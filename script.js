const firebaseConfig = {
    apiKey: "AIzaSyCIriK864klIIu-PfRrTn18NCysRaTwWJs",
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

const vendedores = ["Agustin", "Joaquín", "Vendedor C"];
const colores = ["Negro espacial", "Plata", "Dorado", "Púrpura oscuro", "Rojo (Product RED)", "Azul", "Verde", "Blanco estelar", "Medianoche", "Titanio Natural", "Titanio Azul", "Otro"];
const almacenamientos = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const detallesEsteticos = ["Como Nuevo (Sin detalles)", "Excelente (Mínimos detalles)", "Bueno (Detalles de uso visibles)", "Regular (Marcas o rayones notorios)"];
const modelos = [ "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max", "iPhone 12 Mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max", "iPhone 13 Mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",];
const metodosDePago = ["Dólares", "Pesos (Efectivo)", "Pesos (Transferencia)"];
const gastosCategorias = ["Comida", "Repuestos", "Alquiler", "Accesorios", "Otro"];
const accesoriosSubcategorias = ["Fundas", "Fuentes", "Cables", "Templados", "Otro"];
let proveedoresStock = []; 
const categoriaColores = {
    "Comida": "#3498db",
    "Repuestos": "#e74c3c",
    "Alquiler": "#9b59b6",
    "Accesorios": "#f1c40f",
    "Pago a Proveedor": "#2ecc71",
    "Otro": "#95a5a6"
};

const s = {};
let canjeContext = null;
let gastosChart = null;
let batchLoadContext = null;
// ===== LA NUEVA ESTRATEGIA: UNA VARIABLE GLOBAL SIMPLE =====
let paymentContext = null;

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    Object.assign(s, {
        loginContainer: document.getElementById('login-container'),
        appContainer: document.getElementById('app-container'),
        logoutButton: document.getElementById('logout-button'),
        tabDashboard: document.getElementById('tab-dashboard'),
        tabReports: document.getElementById('tab-reports'),
        tabManagement: document.getElementById('tab-management'),
        tabProviders: document.getElementById('tab-providers'), 
        dashboardView: document.getElementById('dashboard-view'),
        reportsView: document.getElementById('reports-view'),
        managementView: document.getElementById('management-view'),
        providersView: document.getElementById('providers-view'), 
        btnShowStock: document.getElementById('btn-show-stock'),
        btnShowSales: document.getElementById('btn-show-sales'),
        btnShowGastos: document.getElementById('btn-show-gastos'),
        btnShowCanje: document.getElementById('btn-show-canje'),
        btnShowCommissions: document.getElementById('btn-show-commissions'),
        stockSection: document.getElementById('stock-section'),
        salesSection: document.getElementById('sales-section'),
        gastosSection: document.getElementById('gastos-section'),
        canjeSection: document.getElementById('canje-section'),
        commissionsSection: document.getElementById('commissions-section'),
        stockTableContainer: document.getElementById('stock-table-container'),
        salesTableContainer: document.getElementById('sales-table-container'),
        canjeTableContainer: document.getElementById('canje-table-container'),
        filterStockModel: document.getElementById('filter-stock-model'),
        filterStockProveedor: document.getElementById('filter-stock-proveedor'),
        filterStockColor: document.getElementById('filter-stock-color'),
        filterStockGb: document.getElementById('filter-stock-gb'),
        btnApplyStockFilters: document.getElementById('btn-apply-stock-filters'),
        filterSalesVendedor: document.getElementById('filter-sales-vendedor'),
        filterSalesStartDate: document.getElementById('filter-sales-start-date'),
        filterSalesEndDate: document.getElementById('filter-sales-end-date'),
        btnApplySalesFilters: document.getElementById('btn-apply-sales-filters'),
        btnScan: document.getElementById('btn-scan'),
        scannerContainer: document.getElementById('scanner-container'),
        productForm: document.getElementById('product-form'),
        imeiInput: document.getElementById('imei-form'),
        modeloFormSelect: document.getElementById('modelo-form'),
        colorFormSelect: document.getElementById('color-form'),
        almacenamientoFormSelect: document.getElementById('almacenamiento-form'),
        detallesFormSelect: document.getElementById('detalles-form'),
        proveedorFormSelect: document.getElementById('proveedor-form'),
        feedbackMessage: document.getElementById('feedback-message'),
        promptContainer: document.getElementById('prompt-container'),
        globalFeedback: document.getElementById('global-feedback'),
        canjeBadge: document.getElementById('canje-badge'),
        managementTitle: document.getElementById('management-title'),
        productFormSubmitBtn: document.getElementById('product-form-submit-btn'),
        btnExport: document.getElementById('btn-export'),
        exportMenu: document.getElementById('export-menu'),
        exportStockBtn: document.getElementById('export-stock-btn'),
        exportSalesBtn: document.getElementById('export-sales-btn'),
        scanOptions: document.getElementById('scan-options'),
        manualEntryBtn: document.getElementById('manual-entry-btn'),
        btnAddGasto: document.getElementById('btn-add-gasto'),
        gastosChartCanvas: document.getElementById('gastos-chart'),
        gastosList: document.getElementById('gastos-list'),
        btnHacerCaja: document.getElementById('btn-hacer-caja'),
        commissionsResultsContainer: document.getElementById('commissions-results-container'),
        filterCommissionsVendedor: document.getElementById('filter-commissions-vendedor'),
        filterCommissionsStartDate: document.getElementById('filter-commissions-start-date'),
        filterCommissionsEndDate: document.getElementById('filter-commissions-end-date'),
        btnApplyCommissionsFilters: document.getElementById('btn-apply-commissions-filters'),
        filterGastosStartDate: document.getElementById('filter-gastos-start-date'),
        filterGastosEndDate: document.getElementById('filter-gastos-end-date'),
        btnApplyGastosFilter: document.getElementById('btn-apply-gastos-filter'),
        kpiStockValue: document.getElementById('kpi-stock-value'),
        kpiStockCount: document.getElementById('kpi-stock-count'),
        kpiDollarsDay: document.getElementById('kpi-dollars-day'),
        kpiCashDay: document.getElementById('kpi-cash-day'),
        kpiTransferDay: document.getElementById('kpi-transfer-day'),
        kpiProfitDay: document.getElementById('kpi-profit-day'),
        kpiExpensesDay: document.getElementById('kpi-expenses-day'),
        kpiDollarsMonth: document.getElementById('kpi-dollars-month'),
        kpiCashMonth: document.getElementById('kpi-cash-month'),
        kpiTransferMonth: document.getElementById('kpi-transfer-month'),
        kpiProfitMonth: document.getElementById('kpi-profit-month'),
        kpiExpensesMonth: document.getElementById('kpi-expenses-month'),
        btnAddProvider: document.getElementById('btn-add-provider'), 
        providersListContainer: document.getElementById('providers-list-container') 
    });
    
    addEventListeners();
    auth.onAuthStateChanged(handleAuthStateChange);
}

async function loadAndPopulateSelects() {
    try {
        const snapshot = await db.collection('proveedores').orderBy('nombre').get();
        proveedoresStock = snapshot.docs.map(doc => doc.data().nombre);
        populateAllSelects();
    } catch (error) {
        console.error("Error al cargar proveedores para los selects:", error);
        populateAllSelects();
    }
}

function populateAllSelects() {
    populateSelect(s.filterSalesVendedor, vendedores, "Todos");
    populateSelect(s.filterCommissionsVendedor, vendedores, "Todos");
    populateSelect(s.filterStockColor, colores, "Todos");
    populateSelect(s.filterStockGb, almacenamientos, "Todos");
    populateSelect(s.filterStockModel, modelos, "Todos");
    populateSelect(s.filterStockProveedor, proveedoresStock, "Todos");
    populateSelect(s.modeloFormSelect, modelos, "Selecciona...");
    populateSelect(s.colorFormSelect, colores, "Selecciona...");
    populateSelect(s.almacenamientoFormSelect, almacenamientos, "Selecciona...");
    populateSelect(s.detallesFormSelect, detallesEsteticos, "Selecciona...");
    populateSelect(s.proveedorFormSelect, proveedoresStock, "Selecciona...");
}

function addEventListeners() {
    s.logoutButton.addEventListener('click', () => auth.signOut());
    s.tabDashboard.addEventListener('click', () => switchView('dashboard'));
    s.tabProviders.addEventListener('click', () => switchView('providers'));
    s.tabReports.addEventListener('click', () => switchView('reports'));
    s.tabManagement.addEventListener('click', () => switchView('management'));
    s.btnShowStock.addEventListener('click', () => switchDashboardView('stock'));
    s.btnShowSales.addEventListener('click', () => switchDashboardView('sales'));
    s.btnShowGastos.addEventListener('click', () => switchDashboardView('gastos'));
    s.btnShowCanje.addEventListener('click', () => switchDashboardView('canje'));
    s.btnShowCommissions.addEventListener('click', () => switchDashboardView('commissions'));
    s.btnApplyStockFilters.addEventListener('click', loadStock);
    s.btnApplySalesFilters.addEventListener('click', loadSales);
    s.btnApplyCommissionsFilters.addEventListener('click', loadCommissions);
    s.btnApplyGastosFilter.addEventListener('click', loadGastos);
    s.btnScan.addEventListener('click', startScanner);
    s.manualEntryBtn.addEventListener('click', promptForManualImeiInput);
    s.productForm.addEventListener('submit', handleProductFormSubmit);
    s.btnExport.addEventListener('click', () => s.exportMenu.classList.toggle('show'));
    s.exportStockBtn.addEventListener('click', () => { exportToExcel('stock'); s.exportMenu.classList.remove('show'); });
    s.exportSalesBtn.addEventListener('click', () => { exportToExcel('sales'); s.exportMenu.classList.remove('show'); });
    document.addEventListener('click', (e) => { if (s.exportMenu && !s.btnExport.contains(e.target)) s.exportMenu.classList.remove('show'); });
    s.btnAddGasto.addEventListener('click', () => promptToAddGasto());
    s.btnHacerCaja.addEventListener('click', generarCajaDiaria);
    s.btnAddProvider.addEventListener('click', promptToAddProvider);

    // UN SOLO LISTENER PARA ACCIONES DE PROVEEDORES
    s.providersView.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const card = button.closest('.provider-card');
        if (!card) return;

        const providerId = card.dataset.providerId;
        const providerName = card.querySelector('h3').textContent;

        if (button.classList.contains('btn-register-payment')) {
            const debtAmount = parseFloat(card.querySelector('.debt-amount').textContent.replace(/[^0-9,-]+/g,"").replace(',', '.'));
            // ===== CAMBIO CLAVE: GUARDAMOS EN LA VARIABLE GLOBAL =====
            paymentContext = { id: providerId, name: providerName };
            promptToRegisterPayment(providerName, debtAmount);
        }
        else if (button.classList.contains('btn-batch-load')) {
            promptToStartBatchLoad(providerId, providerName);
        }
        else if (button.classList.contains('btn-view-payments')) {
            showPaymentHistory(providerId, providerName);
        }
        else if (button.classList.contains('btn-view-batches')) {
            showBatchHistory(providerId, providerName);
        }
        else if (button.classList.contains('btn-delete-provider')) {
            deleteProvider(providerId, providerName);
        }
    });

    // UN SOLO LISTENER PARA FORMULARIOS DENTRO DEL PROMPT
    s.promptContainer.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        
        if (form.id === 'payment-form') {
            saveProviderPayment(form);
        } else if (form.id === 'provider-form') {
            saveProvider(form.querySelector('button[type="submit"]'));
        } else if (form.id === 'gasto-form') {
            saveGasto(form.querySelector('button[type="submit"]'));
        } else if (form.id === 'batch-load-form') {
            const model = form.modelo.value;
            const batchCost = parseFloat(form.costo.value);
            const batchNumber = form.batchNumber.value.trim();
            const providerId = form.dataset.providerId;
            const providerName = form.dataset.providerName;
            initiateBatchLoad(providerId, providerName, model, batchCost, batchNumber);
        }
    });

    // UN SOLO LISTENER PARA BOTONES DE CANCELAR Y OTROS CLICKS EN EL PROMPT
    s.promptContainer.addEventListener('click', (e) => {
        if (e.target.matches('.prompt-button.cancel')) {
            s.promptContainer.innerHTML = '';
            paymentContext = null; // Limpiamos el contexto si se cancela
        }
    });

    s.kpiDollarsDay.parentElement.addEventListener('click', () => showKpiDetail('dolares', 'dia'));
    s.kpiCashDay.parentElement.addEventListener('click', () => showKpiDetail('efectivo_ars', 'dia'));
    s.kpiTransferDay.parentElement.addEventListener('click', () => showKpiDetail('transferencia_ars', 'dia'));
    s.kpiDollarsMonth.parentElement.addEventListener('click', () => showKpiDetail('dolares', 'mes'));
    s.kpiCashMonth.parentElement.addEventListener('click', () => showKpiDetail('efectivo_ars', 'mes'));
    s.kpiTransferMonth.parentElement.addEventListener('click', () => showKpiDetail('transferencia_ars', 'mes'));
}

async function updateReports() {
    const interactiveKpis = [
        s.kpiDollarsDay, s.kpiCashDay, s.kpiTransferDay,
        s.kpiDollarsMonth, s.kpiCashMonth, s.kpiTransferMonth
    ];
    interactiveKpis.forEach(kpi => kpi.parentElement.classList.add('interactive'));
    
    const kpiElements = [
        s.kpiStockValue, s.kpiStockCount, s.kpiDollarsDay, s.kpiCashDay, s.kpiTransferDay,
        s.kpiProfitDay, s.kpiExpensesDay, s.kpiDollarsMonth, s.kpiCashMonth,
        s.kpiTransferMonth, s.kpiProfitMonth, s.kpiExpensesMonth
    ];
    kpiElements.forEach(el => el.textContent = 'Calculando...');
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const stockPromise = db.collection('stock_individual').where('estado', '==', 'en_stock').get();
        const salesDayPromise = db.collection('ventas').where('fecha_venta', '>=', startOfDay).where('fecha_venta', '<=', endOfDay).get();
        const salesMonthPromise = db.collection('ventas').where('fecha_venta', '>=', startOfMonth).where('fecha_venta', '<=', endOfMonth).get();
        const expensesDayPromise = db.collection('gastos').where('fecha', '>=', startOfDay).where('fecha', '<=', endOfDay).get();
        const expensesMonthPromise = db.collection('gastos').where('fecha', '>=', startOfMonth).where('fecha', '<=', endOfMonth).get();
        const cashOutflowsDayPromise = db.collection('egresos_caja').where('fecha', '>=', startOfDay).where('fecha', '<=', endOfDay).get();
        const cashOutflowsMonthPromise = db.collection('egresos_caja').where('fecha', '>=', startOfMonth).where('fecha', '<=', endOfMonth).get();
        
        const [
            stockSnap, salesDaySnap, salesMonthSnap, expensesDaySnap, expensesMonthSnap,
            cashOutflowsDaySnap, cashOutflowsMonthSnap
        ] = await Promise.all([
            stockPromise, salesDayPromise, salesMonthPromise, expensesDayPromise, expensesMonthPromise,
            cashOutflowsDayPromise, cashOutflowsMonthPromise
        ]);
        
        let totalStockValue = 0;
        stockSnap.forEach(doc => { totalStockValue += doc.data().precio_costo_usd || 0; });
        s.kpiStockValue.textContent = formatearUSD(totalStockValue);
        s.kpiStockCount.textContent = stockSnap.size;
        
        const processCashOutflows = (snapshot) => {
            let totalDollars = 0, totalCash = 0, totalTransfer = 0;
            snapshot.forEach(doc => {
                const egreso = doc.data();
                if (egreso.moneda === 'USD') totalDollars += egreso.monto || 0;
                if (egreso.moneda === 'ARS_Efectivo') totalCash += egreso.monto || 0;
                if (egreso.moneda === 'ARS_Transferencia') totalTransfer += egreso.monto || 0;
            });
            return { totalDollars, totalCash, totalTransfer };
        };
        const dailyOutflows = processCashOutflows(cashOutflowsDaySnap);
        const monthlyOutflows = processCashOutflows(cashOutflowsMonthSnap);

        const processSalesData = async (salesSnapshot, outflows) => {
            let totalIngresoDollars = 0, totalIngresoCash = 0, totalIngresoTransfer = 0;
            let totalSalesUSD = 0, totalCost = 0;
            
            const salesDocs = salesSnapshot.docs;
            for (const doc of salesDocs) {
                const venta = doc.data();
                totalSalesUSD += venta.precio_venta_usd || 0;
                if (venta.metodo_pago === 'Dólares') totalIngresoDollars += venta.precio_venta_usd || 0;
                else if (venta.metodo_pago === 'Pesos (Efectivo)') totalIngresoCash += venta.monto_efectivo || 0;
                else if (venta.metodo_pago === 'Pesos (Transferencia)') totalIngresoTransfer += venta.monto_transferencia || 0;
            }
            if (!salesSnapshot.empty) {
                const costPromises = salesDocs.map(saleDoc => db.collection("stock_individual").doc(saleDoc.data().imei_vendido).get());
                const costDocs = await Promise.all(costPromises);
                costDocs.forEach(costDoc => {
                    if (costDoc.exists) totalCost += costDoc.data().precio_costo_usd || 0;
                });
            }
            
            const finalDollars = totalIngresoDollars - outflows.totalDollars;
            const finalCash = totalIngresoCash - outflows.totalCash;
            const finalTransfer = totalIngresoTransfer - outflows.totalTransfer;

            return { finalDollars, finalCash, finalTransfer, totalSalesUSD, totalCost };
        };
        
        const dailyData = await processSalesData(salesDaySnap, dailyOutflows);
        s.kpiDollarsDay.textContent = formatearUSD(dailyData.finalDollars);
        s.kpiCashDay.textContent = formatearARS(dailyData.finalCash);
        s.kpiTransferDay.textContent = formatearARS(dailyData.finalTransfer);
        s.kpiProfitDay.textContent = formatearUSD(dailyData.totalSalesUSD - dailyData.totalCost);
        
        const monthlyData = await processSalesData(salesMonthSnap, monthlyOutflows);
        s.kpiDollarsMonth.textContent = formatearUSD(monthlyData.finalDollars);
        s.kpiCashMonth.textContent = formatearARS(monthlyData.finalCash);
        s.kpiTransferMonth.textContent = formatearARS(monthlyData.finalTransfer);
        s.kpiProfitMonth.textContent = formatearUSD(monthlyData.totalSalesUSD - monthlyData.totalCost);

        let totalExpensesDay = 0;
        expensesDaySnap.forEach(doc => {
            const gasto = doc.data();
            if (gasto.moneda === 'ARS' || !gasto.moneda) {
                totalExpensesDay += gasto.monto || 0;
            }
        });
        s.kpiExpensesDay.textContent = formatearARS(totalExpensesDay);
        
        let totalExpensesMonth = 0;
        expensesMonthSnap.forEach(doc => {
            const gasto = doc.data();
            if (gasto.moneda === 'ARS' || !gasto.moneda) {
                totalExpensesMonth += gasto.monto || 0;
            }
        });
        s.kpiExpensesMonth.textContent = formatearARS(totalExpensesMonth);

    } catch (error) {
        console.error("Error al actualizar los informes:", error);
        kpiElements.forEach(el => el.textContent = 'Error');
    }
}


async function handleAuthStateChange(user) {
    if (user) {
        s.loginContainer.innerHTML = ''; s.loginContainer.classList.add('hidden');
        s.appContainer.classList.remove('hidden');
        await loadAndPopulateSelects();
        switchView('dashboard');
        updateCanjeCount();
    } else {
        s.loginContainer.classList.remove('hidden');
        s.appContainer.classList.add('hidden');
        s.loginContainer.innerHTML = `<h1>Iniciar Sesión</h1><form id="login-form"><div id="login-feedback" class="hidden"></div><div class="form-group"><label for="email">Email</label><input type="email" id="email" required></div><div class="form-group"><label for="password">Contraseña</label><input type="password" id="password" required></div><button type="submit" class="spinner-btn"><span class="btn-text">Entrar</span><div class="spinner"></div></button></form>`;
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    }
}

const populateSelect = (selectEl, options, defaultText) => {
    if (selectEl) {
        selectEl.innerHTML = `<option value="">${defaultText}</option>` + options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
    }
};

const toggleSpinner = (btn, isLoading) => {
    if(btn) {
        btn.classList.toggle('loading', isLoading);
        btn.disabled = isLoading;
    }
};

const formatearUSD = (monto) => (monto || 0).toLocaleString('es-AR', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatearARS = (monto) => (monto || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 });


function showGlobalFeedback(message, type = 'success', duration = 3000) {
    s.globalFeedback.textContent = message;
    s.globalFeedback.className = `feedback-message ${type}`;
    s.globalFeedback.classList.add('show');
    setTimeout(() => {
        s.globalFeedback.classList.remove('show');
    }, duration);
}

function showConfirmationModal(title, message, onConfirm) {
    const modal = document.createElement('div');
    modal.id = 'confirmation-modal-overlay';
    modal.innerHTML = `
        <div class="confirmation-modal-box">
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="prompt-buttons">
                <button id="confirm-action-btn" class="prompt-button confirm">Aceptar</button>
                <button id="cancel-action-btn" class="prompt-button cancel">Cancelar</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
    document.getElementById('confirm-action-btn').onclick = () => {
        onConfirm();
        modal.remove();
    };
    document.getElementById('cancel-action-btn').onclick = () => {
        modal.remove();
    };
}

async function updateCanjeCount() {
    try {
        const snapshot = await db.collection('plan_canje_pendientes').where('estado', '==', 'pendiente_de_carga').get();
        const count = snapshot.size;
        s.canjeBadge.textContent = count;
        s.canjeBadge.classList.toggle('hidden', count === 0);
    } catch (error) {
        console.error("Error al obtener contador de canjes:", error);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    toggleSpinner(btn, true);
    try {
        await auth.signInWithEmailAndPassword(e.target.email.value, e.target.password.value);
    } catch (error) {
        const feedbackEl = document.getElementById('login-feedback');
        feedbackEl.textContent = "Usuario o contraseña incorrecta. Por favor, vuelve a intentar.";
        feedbackEl.className = 'error';
        feedbackEl.classList.remove('hidden');
    } finally {
        toggleSpinner(btn, false);
    }
}

function switchView(view) {
    const views = ['dashboard', 'reports', 'management', 'providers']; 
    
    views.forEach(v => {
        const viewElement = s[`${v}View`];
        const tabElement = s[`tab${v.charAt(0).toUpperCase() + v.slice(1)}`];

        if (viewElement) viewElement.classList.toggle('hidden', v !== view);
        if (tabElement) tabElement.classList.toggle('active', v === view);
    });

    if (view === 'dashboard' && !s.stockTableContainer.innerHTML.includes('<table>')) {
        switchDashboardView('stock');
    } else if (view === 'reports') {
        updateReports();
    } else if (view === 'providers') {
        loadProviders();
    } else if (view === 'management') {
        if (!batchLoadContext && !canjeContext) {
            resetManagementView();
        }
    }
}


function switchDashboardView(viewName) {
    const sections = ['stock', 'sales', 'canje', 'gastos', 'commissions'];
    sections.forEach(v => {
        const section = document.getElementById(`${v}-section`);
        const button = document.getElementById(`btn-show-${v}`);
        if(section) section.classList.toggle('hidden', v !== viewName);
        if(button) button.classList.toggle('active', v === viewName);
    });
    updateCanjeCount();
    if (viewName === 'stock') loadStock();
    else if (viewName === 'sales') loadSales();
    else if (viewName === 'canje') loadCanjes();
    else if (viewName === 'gastos') loadGastos();
    else if (viewName === 'commissions') loadCommissions();
}

// ===== INICIO: FUNCIONES DE PROVEEDORES =====

async function loadProviders() {
    s.providersListContainer.innerHTML = `<p class="dashboard-loader">Cargando proveedores...</p>`;
    try {
        const snapshot = await db.collection('proveedores').orderBy('nombre').get();
        if (snapshot.empty) {
            s.providersListContainer.innerHTML = `<p class="dashboard-loader">No hay proveedores creados. ¡Agrega el primero!</p>`;
            return;
        }
        const providers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderProviders(providers);
    } catch (error) {
        handleDBError(error, s.providersListContainer, "proveedores");
    }
}

// FUNCIÓN SIMPLIFICADA: SOLO RENDERIZA HTML, NO AÑADE LISTENERS
function renderProviders(providers) {
    s.providersListContainer.innerHTML = providers.map(provider => {
        const debt = provider.deuda_usd || 0;
        const deleteTitle = debt !== 0 ? 'No se puede eliminar un proveedor con deuda pendiente' : 'Eliminar Proveedor';
        
        return `
        <div class="provider-card" data-provider-id="${provider.id}">
            <div class="provider-card-header">
                <div class="provider-card-info">
                    <h3>${provider.nombre}</h3>
                    <p>Contacto: ${provider.contacto || 'No especificado'}</p>
                </div>
                <button class="delete-icon-btn btn-delete-provider" title="${deleteTitle}" ${debt !== 0 ? 'disabled' : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>

            <div class="provider-card-debt">
                <div class="debt-label">Deuda Pendiente</div>
                <div class="debt-amount ${debt === 0 ? 'zero' : ''}">${formatearUSD(debt)}</div>
            </div>

            <div class="provider-card-actions">
                <div class="provider-primary-action">
                    <button class="control-btn btn-batch-load">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span>Carga de Lote</span>
                    </button>
                </div>
                <div class="provider-secondary-actions">
                    <button class="control-btn btn-secondary btn-register-payment" ${debt === 0 ? 'disabled' : ''}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        <span>Registrar Pago</span>
                    </button>
                     <button class="control-btn btn-secondary btn-view-payments">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <span>Ver Pagos</span>
                    </button>
                    <button class="control-btn btn-secondary btn-view-batches">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        <span>Ver Lotes</span>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function promptToAddProvider() {
    s.promptContainer.innerHTML = `
        <div class="container container-sm">
            <div class="prompt-box">
                <h3>Agregar Nuevo Proveedor</h3>
                <form id="provider-form">
                    <div class="form-group">
                        <label for="provider-name">Nombre del Proveedor</label>
                        <input type="text" id="provider-name" name="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="provider-contact">Información de Contacto (Tel, etc.)</label>
                        <input type="text" id="provider-contact" name="contacto">
                    </div>
                    <div class="prompt-buttons">
                        <button type="submit" class="prompt-button confirm spinner-btn">
                            <span class="btn-text">Guardar Proveedor</span>
                            <div class="spinner"></div>
                        </button>
                        <button type="button" class="prompt-button cancel">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>`;
}

async function saveProvider(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const providerData = {
        nombre: form.nombre.value.trim(),
        contacto: form.contacto.value.trim(),
        deuda_usd: 0,
        fecha_creacion: firebase.firestore.FieldValue.serverTimestamp()
    };
    try {
        await db.collection('proveedores').add(providerData);
        showGlobalFeedback('Proveedor agregado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        loadProviders(); 
        loadAndPopulateSelects(); 
    } catch (error) {
        console.error("Error al guardar el proveedor:", error);
        showGlobalFeedback('Error al guardar el proveedor', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

function deleteProvider(providerId, providerName) {
    const message = `¿Estás seguro de que quieres eliminar al proveedor "${providerName}"?\n\nEsta acción es irreversible. Solo se puede eliminar si la deuda es $0.`;
    showConfirmationModal('Confirmar Eliminación', message, async () => {
        try {
            await db.collection('proveedores').doc(providerId).delete();
            showGlobalFeedback(`Proveedor "${providerName}" eliminado correctamente.`, 'success');
            loadProviders();
            loadAndPopulateSelects();
        } catch (error) {
            console.error("Error al eliminar proveedor:", error);
            showGlobalFeedback('No se pudo eliminar el proveedor.', 'error');
        }
    });
}

function promptToStartBatchLoad(providerId, providerName) {
    const modelosOptions = modelos.map(m => `<option value="${m}">${m}</option>`).join('');
    s.promptContainer.innerHTML = `
        <div class="container container-sm">
            <div class="prompt-box">
                <h3>Carga de Lote para ${providerName}</h3>
                <form id="batch-load-form" data-provider-id="${providerId}" data-provider-name="${providerName}">
                    <div class="form-group">
                        <label for="batch-number">Número de Lote (ID)</label>
                        <input type="text" id="batch-number" name="batchNumber" required placeholder="Ej: LOTE-00123">
                    </div>
                    <div class="form-group">
                        <label for="batch-model">Modelo de iPhone</label>
                        <select id="batch-model" name="modelo" required>
                            <option value="">Seleccione un modelo...</option>
                            ${modelosOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="batch-cost">Costo Total del Lote (USD)</label>
                        <input type="number" id="batch-cost" name="costo" step="0.01" required placeholder="Ej: 5500.00">
                    </div>
                    <div class="prompt-buttons">
                        <button type="submit" class="prompt-button confirm">Iniciar Carga</button>
                        <button type="button" class="prompt-button cancel">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>`;
}

async function initiateBatchLoad(providerId, providerName, model, batchCost, batchNumber) {
    try {
        const providerRef = db.collection('proveedores').doc(providerId);
        const loteRef = db.collection('lotes').doc();
        
        await db.runTransaction(async t => {
            t.update(providerRef, {
                deuda_usd: firebase.firestore.FieldValue.increment(batchCost)
            });
            t.set(loteRef, {
                numero_lote: batchNumber,
                proveedorId: providerId,
                proveedorNombre: providerName,
                modelo: model,
                costo_total_usd: batchCost,
                fecha_carga: firebase.firestore.FieldValue.serverTimestamp(),
                imeis: []
            });
        });
        
        batchLoadContext = {
            providerId,
            providerName,
            model,
            batchId: loteRef.id,
            count: 0
        };

        s.promptContainer.innerHTML = '';
        showGlobalFeedback(`Deuda de ${formatearUSD(batchCost)} agregada. Comienza a cargar los equipos.`, 'info', 5000);
        
        resetManagementView(true);
        switchView('management');

    } catch (error) {
        console.error("Error al iniciar la carga de lote:", error);
        showGlobalFeedback('Error al iniciar la carga de lote', 'error');
    }
}

async function promptToRegisterPayment(providerName, currentDebt) {
    // Ya no necesita el ID, lo toma de la variable global 'paymentContext'
    const lotesSnapshot = await db.collection('lotes').where('proveedorId', '==', paymentContext.id).get();
    const lotesOptions = lotesSnapshot.docs.map(doc => {
        const lote = doc.data();
        return `<option value="${lote.numero_lote}">${lote.numero_lote} (${lote.modelo})</option>`;
    }).join('');

    s.promptContainer.innerHTML = `
        <div class="container container-sm">
            <div class="prompt-box">
                <h3>Registrar Pago a ${providerName}</h3>
                <p>Deuda actual: <strong>${formatearUSD(currentDebt)}</strong></p>
                <form id="payment-form">
                    <div class="form-group">
                        <label for="payment-total">Monto Total del Pago (USD)</label>
                        <input type="number" id="payment-total" name="total" step="0.01" max="${currentDebt}" required>
                    </div>
                    <div class="form-group">
                        <label for="lote-asociado">Asociar a Lote (Opcional)</label>
                        <select id="lote-asociado" name="loteAsociado">
                            <option value="">Ninguno / Pago general</option>
                            ${lotesOptions}
                        </select>
                    </div>
                    <div class="form-group payment-details-group">
                        <label>Método de Pago</label>
                        <div class="checkbox-group" style="margin-bottom: 0.5rem;"><input type="checkbox" id="pay-usd" name="pay-usd" class="payment-method-cb"><label for="pay-usd">Dólares</label></div>
                        <div id="pay-usd-fields" class="hidden" style="padding-left: 25px;"><input type="number" name="dolares" placeholder="Monto USD"></div>
                        <div class="checkbox-group" style="margin-bottom: 0.5rem;"><input type="checkbox" id="pay-ars-efectivo" name="pay-ars-efectivo" class="payment-method-cb"><label for="pay-ars-efectivo">Pesos (Efectivo)</label></div>
                        <div id="pay-ars-efectivo-fields" class="hidden" style="padding-left: 25px;"><input type="number" name="efectivo" placeholder="Monto ARS"></div>
                        <div class="checkbox-group" style="margin-bottom: 0.5rem;"><input type="checkbox" id="pay-ars-transfer" name="pay-ars-transfer" class="payment-method-cb"><label for="pay-ars-transfer">Pesos (Transferencia)</label></div>
                        <div id="pay-ars-transfer-fields" class="hidden" style="padding-left: 25px;"><input type="number" name="transferencia" placeholder="Monto ARS"></div>
                    </div>
                    <div class="form-group">
                        <label for="payment-notes">Notas (Opcional)</label>
                        <textarea id="payment-notes" name="notas" rows="2" placeholder="Ej: Pago parcial del Lote-123"></textarea>
                    </div>
                    <div class="prompt-buttons">
                        <button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Registrar Pago</span><div class="spinner"></div></button>
                        <button type="button" class="prompt-button cancel">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>`;
    
    const form = document.getElementById('payment-form');
    const totalInput = document.getElementById('payment-total');
    const paymentCheckboxes = form.querySelectorAll('.payment-method-cb');

    paymentCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const fieldsDiv = document.getElementById(`${cb.id}-fields`);
            if (fieldsDiv) fieldsDiv.classList.toggle('hidden', !cb.checked);
            
            if (cb.id === 'pay-usd' && cb.checked && totalInput.value) {
                form.querySelector('[name="dolares"]').value = totalInput.value;
            }
        });
    });

    totalInput.addEventListener('input', () => {
        const usdCheckbox = document.getElementById('pay-usd');
        if (usdCheckbox && usdCheckbox.checked) {
            form.querySelector('[name="dolares"]').value = totalInput.value;
        }
    });
}

async function saveProviderPayment(form) {
    const btn = form.querySelector('button[type="submit"]');
    toggleSpinner(btn, true);
    
    if (!paymentContext || !paymentContext.id) {
        showGlobalFeedback("Error fatal: No hay contexto de pago. Refresque la página.", "error", 5000);
        toggleSpinner(btn, false);
        return;
    }
    const providerId = paymentContext.id;
    const providerName = paymentContext.name;

    const formData = new FormData(form);
    const totalPaymentUSD = parseFloat(formData.get('total'));
    const loteAsociado = formData.get('loteAsociado');
    const notas = (formData.get('notas') || '').trim(); 
    
    if (isNaN(totalPaymentUSD) || totalPaymentUSD <= 0) {
        showGlobalFeedback("El monto total del pago debe ser un número válido y mayor a cero.", "error");
        toggleSpinner(btn, false);
        return;
    }

    const usdAmount = parseFloat(formData.get('dolares')) || 0;
    const arsEfectivoAmount = parseFloat(formData.get('efectivo')) || 0;
    const arsTransferAmount = parseFloat(formData.get('transferencia')) || 0;
    
    const egresos = [];
    const pagos = [];
    const fecha = firebase.firestore.FieldValue.serverTimestamp();

    if (usdAmount > 0) {
        egresos.push({ monto: usdAmount, moneda: 'USD', fecha, descripcion: `Pago a ${providerName}`, providerId, monto_total_usd: totalPaymentUSD });
        pagos.push({ monto: usdAmount, moneda: 'USD' });
    }
    if (arsEfectivoAmount > 0) {
        egresos.push({ monto: arsEfectivoAmount, moneda: 'ARS_Efectivo', fecha, descripcion: `Pago a ${providerName}`, providerId, monto_total_usd: totalPaymentUSD });
        pagos.push({ monto: arsEfectivoAmount, moneda: 'ARS (Efectivo)' });
    }
    if (arsTransferAmount > 0) {
        egresos.push({ monto: arsTransferAmount, moneda: 'ARS_Transferencia', fecha, descripcion: `Pago a ${providerName}`, providerId, monto_total_usd: totalPaymentUSD });
        pagos.push({ monto: arsTransferAmount, moneda: 'ARS (Transferencia)' });
    }

    if (pagos.length === 0) {
        showGlobalFeedback("Debes especificar al menos un método de pago con su monto.", "error");
        toggleSpinner(btn, false);
        return;
    }
    
    try {
        await db.runTransaction(async t => {
            const providerRef = db.collection('proveedores').doc(providerId);
            const paymentRef = db.collection('pagos_proveedores').doc();

            t.update(providerRef, {
                deuda_usd: firebase.firestore.FieldValue.increment(-totalPaymentUSD)
            });

            t.set(paymentRef, {
                providerId,
                proveedorNombre: providerName,
                monto_total_usd: totalPaymentUSD,
                lote_asociado: loteAsociado || null,
                detalle_pago: pagos,
                fecha,
                notas: notas 
            });

            egresos.forEach(egreso => {
                const egresoRef = db.collection('egresos_caja').doc();
                t.set(egresoRef, egreso);
            });
        });
        
        showGlobalFeedback('Pago a proveedor registrado y descontado de caja.', 'success');
        s.promptContainer.innerHTML = '';
        loadProviders();
        updateReports();

    } catch (error) {
        console.error("Error al registrar el pago:", error);
        showGlobalFeedback('Error al registrar el pago.', 'error');
    } finally {
        toggleSpinner(btn, false);
        paymentContext = null; // Limpiamos la variable global
    }
}


async function showPaymentHistory(providerId, providerName) {
    s.promptContainer.innerHTML = `
    <div class="container kpi-detail-modal">
        <h3>Historial de Pagos a ${providerName}</h3>
        <div id="payment-history-content" class="table-container">
            <p class="dashboard-loader">Cargando pagos...</p>
        </div>
        <div class="prompt-buttons" style="justify-content: center;">
            <button class="prompt-button cancel">Cerrar</button>
        </div>
    </div>`;

    const contentDiv = document.getElementById('payment-history-content');
    try {
        const snapshot = await db.collection('pagos_proveedores')
            .where('proveedorId', '==', providerId)
            .orderBy('fecha', 'desc')
            .get();
        
        if (snapshot.empty) {
            contentDiv.innerHTML = '<p class="dashboard-loader">No hay pagos registrados para este proveedor.</p>';
            return;
        }

        const pagos = snapshot.docs.map(doc => doc.data());

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Monto Total (USD)</th>
                        <th>Lote Asociado</th>
                        <th>Detalle del Pago</th>
                        <th>Notas</th>
                    </tr>
                </thead>
                <tbody>
                    ${pagos.map(pago => `
                        <tr>
                            <td>${pago.fecha.toDate().toLocaleString('es-AR')}</td>
                            <td>${formatearUSD(pago.monto_total_usd)}</td>
                            <td>${pago.lote_asociado || 'N/A'}</td>
                            <td>${pago.detalle_pago.map(d => `${d.moneda === 'USD' ? formatearUSD(d.monto) : formatearARS(d.monto)}`).join(' + ')}</td>
                            <td>${pago.notas || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
        contentDiv.innerHTML = tableHTML;

    } catch(error) {
        handleDBError(error, contentDiv, 'historial de pagos');
    }
}


async function showBatchHistory(providerId, providerName) {
    s.promptContainer.innerHTML = `
    <div class="container batch-history-modal">
        <h3>Historial de Lotes de ${providerName}</h3>
        <div id="batch-list-container">
            <p class="dashboard-loader">Cargando historial...</p>
        </div>
        <hr style="border-color:var(--border-dark);margin:1.5rem 0;">
        <div id="batch-detail-container">
            <h4>Selecciona un lote para ver el detalle</h4>
        </div>
        <div class="prompt-buttons" style="justify-content: center;">
            <button class="prompt-button cancel">Cerrar</button>
        </div>
    </div>`;

    const batchListContainer = document.getElementById('batch-list-container');
    try {
        const snapshot = await db.collection('lotes')
            .where('proveedorId', '==', providerId)
            .orderBy('fecha_carga', 'desc')
            .get();
        
        if (snapshot.empty) {
            batchListContainer.innerHTML = '<p class="dashboard-loader">Este proveedor no tiene lotes registrados.</p>';
            return;
        }

        const lotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        batchListContainer.innerHTML = '<div class="batch-list">' + lotes.map(lote => `
            <div class="batch-list-item" data-batch-id="${lote.id}">
                <div class="list-item-content">
                    <div class="batch-info">Lote #${lote.numero_lote} <span>(${new Date(lote.fecha_carga.seconds * 1000).toLocaleDateString()})</span></div>
                    <div class="batch-cost">${formatearUSD(lote.costo_total_usd)}</div>
                </div>
                <button class="delete-icon-btn btn-delete-batch" title="Eliminar Lote">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `).join('') + '</div>';

        batchListContainer.querySelectorAll('.list-item-content').forEach(itemContent => {
            itemContent.addEventListener('click', async (e) => {
                const parentItem = e.currentTarget.parentElement;
                document.querySelectorAll('.batch-list-item').forEach(i => i.classList.remove('selected'));
                parentItem.classList.add('selected');
                const batchId = parentItem.dataset.batchId;
                const loteData = lotes.find(l => l.id === batchId);
                await showBatchDetail(loteData);
            });
        });

        batchListContainer.querySelectorAll('.btn-delete-batch').forEach(btn => {
            const parentItem = btn.closest('.batch-list-item');
            const batchId = parentItem.dataset.batchId;
            const loteData = lotes.find(l => l.id === batchId);
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteBatch(loteData.id, loteData.numero_lote, providerId, providerName);
            });
        });

    } catch (error) {
        handleDBError(error, batchListContainer, "historial de lotes");
    }
}

async function showBatchDetail(lote) {
    const detailContainer = document.getElementById('batch-detail-container');
    detailContainer.innerHTML = `<p class="dashboard-loader">Cargando detalle del lote...</p>`;

    if (!lote || !lote.imeis || lote.imeis.length === 0) {
        detailContainer.innerHTML = `<h4>Este lote no tiene equipos cargados.</h4>`;
        return;
    }

    try {
        const itemPromises = lote.imeis.map(imei => db.collection('stock_individual').doc(imei).get());
        const itemDocs = await Promise.all(itemPromises);

        const itemsData = itemDocs.filter(doc => doc.exists).map(doc => doc.data());
        
        let tableHTML = `<div class="table-container"><table><thead><tr><th>IMEI</th><th>Modelo</th><th>Color</th><th>GB</th><th>Batería</th><th>Costo</th></tr></thead><tbody>`;
        itemsData.forEach(item => {
            tableHTML += `<tr>
                <td>${item.imei}</td>
                <td>${item.modelo}</td>
                <td>${item.color}</td>
                <td>${item.almacenamiento}</td>
                <td>${item.bateria}%</td>
                <td>${formatearUSD(item.precio_costo_usd)}</td>
            </tr>`;
        });
        tableHTML += '</tbody></table></div>';
        detailContainer.innerHTML = tableHTML;

    } catch (error) {
        handleDBError(error, detailContainer, `detalle del lote ${lote.numero_lote}`);
    }
}

function deleteBatch(batchId, batchNumber, providerId, providerName) {
    const message = `¿Estás seguro de que quieres eliminar el Lote #${batchNumber}?\n\nEsta acción NO eliminará los equipos del stock, solo borrará el registro de este lote.\n\nEsta acción es irreversible.`;
    showConfirmationModal('Confirmar Eliminación de Lote', message, async () => {
        try {
            await db.collection('lotes').doc(batchId).delete();
            showGlobalFeedback(`Lote #${batchNumber} eliminado correctamente.`, 'success');
            showBatchHistory(providerId, providerName);
        } catch (error) {
            console.error("Error al eliminar el lote:", error);
            showGlobalFeedback('No se pudo eliminar el lote.', 'error');
        }
    });
}


// ===== FIN: FUNCIONES DE PROVEEDORES =====

// ===== INICIO: LÓGICA DE DETALLE DE KPI Y REVERSIÓN INTELIGENTE =====

async function showKpiDetail(kpiType, period) {
    const now = new Date();
    let startDate, endDate;
    let title = '';

    if (period === 'dia') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        title = `Detalle de Caja del Día - ${kpiType.replace(/_/g, ' ').toUpperCase()}`;
    } else { // mes
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        title = `Detalle de Caja del Mes - ${kpiType.replace(/_/g, ' ').toUpperCase()}`;
    }

    s.promptContainer.innerHTML = `
        <div class="container kpi-detail-modal">
            <h3>${title}</h3>
            <div id="kpi-detail-content">
                <p class="dashboard-loader">Cargando transacciones...</p>
            </div>
            <div class="prompt-buttons" style="justify-content: center;">
                <button class="prompt-button cancel">Cerrar</button>
            </div>
        </div>`;

    const detailContent = document.getElementById('kpi-detail-content');

    try {
        const transactions = [];
        let kpiMoneda, kpiMetodo, kpiMontoField, egresoMoneda;

        if (kpiType === 'dolares') {
            kpiMoneda = 'USD'; kpiMetodo = 'Dólares'; kpiMontoField = 'precio_venta_usd'; egresoMoneda = 'USD';
        } else if (kpiType === 'efectivo_ars') {
            kpiMoneda = 'ARS'; kpiMetodo = 'Pesos (Efectivo)'; kpiMontoField = 'monto_efectivo'; egresoMoneda = 'ARS_Efectivo';
        } else if (kpiType === 'transferencia_ars') {
            kpiMoneda = 'ARS'; kpiMetodo = 'Pesos (Transferencia)'; kpiMontoField = 'monto_transferencia'; egresoMoneda = 'ARS_Transferencia';
        }
        
        const salesSnap = await db.collection('ventas').where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).where('metodo_pago', '==', kpiMetodo).get();
        salesSnap.forEach(doc => {
            const venta = doc.data();
            transactions.push({ id: doc.id, fecha: venta.fecha_venta.toDate(), tipo: 'Ingreso', concepto: `Venta: ${venta.producto.modelo}`, monto: venta[kpiMontoField], moneda: kpiMoneda, data: venta });
        });

        const outflowsSnap = await db.collection('egresos_caja').where('fecha', '>=', startDate).where('fecha', '<=', endDate).where('moneda', '==', egresoMoneda).get();
        outflowsSnap.forEach(doc => {
            const egreso = doc.data();
            transactions.push({ id: doc.id, fecha: egreso.fecha.toDate(), tipo: 'Egreso', concepto: egreso.descripcion, monto: egreso.monto, moneda: egreso.moneda.startsWith('ARS') ? 'ARS' : 'USD', data: egreso });
        });
        
        transactions.sort((a, b) => b.fecha - a.fecha);

        if (transactions.length === 0) {
            detailContent.innerHTML = `<p class="dashboard-loader">No hay movimientos para este período.</p>`;
            return;
        }

        const tableHTML = `
            <div class="table-container">
                <table>
                    <thead><tr><th>Fecha</th><th>Tipo</th><th>Concepto</th><th>Monto</th><th>Acciones</th></tr></thead>
                    <tbody>
                        ${transactions.map(t => {
                            const dataString = JSON.stringify(t.data).replace(/'/g, "\\'");
                            return `
                                <tr data-id="${t.id}" data-type="${t.tipo}" data-item='${dataString}'>
                                    <td>${t.fecha.toLocaleString('es-AR')}</td>
                                    <td>${t.tipo}</td>
                                    <td>${t.concepto}</td>
                                    <td class="${t.tipo === 'Ingreso' ? 'income' : 'outcome'}">
                                        ${t.tipo === 'Egreso' ? '-' : ''}${t.moneda === 'USD' ? formatearUSD(t.monto) : formatearARS(t.monto)}
                                    </td>
                                    <td class="actions-cell">
                                        <button class="edit-btn btn-edit-kpi-item" title="Editar" ${t.tipo === 'Egreso' ? 'disabled' : ''}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                        <button class="delete-btn btn-delete-kpi-item" title="Eliminar/Revertir"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                                    </td>
                                </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>`;
        detailContent.innerHTML = tableHTML;

        detailContent.querySelectorAll('.btn-edit-kpi-item').forEach(btn => btn.addEventListener('click', (e) => {
            const row = e.currentTarget.closest('tr');
            promptToEditSale(JSON.parse(row.dataset.item.replace(/\\'/g, "'")), row.dataset.id);
        }));

        detailContent.querySelectorAll('.btn-delete-kpi-item').forEach(btn => btn.addEventListener('click', (e) => {
            const row = e.currentTarget.closest('tr');
            const id = row.dataset.id;
            const type = row.dataset.type;
            const data = JSON.parse(row.dataset.item.replace(/\\'/g, "'"));
            
            if (type === 'Ingreso') {
                const message = `¿Seguro que quieres revertir esta venta?\n\n- La venta se eliminará.\n- El equipo (IMEI: ${data.imei_vendido}) volverá al stock.`;
                showConfirmationModal('Revertir Venta', message, () => reverseSaleTransaction(id, data, kpiType, period));
            } else { // Egreso
                const isRevertible = data.proveedorId && typeof data.monto_total_usd === 'number';
                if (isRevertible) {
                    const message = `¿Seguro que quieres revertir este pago?\n\n- El egreso de caja se eliminará.\n- La deuda con el proveedor se incrementará en ${formatearUSD(data.monto_total_usd)}.`;
                    showConfirmationModal('Revertir Pago a Proveedor', message, () => reverseEgresoTransaction(id, data, kpiType, period));
                } else {
                    const message = `<strong>¡ATENCIÓN!</strong>\n\nEste es un registro de pago antiguo y no puede ser revertido automáticamente.\n\nSolo podemos <strong>eliminar este registro del historial</strong> de caja.\n\nLa deuda con el proveedor <strong>NO será modificada</strong>.\n\n¿Deseas forzar el borrado de este registro?`;
                    showConfirmationModal('Borrado Administrativo', message, () => forceDeleteEgresoRecord(id, kpiType, period));
                }
            }
        }));

    } catch (error) {
        handleDBError(error, detailContent, `el detalle de ${kpiType}`);
    }
}

async function reverseSaleTransaction(saleId, saleData, kpiType, period) {
    try {
        await db.runTransaction(async t => {
            const saleRef = db.collection('ventas').doc(saleId);
            const stockRef = db.collection('stock_individual').doc(saleData.imei_vendido);
            
            t.delete(saleRef);
            t.update(stockRef, { estado: 'en_stock' });
            
            if (saleData.id_canje_pendiente) {
                const canjeRef = db.collection('plan_canje_pendientes').doc(saleData.id_canje_pendiente);
                t.delete(canjeRef);
            }
        });
        showGlobalFeedback("Venta revertida con éxito. El equipo ha vuelto al stock.", "success");
        updateReports();
        showKpiDetail(kpiType, period); 
    } catch (error) {
        console.error("Error al revertir la venta:", error);
        showGlobalFeedback("Error al revertir la venta.", "error");
    }
}

async function reverseEgresoTransaction(egresoId, egresoData, kpiType, period) {
    if (!egresoData.proveedorId || typeof egresoData.monto_total_usd !== 'number' || isNaN(egresoData.monto_total_usd)) {
        showGlobalFeedback("Error: Datos incompletos para la reversión automática.", "error", 5000);
        return;
    }

    try {
        await db.runTransaction(async t => {
            const egresoRef = db.collection('egresos_caja').doc(egresoId);
            const providerRef = db.collection('proveedores').doc(egresoData.proveedorId);
            
            const providerDoc = await t.get(providerRef);
            if (!providerDoc.exists) throw new Error(`El proveedor con ID ${egresoData.proveedorId} no fue encontrado.`);

            t.delete(egresoRef);
            t.update(providerRef, { deuda_usd: firebase.firestore.FieldValue.increment(egresoData.monto_total_usd) });
        });

        showGlobalFeedback("Pago a proveedor revertido. La deuda ha sido restaurada.", "success");
        updateReports();
        showKpiDetail(kpiType, period);
    } catch (error) {
        console.error("Error al revertir el pago:", error);
        showGlobalFeedback(error.message || "Error al revertir el pago.", "error");
    }
}

async function forceDeleteEgresoRecord(egresoId, kpiType, period) {
    try {
        await db.collection('egresos_caja').doc(egresoId).delete();
        showGlobalFeedback("Registro de egreso eliminado administrativamente.", "success", 4000);
        updateReports();
        showKpiDetail(kpiType, period);
    } catch (error) {
        console.error("Error en el borrado administrativo:", error);
        showGlobalFeedback("No se pudo eliminar el registro.", "error");
    }
}

// ===== FIN: LÓGICA DE DETALLE DE KPI =====


async function loadCommissions() {
    s.commissionsResultsContainer.innerHTML = `<p class="dashboard-loader">Cargando comisiones...</p>`;
    toggleSpinner(s.btnApplyCommissionsFilters, true);
    try {
        let query = db.collection("ventas").where("comision_vendedor_usd", ">", 0);
        if (s.filterCommissionsVendedor.value) {
            query = query.where('vendedor', '==', s.filterCommissionsVendedor.value);
        }
        query = query.orderBy("comision_vendedor_usd", "desc").orderBy("fecha_venta", "desc");
        const querySnapshot = await query.get();
        let sales = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const startDate = s.filterCommissionsStartDate.value;
        const endDate = s.filterCommissionsEndDate.value;
        if (startDate) {
            sales = sales.filter(sale => sale.fecha_venta && sale.fecha_venta.toDate() >= new Date(startDate + 'T00:00:00'));
        }
        if (endDate) {
            sales = sales.filter(sale => sale.fecha_venta && sale.fecha_venta.toDate() <= new Date(endDate + 'T23:59:59'));
        }
        if (sales.length === 0) {
            s.commissionsResultsContainer.innerHTML = `<p class="dashboard-loader">No se encontraron comisiones con los filtros seleccionados.</p>`;
            return;
        }
        renderCommissions(sales);
    } catch (error) {
        handleDBError(error, s.commissionsResultsContainer, "comisiones");
    } finally {
        toggleSpinner(s.btnApplyCommissionsFilters, false);
    }
}

function renderCommissions(sales) {
    const commissionsByVendor = sales.reduce((acc, sale) => {
        const vendor = sale.vendedor;
        if (!vendor) return acc;
        if (!acc[vendor]) acc[vendor] = { total: 0, sales: [] };
        acc[vendor].total += sale.comision_vendedor_usd || 0;
        acc[vendor].sales.push(sale);
        return acc;
    }, {});
    if (Object.keys(commissionsByVendor).length === 0) {
        s.commissionsResultsContainer.innerHTML = `<p class="dashboard-loader">No hay datos de comisiones para mostrar.</p>`;
        return;
    }
    let html = '';
    for (const vendorName in commissionsByVendor) {
        const data = commissionsByVendor[vendorName];
        const salesListHtml = data.sales.map(sale => `
            <div class="commission-sale-item">
                <div class="commission-sale-main">
                    <span class="commission-sale-product">${sale.producto.modelo || 'Producto desc.'} ${sale.producto.color || ''}</span>
                    <span class="commission-sale-amount">${formatearUSD(sale.comision_vendedor_usd)}</span>
                </div>
                <span class="commission-sale-date">${new Date((sale.fecha_venta?.seconds || 0) * 1000).toLocaleString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})} hs</span>
            </div>
        `).join('');
        html += `
            <div class="commission-vendor-card">
                <div class="vendor-card-header">
                    <h3>${vendorName}</h3>
                    <span class="vendor-total-commission">${formatearUSD(data.total)}</span>
                </div>
                <div class="commission-sales-list">${salesListHtml}</div>
            </div>
        `;
    }
    s.commissionsResultsContainer.innerHTML = html;
}

async function generarCajaDiaria() {
    const fechaSeleccionada = s.filterSalesEndDate.value;
    if (!fechaSeleccionada) {
        showGlobalFeedback("Por favor, selecciona una fecha en el filtro 'Fecha Hasta' para generar la caja.", "error", 4000);
        return;
    }
    toggleSpinner(s.btnHacerCaja, true);
    try {
        const fecha = new Date(fechaSeleccionada + 'T00:00:00');
        const inicioDelDia = new Date(fecha.setHours(0, 0, 0, 0));
        const finDelDia = new Date(fecha.setHours(23, 59, 59, 999));
        const ventasSnapshot = await db.collection("ventas").where("fecha_venta", ">=", inicioDelDia).where("fecha_venta", "<=", finDelDia).get();
        if (ventasSnapshot.empty) {
            mostrarReporteCaja(fechaSeleccionada, 0, 0, 0, [], 0, 0);
            return;
        }
        const ventasDelDia = ventasSnapshot.docs.map(doc => doc.data());
        const promesasDeCosto = ventasDelDia.map(venta => db.collection("stock_individual").doc(venta.imei_vendido).get());
        const costosDocs = await Promise.all(promesasDeCosto);
        let totalVentasUSD = 0, totalCostoUSD = 0, totalCanjeUSD = 0;
        const itemsConError = [];
        ventasDelDia.forEach((venta, index) => {
            totalVentasUSD += venta.precio_venta_usd || 0;
            if (venta.hubo_canje) totalCanjeUSD += venta.valor_toma_canje_usd || 0;
            const costoDoc = costosDocs[index];
            if (costoDoc.exists && costoDoc.data().precio_costo_usd !== undefined) {
                totalCostoUSD += costoDoc.data().precio_costo_usd;
            } else {
                itemsConError.push(venta.imei_vendido);
            }
        });
        mostrarReporteCaja(fechaSeleccionada, totalVentasUSD, totalCostoUSD, totalVentasUSD - totalCostoUSD, itemsConError, ventasDelDia.length, totalCanjeUSD);
    } catch (error) {
        console.error("Error al generar la caja diaria:", error);
        showGlobalFeedback("Ocurrió un error al generar el reporte. Revisa la consola.", "error");
    } finally {
        toggleSpinner(s.btnHacerCaja, false);
    }
}

function mostrarReporteCaja(fecha, totalVentas, totalCosto, gananciaNeta, errores, cantidadVentas, totalCanje) {
    const fechaFormateada = new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const totalEnCaja = totalVentas - totalCanje;
    let errorHtml = errores.length > 0 ? `<div class="report-errors"><h4>Atención</h4><p>No se encontró el costo para los IMEIs: ${errores.join(', ')}.</p></div>` : '';
    let contenidoReporte = cantidadVentas === 0 ? `<p>No se encontraron ventas para el día ${fechaFormateada}.</p>` : `
        <div class="report-item"><span class="report-label">Facturación Bruta (Ventas):</span><span class="report-value">${formatearUSD(totalVentas)}</span></div>
        <div class="report-item deduction"><span class="report-label">(-) Valor por Plan Canje:</span><span class="report-value">- ${formatearUSD(totalCanje)}</span></div>
        <div class="report-item total"><span class="report-label">INGRESO REAL EN CAJA:</span><span class="report-value">${formatearUSD(totalEnCaja)}</span></div>
        <div class="report-item" style="margin-top: 1.5rem; border-top: 1px dashed var(--border-dark); padding-top: 1rem;"><span class="report-label">Costo Mercadería:</span><span class="report-value">${formatearUSD(totalCosto)}</span></div>
        <div class="report-item" style="font-weight: bold;"><span class="report-label">Ganancia Neta (Profit):</span><span class="report-value" style="color: var(--brand-yellow);">${formatearUSD(gananciaNeta)}</span></div>
        ${errorHtml}`;
    s.promptContainer.innerHTML = `
        <div class="container container-sm caja-report-box">
            <h3>Cierre de Caja</h3><p class="report-date">Reporte para: ${fechaFormateada}</p>${contenidoReporte}
            <div class="prompt-buttons" style="justify-content: center;"><button id="btn-cerrar-reporte" class="prompt-button cancel">Cerrar</button></div>
        </div>`;
    document.getElementById('btn-cerrar-reporte').onclick = () => { s.promptContainer.innerHTML = ''; };
}

async function loadGastos() {
    s.gastosList.innerHTML = `<p class="dashboard-loader">Cargando gastos...</p>`;
    if (gastosChart) gastosChart.destroy();
    toggleSpinner(s.btnApplyGastosFilter, true);
    let startDate = s.filterGastosStartDate.value;
    let endDate = s.filterGastosEndDate.value;
    if (!startDate && !endDate) {
        const hoy = new Date();
        startDate = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
        endDate = startDate;
        s.filterGastosStartDate.value = startDate;
        s.filterGastosEndDate.value = endDate;
    } else if (startDate && !endDate) {
        endDate = startDate;
    } else if (!startDate && endDate) {
        startDate = endDate;
    }
    try {
        const inicioDelRango = new Date(startDate + 'T00:00:00');
        const finDelRango = new Date(endDate + 'T23:59:59.999');
        let query = db.collection('gastos').orderBy('fecha', 'desc').where('fecha', '>=', inicioDelRango).where('fecha', '<=', finDelRango);
        const snapshot = await query.get();
        const gastos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const gastosPorCategoria = gastos.reduce((acc, gasto) => {
            const monto = gasto.moneda === 'USD' ? gasto.monto * (gasto.cotizacion_dolar || 1) : gasto.monto; 
            acc[gasto.categoria] = (acc[gasto.categoria] || 0) + (monto || 0);
            return acc;
        }, {});
        renderGastosChart(gastos, gastosPorCategoria);
        renderGastosList(gastos);
    } catch (error) {
        handleDBError(error, s.gastosList, "gastos");
    } finally {
        toggleSpinner(s.btnApplyGastosFilter, false);
    }
}

function renderGastosChart(gastos, gastosPorCategoria) {
    if (gastosChart) gastosChart.destroy();
    const totalGastos = Object.values(gastosPorCategoria).reduce((sum, monto) => sum + monto, 0);
    const labels = Object.keys(gastosPorCategoria);
    const data = Object.values(gastosPorCategoria);
    const backgroundColors = labels.map(label => categoriaColores[label] || '#cccccc');
    const centerTextPlugin = {
        id: 'centerText',
        afterDraw: (chart) => {
            const ctx = chart.ctx;
            const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.font = '500 16px -apple-system, sans-serif'; ctx.fillStyle = '#86868b';
            ctx.fillText('Total Gastado', centerX, centerY - 12);
            ctx.font = 'bold 24px -apple-system, sans-serif'; ctx.fillStyle = '#ffffff';
            ctx.fillText(formatearARS(totalGastos), centerX, centerY + 12);
            ctx.restore();
        }
    };
    gastosChart = new Chart(s.gastosChartCanvas, {
        type: 'doughnut',
        data: {
            labels: labels.map(l => `${l} (${formatearARS(gastosPorCategoria[l] || 0)})`),
            datasets: [{ data, backgroundColor: backgroundColors, borderColor: 'var(--container-dark)', borderWidth: 4, hoverOffset: 10 }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            cutout: '70%', 
            plugins: { 
                legend: { 
                    position: 'bottom', 
                    labels: { 
                        color: 'var(--text-light)', 
                        boxWidth: 15, 
                        padding: 20, 
                    } 
                }, 
                tooltip: { enabled: false } 
            } 
        },
        plugins: [centerTextPlugin]
    });
}

function renderGastosList(gastos) {
    if (gastos.length === 0) {
        s.gastosList.innerHTML = `<p class="dashboard-loader">No hay gastos para mostrar en este período.</p>`;
        return;
    }
    s.gastosList.innerHTML = gastos.map(gasto => {
        let desc = gasto.descripcion || 'Sin detalles';
        if (gasto.categoria === 'Accesorios' && gasto.subcategoria) desc = `${gasto.subcategoria}${gasto.detalle_otro ? `: ${gasto.detalle_otro}` : ''} - ${desc}`;
        if (gasto.categoria === 'Otro' && gasto.detalle_otro) desc = `${gasto.detalle_otro} - ${desc}`;
        const montoFormateado = gasto.moneda === 'USD' ? formatearUSD(gasto.monto) : formatearARS(gasto.monto);
        return `<div class="gasto-item" style="border-color: ${categoriaColores[gasto.categoria] || '#cccccc'};">
            <div class="gasto-item-info"><div class="gasto-item-cat">${gasto.categoria}</div><div class="gasto-item-desc">${desc}</div></div>
            <div class="gasto-item-details"><div class="gasto-item-amount">${montoFormateado}</div><div class="gasto-item-date">${new Date((gasto.fecha?.seconds || 0) * 1000).toLocaleDateString('es-AR')}</div></div>
            <div class="gasto-item-actions"><button class="delete-btn" title="Eliminar Gasto" onclick="deleteGasto('${gasto.id}', '${gasto.categoria}', ${gasto.monto})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></div>
        </div>`;
    }).join('');
}

function promptToAddGasto() {
    const categoriaOptions = gastosCategorias.map(c => `<option value="${c}">${c}</option>`).join('');
    const subCategoriaOptions = accesoriosSubcategorias.map(sc => `<option value="${sc}">${sc}</option>`).join('');
    s.promptContainer.innerHTML = `<div class="container container-sm"><div class="prompt-box"><h3>Registrar Nuevo Gasto</h3><form id="gasto-form"><div class="form-group"><label for="gasto-monto">Monto (ARS)</label><input type="number" id="gasto-monto" name="monto" required placeholder="Ej: 1500.50" step="0.01"></div><div class="form-group"><label for="gasto-categoria">Categoría</label><select id="gasto-categoria" name="categoria" required><option value="">Seleccione...</option>${categoriaOptions}</select></div><div id="accesorios-fields" class="form-group hidden"><label for="gasto-subcategoria">Tipo de Accesorio</label><select id="gasto-subcategoria" name="subcategoria"><option value="">Seleccione...</option>${subCategoriaOptions}</select></div><div id="otro-detalle-field" class="form-group hidden"><label for="gasto-detalle-otro">Especificar</label><input type="text" id="gasto-detalle-otro" name="detalle_otro" placeholder="Detalle aquí..."></div><div class="form-group"><label for="gasto-descripcion">Descripción (opcional)</label><textarea id="gasto-descripcion" name="descripcion" rows="2" placeholder="Detalles adicionales del gasto"></textarea></div><div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Guardar Gasto</span><div class="spinner"></div></button><button type="button" class="prompt-button cancel">Cancelar</button></div></form></div></div>`;
    
    const form = document.getElementById('gasto-form');
    const categoriaSelect = document.getElementById('gasto-categoria');
    const subcategoriaSelect = document.getElementById('gasto-subcategoria');
    const accesoriosFields = document.getElementById('accesorios-fields');
    const otroDetalleField = document.getElementById('otro-detalle-field');
    const toggleConditionalFields = () => {
        accesoriosFields.classList.toggle('hidden', categoriaSelect.value !== 'Accesorios');
        otroDetalleField.classList.toggle('hidden', categoriaSelect.value !== 'Otro' && subcategoriaSelect.value !== 'Otro');
    };
    categoriaSelect.addEventListener('change', toggleConditionalFields);
    subcategoriaSelect.addEventListener('change', toggleConditionalFields);
}

async function saveGasto(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    const gastoData = {
        monto: parseFloat(formData.get('monto')), 
        moneda: 'ARS',
        categoria: formData.get('categoria'),
        descripcion: formData.get('descripcion'), 
        fecha: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (gastoData.categoria === 'Accesorios') {
        gastoData.subcategoria = formData.get('subcategoria');
        if (gastoData.subcategoria === 'Otro') gastoData.detalle_otro = formData.get('detalle_otro');
    } else if (gastoData.categoria === 'Otro') {
        gastoData.detalle_otro = formData.get('detalle_otro');
    }
    try {
        await db.collection('gastos').add(gastoData);
        showGlobalFeedback('Gasto registrado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        if(s.gastosSection && !s.gastosSection.classList.contains('hidden')) loadGastos();
        updateReports();
    } catch (error) {
        console.error("Error al guardar el gasto:", error);
        showGlobalFeedback('Error al registrar el gasto', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

function deleteGasto(id, categoria, monto) {
    const message = `Categoría: ${categoria}\nMonto: ${formatearARS(monto)}\n\n¿Estás seguro de que quieres eliminar este gasto?`;
    showConfirmationModal('Confirmar Eliminación', message, async () => {
        try {
            await db.collection('gastos').doc(id).delete();
            showGlobalFeedback('Gasto eliminado correctamente.', 'success');
            loadGastos();
            updateReports();
        } catch (error) {
            console.error("Error al eliminar gasto:", error);
            showGlobalFeedback('No se pudo eliminar el gasto.', 'error');
        }
    });
}

async function loadStock() {
    s.stockTableContainer.innerHTML = `<p class="dashboard-loader">Cargando stock...</p>`;
    toggleSpinner(s.btnApplyStockFilters, true);
    try {
        let query = db.collection("stock_individual").where("estado", "==", "en_stock");
        if (s.filterStockModel.value) query = query.where('modelo', '==', s.filterStockModel.value);
        if (s.filterStockProveedor.value) query = query.where('proveedor', '==', s.filterStockProveedor.value);
        if (s.filterStockColor.value) query = query.where('color', '==', s.filterStockColor.value);
        if (s.filterStockGb.value) query = query.where('almacenamiento', '==', s.filterStockGb.value);
        query = query.orderBy('modelo');
        const querySnapshot = await query.get();
        if (querySnapshot.empty) { s.stockTableContainer.innerHTML = `<p class="dashboard-loader">No se encontraron productos con esos filtros.</p>`; return; }
        let tableHTML = `<table><thead><tr><th>Fecha Carga</th><th>Modelo</th><th>Proveedor</th><th>Color</th><th>GB</th><th>Batería</th><th>Costo (USD)</th><th>Acciones</th></tr></thead><tbody>`;
        querySnapshot.forEach(doc => {
            const item = doc.data();
            const fechaObj = item.fechaDeCarga ? new Date(item.fechaDeCarga.seconds * 1000) : null;
            let fechaFormateada = fechaObj ? `${String(fechaObj.getDate()).padStart(2, '0')}/${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}<br><small class="time-muted">${String(fechaObj.getHours()).padStart(2, '0')}:${String(fechaObj.getMinutes()).padStart(2, '0')} hs</small>` : 'N/A';
            const itemJSON = JSON.stringify(item).replace(/'/g, "\\'");
            tableHTML += `<tr data-item='${itemJSON}'>
                <td>${fechaFormateada}</td><td>${item.modelo || ''}</td><td>${item.proveedor || 'N/A'}</td><td>${item.color || ''}</td><td>${item.almacenamiento || ''}</td>
                <td>${item.bateria || ''}%</td><td>${formatearUSD(item.precio_costo_usd)}</td>
                <td class="actions-cell">
                    <button class="edit-btn btn-edit-stock" title="Editar Producto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button class="delete-btn btn-delete-stock" title="Eliminar Producto"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                </td></tr>`;
        });
        s.stockTableContainer.innerHTML = tableHTML + `</tbody></table>`;
        document.querySelectorAll('.btn-edit-stock').forEach(button => button.addEventListener('click', e => { const item = JSON.parse(e.currentTarget.closest('tr').dataset.item.replace(/\\'/g, "'")); promptToEditStock(item); }));
        document.querySelectorAll('.btn-delete-stock').forEach(button => button.addEventListener('click', e => { const item = JSON.parse(e.currentTarget.closest('tr').dataset.item.replace(/\\'/g, "'")); const message = `Producto: ${item.modelo} ${item.color}\nIMEI: ${item.imei}\n\nEsta acción eliminará el producto del stock permanentemente.`; showConfirmationModal('¿Seguro que quieres eliminar este producto?', message, () => deleteStockItem(item.imei, item)); }));
    } catch (error) { handleDBError(error, s.stockTableContainer, "stock"); }
    finally { toggleSpinner(s.btnApplyStockFilters, false); }
}

function promptToEditStock(item) {
    switchView('management');
    resetManagementView();
    s.scanOptions.classList.add('hidden'); s.scannerContainer.classList.add('hidden'); s.feedbackMessage.classList.add('hidden');
    s.managementTitle.textContent = "Editar Producto"; s.productFormSubmitBtn.querySelector('.btn-text').textContent = "Actualizar Producto";
    s.productForm.reset(); s.imeiInput.value = item.imei; s.imeiInput.readOnly = true;
    document.getElementById('precio-costo-form').value = item.precio_costo_usd || ''; s.modeloFormSelect.value = item.modelo;
    document.getElementById('bateria').value = item.bateria; s.colorFormSelect.value = item.color;
    s.almacenamientoFormSelect.value = item.almacenamiento; s.detallesFormSelect.value = item.detalles_esteticos;
    s.proveedorFormSelect.value = item.proveedor || '';
    s.productForm.dataset.mode = 'update'; s.productForm.classList.remove('hidden');
}

async function deleteStockItem(imei, item) {
    try {
        await db.runTransaction(async t => {
            const stockRef = db.collection("stock_individual").doc(imei);
            const displayRef = db.collection("productos_display").doc(`${(item.modelo || '').toLowerCase().replace(/\s+/g, '-')}-${(item.color || '').toLowerCase().replace(/\s+/g, '-')}`);
            const displayDoc = await t.get(displayRef);
            t.delete(stockRef);
            if (displayDoc.exists) { t.update(displayRef, { stock_total: firebase.firestore.FieldValue.increment(-1), opciones_disponibles: firebase.firestore.FieldValue.arrayRemove({ imei: item.imei, gb: item.almacenamiento, bateria: item.bateria }) }); }
        });
        showGlobalFeedback("Producto eliminado del stock.");
        loadStock();
        updateReports();
    } catch (error) {
        console.error("Error al eliminar del stock:", error);
        showGlobalFeedback("No se pudo eliminar el producto.", "error");
    }
}

async function exportToExcel(type) {
    const btn = (type === 'stock') ? s.exportStockBtn : s.exportSalesBtn;
    toggleSpinner(btn, true);
    try {
        let dataToExport = [], fileName = '', sheetName = '';
        if (type === 'stock') {
            const querySnapshot = await db.collection("stock_individual").where("estado", "==", "en_stock").orderBy('modelo').get();
            if (querySnapshot.empty) { showGlobalFeedback("No hay stock para exportar.", "error"); return; }
            querySnapshot.forEach(doc => { const data = doc.data(); dataToExport.push({ 'Fecha de Carga': data.fechaDeCarga ? new Date(data.fechaDeCarga.seconds * 1000).toLocaleString('es-AR') : '', 'Modelo': data.modelo, 'Color': data.color, 'Almacenamiento': data.almacenamiento, 'Bateria (%)': data.bateria, 'IMEI': data.imei, 'Detalles Esteticos': data.detalles_esteticos, 'Precio Costo (USD)': data.precio_costo_usd || 0 }); });
            fileName = `Stock_iPhone_Twins_${new Date().toISOString().slice(0, 10)}.xlsx`; sheetName = "Stock Actual";
        } else if (type === 'sales') {
            const querySnapshot = await db.collection("ventas").orderBy("fecha_venta", "desc").get();
            if (querySnapshot.empty) { showGlobalFeedback("No hay ventas para exportar.", "error"); return; }
            querySnapshot.forEach(doc => { const venta = doc.data(); dataToExport.push({ 'Fecha Venta': venta.fecha_venta ? new Date(venta.fecha_venta.seconds * 1000).toLocaleString('es-AR') : 'N/A', 'Producto Vendido': `${venta.producto.modelo || ''} ${venta.producto.color || ''}`, 'IMEI Vendido': venta.imei_vendido, 'Vendedor': venta.vendedor, 'Precio (USD)': venta.precio_venta_usd, 'Método Pago': venta.metodo_pago, 'Monto (ARS)': venta.metodo_pago.startsWith('Pesos') ? (venta.monto_efectivo || venta.monto_transferencia || '') : '', 'Cotización Dólar': venta.metodo_pago.startsWith('Pesos') ? venta.cotizacion_dolar : '', 'Hubo Canje': venta.hubo_canje ? 'Sí' : 'No', 'Valor Toma Canje (USD)': venta.hubo_canje ? venta.valor_toma_canje_usd : '' }); });
            fileName = `Ventas_iPhone_Twins_${new Date().toISOString().slice(0, 10)}.xlsx`; sheetName = "Ventas";
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
    toggleSpinner(s.btnApplySalesFilters, true);
    try {
        let query = db.collection("ventas").orderBy("fecha_venta", "desc");
        if (s.filterSalesStartDate.value) query = query.where('fecha_venta', '>=', new Date(s.filterSalesStartDate.value + 'T00:00:00'));
        if (s.filterSalesEndDate.value) query = query.where('fecha_venta', '<=', new Date(s.filterSalesEndDate.value + 'T23:59:59'));
        if (s.filterSalesVendedor.value) query = query.where('vendedor', '==', s.filterSalesVendedor.value);
        const querySnapshot = await query.limit(100).get();
        if (querySnapshot.empty) { s.salesTableContainer.innerHTML = `<p class="dashboard-loader">No se encontraron ventas con esos filtros.</p>`; return; }
        let tableHTML = `<table><thead><tr><th>Fecha</th><th>Producto</th><th>Vendedor</th><th>Precio (USD)</th><th>Pago</th><th>Detalles Pago</th><th>Plan Canje</th><th>Acciones</th></tr></thead><tbody>`;
        querySnapshot.forEach(doc => {
            const venta = doc.data();
            const fechaObj = venta.fecha_venta ? new Date(venta.fecha_venta.seconds * 1000) : null;
            let fechaFormateada = fechaObj ? `${String(fechaObj.getDate()).padStart(2, '0')}/${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}<br><small class="time-muted">${String(fechaObj.getHours()).padStart(2, '0')}:${String(fechaObj.getMinutes()).padStart(2, '0')} hs</small>` : 'N/A';
            let pagoDetalle = '-';
            if (venta.metodo_pago === 'Pesos (Efectivo)') pagoDetalle = `${formatearARS(venta.monto_efectivo)} (T/C ${venta.cotizacion_dolar || ''})`;
            else if (venta.metodo_pago === 'Pesos (Transferencia)') pagoDetalle = `${formatearARS(venta.monto_transferencia)} (T/C ${venta.cotizacion_dolar || ''})`;
            const canjeIcon = venta.hubo_canje ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
            const ventaJSON = JSON.stringify(venta).replace(/'/g, "\\'");
            tableHTML += `<tr data-sale-id="${doc.id}" data-sale-item='${ventaJSON}'>
                <td>${fechaFormateada}</td><td>${venta.producto.modelo || ''} ${venta.producto.color || ''}</td><td>${venta.vendedor}</td><td>${formatearUSD(venta.precio_venta_usd)}</td>
                <td>${venta.metodo_pago}</td><td>${pagoDetalle}</td><td style="text-align: center;">${canjeIcon}</td>
                <td class="actions-cell"><button class="edit-btn btn-edit-sale" title="Editar Venta"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button><button class="delete-btn btn-delete-sale" title="Eliminar Venta"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></td>
            </tr>`;
        });
        s.salesTableContainer.innerHTML = tableHTML + `</tbody></table>`;
        document.querySelectorAll('.btn-edit-sale').forEach(button => button.addEventListener('click', e => { const row = e.currentTarget.closest('tr'); const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'")); promptToEditSale(saleItem, row.dataset.saleId); }));
        document.querySelectorAll('.btn-delete-sale').forEach(button => button.addEventListener('click', e => { const row = e.currentTarget.closest('tr'); const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'")); const message = `Producto: ${saleItem.producto.modelo}\nIMEI: ${saleItem.imei_vendido}\n\nEsta acción NO devolverá el equipo al stock y la eliminará permanentemente.`; showConfirmationModal('¿Seguro que quieres eliminar esta venta?', message, () => deleteSale(row.dataset.saleId, saleItem.imei_vendido, saleItem.id_canje_pendiente)); }));
    } catch (error) { handleDBError(error, s.salesTableContainer, "ventas"); }
    finally { toggleSpinner(s.btnApplySalesFilters, false); }
}

function promptToEditSale(sale, saleId) {
    const vendedoresOptions = vendedores.map(v => `<option value="${v}" ${sale.vendedor === v ? 'selected' : ''}>${v}</option>`).join('');
    const pagoOptions = metodosDePago.map(p => `<option value="${p}" ${sale.metodo_pago === p ? 'selected' : ''}>${p}</option>`).join('');
    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin:auto;"><div class="prompt-box"><h3>Editar Venta</h3><form id="edit-sale-form"><div class="details-box"><div class="detail-item"><span>Producto:</span> <strong>${sale.producto.modelo || ''}</strong></div><div class="detail-item"><span>IMEI:</span> <strong>${sale.imei_vendido}</strong></div></div><div class="form-group"><label for="precioVenta">Precio (USD)</label><input type="number" name="precioVenta" required value="${sale.precio_venta_usd || ''}"></div><div class="form-group"><label for="metodoPago">Método de Pago</label><select name="metodoPago" required>${pagoOptions}</select></div><div id="pesos-efectivo-fields" class="payment-details-group hidden"><div class="form-group"><label>Monto Efectivo (ARS)</label><input type="number" name="monto_efectivo" value="${sale.monto_efectivo || ''}"></div></div><div id="pesos-transferencia-fields" class="payment-details-group hidden"><div class="form-group"><label>Monto Transferido (ARS)</label><input type="number" name="monto_transferencia" value="${sale.monto_transferencia || ''}"></div><div class="form-group"><label>Obs. Transferencia</label><textarea name="observaciones_transferencia" rows="2">${sale.observaciones_transferencia || ''}</textarea></div></div><div id="cotizacion-dolar-field" class="form-group hidden"><label for="cotizacion_dolar">Cotización Dólar</label><input type="number" name="cotizacion_dolar" value="${sale.cotizacion_dolar || ''}"></div><div class="form-group"><label for="vendedor">Vendedor</label><select name="vendedor" required>${vendedoresOptions}</select></div><div id="comision-vendedor-field" class="form-group hidden"><label>Comisión Vendedor (USD)</label><input type="number" name="comision_vendedor_usd" value="${sale.comision_vendedor_usd || ''}"></div><div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Actualizar Venta</span><div class="spinner"></div></button><button type="button" class="prompt-button cancel">Cancelar</button></div></form></div></div>`;
    const form = document.getElementById('edit-sale-form');
    const metodoPagoSelect = form.querySelector('[name="metodoPago"]');
    const vendedorSelect = form.querySelector('[name="vendedor"]');
    const toggleSaleFields = () => {
        const pago = metodoPagoSelect.value;
        form.querySelector('#pesos-efectivo-fields').classList.toggle('hidden', pago !== 'Pesos (Efectivo)');
        form.querySelector('#pesos-transferencia-fields').classList.toggle('hidden', pago !== 'Pesos (Transferencia)');
        form.querySelector('#cotizacion-dolar-field').classList.toggle('hidden', !pago.startsWith('Pesos'));
        form.querySelector('#comision-vendedor-field').classList.toggle('hidden', !vendedorSelect.value);
    };
    toggleSaleFields();
    metodoPagoSelect.addEventListener('change', toggleSaleFields);
    vendedorSelect.addEventListener('change', toggleSaleFields);
    form.addEventListener('submit', (e) => { e.preventDefault(); updateSale(saleId, e.target.querySelector('button[type="submit"]')); });
}

async function updateSale(saleId, btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    const metodoPago = formData.get('metodoPago');
    const saleUpdateData = { precio_venta_usd: parseFloat(formData.get('precioVenta')) || 0, metodo_pago: metodoPago, vendedor: formData.get('vendedor'), comision_vendedor_usd: parseFloat(formData.get('comision_vendedor_usd')) || 0 };
    if (metodoPago.startsWith('Pesos')) {
        saleUpdateData.cotizacion_dolar = parseFloat(formData.get('cotizacion_dolar')) || 0;
        if (metodoPago === 'Pesos (Efectivo)') {
            saleUpdateData.monto_efectivo = parseFloat(formData.get('monto_efectivo')) || 0;
            saleUpdateData.monto_transferencia = firebase.firestore.FieldValue.delete();
            saleUpdateData.observaciones_transferencia = firebase.firestore.FieldValue.delete();
        } else if (metodoPago === 'Pesos (Transferencia)') {
            saleUpdateData.monto_transferencia = parseFloat(formData.get('monto_transferencia')) || 0;
            saleUpdateData.observaciones_transferencia = formData.get('observaciones_transferencia');
            saleUpdateData.monto_efectivo = firebase.firestore.FieldValue.delete();
        }
    } else { ['cotizacion_dolar', 'monto_efectivo', 'monto_transferencia', 'observaciones_transferencia'].forEach(field => saleUpdateData[field] = firebase.firestore.FieldValue.delete()); }
    try {
        await db.collection("ventas").doc(saleId).update(saleUpdateData);
        showGlobalFeedback("Venta actualizada con éxito", "success");
        s.promptContainer.innerHTML = '';
        loadSales();
        updateReports();
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        showGlobalFeedback("Error al actualizar la venta", "error");
    } finally {
        toggleSpinner(btn, false);
    }
}

async function deleteSale(saleId, imei, canjeId) {
    try {
        await db.runTransaction(async t => {
            const saleRef = db.collection("ventas").doc(saleId);
            const stockRef = db.collection("stock_individual").doc(imei);
            
            const stockDoc = await t.get(stockRef);

            if (stockDoc.exists) {
                t.update(stockRef, { estado: "eliminado_por_error_en_venta" });
            } else {
                console.warn(`Al eliminar la venta ${saleId}, no se encontró el documento de stock con IMEI ${imei}. Se omitirá su actualización.`);
            }

            t.delete(saleRef);
            
            if (canjeId) {
                const canjeRef = db.collection("plan_canje_pendientes").doc(canjeId);
                t.delete(canjeRef);
            }
        });

        showGlobalFeedback("Venta eliminada con éxito.");
        loadSales();
        updateCanjeCount();
        updateReports();
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
        let tableHTML = `<table><thead><tr><th>Fecha Canje</th><th>Modelo Recibido</th><th>Info Venta Asociada</th><th>Valor Toma (USD)</th><th>Acción</th></tr></thead><tbody>`;
        querySnapshot.forEach(doc => { const item = doc.data(); const fecha = item.fecha_canje ? new Date(item.fecha_canje.seconds * 1000).toLocaleDateString('es-AR') : 'N/A'; let ventaInfo = item.observaciones_canje || ''; if (item.producto_vendido) ventaInfo = `A cambio de ${item.producto_vendido}. ${ventaInfo}`; tableHTML += `<tr data-canje-id="${doc.id}" data-modelo="${item.modelo_recibido}"><td>${fecha}</td><td>${item.modelo_recibido}</td><td>${ventaInfo}</td><td>${formatearUSD(item.valor_toma_usd)}</td><td><button class="control-btn btn-cargar-canje" style="background-color: var(--success-bg);">Cargar a Stock</button></td></tr>`; });
        s.canjeTableContainer.innerHTML = tableHTML + `</tbody></table>`;
        document.querySelectorAll('.btn-cargar-canje').forEach(button => button.addEventListener('click', (e) => { const row = e.currentTarget.closest('tr'); cargarCanje(row.dataset.canjeId, row.dataset.modelo); }));
    } catch (error) { handleDBError(error, s.canjeTableContainer, "pendientes de canje"); }
}

function cargarCanje(docId, modelo) {
    s.promptContainer.innerHTML = `
        <div class="container container-sm" style="margin: auto;">
            <div class="prompt-box">
                <h3>Cargar IMEI para ${modelo}</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">¿Cómo deseas ingresar el IMEI del equipo de canje?</p>
                <div class="prompt-buttons">
                    <button id="btn-canje-scan" class="prompt-button confirm">Escanear IMEI</button>
                    <button id="btn-canje-manual" class="prompt-button confirm" style="background-color: #555;">Ingresar Manualmente</button>
                </div>
                <div class="prompt-buttons" style="margin-top: 1rem;">
                    <button class="prompt-button cancel">Cancelar</button>
                </div>
            </div>
        </div>`;
        
    document.getElementById('btn-canje-scan').onclick = () => {
        canjeContext = { docId, modelo };
        resetManagementView();
        switchView('management');
        startScanner();
    };
    
    document.getElementById('btn-canje-manual').onclick = () => {
        canjeContext = { docId, modelo };
        resetManagementView();
        switchView('management');
        promptForManualImeiInput();
    };
}

function handleDBError(error, container, context) {
    console.error(`Error cargando ${context}:`, error);
    let msg = `Error al cargar ${context}.`;
    if (error.code === 'failed-precondition' || error.code === 'invalid-argument') msg = `Error en la consulta de ${context}. Revisa los filtros y la consola (F12) para más detalles.`;
    container.innerHTML = `<p class="dashboard-loader" style="color:var(--error-bg)">${msg}</p>`;
}

const html5QrCode = new Html5Qrcode("scanner-container");

function startScanner() {
    let feedbackText = 'Escanea un IMEI para empezar';
    if (canjeContext) {
        feedbackText = `Escanea el IMEI para el ${canjeContext.modelo} del plan canje...`;
    } else if (batchLoadContext) {
        feedbackText = `Cargando lote de ${batchLoadContext.model}. Escanea el siguiente IMEI.`;
    }
    
    showFeedback(feedbackText, 'info');

    s.scanOptions.classList.add('hidden');
    s.scannerContainer.classList.remove('hidden');
    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: { width: 250, height: 150 } }, 
        async (decodedText) => { 
            try { await html5QrCode.stop(); } catch(err) {} 
            onScanSuccess(decodedText); 
        }, 
        (errorMessage) => {}
    ).catch((err) => { 
        showFeedback("Error al iniciar cámara. Revisa los permisos.", "error"); 
    });
}

function promptForManualImeiInput(e) {
    if(e) e.preventDefault();
    let promptTitle = 'Ingresar IMEI Manualmente';
    if (canjeContext) promptTitle = `Ingresar IMEI para ${canjeContext.modelo}`;
    else if (batchLoadContext) promptTitle = `Ingresar IMEI para ${batchLoadContext.model}`;

    s.promptContainer.innerHTML = `<div class="container container-sm"><div class="prompt-box"><h3>${promptTitle}</h3><p style="color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">Escribe el IMEI para buscarlo o agregarlo.</p><div class="form-group"><label for="manual-imei-input">IMEI</label><input type="text" id="manual-imei-input" placeholder="Ingresa el IMEI aquí..."></div><div class="prompt-buttons"><button id="btn-search-manual-imei" class="prompt-button confirm">Buscar / Continuar</button><button class="prompt-button cancel">Cancelar</button></div></div></div>`;
    
    const imeiInput = document.getElementById('manual-imei-input');
    imeiInput.focus();

    document.getElementById('btn-search-manual-imei').addEventListener('click', () => { 
        const imei = imeiInput.value.trim(); 
        if (!imei) { 
            showGlobalFeedback("Por favor, ingresa un IMEI.", "error"); 
            return; 
        } 
        s.promptContainer.innerHTML = ''; 
        onScanSuccess(imei); 
    });
    
    imeiInput.addEventListener('keypress', (event) => { 
        if (event.key === 'Enter') { 
            event.preventDefault(); 
            document.getElementById('btn-search-manual-imei').click(); 
        } 
    });
}

async function onScanSuccess(imei) {
    s.feedbackMessage.classList.add('hidden');
    if (canjeContext) {
        showAddProductForm(null, imei, canjeContext.modelo, canjeContext.docId);
        canjeContext = null;
    } else if (batchLoadContext) {
        showAddProductForm(null, imei, batchLoadContext.model);
    } else {
        showFeedback("Buscando IMEI...", "loading");
        try {
            const imeiDoc = await db.collection("stock_individual").doc(imei.trim()).get();
            s.feedbackMessage.classList.add('hidden');
            if (imeiDoc.exists && imeiDoc.data().estado === 'en_stock') {
                s.managementView.classList.add('hidden');
                promptToSell(imei.trim(), imeiDoc.data());
            } else {
                showAddProductForm(null, imei.trim());
            }
        } catch (error) { handleDBError(error, s.feedbackMessage, "búsqueda de IMEI"); }
    }
}

function showAddProductForm(e, imei = '', modelo = '', canjeId = null) {
    if(e) e.preventDefault();
    resetManagementView(batchLoadContext ? true : false); 
    s.scanOptions.classList.add('hidden');
    s.scannerContainer.classList.add('hidden');
    s.imeiInput.readOnly = !!imei;
    s.imeiInput.value = imei;

    if(batchLoadContext) {
        s.proveedorFormSelect.value = batchLoadContext.providerName;
        s.modeloFormSelect.value = batchLoadContext.model;
        s.managementTitle.textContent = `Cargando Lote: ${batchLoadContext.model} (${batchLoadContext.count} cargados)`;
    }
    
    if (modelo && !batchLoadContext) s.modeloFormSelect.value = modelo;
    if (canjeId) s.productForm.dataset.canjeId = canjeId;

    s.productForm.classList.remove('hidden');
    
    if (!imei) s.imeiInput.focus();
    else document.getElementById('precio-costo-form').focus();
}

function promptToSell(imei, details) {
    const vendedoresOptions = vendedores.map(v => `<option value="${v}">${v}</option>`).join('');
    const pagoOptions = metodosDePago.map(p => `<option value="${p}">${p}</option>`).join('');
    const modelosOptions = modelos.map(m => `<option value="${m}">${m}</option>`).join('');
    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin:auto;"><div class="prompt-box"><h3>Registrar Venta</h3><form id="sell-form"><div class="details-box"><div class="detail-item"><span>Vendiendo:</span> <strong>${details.modelo || ''}</strong></div><div class="detail-item"><span>IMEI:</span> <strong>${imei}</strong></div></div><div class="form-group"><label>Precio Venta (USD)</label><input type="number" name="precioVenta" required></div><div class="form-group"><label>Método de Pago</label><select name="metodoPago" required><option value="">Seleccione...</option>${pagoOptions}</select></div><div id="pesos-efectivo-fields" class="payment-details-group hidden"><div class="form-group"><label>Monto Efectivo (ARS)</label><input type="number" name="monto_efectivo"></div></div><div id="pesos-transferencia-fields" class="payment-details-group hidden"><div class="form-group"><label>Monto Transferido (ARS)</label><input type="number" name="monto_transferencia"></div><div class="form-group"><label>Obs. Transferencia</label><textarea name="observaciones_transferencia" rows="2"></textarea></div></div><div id="cotizacion-dolar-field" class="form-group hidden"><label>Cotización Dólar</label><input type="number" name="cotizacion_dolar"></div><div class="form-group"><label>Vendedor</label><select name="vendedor" required><option value="">Seleccione...</option>${vendedoresOptions}</select></div><div id="comision-vendedor-field" class="form-group hidden"><label>Comisión Vendedor (USD)</label><input type="number" name="comision_vendedor_usd"></div><hr style="border-color:var(--border-dark);margin:1rem 0;"><div class="checkbox-group"><input type="checkbox" id="acepta-canje" name="acepta-canje"><label for="acepta-canje">Acepta Plan Canje</label></div><div id="plan-canje-fields" class="hidden"><h4>Detalles del Equipo Recibido</h4><div class="form-group"><label>Modelo Recibido</label><select name="canje-modelo">${modelosOptions}</select></div><div class="form-group"><label>Valor Toma (USD)</label><input type="number" name="canje-valor"></div><div class="form-group"><label>Observaciones</label><textarea name="canje-observaciones" rows="2"></textarea></div></div><div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Registrar Venta</span><div class="spinner"></div></button><button type="button" class="prompt-button cancel">Cancelar</button></div></form></div></div>`;
    const form = document.getElementById('sell-form');
    const metodoPagoSelect = form.querySelector('[name="metodoPago"]');
    const vendedorSelect = form.querySelector('[name="vendedor"]');
    const toggleSaleFields = () => {
        form.querySelector('#pesos-efectivo-fields').classList.toggle('hidden', metodoPagoSelect.value !== 'Pesos (Efectivo)');
        form.querySelector('#pesos-transferencia-fields').classList.toggle('hidden', metodoPagoSelect.value !== 'Pesos (Transferencia)');
        form.querySelector('#cotizacion-dolar-field').classList.toggle('hidden', !metodoPagoSelect.value.startsWith('Pesos'));
        form.querySelector('#comision-vendedor-field').classList.toggle('hidden', !vendedorSelect.value);
    };
    metodoPagoSelect.addEventListener('change', toggleSaleFields);
    vendedorSelect.addEventListener('change', toggleSaleFields);
    document.getElementById('acepta-canje').addEventListener('change', (e) => { document.getElementById('plan-canje-fields').classList.toggle('hidden', !e.target.checked); });
    form.addEventListener('submit', (e) => { e.preventDefault(); registerSale(imei, details, e.target.querySelector('button[type="submit"]')); });
}

async function registerSale(imei, productDetails, btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    const metodoPago = formData.get('metodoPago');
    const saleData = {
        imei_vendido: imei, producto: productDetails, precio_venta_usd: parseFloat(formData.get('precioVenta')) || 0,
        metodo_pago: metodoPago, vendedor: formData.get('vendedor'), comision_vendedor_usd: parseFloat(formData.get('comision_vendedor_usd')) || 0,
        fecha_venta: firebase.firestore.FieldValue.serverTimestamp(), hubo_canje: formData.get('acepta-canje') === 'on'
    };
    if (metodoPago.startsWith('Pesos')) {
        saleData.cotizacion_dolar = parseFloat(formData.get('cotizacion_dolar')) || 0;
        if (metodoPago === 'Pesos (Efectivo)') saleData.monto_efectivo = parseFloat(formData.get('monto_efectivo')) || 0;
        else if (metodoPago === 'Pesos (Transferencia)') {
            saleData.monto_transferencia = parseFloat(formData.get('monto_transferencia')) || 0;
            saleData.observaciones_transferencia = formData.get('observaciones_transferencia');
        }
    }
    if (saleData.hubo_canje) saleData.valor_toma_canje_usd = parseFloat(formData.get('canje-valor')) || 0;
    try {
        await db.runTransaction(async (t) => {
            const saleRef = db.collection("ventas").doc();
            t.update(db.collection("stock_individual").doc(imei), { estado: 'vendido' });
            if (saleData.hubo_canje) {
                const canjeRef = db.collection("plan_canje_pendientes").doc();
                t.set(canjeRef, { modelo_recibido: formData.get('canje-modelo'), valor_toma_usd: saleData.valor_toma_canje_usd, observaciones_canje: formData.get('canje-observaciones'), producto_vendido: `${productDetails.modelo} ${productDetails.color}`, venta_asociada_id: saleRef.id, fecha_canje: firebase.firestore.FieldValue.serverTimestamp(), estado: 'pendiente_de_carga' });
                saleData.id_canje_pendiente = canjeRef.id;
            }
            t.set(saleRef, saleData);
        });
        s.promptContainer.innerHTML = ''; s.managementView.classList.add('hidden');
        switchView('dashboard');
        updateReports();
    } catch (error) { console.error("Error al registrar la venta:", error); alert("Error al procesar la venta. Revisa la consola."); } 
    finally { toggleSpinner(btn, false); }
}

async function handleProductFormSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const form = e.target;
    const mode = form.dataset.mode || 'create';
    toggleSpinner(btn, true);
    const formData = new FormData(form);
    const imei = formData.get('imei').trim();
    if (!imei) { showFeedback("El campo IMEI no puede estar vacío.", "error"); toggleSpinner(btn, false); return; }
    const unitData = {
        imei, estado: 'en_stock', precio_costo_usd: parseFloat(formData.get('precio_costo_usd')) || 0,
        modelo: formData.get('modelo'), color: formData.get('color'), bateria: parseInt(formData.get('bateria')),
        almacenamiento: formData.get('almacenamiento'), detalles_esteticos: formData.get('detalles'),
        proveedor: formData.get('proveedor')
    };
    if (mode === 'create') unitData.fechaDeCarga = firebase.firestore.FieldValue.serverTimestamp();
    
    try {
        if (mode === 'create') {
            const canjeId = form.dataset.canjeId;
            const productId = `${(unitData.modelo || '').toLowerCase().replace(/\s+/g, '-')}-${(unitData.color || '').toLowerCase().replace(/\s+/g, '-')}`;
            
            await db.runTransaction(async (t) => {
                const individualStockRef = db.collection("stock_individual").doc(imei);
                const displayProductRef = db.collection("productos_display").doc(productId);
                
                const existingImei = await t.get(individualStockRef);
                const displayDoc = await t.get(displayProductRef);

                if (existingImei.exists && existingImei.data().estado === 'en_stock') {
                    throw new Error(`El IMEI ${imei} ya está en stock.`);
                }

                t.set(individualStockRef, unitData);
                
                if (!displayDoc.exists) {
                    t.set(displayProductRef, { 
                        nombre: unitData.modelo, 
                        color: unitData.color, 
                        stock_total: 1, 
                        opciones_disponibles: [{ imei, gb: unitData.almacenamiento, bateria: unitData.bateria }] 
                    });
                } else {
                    t.update(displayProductRef, { 
                        stock_total: firebase.firestore.FieldValue.increment(1), 
                        opciones_disponibles: firebase.firestore.FieldValue.arrayUnion({ imei, gb: unitData.almacenamiento, bateria: unitData.bateria }) 
                    });
                }
                
                if (canjeId) {
                    t.update(db.collection("plan_canje_pendientes").doc(canjeId), { estado: 'cargado_en_stock', imei_asignado: imei });
                }
                
                if (batchLoadContext) {
                    const loteRef = db.collection('lotes').doc(batchLoadContext.batchId);
                    t.update(loteRef, {
                        imeis: firebase.firestore.FieldValue.arrayUnion(imei)
                    });
                }
            });
            
            if (batchLoadContext) {
                batchLoadContext.count++;
                showFeedback(`¡Éxito! ${unitData.modelo} añadido. Cargados: ${batchLoadContext.count}`, "success");
                setTimeout(() => {
                    resetManagementView(true);
                }, 1500);
            } else {
                showFeedback(`¡Éxito! ${unitData.modelo} añadido al stock.`, "success");
                setTimeout(() => { 
                    resetManagementView(); 
                    switchView('dashboard');
                    loadStock();
                    updateReports();
                }, 1500);
            }
        } else { // modo 'update'
            await db.collection("stock_individual").doc(imei).update(unitData);
            showGlobalFeedback("¡Producto actualizado con éxito!", "success");
            setTimeout(() => { 
                resetManagementView(); 
                switchView('dashboard');
                loadStock();
                updateReports();
            }, 1500);
        }
    } catch (error) {
        showFeedback(error.message || `Error al ${mode === 'create' ? 'guardar' : 'actualizar'}.`, "error");
        console.error("Error en handleProductFormSubmit:", error);
    } finally {
        toggleSpinner(btn, false);
        if (!batchLoadContext) {
            delete form.dataset.mode;
            delete form.dataset.canjeId;
        }
    }
}

function resetManagementView(isBatchLoad = false) {
     s.promptContainer.innerHTML = ''; 
     s.productForm.reset();
     s.productForm.classList.add('hidden');
     s.scanOptions.classList.remove('hidden');
     s.scannerContainer.classList.add('hidden');
     s.feedbackMessage.classList.add('hidden');
     s.managementTitle.textContent = "Gestión de IMEI";
     s.productFormSubmitBtn.querySelector('.btn-text').textContent = "Guardar Producto";
     
     const existingEndBatchBtn = document.getElementById('btn-end-batch');
     if (existingEndBatchBtn) {
         existingEndBatchBtn.remove();
     }

     if (!isBatchLoad) {
         batchLoadContext = null;
         canjeContext = null;
     } else if (batchLoadContext) {
         s.managementTitle.textContent = `Cargando lote: ${batchLoadContext.model}`;
         
         const endBatchBtn = document.createElement('button');
         endBatchBtn.id = 'btn-end-batch';
         endBatchBtn.className = 'control-btn';
         endBatchBtn.style.backgroundColor = 'var(--error-bg)';
         endBatchBtn.textContent = 'Finalizar Carga de Lote';
         endBatchBtn.onclick = () => {
             const loadedCount = batchLoadContext.count;
             showGlobalFeedback(`Carga de lote finalizada. Se cargaron ${loadedCount} equipos.`, 'success', 4000);
             batchLoadContext = null;
             resetManagementView();
             switchView('providers');
         };
         s.scanOptions.appendChild(endBatchBtn);
     }
     
     delete s.productForm.dataset.mode;
     delete s.productForm.dataset.canjeId;
}

function showFeedback(message, type = 'info') {
    s.feedbackMessage.textContent = message;
    s.feedbackMessage.className = `feedback-message ${type}`;
    s.feedbackMessage.classList.remove('hidden');
}