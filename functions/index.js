// Importa las funciones necesarias con la nueva sintaxis (v2)
const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const {logger} = require("firebase-functions");
const {google} = require("googleapis");
const admin = require("firebase-admin"); // Importa el SDK de Admin

// --- INICIALIZACIÓN SEGURA ---
// Inicializa el SDK de Firebase Admin.
// Al ejecutarse en el entorno de Firebase, encontrará las credenciales automáticamente.
admin.initializeApp();

// --- CONFIGURACIÓN ---
const SPREADSHEET_ID = "1dfq-38MaoIkt0AdZqrays_3mWXcdc9IoRU0HufevuRg";

// --- FUNCIÓN PRINCIPAL (con sintaxis v2) ---
exports.updateStockSheet = onDocumentWritten("stock_individual/{imei}", async (event) => {
  let data;
  const imei = event.params.imei;
  let action;

  // Autenticación con Google Sheets.
  // Ya no se pegan las credenciales. Google las encuentra automáticamente en el entorno.
  const auth = new google.auth.GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  if (!event.data.after.exists) {
    action = "DELETE";
    logger.log(`Detectado BORRADO para IMEI: ${imei}`);
  } else if (!event.data.before.exists) {
    action = "CREATE";
    data = event.data.after.data();
    logger.log(`Detectada CREACIÓN para IMEI: ${imei}`, {data});
  } else {
    action = "UPDATE";
    data = event.data.after.data();
    logger.log(`Detectada ACTUALIZACIÓN para IMEI: ${imei}`, {data});
  }

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({version: "v4", auth: client});

    if (action === "DELETE") {
      await deleteRowByImei(sheets, auth, imei);
      return;
    }

    if (data.estado === "en_stock") {
      await updateOrCreateRow(sheets, auth, data, imei);
    } else {
      await deleteRowByImei(sheets, auth, imei);
    }
  } catch (error) {
    logger.error("Error al actualizar Google Sheet:", error.message, error.stack);
  }
});


// --- FUNCIONES AUXILIARES (Modificadas para recibir 'auth') ---
async function updateOrCreateRow(sheets, auth, data, imei) {
  const sheetName = "Hoja 1";
  const range = `${sheetName}!A:A`;
  const getRows = await sheets.spreadsheets.values.get({auth, spreadsheetId: SPREADSHEET_ID, range});
  const imeiList = getRows.data.values ? getRows.data.values.flat() : [];
  const rowIndex = imeiList.indexOf(imei);
  
  // Incluir el proveedor en los datos a guardar
  const rowData = [
    data.imei || "",
    data.modelo || "",
    data.color || "",
    data.almacenamiento || "",
    data.bateria ? `${data.bateria}%` : "",
    data.detalles_esteticos || "",
    data.proveedor || "N/A", // Agregamos el proveedor
    new Date().toLocaleString("es-AR"),
  ];

  if (rowIndex > -1) {
    logger.log(`Actualizando fila ${rowIndex + 1} para IMEI ${imei}`);
    await sheets.spreadsheets.values.update({
      auth, spreadsheetId: SPREADSHEET_ID, range: `${sheetName}!A${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED", resource: {values: [rowData]},
    });
  } else {
    logger.log(`Creando nueva fila para IMEI ${imei}`);
    await sheets.spreadsheets.values.append({
      auth, spreadsheetId: SPREADSHEET_ID, range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED", resource: {values: [rowData]},
    });
  }
}

async function deleteRowByImei(sheets, auth, imei) {
  const sheetName = "Hoja 1";
  const range = `${sheetName}!A:A`;
  const getRows = await sheets.spreadsheets.values.get({auth, spreadsheetId: SPREADSHEET_ID, range});
  const imeiList = getRows.data.values ? getRows.data.values.flat() : [];
  const rowIndex = imeiList.indexOf(imei);

  if (rowIndex > -1) {
    // Obtener el ID de la hoja de cálculo (sheetId) dinámicamente
    const spreadsheet = await sheets.spreadsheets.get({auth, spreadsheetId: SPREADSHEET_ID});
    const sheet = spreadsheet.data.sheets.find(s => s.properties.title === sheetName);
    if (!sheet) {
        logger.error(`No se encontró la hoja con el nombre: ${sheetName}`);
        return;
    }
    const sheetId = sheet.properties.sheetId;

    logger.log(`Eliminando fila ${rowIndex + 1} para IMEI ${imei}`);
    await sheets.spreadsheets.batchUpdate({
      auth, spreadsheetId: SPREADSHEET_ID,
      resource: { requests: [{ deleteDimension: { range: {
        sheetId: sheetId, dimension: "ROWS", startIndex: rowIndex, endIndex: rowIndex + 1,
      }}}]},
    });
  } else {
    logger.log(`No se encontró el IMEI ${imei} en la hoja para eliminar.`);
  }
}