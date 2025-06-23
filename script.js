const firebaseConfig = {
    apiKey: "AIzaSyAG2rhzDqoy_Iq6DlP0osuJjbrwFEtl6n4",
    authDomain: "tienda-twins.firebaseapp.com",
    projectId: "tienda-twins",
    storageBucket: "tienda-twins.appspot.com",
    messagingSenderId: "331341386452",
    appId: "1:331341386452:web:1f0c5257beaaccfcf86141",
    measurementId: "G-QYLGN5ZWX6"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

const vendedores = ["Vendedor A", "Vendedor B", "Vendedor C"];
const colores = ["Negro espacial", "Plata", "Dorado", "Púrpura oscuro", "Rojo (Product RED)", "Azul", "Verde", "Blanco estelar", "Medianoche", "Titanio Natural", "Titanio Azul", "Otro"];
const almacenamientos = ["128GB", "256GB", "512GB", "1TB"];
const detallesEsteticos = ["Como Nuevo (Sin detalles)", "Excelente (Mínimos detalles)", "Bueno (Detalles de uso visibles)", "Regular (Marcas o rayones notorios)"];
const modelos = [ "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max", "iPhone 12 Mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max", "iPhone 13 Mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",];

const s = {};
let canjeContext = null;

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    Object.assign(s, {
        loginContainer: document.getElementById('login-container'), appContainer: document.getElementById('app-container'), logoutButton: document.getElementById('logout-button'),
        tabDashboard: document.getElementById('tab-dashboard'), tabManagement: document.getElementById('tab-management'),
        dashboardView: document.getElementById('dashboard-view'), managementView: document.getElementById('management-view'),
        btnShowStock: document.getElementById('btn-show-stock'), btnShowSales: document.getElementById('btn-show-sales'), btnShowCanje: document.getElementById('btn-show-canje'),
        stockSection: document.getElementById('stock-section'), salesSection: document.getElementById('sales-section'), canjeSection: document.getElementById('canje-section'),
        stockTableContainer: document.getElementById('stock-table-container'), salesTableContainer: document.getElementById('sales-table-container'), canjeTableContainer: document.getElementById('canje-table-container'),
        filterStockModel: document.getElementById('filter-stock-model'), filterStockColor: document.getElementById('filter-stock-color'),
        filterStockGb: document.getElementById('filter-stock-gb'), filterStockBatMin: document.getElementById('filter-stock-bat-min'),
        filterStockBatMax: document.getElementById('filter-stock-bat-max'), btnApplyStockFilters: document.getElementById('btn-apply-stock-filters'),
        filterSalesVendedor: document.getElementById('filter-sales-vendedor'), filterSalesStartDate: document.getElementById('filter-sales-start-date'),
        filterSalesEndDate: document.getElementById('filter-sales-end-date'), btnApplySalesFilters: document.getElementById('btn-apply-sales-filters'),
        btnScan: document.getElementById('btn-scan'), scannerContainer: document.getElementById('scanner-container'),
        productForm: document.getElementById('product-form'), imeiInput: document.getElementById('imei-form'),
        modeloFormSelect: document.getElementById('modelo-form'), colorFormSelect: document.getElementById('color-form'),
        almacenamientoFormSelect: document.getElementById('almacenamiento-form'), detallesFormSelect: document.getElementById('detalles-form'),
        feedbackMessage: document.getElementById('feedback-message'), promptContainer: document.getElementById('prompt-container'),
        globalFeedback: document.getElementById('global-feedback'), canjeBadge: document.getElementById('canje-badge'),
        btnExport: document.getElementById('btn-export'), exportMenu: document.getElementById('export-menu'),
        exportStockBtn: document.getElementById('export-stock-btn'), exportSalesBtn: document.getElementById('export-sales-btn')
    });
    
    populateAllSelects();
    addEventListeners();
    auth.onAuthStateChanged(handleAuthStateChange);
}

function populateAllSelects() {
    populateSelect(s.filterSalesVendedor, vendedores, "Todos"); populateSelect(s.filterStockColor, colores, "Todos");
    populateSelect(s.filterStockGb, almacenamientos, "Todos"); populateSelect(s.filterStockModel, modelos, "Todos");
    populateSelect(s.modeloFormSelect, modelos, "Selecciona..."); populateSelect(s.colorFormSelect, colores, "Selecciona...");
    populateSelect(s.almacenamientoFormSelect, almacenamientos, "Selecciona..."); populateSelect(s.detallesFormSelect, detallesEsteticos, "Selecciona...");
}
function addEventListeners() {
    s.logoutButton.addEventListener('click', () => auth.signOut());
    s.tabDashboard.addEventListener('click', () => switchTab(true));
    s.tabManagement.addEventListener('click', () => switchTab(false));
    s.btnShowStock.addEventListener('click', () => switchDashboardView('stock'));
    s.btnShowSales.addEventListener('click', () => switchDashboardView('sales'));
    s.btnShowCanje.addEventListener('click', () => switchDashboardView('canje'));
    s.btnApplyStockFilters.addEventListener('click', loadStock);
    s.btnApplySalesFilters.addEventListener('click', loadSales);
    s.btnScan.addEventListener('click', startScanner);
    s.productForm.addEventListener('submit', handleProductFormSubmit);
    s.btnExport.addEventListener('click', () => s.exportMenu.classList.toggle('show'));
    s.exportStockBtn.addEventListener('click', () => { exportToExcel('stock'); s.exportMenu.classList.remove('show'); });
    s.exportSalesBtn.addEventListener('click', () => { exportToExcel('sales'); s.exportMenu.classList.remove('show'); });
    document.addEventListener('click', (e) => { if (!s.btnExport.contains(e.target)) s.exportMenu.classList.remove('show'); });
}
function handleAuthStateChange(user) {
    if (user) {
        s.loginContainer.innerHTML = ''; s.loginContainer.classList.add('hidden');
        s.appContainer.classList.remove('hidden'); s.btnShowStock.click();
        updateCanjeCount();
    } else {
        s.loginContainer.classList.remove('hidden'); s.appContainer.classList.add('hidden');
        s.loginContainer.innerHTML = `<h1>Iniciar Sesión</h1><form id="login-form"><div id="login-feedback" class="hidden"></div><div class="form-group"><label for="email">Email</label><input type="email" id="email" required></div><div class="form-group"><label for="password">Contraseña</label><input type="password" id="password" required></div><button type="submit" class="spinner-btn"><span class="btn-text">Entrar</span><div class="spinner"></div></button></form>`;
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    }
}
const populateSelect = (selectEl, options, defaultText) => { if (selectEl) selectEl.innerHTML = `<option value="">${defaultText}</option>` + options.map(opt => `<option value="${opt}">${opt}</option>`).join(''); };
const toggleSpinner = (btn, isLoading) => { if(btn) btn.classList.toggle('loading', isLoading); };

function showGlobalFeedback(message, type = 'success', duration = 3000) {
    s.globalFeedback.textContent = message;
    s.globalFeedback.className = `feedback-message ${type}`;
    s.globalFeedback.classList.add('show');
    setTimeout(() => { s.globalFeedback.classList.remove('show'); }, duration);
}
function showConfirmationModal(title, message, onConfirm) {
    const modal = document.createElement('div');
    modal.id = 'confirmation-modal-overlay';
    modal.innerHTML = `<div class="confirmation-modal-box"><h3>${title}</h3><p>${message}</p><div class="prompt-buttons"><button id="confirm-action-btn" class="prompt-button confirm">Aceptar</button><button id="cancel-action-btn" class="prompt-button cancel">Cancelar</button></div></div>`;
    document.body.appendChild(modal);
    document.getElementById('confirm-action-btn').onclick = () => { onConfirm(); modal.remove(); };
    document.getElementById('cancel-action-btn').onclick = () => { modal.remove(); };
}

async function updateCanjeCount() {
    try {
        const snapshot = await db.collection('plan_canje_pendientes').where('estado', '==', 'pendiente_de_carga').get();
        const count = snapshot.size;
        s.canjeBadge.textContent = count;
        s.canjeBadge.classList.toggle('hidden', count === 0);
    } catch (error) { console.error("Error al obtener contador de canjes:", error); }
}
async function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    toggleSpinner(btn, true);
    try { await auth.signInWithEmailAndPassword(e.target.email.value, e.target.password.value); }
    catch (error) {
        const feedbackEl = document.getElementById('login-feedback');
        feedbackEl.textContent = "Error: " + error.message;
        feedbackEl.className = 'error';
        feedbackEl.classList.remove('hidden');
    } finally { toggleSpinner(btn, false); }
}
function switchTab(isDashboard) {
    s.dashboardView.classList.toggle('hidden', !isDashboard);
    s.managementView.classList.toggle('hidden', isDashboard);
    s.tabDashboard.classList.toggle('active', isDashboard);
    s.tabManagement.classList.toggle('active', !isDashboard);
}
function switchDashboardView(viewName) {
    ['stock', 'sales', 'canje'].forEach(v => {
        const section = document.getElementById(`${v}-section`);
        const button = document.getElementById(`btn-show-${v}`);
        if (section) section.classList.toggle('hidden', v !== viewName);
        if (button) button.classList.toggle('active', v === viewName);
    });
    updateCanjeCount();
    if (viewName === 'stock') loadStock();
    else if (viewName === 'sales') loadSales();
    else if (viewName === 'canje') loadCanjes();
}

async function loadStock() {
    s.stockTableContainer.innerHTML = `<p class="dashboard-loader">Cargando stock...</p>`;
    try {
        let query = db.collection("stock_individual").where("estado", "==", "en_stock");
        if (s.filterStockModel.value) query = query.where('modelo', '==', s.filterStockModel.value);
        if (s.filterStockColor.value) query = query.where('color', '==', s.filterStockColor.value);
        if (s.filterStockGb.value) query = query.where('almacenamiento', '==', s.filterStockGb.value);
        if (s.filterStockBatMin.value) query = query.where('bateria', '>=', parseInt(s.filterStockBatMin.value));
        if (s.filterStockBatMax.value) query = query.where('bateria', '<=', parseInt(s.filterStockBatMax.value));
        query = query.orderBy('modelo');
        const querySnapshot = await query.get();
        if (querySnapshot.empty) { s.stockTableContainer.innerHTML = `<p class="dashboard-loader">No se encontraron productos con esos filtros.</p>`; return; }
        let tableHTML = `<table><thead><tr><th>Modelo</th><th>Color</th><th>GB</th><th>Batería</th><th>IMEI</th><th>Detalles</th><th>Acción</th></tr></thead><tbody>`;
        querySnapshot.forEach(doc => {
            const item = doc.data();
            const itemJSON = JSON.stringify(item).replace(/"/g, '"');
            tableHTML += `<tr data-imei="${item.imei}" data-item='${itemJSON}'><td>${item.modelo || ''}</td><td>${item.color || ''}</td><td>${item.almacenamiento || ''}</td><td>${item.bateria || ''}%</td><td>${item.imei || ''}</td><td>${item.detalles_esteticos || ''}</td><td><button class="delete-btn btn-delete-stock"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></td></tr>`;
        });
        s.stockTableContainer.innerHTML = tableHTML + `</tbody></table>`;
        document.querySelectorAll('.btn-delete-stock').forEach(button => {
            button.addEventListener('click', e => {
                const row = e.target.closest('tr');
                const item = JSON.parse(row.dataset.item.replace(/"/g, '"'));
                const message = `Producto: ${item.modelo} ${item.color}\nIMEI: ${item.imei}\n\nEsta acción eliminará el producto del stock permanentemente.`;
                showConfirmationModal('¿Seguro que quieres eliminar este producto?', message, () => {
                    deleteStockItem(item.imei, item);
                });
            });
        });
    } catch (error) { handleDBError(error, s.stockTableContainer, "stock"); }
}
async function deleteStockItem(imei, item) {
    try {
        await db.runTransaction(async t => {
            const stockRef = db.collection("stock_individual").doc(imei);
            const displayRef = db.collection("productos_display").doc(`${(item.modelo || '').toLowerCase().replace(/\s+/g, '-')}-${(item.color || '').toLowerCase().replace(/\s+/g, '-')}`);
            
            const displayDoc = await t.get(displayRef);
            
            t.delete(stockRef);
            
            if (displayDoc.exists) {
                t.update(displayRef, {
                    stock_total: firebase.firestore.FieldValue.increment(-1),
                    opciones_disponibles: firebase.firestore.FieldValue.arrayRemove({ imei: item.imei, gb: item.almacenamiento, bateria: item.bateria })
                });
            }
        });
        showGlobalFeedback("Producto eliminado del stock.");
        loadStock();
    } catch (error) {
        console.error("Error al eliminar del stock:", error);
        showGlobalFeedback("No se pudo eliminar el producto.", "error");
    }
}
async function exportToExcel(type) {
    const btn = (type === 'stock') ? document.getElementById('export-stock-btn') : document.getElementById('export-sales-btn');
    toggleSpinner(btn, true);
    try {
        let dataToExport = [];
        let fileName = '';
        let sheetName = '';

        if (type === 'stock') {
            const querySnapshot = await db.collection("stock_individual").where("estado", "==", "en_stock").orderBy('modelo').get();
            if (querySnapshot.empty) { showGlobalFeedback("No hay stock para exportar.", "error"); return; }
            querySnapshot.forEach(doc => {
                const data = doc.data();
                dataToExport.push({
                    'Modelo': data.modelo, 'Color': data.color, 'Almacenamiento': data.almacenamiento,
                    'Bateria (%)': data.bateria, 'IMEI': data.imei, 'Detalles Esteticos': data.detalles_esteticos,
                    'Fecha de Carga': data.fechaDeCarga ? new Date(data.fechaDeCarga.seconds * 1000).toLocaleString('es-AR') : ''
                });
            });
            fileName = `Stock_iPhone_Twins_${new Date().toISOString().slice(0,10)}.xlsx`;
            sheetName = "Stock Actual";
        } else if (type === 'sales') {
            const querySnapshot = await db.collection("ventas").orderBy("fecha_venta", "desc").get();
            if (querySnapshot.empty) { showGlobalFeedback("No hay ventas para exportar.", "error"); return; }
            querySnapshot.forEach(doc => {
                const venta = doc.data();
                dataToExport.push({
                    'Fecha Venta': venta.fecha_venta ? new Date(venta.fecha_venta.seconds * 1000).toLocaleString('es-AR') : 'N/A',
                    'Producto Vendido': `${venta.producto.modelo || ''} ${venta.producto.color || ''}`,
                    'IMEI Vendido': venta.imei_vendido,
                    'Vendedor': venta.vendedor, 'Precio (USD)': venta.precio_venta_usd, 'Método Pago': venta.metodo_pago,
                    'Monto (ARS)': venta.metodo_pago === 'pesos' ? venta.monto_pesos : '', 'Cotización Dólar': venta.metodo_pago === 'pesos' ? venta.cotizacion_dolar : '',
                    'Hubo Canje': venta.hubo_canje ? 'Sí' : 'No', 'Valor Toma Canje (USD)': venta.hubo_canje ? venta.valor_toma_canje_usd : ''
                });
            });
            fileName = `Ventas_iPhone_Twins_${new Date().toISOString().slice(0,10)}.xlsx`;
            sheetName = "Ventas";
        }

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, fileName);

    } catch (error) {
        console.error(`Error al exportar ${type}:`, error);
        showGlobalFeedback(`Error al exportar los datos de ${type}.`, "error");
    } finally {
        toggleSpinner(btn, false);
    }
}
async function loadSales() {
    s.salesTableContainer.innerHTML = `<p class="dashboard-loader">Cargando ventas...</p>`;
    try {
        let query = db.collection("ventas").orderBy("fecha_venta", "desc");
        if (s.filterSalesVendedor.value) query = query.where('vendedor', '==', s.filterSalesVendedor.value);
        if (s.filterSalesStartDate.value) query = query.where('fecha_venta', '>=', new Date(s.filterSalesStartDate.value));
        if (s.filterSalesEndDate.value) {
            const endDate = new Date(s.filterSalesEndDate.value);
            endDate.setHours(23, 59, 59, 999);
            query = query.where('fecha_venta', '<=', endDate);
        }
        const querySnapshot = await query.limit(100).get();
        if (querySnapshot.empty) { s.salesTableContainer.innerHTML = `<p class="dashboard-loader">No se encontraron ventas con esos filtros.</p>`; return; }
        let tableHTML = `<table><thead><tr><th>Fecha</th><th>Producto</th><th>Vendedor</th><th>Precio (USD)</th><th>Pago</th><th>Detalles Pago</th><th>Acción</th></tr></thead><tbody>`;
        querySnapshot.forEach(doc => {
            const venta = doc.data();
            const fecha = venta.fecha_venta ? new Date(venta.fecha_venta.seconds * 1000).toLocaleString('es-AR') : 'N/A';
            const productoInfo = `${venta.producto.modelo || ''} ${venta.producto.color || ''}`;
            let pagoDetalle = venta.metodo_pago === 'pesos' ? `ARS ${venta.monto_pesos || ''} (T/C ${venta.cotizacion_dolar || ''})` : '-';
            const productoJSON = JSON.stringify(venta.producto).replace(/"/g, '"');
            tableHTML += `<tr data-sale-id="${doc.id}" data-imei="${venta.imei_vendido}" data-canje-id="${venta.id_canje_pendiente || ''}" data-producto='${productoJSON}'><td>${fecha}</td><td>${productoInfo}</td><td>${venta.vendedor}</td><td>$${venta.precio_venta_usd}</td><td>${venta.metodo_pago}</td><td>${pagoDetalle}</td><td><button class="delete-btn btn-delete-sale"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></td></tr>`;
        });
        s.salesTableContainer.innerHTML = tableHTML + `</tbody></table>`;
        document.querySelectorAll('.btn-delete-sale').forEach(button => {
            button.addEventListener('click', e => {
                const row = e.target.closest('tr');
                const producto = JSON.parse(row.dataset.producto.replace(/"/g, '"'));
                const message = `Producto: ${producto.modelo}\nIMEI: ${row.dataset.imei}\n\nEsta acción NO devolverá el equipo al stock y la eliminará permanentemente.`;
                showConfirmationModal('¿Seguro que quieres eliminar esta venta?', message, () => {
                    deleteSale(row.dataset.saleId, row.dataset.imei, row.dataset.canjeId);
                });
            });
        });
    } catch (error) { handleDBError(error, s.salesTableContainer, "ventas"); }
}
async function deleteSale(saleId, imei, canjeId) {
    try {
        await db.runTransaction(async t => {
            const ventaRef = db.collection("ventas").doc(saleId);
            const stockRef = db.collection("stock_individual").doc(imei);
            t.delete(ventaRef);
            t.update(stockRef, { estado: "eliminado_por_error" });
            if (canjeId) {
                const canjeRef = db.collection("plan_canje_pendientes").doc(canjeId);
                t.delete(canjeRef);
            }
        });
        showGlobalFeedback("Venta eliminada con éxito.");
        loadSales();
        updateCanjeCount();
    } catch (error) {
        console.error("Error al eliminar la venta:", error);
        showGlobalFeedback("No se pudo eliminar la venta.", "error");
    }
}
async function loadCanjes() {
    s.canjeTableContainer.innerHTML = `<p class="dashboard-loader">Cargando pendientes...</p>`;
    try {
        const query = db.collection("plan_canje_pendientes").where("estado", "==", "pendiente_de_carga").orderBy("fecha_canje", "desc");
        const querySnapshot = await query.get();
        if (querySnapshot.empty) { s.canjeTableContainer.innerHTML = `<p class="dashboard-loader">No hay equipos pendientes de carga.</p>`; return; }
        let tableHTML = `<table><thead><tr><th>Fecha Canje</th><th>Modelo Recibido</th><th>Observaciones</th><th>Valor Toma (USD)</th><th>Acción</th></tr></thead><tbody>`;
        querySnapshot.forEach(doc => {
            const item = doc.data();
            const fecha = item.fecha_canje ? new Date(item.fecha_canje.seconds * 1000).toLocaleDateString('es-AR') : 'N/A';
            tableHTML += `<tr data-canje-id="${doc.id}" data-modelo="${item.modelo_recibido}"><td>${fecha}</td><td>${item.modelo_recibido}</td><td>${item.observaciones_canje}</td><td>$${item.valor_toma_usd}</td><td><button class="control-btn btn-cargar-canje" style="background-color: var(--success-bg);">Cargar a Stock</button></td></tr>`;
        });
        s.canjeTableContainer.innerHTML = tableHTML + `</tbody></table>`;
        document.querySelectorAll('.btn-cargar-canje').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                cargarCanje(row.dataset.canjeId, row.dataset.modelo);
            });
        });
    } catch (error) { handleDBError(error, s.canjeTableContainer, "pendientes de canje"); }
}
function cargarCanje(docId, modelo) {
    switchTab(false);
    canjeContext = { docId, modelo };
    startScanner();
}
function handleDBError(error, container, context) {
    console.error(`Error cargando ${context}:`, error);
    let msg = `Error al cargar ${context}.`;
    if (error.code === 'failed-precondition') { msg = `Error: Esta consulta requiere un índice. Por favor, crea uno en la consola de Firebase (F12) para ver el link.`; }
    container.innerHTML = `<p class="dashboard-loader" style="color:var(--error-bg)">${msg}</p>`;
}
const html5QrCode = new Html5Qrcode("scanner-container");
function startScanner() {
    resetManagementView();
    showFeedback(canjeContext ? `Escanea el IMEI para el ${canjeContext.modelo} del plan canje...` : 'Escanea un IMEI para empezar', 'info');
    s.btnScan.classList.remove('hidden');
    s.scannerContainer.classList.remove('hidden');
    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 150 } },
        async (decodedText) => {
            try { await html5QrCode.stop(); } catch(err) {}
            onScanSuccess(decodedText);
        },
        (errorMessage) => {}
    ).catch((err) => { showFeedback("Error al iniciar cámara. Revisa los permisos.", "error"); });
}
async function onScanSuccess(imei) {
    s.feedbackMessage.classList.add('hidden');
    if (canjeContext) {
        s.imeiInput.value = imei.trim();
        s.modeloFormSelect.value = canjeContext.modelo;
        s.productForm.dataset.canjeId = canjeContext.docId;
        s.productForm.classList.remove('hidden');
        s.productForm.querySelector('#bateria').focus();
        canjeContext = null;
    } else {
        showFeedback("Buscando IMEI...", "loading");
        try {
            const imeiRef = db.collection("stock_individual").doc(imei.trim());
            const imeiDoc = await imeiRef.get();
            s.feedbackMessage.classList.add('hidden');
            if (imeiDoc.exists && imeiDoc.data().estado === 'en_stock') {
                s.managementView.classList.add('hidden');
                promptToSell(imei.trim(), imeiDoc.data());
            } else {
                s.imeiInput.value = imei.trim();
                s.productForm.classList.remove('hidden');
                s.productForm.querySelector('select').focus();
            }
        } catch (error) { handleDBError(error, s.feedbackMessage, "búsqueda de IMEI"); }
    }
}
function promptToSell(imei, details) {
    const vendedoresOptions = vendedores.map(v => `<option value="${v}">${v}</option>`).join('');
    const modelosOptions = modelos.map(m => `<option value="${m}">${m}</option>`).join('');
    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin:auto;"><div class="prompt-box"><h3>Registrar Venta</h3><form id="sell-form"><div class="details-box"><div class="detail-item"><span>Vendiendo:</span> <strong>${details.modelo || ''}</strong></div><div class="detail-item"><span>IMEI:</span> <strong>${imei}</strong></div></div><div class="form-group"><label for="precioVenta">Precio de Venta (USD)</label><input type="number" id="precioVenta" name="precioVenta" required placeholder="Ej: 850"></div><div class="form-group"><label for="metodoPago">Método de Pago</label><select id="metodoPago" name="metodoPago" required><option value="dolares">Dólares</option><option value="pesos">Pesos</option></select></div><div id="pesos-fields" class="hidden"><div class="form-group"><label>Detalles Pago en Pesos</label><input type="number" name="montoPesos" placeholder="Monto en ARS"><input type="number" name="cotizacionDolar" placeholder="Cotización Dólar"></div></div><div class="form-group"><label for="vendedor">Vendedor</label><select name="vendedor" required>${vendedoresOptions}</select></div><hr style="border-color: var(--border-dark); margin: 1rem 0;"><div class="checkbox-group"><input type="checkbox" id="acepta-canje" name="acepta-canje"><label for="acepta-canje">Acepta Plan Canje</label></div><div id="plan-canje-fields" class="hidden"><h4>Detalles del Equipo Recibido</h4><div class="form-group"><label for="canje-modelo">Modelo Recibido</label><select name="canje-modelo">${modelosOptions}</select></div><div class="form-group"><label for="canje-valor">Valor de Toma (USD)</label><input type="number" name="canje-valor" placeholder="Ej: 300"></div><div class="form-group"><label for="canje-observaciones">Observaciones</label><textarea name="canje-observaciones" rows="2"></textarea></div></div><div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Registrar Venta</span><div class="spinner"></div></button><button type="button" id="btn-cancel-sell" class="prompt-button cancel">Cancelar</button></div></form></div></div>`;
    document.getElementById('metodoPago').addEventListener('change', (e) => { document.getElementById('pesos-fields').classList.toggle('hidden', e.target.value !== 'pesos'); });
    document.getElementById('acepta-canje').addEventListener('change', (e) => { document.getElementById('plan-canje-fields').classList.toggle('hidden', !e.target.checked); });
    document.getElementById('sell-form').addEventListener('submit', (e) => { e.preventDefault(); registerSale(imei, details, e.target.querySelector('button[type="submit"]')); });
    document.getElementById('btn-cancel-sell').onclick = () => { s.managementView.classList.remove('hidden'); s.promptContainer.innerHTML = ''; };
}
async function registerSale(imei, productDetails, btn) {
    toggleSpinner(btn, true);
    const formData = new FormData(btn.form);
    const aceptaCanje = formData.get('acepta-canje') === 'on';
    const saleData = { imei_vendido: imei, producto: productDetails, precio_venta_usd: parseFloat(formData.get('precioVenta')), metodo_pago: formData.get('metodoPago'), vendedor: formData.get('vendedor'), fecha_venta: firebase.firestore.FieldValue.serverTimestamp() };
    if (saleData.metodo_pago === 'pesos') Object.assign(saleData, { monto_pesos: parseFloat(formData.get('montoPesos')), cotizacion_dolar: parseFloat(formData.get('cotizacionDolar')) });
    if (aceptaCanje) Object.assign(saleData, { hubo_canje: true, valor_toma_canje_usd: parseFloat(formData.get('canje-valor')) });
    try {
        await db.runTransaction(async (t) => {
            const individualStockRef = db.collection("stock_individual").doc(imei);
            const displayProductRef = db.collection("productos_display").doc(`${(productDetails.modelo || '').toLowerCase().replace(/\s+/g, '-')}-${(productDetails.color || '').toLowerCase().replace(/\s+/g, '-')}`);
            const saleRef = db.collection("ventas").doc();
            const displayDoc = await t.get(displayProductRef);
            t.update(individualStockRef, { estado: 'vendido' });
            if (displayDoc.exists) {
                const newStock = Math.max(0, (displayDoc.data().stock_total || 1) - 1);
                t.update(displayProductRef, { stock_total: newStock, opciones_disponibles: firebase.firestore.FieldValue.arrayRemove({ imei: imei, gb: productDetails.almacenamiento, bateria: productDetails.bateria }) });
            }
            if (aceptaCanje) {
                const canjeRef = db.collection("plan_canje_pendientes").doc();
                const canjeData = { modelo_recibido: formData.get('canje-modelo'), valor_toma_usd: parseFloat(formData.get('canje-valor')), observaciones_canje: formData.get('canje-observaciones'), venta_asociada_id: saleRef.id, fecha_canje: firebase.firestore.FieldValue.serverTimestamp(), estado: 'pendiente_de_carga' };
                t.set(canjeRef, canjeData);
                saleData.id_canje_pendiente = canjeRef.id;
            }
            t.set(saleRef, saleData);
        });
        s.promptContainer.innerHTML = '';
        s.managementView.classList.remove('hidden');
        switchDashboardView('sales');
        switchTab(true);
    } catch (error) { console.error("Error al registrar la venta:", error); alert("Error al procesar la venta. Revisa la consola."); } 
    finally { toggleSpinner(btn, false); }
}
async function handleProductFormSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    toggleSpinner(btn, true);
    const formData = new FormData(e.target);
    const imei = formData.get('imei');
    const canjeId = e.target.dataset.canjeId;
    const unitData = { imei: imei, modelo: formData.get('modelo'), color: formData.get('color'), bateria: parseInt(formData.get('bateria')), almacenamiento: formData.get('almacenamiento'), detalles_esteticos: formData.get('detalles'), estado: 'en_stock', fechaDeCarga: firebase.firestore.FieldValue.serverTimestamp() };
    const productId = `${(unitData.modelo || '').toLowerCase().replace(/\s+/g, '-')}-${(unitData.color || '').toLowerCase().replace(/\s+/g, '-')}`;
    try {
        await db.runTransaction(async (t) => {
            const individualStockRef = db.collection("stock_individual").doc(imei);
            const displayProductRef = db.collection("productos_display").doc(productId);
            const [existingImei, displayDoc] = await Promise.all([t.get(individualStockRef), t.get(displayProductRef)]);
            if (existingImei.exists && existingImei.data().estado === 'en_stock') throw new Error(`El IMEI ${imei} ya está en stock.`);
            t.set(individualStockRef, unitData);
            if (!displayDoc.exists) { t.set(displayProductRef, { nombre: unitData.modelo, color: unitData.color, stock_total: 1, opciones_disponibles: [{ imei: unitData.imei, gb: unitData.almacenamiento, bateria: unitData.bateria }] });
            } else { t.update(displayProductRef, { stock_total: firebase.firestore.FieldValue.increment(1), opciones_disponibles: firebase.firestore.FieldValue.arrayUnion({ imei: unitData.imei, gb: unitData.almacenamiento, bateria: unitData.bateria }) }); }
            if (canjeId) { t.update(db.collection("plan_canje_pendientes").doc(canjeId), { estado: 'cargado_en_stock', imei_asignado: imei }); }
        });
        showFeedback(`¡Éxito! ${unitData.modelo} añadido al stock.`, "success");
        setTimeout(() => { resetManagementView(); if(canjeId) switchDashboardView('canje'); else switchDashboardView('stock'); switchTab(true); delete e.target.dataset.canjeId; }, 1500);
    } catch (error) { showFeedback(error.message || "Error al guardar.", "error"); }
    finally { toggleSpinner(btn, false); }
}
function resetManagementView() {
     s.promptContainer.innerHTML = ''; 
     s.productForm.reset();
     s.productForm.classList.add('hidden');
     s.btnScan.classList.remove('hidden');
     s.scannerContainer.classList.add('hidden');
     s.feedbackMessage.classList.add('hidden');
}
function showFeedback(message, type = 'info') {
    s.feedbackMessage.textContent = message;
    s.feedbackMessage.className = `feedback-message ${type}`;
    s.feedbackMessage.classList.remove('hidden');
}