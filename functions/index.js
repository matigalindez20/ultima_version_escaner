// =======================================================================
// ===== ARCHIVO index.js DE PRODUCCIÓN (CON AMBAS FUNCIONES) ==========
// =======================================================================

// --- IMPORTACIONES COMUNES ---
const { onDocumentCreated, onDocumentWritten } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// --- INICIALIZACIÓN ---
admin.initializeApp();

// =======================================================================
// ===== FUNCIÓN 1: ENVIAR GARANTÍA POR EMAIL ============================
// =======================================================================

// Le decimos a la función que necesita acceso al secreto GMAIL_PASSWORD
exports.enviarGarantia = onDocumentCreated(
  {
    document: "mailQueue/{docId}",
    secrets: ["GMAIL_PASSWORD"],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) {
      logger.log("No hay datos asociados al evento de email.");
      return;
    }
    const mailData = snap.data();

    const mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // ¡IMPORTANTE! Reemplaza con el email de tu empresa
        user: "garantiatwinss@gmail.com", 
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      // ¡IMPORTANTE! Reemplaza con el email de tu empresa
      from: `"iPhone Twins" <garantiatwinss@gmail.com>`,
      to: mailData.to,
      subject: mailData.message.subject,
      html: mailData.message.html,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      logger.log(`Garantía enviada a ${mailData.to} vía Gmail`);
      return snap.ref.delete();
    } catch (error) {
      logger.error("Hubo un error al enviar el email:", error);
      return null;
    }
  }
);

// =======================================================================
// ===== FUNCIÓN 2: ACTUALIZAR GOOGLE SHEETS =============================
// =======================================================================

const SPREADSHEET_ID = "1dfq-38MaoIkt0AdZqrays_3mWXcdc9IoRU0HufevuRg";

exports.updateStockSheet = onDocumentWritten("stock_individual/{imei}", async (event) => {
  let data;
  const imei = event.params.imei;
  let action;

  const auth = new google.auth.GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  if (!event.data.after.exists) {
    action = "DELETE";
    logger.log(`Detectado BORRADO para IMEI: ${imei}`);
  } else if (!event.data.before.exists) {
    action = "CREATE";
    data = event.data.after.data();
    logger.log(`Detectada CREACIÓN para IMEI: ${imei}`, { data });
  } else {
    action = "UPDATE";
    data = event.data.after.data();
    logger.log(`Detectada ACTUALIZACIÓN para IMEI: ${imei}`, { data });
  }

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

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

// --- FUNCIONES AUXILIARES PARA GOOGLE SHEETS ---
async function updateOrCreateRow(sheets, auth, data, imei) {
  const sheetName = "Hoja 1";
  const range = `${sheetName}!A:A`;
  const getRows = await sheets.spreadsheets.values.get({ auth, spreadsheetId: SPREADSHEET_ID, range });
  const imeiList = getRows.data.values ? getRows.data.values.flat() : [];
  const rowIndex = imeiList.indexOf(imei);

  const rowData = [
    data.imei || "",
    data.modelo || "",
    data.color || "",
    data.almacenamiento || "",
    data.bateria ? `${data.bateria}%` : "",
    data.detalles_esteticos || "",
    data.proveedor || "N/A",
    new Date().toLocaleString("es-AR"),
  ];

  if (rowIndex > -1) {
    logger.log(`Actualizando fila ${rowIndex + 1} para IMEI ${imei}`);
    await sheets.spreadsheets.values.update({
      auth, spreadsheetId: SPREADSHEET_ID, range: `${sheetName}!A${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED", resource: { values: [rowData] },
    });
  } else {
    logger.log(`Creando nueva fila para IMEI ${imei}`);
    await sheets.spreadsheets.values.append({
      auth, spreadsheetId: SPREADSHEET_ID, range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED", resource: { values: [rowData] },
    });
  }
}

async function deleteRowByImei(sheets, auth, imei) {
  const sheetName = "Hoja 1";
  const range = `${sheetName}!A:A`;
  const getRows = await sheets.spreadsheets.values.get({ auth, spreadsheetId: SPREADSHEET_ID, range });
  const imeiList = getRows.data.values ? getRows.data.values.flat() : [];
  const rowIndex = imeiList.indexOf(imei);

  if (rowIndex > -1) {
    const spreadsheet = await sheets.spreadsheets.get({ auth, spreadsheetId: SPREADSHEET_ID });
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