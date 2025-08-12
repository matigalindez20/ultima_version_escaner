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

// =======================================================
// ===== FUNCIÓN DE MIGRACIÓN DE DATOS (EJECUTAR UNA VEZ) =====
// =======================================================
async function migrarCuentasSinMoneda() {
    console.log("Iniciando migración de cuentas financieras...");
    const cuentasRef = db.collection('cuentas_financieras');
    
    try {
        // Buscamos todas las cuentas donde el campo 'moneda' NO exista.
        const snapshot = await cuentasRef.where('moneda', '==', null).get();

        if (snapshot.empty) {
            console.log("No hay cuentas para migrar. Todo está actualizado.");
            return;
        }

        const batch = db.batch();
        snapshot.forEach(doc => {
            console.log(`Migrando cuenta: ${doc.data().nombre} (ID: ${doc.id}) a ARS.`);
            const docRef = cuentasRef.doc(doc.id);
            // A cada cuenta encontrada, le añadimos el campo moneda: 'ARS'
            // y el nuevo campo saldo_actual_usd: 0
            batch.update(docRef, { 
                moneda: 'ARS',
                saldo_actual_usd: 0 
            });
        });

        await batch.commit();
        console.log(`¡Migración completada! ${snapshot.size} cuentas han sido actualizadas a ARS.`);
        showGlobalFeedback(`${snapshot.size} cuentas existentes actualizadas a ARS.`, 'success', 5000);

    } catch (error) {
        // Si la primera consulta falla, puede ser porque el campo 'moneda' ya existe en todos lados.
        // Intentamos una segunda vez buscando por un campo que seguro no existe.
        if (error.code === 'failed-precondition') {
             console.log("El índice para la migración no existe, intentando método alternativo...");
             const allDocsSnapshot = await cuentasRef.get();
             const batch = db.batch();
             let count = 0;
             allDocsSnapshot.forEach(doc => {
                 const data = doc.data();
                 if (!data.moneda) { // Si la moneda no está definida
                     count++;
                     console.log(`Migrando cuenta: ${data.nombre} (ID: ${doc.id}) a ARS.`);
                     const docRef = cuentasRef.doc(doc.id);
                     batch.update(docRef, { moneda: 'ARS', saldo_actual_usd: 0 });
                 }
             });
             if (count > 0) {
                await batch.commit();
                console.log(`¡Migración completada! ${count} cuentas han sido actualizadas a ARS.`);
                showGlobalFeedback(`${count} cuentas existentes actualizadas a ARS.`, 'success', 5000);
             } else {
                console.log("No se encontraron cuentas para migrar con el método alternativo.");
             }
        } else {
            console.error("Error durante la migración de cuentas:", error);
            showGlobalFeedback("Error al migrar las cuentas. Revisa la consola.", "error");
        }
    }
}

// AÑADE ESTE OBJETO AL PRINCIPIO DE TU SCRIPT.JS
// AÑADE ESTA LÍNEA AL INICIO DE TU SCRIPT.JS, JUNTO A LAS OTRAS CONSTANTES

const socios = ["Agustín", "Tomás", "Julián"];
const emailToNameMap = {
    'matiasgalindez20@gmail.com': 'Pollo',
    'julian_sbrocca@gmail.com': 'Julián',
    'tomi_sbrocca@gmail.com': 'Tomás',
    'agus_sbrocca@gmail.com': 'Agustín',
    'arguellomati12@gmail.com': 'Papa luchon'
    // Puedes añadir más usuarios aquí si lo necesitas
};
let vendedores = ["Equipo Twins", "Pollo", "Victo", "Mili", "Hasha","Juan"];
const colores = ["Negro espacial", "Plata", "Dorado", "Púrpura oscuro", "Rojo (Product RED)", "Azul", "Verde", "Blanco estelar", "Medianoche", "Titanio Natural", "Titanio Azul", "Otro"];
const almacenamientos = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const detallesEsteticos = ["Como Nuevo (Sin detalles)", "Excelente (Mínimos detalles)", "Bueno (Detalles de uso visibles)", "Regular (Marcas o rayones notorios)"];
const modelos = [ "Iphone X", "Iphne Xs", "Iphone XS Max", "Iphone Xr", "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max", "iPhone 12 Mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max", "iPhone 13 Mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",];
const metodosDePago = ["Dólares", "Pesos (Efectivo)", "Pesos (Transferencia)"];
const gastosCategorias = ["Comida", "Repuestos", "Alquiler", "Accesorios", "Otro", "Comisiones"];
let ingresosCategorias = []; 
const accesoriosSubcategorias = ["Fundas", "Fuentes", "Cables", "Templados", "Otro"];
let proveedoresStock = [];
let financialAccounts = [];
const categoriaColores = {
    "Comida": "#3498db",
    "Repuestos": "#e74c3c",
    "Alquiler": "#9b59b6",
    "Accesorios": "#f1c40f",
    "Pago a Proveedor": "#2ecc71",
    "Comisiones": "#e67e22",
    "Otro": "#95a5a6"
};

const s = {};
let canjeContext = null;
let gastosChart = null;
let batchLoadContext = null;
let paymentContext = null;
let wholesaleSaleContext = null;
let paginationState = {};

document.addEventListener('DOMContentLoaded', initApp);

// REEMPLAZA ESTA FUNCIÓN COMPLETA
function initApp() {
    Object.assign(s, {
        loginContainer: document.getElementById('login-container'),
        appContainer: document.getElementById('app-container'),
        logoutButton: document.getElementById('logout-button'),
        navTabs: document.querySelector('.nav-tabs'),
        navSlider: document.querySelector('.nav-slider'),
        tabDashboard: document.getElementById('tab-dashboard'),
        tabProviders: document.getElementById('tab-providers'), 
        tabWholesale: document.getElementById('tab-wholesale'),
        tabReports: document.getElementById('tab-reports'),
        tabManagement: document.getElementById('tab-management'),
        dashboardView: document.getElementById('dashboard-view'),
        providersView: document.getElementById('providers-view'),
        wholesaleView: document.getElementById('wholesale-view'),
        reportsView: document.getElementById('reports-view'),
        managementView: document.getElementById('management-view'),
        dashboardControls: document.querySelector('.dashboard-controls'),
        dashboardMenuToggle: document.getElementById('dashboard-menu-toggle'),
        dashboardMenuLabel: document.getElementById('dashboard-menu-label'),
        dashboardOptionsContainer: document.getElementById('dashboard-options-container'),
        btnShowStock: document.getElementById('btn-show-stock'),
        btnShowSales: document.getElementById('btn-show-sales'),
        btnShowGastos: document.getElementById('btn-show-gastos'),
        btnShowCanje: document.getElementById('btn-show-canje'),
        btnShowCommissions: document.getElementById('btn-show-commissions'),
        btnShowIngresos: document.getElementById('btn-show-ingresos'),
        stockSection: document.getElementById('stock-section'),
        salesSection: document.getElementById('sales-section'),
        gastosSection: document.getElementById('gastos-section'),
        ingresosSection: document.getElementById('ingresos-section'),
        canjeSection: document.getElementById('canje-section'),
        commissionsSection: document.getElementById('commissions-section'),
        stockTableContainer: document.getElementById('stock-table-container'),
        salesTableContainer: document.getElementById('sales-table-container'),
        canjeTableContainer: document.getElementById('canje-table-container'),
        filterStockModel: document.getElementById('filter-stock-model'),
        filterStockProveedor: document.getElementById('filter-stock-proveedor'),
        filterStockColor: document.getElementById('filter-stock-color'),
        filterStockGb: document.getElementById('filter-stock-gb'),
        filterStockImei: document.getElementById('filter-stock-imei'),
        btnApplyStockFilters: document.getElementById('btn-apply-stock-filters'),
        filterSalesVendedor: document.getElementById('filter-sales-vendedor'),
        filterSalesStartDate: document.getElementById('filter-sales-start-date'),
        filterSalesEndDate: document.getElementById('filter-sales-end-date'),
        btnApplySalesFilters: document.getElementById('btn-apply-sales-filters'),
        filterSalesImei: document.getElementById('filter-sales-imei'),
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
        commissionsResultsContainer: document.getElementById('commissions-results-container'),
        filterGastosStartDate: document.getElementById('filter-gastos-start-date'),
        filterGastosEndDate: document.getElementById('filter-gastos-end-date'),
        btnApplyGastosFilter: document.getElementById('btn-apply-gastos-filter'),
        btnAddIngreso: document.getElementById('btn-add-ingreso'),
        ingresosList: document.getElementById('ingresos-list'),
        filterIngresosStartDate: document.getElementById('filter-ingresos-start-date'),
        filterIngresosEndDate: document.getElementById('filter-ingresos-end-date'),
        btnApplyIngresosFilter: document.getElementById('btn-apply-ingresos-filter'),
        ingresosPeriodTotalArsEfectivo: document.getElementById('ingresos-period-total-ars-efectivo'),
        ingresosPeriodTotalArsTransferencia: document.getElementById('ingresos-period-total-ars-transferencia'),
        ingresosPeriodTotalUsd: document.getElementById('ingresos-period-total-usd'),
        kpiStockValue: document.getElementById('kpi-stock-value'),
        kpiStockCount: document.getElementById('kpi-stock-count'),
        kpiReparacionCount: document.getElementById('kpi-reparacion-count'),
        kpiDollarsDay: document.getElementById('kpi-dollars-day'),
        kpiCashDay: document.getElementById('kpi-cash-day'),
        kpiTransferDay: document.getElementById('kpi-transfer-day'),
        kpiProfitDay: document.getElementById('kpi-profit-day'),
        kpiExpensesDayUsd: document.getElementById('kpi-expenses-day-usd'),
        kpiExpensesDayCash: document.getElementById('kpi-expenses-day-cash'),
        kpiExpensesDayTransfer: document.getElementById('kpi-expenses-day-transfer'),
        kpiDollarsMonth: document.getElementById('kpi-dollars-month'),
        kpiCashMonth: document.getElementById('kpi-cash-month'),
        kpiTransferMonth: document.getElementById('kpi-transfer-month'),
        kpiProfitMonth: document.getElementById('kpi-profit-month'),
        kpiExpensesMonthUsd: document.getElementById('kpi-expenses-month-usd'),
        kpiExpensesMonthCash: document.getElementById('kpi-expenses-month-cash'),
        kpiExpensesMonthTransfer: document.getElementById('kpi-expenses-month-transfer'),
        btnAddProvider: document.getElementById('btn-add-provider'), 
        providersListContainer: document.getElementById('providers-list-container'),
        btnAddWholesaleClient: document.getElementById('btn-add-wholesale-client'),
        wholesaleClientsListContainer: document.getElementById('wholesale-clients-list-container'),
        btnRefreshPage: document.getElementById('btn-refresh-page'),
        btnShowReparacion: document.getElementById('btn-show-reparacion'),
        reparacionSection: document.getElementById('reparacion-section'),
        reparacionTableContainer: document.getElementById('reparacion-table-container'),
        reparacionBadge: document.getElementById('reparacion-badge'),
        stockPaginationControls: document.getElementById('stock-pagination-controls'),
        stockItemsPerPage: document.getElementById('stock-items-per-page'),
        stockPrevPage: document.getElementById('stock-prev-page'),
        stockNextPage: document.getElementById('stock-next-page'),
        stockPageInfo: document.getElementById('stock-page-info'),
        salesPaginationControls: document.getElementById('sales-pagination-controls'),
        salesItemsPerPage: document.getElementById('sales-items-per-page'),
        salesPrevPage: document.getElementById('sales-prev-page'),
        salesNextPage: document.getElementById('sales-next-page'),
        salesPageInfo: document.getElementById('sales-page-info'),
        tabFinanciera: document.getElementById('tab-financiera'),
        financieraView: document.getElementById('financiera-view'),
        btnMakeDeposit: document.getElementById('btn-make-deposit'),
        btnAddAccount: document.getElementById('btn-add-account'),
        financieraTotalBalance: document.getElementById('financiera-total-balance'),
        accountsListContainer: document.getElementById('accounts-list-container'),
        tabMensualidad: document.getElementById('tab-mensualidad'),
        mensualidadView: document.getElementById('mensualidad-view'),
        mensualidadCardsContainer: document.getElementById('mensualidad-cards-container'),
        retirosHistoryContainer: document.getElementById('retiros-history-container')
    });
    
    addEventListeners();
    auth.onAuthStateChanged(handleAuthStateChange);
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA
async function loadAndPopulateSelects() {
    try {
        const proveedoresPromise = db.collection('proveedores').orderBy('nombre').get();
        const ingresosCatPromise = db.collection('ingresos_categorias').orderBy('nombre').get();
        // ===================== INICIO DE LA MODIFICACIÓN =====================
        // Ahora cargamos los vendedores desde la base de datos
        const vendedoresPromise = db.collection('vendedores').orderBy('nombre').get();
        
        const [provSnapshot, ingCatSnapshot, vendSnapshot] = await Promise.all([
            proveedoresPromise, 
            ingresosCatPromise, 
            vendedoresPromise
        ]);
        
        proveedoresStock = provSnapshot.docs.map(doc => doc.data().nombre);
        ingresosCategorias = ingCatSnapshot.docs.map(doc => doc.data().nombre);
        // Sobrescribimos la variable global 'vendedores' con los datos de la BD
        vendedores = vendSnapshot.docs.map(doc => doc.data().nombre); 
        // ====================== FIN DE LA MODIFICACIÓN =======================

        populateAllSelects();
    } catch (error) {
        console.error("Error al cargar datos para los selects:", error);
        // Aún así poblamos los selects con los datos que tengamos en memoria
        populateAllSelects();
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function populateAllSelects() {
    // --- INICIO DE LA MODIFICACIÓN ---
    // Creamos una nueva lista de proveedores que incluye la opción de Plan Canje.
    const proveedoresConCanje = ["Usado (Plan Canje)", ...proveedoresStock];
    // --- FIN DE LA MODIFICACIÓN ---

    populateSelect(s.filterSalesVendedor, vendedores, "Todos");
    populateSelect(s.filterCommissionsVendedor, vendedores, "Todos");
    populateSelect(s.filterStockColor, colores, "Todos");
    populateSelect(s.filterStockGb, almacenamientos, "Todos");
    populateSelect(s.filterStockModel, modelos, "Todos");
    // Usamos la nueva lista para los filtros de stock
    populateSelect(s.filterStockProveedor, proveedoresConCanje, "Todos"); 
    populateSelect(s.modeloFormSelect, modelos, "Selecciona...");
    populateSelect(s.colorFormSelect, colores, "Selecciona...");
    populateSelect(s.almacenamientoFormSelect, almacenamientos, "Selecciona...");
    populateSelect(s.detallesFormSelect, detallesEsteticos, "Selecciona...");
    // Usamos la nueva lista para el formulario de carga
    populateSelect(s.proveedorFormSelect, proveedoresConCanje, "Selecciona..."); 
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA
function addEventListeners() {
    s.logoutButton.addEventListener('click', () => auth.signOut());
    
    if (s.btnRefreshPage) {
        s.btnRefreshPage.addEventListener('click', () => location.reload());
    }

    if (s.navTabs) {
        s.navTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.nav-tab');
            if (!tab) return;
            const viewName = tab.id.replace('tab-', '');
            switchView(viewName, tab);
        });
    }

    if (s.dashboardOptionsContainer) {
        s.dashboardOptionsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.control-btn');
            if (!button) return;
            const viewName = button.id.replace('btn-show-', '');
            switchDashboardView(viewName, button);
            
            if (window.innerWidth < 768) {
                s.dashboardMenuToggle.classList.remove('open');
                s.dashboardOptionsContainer.classList.remove('open');
            }
        });
    }

    if (s.dashboardMenuToggle) {
        s.dashboardMenuToggle.addEventListener('click', () => {
            s.dashboardMenuToggle.classList.toggle('open');
            s.dashboardOptionsContainer.classList.toggle('open');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (s.dashboardControls && !s.dashboardControls.contains(e.target)) {
            s.dashboardMenuToggle.classList.remove('open');
            s.dashboardOptionsContainer.classList.remove('open');
        }
        if (s.exportMenu && !s.btnExport.contains(e.target)) {
            s.exportMenu.classList.remove('show');
        }
        if (e.target.matches('#prompt-container .prompt-button.cancel')) {
             e.preventDefault();
             s.promptContainer.innerHTML = '';
             paymentContext = null; 
             canjeContext = null;
        }
    });

    document.addEventListener('submit', (e) => {
        const form = e.target;
        if (s.promptContainer && s.promptContainer.contains(form)) {
            e.preventDefault();
            if (form.id === 'payment-form') { saveProviderPayment(form);
            } else if (form.id === 'collect-balance-form') { saveCollectedBalance(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'provider-form') { saveProvider(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'gasto-form') { saveGasto(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'ingreso-form') {
                const mode = form.dataset.mode || 'create';
                if (mode === 'create') { saveIngreso(form.querySelector('button[type="submit"]'));
                } else { updateIngreso(form.dataset.ingresoId, form.querySelector('button[type="submit"]')); }
            } else if (form.id === 'commission-payment-form') { saveCommissionPayment(form);
            } else if (form.id === 'add-commission-form') {
                saveAddedCommissionBalance(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'currency-exchange-form') {
                saveCurrencyExchange(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'batch-id-form') {
                const batchIdManual = form.batchNumber.value.trim();
                if (!batchIdManual) { showGlobalFeedback("El ID del lote no puede estar vacío.", "error"); return; }
                batchLoadContext.batchIdManual = batchIdManual;
                showModelSelectionStep();
            } else if (form.id === 'lote-cost-form') { promptToAssignLoteCost(form);
            } else if (form.id === 'finalize-reparacion-form') { saveFinalizedReparacion(form);
            } else if (form.id === 'wholesale-client-form') { saveWholesaleClient(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'wholesale-sale-finalize-form') { finalizeWholesaleSale(form);
            } else if (form.id === 'wholesale-payment-form') { saveWholesalePayment(form);
            } else if (form.id === 'financiera-account-form') { saveFinancialAccount(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'move-money-form') { executeMoneyMovement(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'deposit-form') {
                saveDeposit(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'retiro-socio-form') {
                saveRetiroSocio(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'vendedor-form') {
                saveVendedor(form.querySelector('button[type="submit"]'));
            }
        }
    });
    
    const btnResyncCommissions = document.getElementById('btn-resync-commissions');
    if (btnResyncCommissions) {
        btnResyncCommissions.addEventListener('click', resincronizarSaldosDeVendedores);
    }
    
    // ===================== INICIO DE LA MODIFICACIÓN =====================
    // Se cambia el ID al que escucha el evento por el del nuevo botón de icono.
    const btnCurrencyExchange = document.getElementById('btn-currency-exchange-icon');
    if (btnCurrencyExchange) {
        btnCurrencyExchange.addEventListener('click', promptForCurrencyExchange);
    }
    // ====================== FIN DE LA MODIFICACIÓN =======================

    s.btnApplyStockFilters.addEventListener('click', () => loadStock('first'));
    s.btnApplySalesFilters.addEventListener('click', () => loadSales('first'));
    s.btnApplyGastosFilter.addEventListener('click', loadGastos);
    s.btnApplyIngresosFilter.addEventListener('click', loadIngresos);
    s.btnScan.addEventListener('click', () => startScanner());
    s.manualEntryBtn.addEventListener('click', (e) => promptForManualImeiInput(e));
    s.productForm.addEventListener('submit', handleProductFormSubmit);
    
    s.productForm.addEventListener('click', (e) => {
        if (e.target.id === 'btn-cancel-product-form') {
            e.preventDefault();
            showConfirmationModal('¿Cancelar Carga?', 'Se perderán los datos ingresados. ¿Continuar?', () => {
                canjeContext = null;
                batchLoadContext = null;
                wholesaleSaleContext = null;
                resetManagementView();
                switchView('dashboard', s.tabDashboard);
            });
        }
    });

    s.btnExport.addEventListener('click', (e) => { e.stopPropagation(); s.exportMenu.classList.toggle('show'); });
    s.exportStockBtn.addEventListener('click', () => { exportToExcel('stock'); s.exportMenu.classList.remove('show'); });
    s.exportSalesBtn.addEventListener('click', () => { exportToExcel('sales'); s.exportMenu.classList.remove('show'); });
    s.btnAddGasto.addEventListener('click', () => promptToAddGasto());
    s.btnAddIngreso.addEventListener('click', () => promptToAddIngreso());
    s.btnAddProvider.addEventListener('click', promptToAddProvider);
    s.btnAddWholesaleClient.addEventListener('click', promptToAddWholesaleClient);
    
    if (s.btnMakeDeposit) {
        s.btnMakeDeposit.addEventListener('click', promptToMakeDeposit);
    }

    if (s.btnAddAccount) {
        s.btnAddAccount.addEventListener('click', promptToCreateAccount);
    }
    
    if (s.accountsListContainer) {
        s.accountsListContainer.addEventListener('click', e => {
            const button = e.target.closest('.action-btn-icon');
            const card = e.target.closest('.account-card');
            if (!card) return;

            const accountId = card.dataset.accountId;
            const accountName = card.querySelector('.account-name').textContent;

            if (button) {
                e.stopPropagation(); 
                if (button.classList.contains('btn-move-money')) {
                    promptToMoveMoney(accountId, accountName);
                } else if (button.classList.contains('btn-delete-account')) {
                    deleteFinancialAccount(accountId);
                }
            } else { 
                toggleAccountHistory(card, accountId);
            }
        });
    }

    s.providersView.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const card = button.closest('.provider-card-modern'); 
        if (!card) return;
        const providerId = card.dataset.providerId;
        const providerName = card.querySelector('h3').textContent;
        const debtValue = parseFloat(card.dataset.debtValue) || 0;

        paymentContext = { id: providerId, name: providerName };

        if (button.classList.contains('btn-register-payment')) {
            promptToRegisterPayment(providerName, debtValue);
        } else if (button.classList.contains('btn-collect-balance')) {
            promptToCollectBalance(providerId, providerName, Math.abs(debtValue));
        } else if (button.classList.contains('btn-batch-load')) {
            promptToStartBatchLoad(providerId, providerName);
        } else if (button.classList.contains('btn-view-payments')) {
            showPaymentHistory(providerId, providerName);
        } else if (button.classList.contains('btn-view-batches')) {
            showBatchHistory(providerId, providerName);
        } else if (button.classList.contains('btn-delete-provider')) {
            deleteProvider(providerId, providerName);
        }
    });
    
    s.wholesaleView.addEventListener('click', e => {
        const button = e.target.closest('button');
        if (!button) return;
        const clientCard = button.closest('.provider-card-modern'); 
        if (!clientCard) return;
        const clientId = clientCard.dataset.clientId;
        const clientName = clientCard.querySelector('h3').textContent;

        if (button.classList.contains('btn-new-wholesale-sale')) {
            wholesaleSaleContext = { clientId: clientId, clientName: clientName, items: [], totalSaleValue: 0 };
            switchView('management', s.tabManagement);
            resetManagementView(false, false, true);
        } else if (button.classList.contains('btn-register-ws-payment')) {
            const actualDebt = parseFloat(clientCard.dataset.debtValue) || 0;
            promptToRegisterWholesalePayment(clientId, clientName, actualDebt);
        } else if (button.classList.contains('btn-view-wholesale-history')) {
            showWholesaleHistory(clientId, clientName);
        } else if (button.classList.contains('btn-resync-client')) {
            resyncWholesaleClientTotal(clientId, clientName);
        } else if (button.classList.contains('btn-delete-wholesale-client')) {
            deleteWholesaleClient(clientId, clientName);
        }
    });

    s.commissionsResultsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const card = button.closest('.commission-vendor-card');
        const vendorName = card.dataset.vendorName;
        if (button.classList.contains('btn-pay-commission')) {
            const pendingAmount = parseFloat(button.dataset.pendingAmount);
            promptToPayCommission(vendorName, pendingAmount);
        }
        else if (button.classList.contains('btn-delete-vendedor')) {
            deleteVendedor(vendorName);
        }
        else if (button.classList.contains('btn-add-balance')) {
            promptToAddCommissionBalance(vendorName);
        }
    });
    
    if (s.reportsView) {
        s.reportsView.addEventListener('click', (e) => {
            const kpiCard = e.target.closest('.kpi-card');
            
            const exportButton = e.target.closest('#btn-export-daily-summary');
            if (exportButton) {
                exportDailySummaryToExcel();
                return; 
            }

            if (!kpiCard) return;
            const kpiValueDiv = kpiCard.querySelector('.kpi-value');
            if (!kpiValueDiv) return;
            const id = kpiValueDiv.id;
            switch (id) {
                case 'kpi-dollars-day': showKpiDetail('dolares', 'dia'); break;
                case 'kpi-cash-day': showKpiDetail('efectivo_ars', 'dia'); break;
                case 'kpi-transfer-day': showKpiDetail('transferencia_ars', 'dia'); break;
                case 'kpi-transfer-usd-day': showKpiDetail('transferencia_usd', 'dia'); break;
                case 'kpi-dollars-month': showKpiDetail('dolares', 'mes'); break;
                case 'kpi-cash-month': showKpiDetail('efectivo_ars', 'mes'); break;
                case 'kpi-transfer-month': showKpiDetail('transferencia_ars', 'mes'); break;
                case 'kpi-transfer-usd-month': showKpiDetail('transferencia_usd', 'mes'); break;
                case 'kpi-profit-day': showProfitDetail('dia'); break;
                case 'kpi-profit-month': showProfitDetail('mes'); break;
            }
        });
    }

    if (s.ingresosList) {
        s.ingresosList.addEventListener('click', (e) => {
            const header = e.target.closest('.ingreso-group-header');
            if (!header) return; 

            if (e.target.closest('.edit-btn') || e.target.closest('.delete-btn')) {
                return;
            }

            const card = header.closest('.ingreso-group-card');
            const details = card.querySelector('.ingreso-group-details');
            
            if (card.classList.contains('open')) {
                card.classList.remove('open');
                details.style.maxHeight = null;
            } else {
                s.ingresosList.querySelectorAll('.ingreso-group-card.open').forEach(openCard => {
                    openCard.classList.remove('open');
                    openCard.querySelector('.ingreso-group-details').style.maxHeight = null;
                });
                card.classList.add('open');
                details.style.maxHeight = details.scrollHeight + "px";
            }
        });
    }

    s.stockItemsPerPage.addEventListener('change', () => loadStock('first'));
    s.stockNextPage.addEventListener('click', () => loadStock('next'));
    s.stockPrevPage.addEventListener('click', () => loadStock('prev'));

    s.salesItemsPerPage.addEventListener('change', () => loadSales('first'));
    s.salesNextPage.addEventListener('click', () => loadSales('next'));
    s.salesPrevPage.addEventListener('click', () => loadSales('prev'));
    
    s.promptContainer.addEventListener('change', (e) => {
        const form = e.target.closest('form');
        if (!form) return;

        if (e.target.matches('#wholesale-payment-form .payment-method-cb')) {
            const cb = e.target;
            const fieldsDiv = form.querySelector(`#${cb.id}-fields`);
            if (fieldsDiv) {
                const isChecked = cb.checked;
                fieldsDiv.classList.toggle('hidden', !isChecked);

                if (cb.id === 'pay-ars-transfer') {
                    const cuentaSelect = fieldsDiv.querySelector('select[name="cuenta_destino"]');
                    if(cuentaSelect) {
                       cuentaSelect.required = isChecked;
                    }
                }
            }
            
            const cotizacionGroup = form.querySelector('#cotizacion-dolar-group');
            if (cotizacionGroup) {
                const pagoEnPesos = form.querySelector('#pay-ars-efectivo:checked') || form.querySelector('#pay-ars-transfer:checked');
                cotizacionGroup.classList.toggle('hidden', !pagoEnPesos);
                cotizacionGroup.querySelector('input').required = !!pagoEnPesos;
            }
        }
    });

    s.promptContainer.addEventListener('input', (e) => {
         if (e.target.matches('#wholesale-payment-form #payment-total')) {
            const form = e.target.closest('form');
            const usdCheckbox = form.querySelector('#pay-usd');
            if (usdCheckbox && usdCheckbox.checked) {
                form.querySelector('[name="dolares"]').value = e.target.value;
            }
        }
    });
}

function moveDashboardSlider(activeButton) {
    if (!s.dashboardOptionsContainer || !activeButton) return;
    const { offsetLeft, offsetWidth } = activeButton;
    s.dashboardOptionsContainer.style.setProperty('--slider-left', `${offsetLeft}px`);
    s.dashboardOptionsContainer.style.setProperty('--slider-width', `${offsetWidth}px`);
}

function moveNavSlider(activeTab) {
    if (!s.navSlider || !activeTab) return;
    const { offsetLeft, offsetWidth } = activeTab;
    s.navSlider.style.left = `${offsetLeft}px`;
    s.navSlider.style.width = `${offsetWidth}px`;
}

async function updateReports() {
    // Definimos todos los elementos que vamos a actualizar
    const kpiElements = {
        stockValue: document.getElementById('kpi-stock-value'),
        stockCount: document.getElementById('kpi-stock-count'),
        reparacionCount: document.getElementById('kpi-reparacion-count'),
        dollarsDay: document.getElementById('kpi-dollars-day'),
        cashDay: document.getElementById('kpi-cash-day'),
        transferDay: document.getElementById('kpi-transfer-day'),
        transferUsdDay: document.getElementById('kpi-transfer-usd-day'),
        profitDay: document.getElementById('kpi-profit-day'),
        expensesDayUsd: document.getElementById('kpi-expenses-day-usd'),
        expensesDayCash: document.getElementById('kpi-expenses-day-cash'),
        expensesDayTransfer: document.getElementById('kpi-expenses-day-transfer'),
        expensesDayTransferUsd: document.getElementById('kpi-expenses-day-transfer-usd'),
        dollarsMonth: document.getElementById('kpi-dollars-month'),
        cashMonth: document.getElementById('kpi-cash-month'),
        transferMonth: document.getElementById('kpi-transfer-month'),
        transferUsdMonth: document.getElementById('kpi-transfer-usd-month'),
        profitMonth: document.getElementById('kpi-profit-month'),
        expensesMonthUsd: document.getElementById('kpi-expenses-month-usd'),
        expensesMonthCash: document.getElementById('kpi-expenses-month-cash'),
        expensesMonthTransfer: document.getElementById('kpi-expenses-month-transfer'),
        expensesMonthTransferUsd: document.getElementById('kpi-expenses-month-transfer-usd')
    };
    
    // Ponemos '...' en todos los elementos que existan
    Object.values(kpiElements).forEach(el => { if (el) el.textContent = '...'; });

    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const fetchData = (collection, dateField, start, end) => {
            return db.collection(collection).where(dateField, '>=', start).where(dateField, '<=', end).get();
        };

        const [
            stockSnap, reparacionesSnap, salesDaySnap, salesMonthSnap, expensesDaySnap, expensesMonthSnap,
            miscIncomesDaySnap, miscIncomesMonthSnap, wholesaleSalesDaySnap, wholesaleSalesMonthSnap,
            internalMovesDaySnap, internalMovesMonthSnap
        ] = await Promise.all([
            db.collection('stock_individual').where('estado', '==', 'en_stock').get(),
            db.collection('reparaciones').get(),
            fetchData('ventas', 'fecha_venta', startOfDay, endOfDay),
            fetchData('ventas', 'fecha_venta', startOfMonth, endOfMonth),
            fetchData('gastos', 'fecha', startOfDay, endOfDay),
            fetchData('gastos', 'fecha', startOfMonth, endOfMonth),
            fetchData('ingresos_caja', 'fecha', startOfDay, endOfDay),
            fetchData('ingresos_caja', 'fecha', startOfMonth, endOfMonth),
            fetchData('ventas_mayoristas', 'fecha_venta', startOfDay, endOfDay),
            fetchData('ventas_mayoristas', 'fecha_venta', startOfMonth, endOfMonth),
            fetchData('movimientos_internos', 'fecha', startOfDay, endOfDay),
            fetchData('movimientos_internos', 'fecha', startOfMonth, endOfMonth)
        ]);
        
        let totalStockValue = 0, totalReparacionValue = 0;
        stockSnap.forEach(doc => { totalStockValue += doc.data().precio_costo_usd || 0; });
        reparacionesSnap.forEach(doc => { totalReparacionValue += doc.data().precio_costo_usd || 0; });

        if (kpiElements.stockValue) kpiElements.stockValue.textContent = formatearUSD(totalStockValue + totalReparacionValue);
        if (kpiElements.stockCount) kpiElements.stockCount.textContent = stockSnap.size;
        if (kpiElements.reparacionCount) kpiElements.reparacionCount.textContent = reparacionesSnap.size;

        const processEntries = async (salesSnapshot, miscIncomesSnap, expensesSnap, wholesaleSalesSnapshot, internalMovesSnap) => {
            let totalIncomes = { usd: 0, cash: 0, transfer: 0, transfer_usd: 0 };
            let totalExpenses = { usd: 0, cash: 0, transfer: 0, transfer_usd: 0 };
            let totalOperationalExpenses = { usd: 0, cash: 0, transfer: 0, transfer_usd: 0 };
            let totalProfit = 0;
        
            if (!salesSnapshot.empty) {
                const costPromises = salesSnapshot.docs.map(saleDoc => db.collection("stock_individual").doc(saleDoc.data().imei_vendido).get());
                const costDocs = await Promise.all(costPromises);
                const costMap = new Map(costDocs.map(doc => [doc.id, doc.data()?.precio_costo_usd || 0]));
                salesSnapshot.forEach(doc => {
                    const venta = doc.data();
                    const cost = venta.imei_vendido ? (costMap.get(venta.imei_vendido) || 0) : 0;
                    const commission = venta.comision_vendedor_usd || 0;
                    totalProfit += (venta.precio_venta_usd || 0) - cost - commission;
                    totalIncomes.usd += venta.monto_dolares || 0;
                    totalIncomes.cash += venta.monto_efectivo || 0;
                    totalIncomes.transfer += venta.monto_transferencia || 0;
                    totalIncomes.transfer_usd += venta.monto_transferencia_usd || 0;
                });
            }
            
            wholesaleSalesSnapshot.forEach(doc => {
                const payment = doc.data().pago_recibido || {};
                totalIncomes.usd += payment.usd || 0;
                totalIncomes.cash += payment.ars_efectivo || 0;
                totalIncomes.transfer += payment.ars_transferencia || 0;
                totalIncomes.transfer_usd += payment.usd_transferencia || 0;
            });

            miscIncomesSnap.forEach(doc => {
                const ingreso = doc.data();
                if (ingreso.metodo === 'Dólares') totalIncomes.usd += ingreso.monto || 0;
                if (ingreso.metodo === 'Pesos (Efectivo)') totalIncomes.cash += ingreso.monto;
                if (ingreso.metodo === 'Pesos (Transferencia)') totalIncomes.transfer += ingreso.monto;
                if (ingreso.metodo === 'Dólares (Transferencia)') totalIncomes.transfer_usd += ingreso.monto || 0;
            });
            
            expensesSnap.forEach(doc => {
                const gasto = doc.data();
                if (gasto.metodo_pago === 'Dólares') totalExpenses.usd += gasto.monto || 0;
                if (gasto.metodo_pago === 'Pesos (Efectivo)') totalExpenses.cash += gasto.monto || 0;
                if (gasto.metodo_pago === 'Pesos (Transferencia)') totalExpenses.transfer += gasto.monto || 0;
                if (gasto.metodo_pago === 'Dólares (Transferencia)') totalExpenses.transfer_usd += gasto.monto || 0;

                if (gasto.categoria !== 'Pago a Proveedor' && gasto.categoria !== 'Comisiones' && gasto.categoria !== 'Retiro de Socio') {
                    if (gasto.metodo_pago === 'Dólares') totalOperationalExpenses.usd += gasto.monto || 0;
                    if (gasto.metodo_pago === 'Pesos (Efectivo)') totalOperationalExpenses.cash += gasto.monto || 0;
                    if (gasto.metodo_pago === 'Pesos (Transferencia)') totalOperationalExpenses.transfer += gasto.monto || 0;
                    if (gasto.metodo_pago === 'Dólares (Transferencia)') totalOperationalExpenses.transfer_usd += gasto.monto || 0;
                }
            });
            
            internalMovesSnap.forEach(doc => {
                const move = doc.data();
                if (move.tipo === 'Retiro a Caja') {
                    totalIncomes.transfer -= move.monto_ars;
                    totalIncomes.cash += move.monto_ars; 
                } else if (move.tipo === 'Retiro a Caja (USD)') {
                    totalIncomes.transfer -= move.monto_ars;
                }
            });
            
            const netIncomes = {
                usd: totalIncomes.usd - totalExpenses.usd,
                cash: totalIncomes.cash - totalExpenses.cash,
                transfer: totalIncomes.transfer - totalExpenses.transfer,
                transfer_usd: totalIncomes.transfer_usd - totalExpenses.transfer_usd
            };
        
            return { netIncomes, expenses: totalOperationalExpenses, profit: totalProfit };
        };

        const daily = await processEntries(salesDaySnap, miscIncomesDaySnap, expensesDaySnap, wholesaleSalesDaySnap, internalMovesDaySnap);
        if (kpiElements.dollarsDay) kpiElements.dollarsDay.textContent = formatearUSD(daily.netIncomes.usd);
        if (kpiElements.cashDay) kpiElements.cashDay.textContent = formatearARS(daily.netIncomes.cash);
        if (kpiElements.transferDay) kpiElements.transferDay.textContent = formatearARS(daily.netIncomes.transfer);
        if (kpiElements.transferUsdDay) kpiElements.transferUsdDay.textContent = formatearUSD(daily.netIncomes.transfer_usd);
        if (kpiElements.profitDay) kpiElements.profitDay.textContent = formatearUSD(daily.profit);
        if (kpiElements.expensesDayUsd) kpiElements.expensesDayUsd.textContent = formatearUSD(daily.expenses.usd);
        if (kpiElements.expensesDayCash) kpiElements.expensesDayCash.textContent = formatearARS(daily.expenses.cash);
        if (kpiElements.expensesDayTransfer) kpiElements.expensesDayTransfer.textContent = formatearARS(daily.expenses.transfer);
        if (kpiElements.expensesDayTransferUsd) kpiElements.expensesDayTransferUsd.textContent = formatearUSD(daily.expenses.transfer_usd);

        const monthly = await processEntries(salesMonthSnap, miscIncomesMonthSnap, expensesMonthSnap, wholesaleSalesMonthSnap, internalMovesMonthSnap);
        if (kpiElements.dollarsMonth) kpiElements.dollarsMonth.textContent = formatearUSD(monthly.netIncomes.usd);
        if (kpiElements.cashMonth) kpiElements.cashMonth.textContent = formatearARS(monthly.netIncomes.cash);
        if (kpiElements.transferMonth) kpiElements.transferMonth.textContent = formatearARS(monthly.netIncomes.transfer);
        if (kpiElements.transferUsdMonth) kpiElements.transferUsdMonth.textContent = formatearUSD(monthly.netIncomes.transfer_usd);
        if (kpiElements.profitMonth) kpiElements.profitMonth.textContent = formatearUSD(monthly.profit);
        if (kpiElements.expensesMonthUsd) kpiElements.expensesMonthUsd.textContent = formatearUSD(monthly.expenses.usd);
        if (kpiElements.expensesMonthCash) kpiElements.expensesMonthCash.textContent = formatearARS(monthly.expenses.cash);
        if (kpiElements.expensesMonthTransfer) kpiElements.expensesMonthTransfer.textContent = formatearARS(monthly.expenses.transfer);
        if (kpiElements.expensesMonthTransferUsd) kpiElements.expensesMonthTransferUsd.textContent = formatearUSD(monthly.expenses.transfer_usd);

    } catch (error) {
        console.error("Error al actualizar los informes:", error);
        Object.values(kpiElements).forEach(el => { if (el) el.textContent = 'Error'; });
    }
}

async function handleAuthStateChange(user) {
    const userGreetingEl = document.getElementById('user-greeting');

    if (user) {
        // --- LÓGICA DE SALUDO ---
        const userEmail = user.email;
        const userName = emailToNameMap[userEmail]; 

        if (userName && userGreetingEl) {
            userGreetingEl.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Hola, ${userName}</span>`;
            userGreetingEl.classList.remove('hidden');
        }
        
        s.loginContainer.innerHTML = ''; 
        s.loginContainer.classList.add('hidden');
        s.appContainer.classList.remove('hidden');

        // ===== INICIO DE LA MODIFICACIÓN =====
        // Ejecutamos la migración aquí. Se ejecutará una sola vez por cada cuenta vieja.
        await migrarCuentasSinMoneda(); 
        // ===== FIN DE LA MODIFICACIÓN =====
        
        await loadAndPopulateSelects();
        switchView('dashboard', s.tabDashboard);
        updateCanjeCount();
        updateReparacionCount();

        setTimeout(() => {
            moveDashboardSlider(document.querySelector('.control-btn.active'));
            moveNavSlider(document.querySelector('.nav-tab.active'));
        }, 100);
    } else {
        if (userGreetingEl) {
            userGreetingEl.classList.add('hidden');
        }

        s.loginContainer.classList.remove('hidden');
        s.appContainer.classList.add('hidden');
        
        s.loginContainer.innerHTML = `
            <h1>Iniciar Sesión</h1>
            <form id="login-form" autocomplete="off">
                <div id="login-feedback" class="hidden"></div>
                <div class="form-group">
                    <input type="email" id="email" required placeholder=" " autocomplete="off">
                    <label for="email">Email</label>
                </div>
                <div class="form-group">
                    <div class="password-wrapper">
                        <input type="password" id="password" required placeholder=" " autocomplete="new-password">
                        <label for="password">Contraseña</label>
                        <button type="button" id="password-toggle" class="password-toggle-btn" title="Mostrar/Ocultar contraseña">
                            <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            <svg id="eye-off-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        </button>
                    </div>
                </div>
                <button type="submit" class="spinner-btn"><span class="btn-text">Entrar</span><div class="spinner"></div></button>
            </form>`;
        
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        
        const passwordInput = document.getElementById('password');
        const toggleButton = document.getElementById('password-toggle');
        const eyeIcon = document.getElementById('eye-icon');
        const eyeOffIcon = document.getElementById('eye-off-icon');

        toggleButton.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeIcon.classList.toggle('hidden', isPassword);
            eyeOffIcon.classList.toggle('hidden', !isPassword);
        });
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
// REEMPLAZA ESTA FUNCIÓN COMPLETA
const formatearARS = (monto) => {
    const montoNumerico = monto || 0;
    // Usamos Intl.NumberFormat para un formato más robusto
    const formatter = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatter.format(montoNumerico);
};

function showGlobalFeedback(message, type = 'success', duration = 3000) {
    s.globalFeedback.innerHTML = message;
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

// AÑADE ESTA FUNCIÓN NUEVA
async function updateReparacionCount() {
    try {
        const snapshot = await db.collection('reparaciones').get();
        const count = snapshot.size;
        s.reparacionBadge.textContent = count;
        s.reparacionBadge.classList.toggle('hidden', count === 0);
    } catch (error) {
        console.error("Error al obtener contador de reparaciones:", error);
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function switchView(view, tabElement) {
    const views = ['dashboard', 'providers', 'wholesale', 'reports', 'financiera', 'management', 'mensualidad'];
    
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    if(tabElement) {
        tabElement.classList.add('active');
        moveNavSlider(tabElement);
    }
    
    views.forEach(v => {
        const viewElement = s[`${v}View`];
        if (viewElement) viewElement.classList.toggle('hidden', v !== view);
    });

    if (view === 'dashboard' && !s.stockTableContainer.innerHTML.includes('<table>')) {
        const initialButton = document.querySelector('.control-btn');
        switchDashboardView('stock', initialButton);
    } else if (view === 'reports') {
        updateReports();
    } else if (view === 'providers') {
        loadProviders();
    } else if (view === 'wholesale') {
        loadWholesaleClients();
    } else if (view === 'financiera') {
        loadFinancialData();
    } else if (view === 'management') {
        resetManagementView();
    } else if (view === 'mensualidad') {
        loadMensualidadData();
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA
function switchDashboardView(viewName, button) {
    const sections = ['stock', 'sales', 'canje', 'reparacion', 'commissions', 'gastos', 'ingresos'];
    
    s.dashboardOptionsContainer.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
    sections.forEach(v => {
        const section = document.getElementById(`${v}-section`);
        if(section) section.classList.add('hidden');
    });

    if (button) {
        button.classList.add('active');
        s.dashboardMenuLabel.textContent = button.textContent.replace(/<span.*<\/span>/, '').trim();
        document.getElementById(`${viewName}-section`).classList.remove('hidden');
        moveDashboardSlider(button);
    }
    
    updateCanjeCount();
    if (viewName === 'stock') loadStock();
    else if (viewName === 'sales') loadSales();
    else if (viewName === 'canje') loadCanjes();
    else if (viewName === 'reparacion') loadReparaciones();
    else if (viewName === 'commissions') loadCommissions();
    else if (viewName === 'gastos') loadGastos();
    else if (viewName === 'ingresos') loadIngresos();
}
// =======================================================
// ============= INICIO VENTA MAYORISTA ==================
// =======================================================

async function loadWholesaleClients() {
    s.wholesaleClientsListContainer.innerHTML = `<p class="dashboard-loader">Cargando clientes mayoristas...</p>`;
    
    // ===== INICIO DE LA MODIFICACIÓN =====
    // Preparamos los elementos del DOM para los nuevos KPIs de mayoristas
    const debtTotalEl = document.getElementById('kpi-ws-debt-total');
    const balanceTotalEl = document.getElementById('kpi-ws-balance-total');
    if (debtTotalEl) debtTotalEl.textContent = '...';
    if (balanceTotalEl) balanceTotalEl.textContent = '...';
    // ===== FIN DE LA MODIFICACIÓN =====

    try {
        const snapshot = await db.collection('clientes_mayoristas').orderBy('nombre').get();
        if (snapshot.empty) {
            s.wholesaleClientsListContainer.innerHTML = `<p class="dashboard-loader">No hay clientes mayoristas. ¡Agrega el primero!</p>`;
            // Ponemos los contadores en cero si no hay clientes
            if (debtTotalEl) debtTotalEl.textContent = formatearUSD(0);
            if (balanceTotalEl) balanceTotalEl.textContent = formatearUSD(0);
            return;
        }

        // ===== INICIO DE LA MODIFICACIÓN =====
        // 1. Inicializamos los contadores para mayoristas
        let totalDeuda = 0;
        let totalSaldoFavor = 0;

        const clients = snapshot.docs.map(doc => {
            const clientData = doc.data();
            const debt = clientData.deuda_usd || 0;

            // 2. Sumamos a la categoría correcta
            if (debt > 0) {
                totalDeuda += debt;
            } else if (debt < 0) {
                totalSaldoFavor += Math.abs(debt); // Sumamos el valor absoluto
            }

            return { id: doc.id, ...clientData };
        });

        // 3. Actualizamos el HTML con los totales calculados
        if (debtTotalEl) debtTotalEl.textContent = formatearUSD(totalDeuda);
        if (balanceTotalEl) balanceTotalEl.textContent = formatearUSD(totalSaldoFavor);
        // ===== FIN DE LA MODIFICACIÓN =====
        
        renderWholesaleClients(clients);

    } catch (error) {
        handleDBError(error, s.wholesaleClientsListContainer, "clientes mayoristas");
        if (debtTotalEl) debtTotalEl.textContent = 'Error';
        if (balanceTotalEl) balanceTotalEl.textContent = 'Error';
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function promptToAddWholesaleClient() {
    // ===== INICIO DE LA MODIFICACIÓN =====
    // Se han añadido nuevos campos para el balance inicial.
    s.promptContainer.innerHTML = `
        <div class="ingreso-modal-box">
            <h3>Nuevo Cliente Mayorista</h3>
            <form id="wholesale-client-form" novalidate>
                <div class="form-group">
                    <input type="text" id="ws-client-name" name="nombre" required placeholder=" ">
                    <label for="ws-client-name">Nombre del Cliente</label>
                </div>
                <div class="form-group">
                    <textarea id="ws-client-notes" name="notas" rows="1" placeholder=" "></textarea>
                    <label for="ws-client-notes">Notas (Teléfono, etc. - opcional)</label>
                </div>

                <hr style="border-color:var(--border-dark);margin:1rem 0 2rem;">

                <div class="form-group">
                    <select id="ws-initial-balance-type" name="balance_type">
                        <option value="">Sin balance inicial</option>
                        <option value="deuda">Ingresa con Deuda</option>
                        <option value="favor">Ingresa con Saldo a Favor</option>
                    </select>
                    <label for="ws-initial-balance-type">Balance Inicial (Opcional)</label>
                </div>

                <div id="ws-initial-balance-amount-group" class="form-group hidden">
                    <input type="number" id="ws-initial-balance-amount" name="balance_amount" step="0.01" placeholder=" ">
                    <label for="ws-initial-balance-amount">Monto del Balance (USD)</label>
                </div>

                <div class="prompt-buttons" style="margin-top: 2rem;">
                    <button type="submit" class="prompt-button confirm spinner-btn">
                        <span class="btn-text">Guardar Cliente</span>
                        <div class="spinner"></div>
                    </button>
                    <button type="button" class="prompt-button cancel">Cancelar</button>
                </div>
            </form>
        </div>`;
    // ===== FIN DE LA MODIFICACIÓN =====
    
    const textarea = document.getElementById('ws-client-notes');
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }

    // ===== INICIO DE LA MODIFICACIÓN =====
    // Lógica para mostrar/ocultar el campo de monto
    const balanceTypeSelect = document.getElementById('ws-initial-balance-type');
    const amountGroup = document.getElementById('ws-initial-balance-amount-group');
    const amountInput = document.getElementById('ws-initial-balance-amount');

    balanceTypeSelect.addEventListener('change', () => {
        if (balanceTypeSelect.value) {
            amountGroup.classList.remove('hidden');
            amountInput.required = true;
        } else {
            amountGroup.classList.add('hidden');
            amountInput.required = false;
        }
    });
    // ===== FIN DE LA MODIFICACIÓN =====
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function saveWholesaleClient(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    
    // ===== INICIO DE LA MODIFICACIÓN =====
    // Leemos los nuevos campos del formulario
    const balanceType = form.balance_type.value;
    const balanceAmount = parseFloat(form.balance_amount.value) || 0;
    
    let initialDebt = 0;
    if (balanceType === 'deuda') {
        initialDebt = balanceAmount; // Se guarda como número positivo
    } else if (balanceType === 'favor') {
        initialDebt = -balanceAmount; // Se guarda como número negativo
    }
    // ===== FIN DE LA MODIFICACIÓN =====

    const clientData = {
        nombre: form.nombre.value.trim(),
        notas: form.notas.value.trim(),
        total_comprado_usd: 0,
        deuda_usd: initialDebt, // Usamos el valor calculado
        fecha_creacion: firebase.firestore.FieldValue.serverTimestamp(),
        fecha_ultima_compra: null
    };

    try {
        await db.collection('clientes_mayoristas').add(clientData);
        showGlobalFeedback('Cliente mayorista agregado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        loadWholesaleClients();
    } catch (error) {
        console.error("Error guardando cliente mayorista:", error);
        showGlobalFeedback('Error al guardar el cliente', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

function promptToStartWholesaleSale(clientId, clientName) {
    // Ya no necesitamos los modelos para el canje aquí
    // const modelosOptions = modelos.map(m => `<option value="${m}">${m}</option>`).join('');

    const metodosDePagoHtml = `
        <div class="form-group">
            <label>Método(s) de Pago Recibidos</label>
            <div id="payment-methods-container">
                <div class="payment-option">
                    <label class="toggle-switch-group">
                        <input type="checkbox" name="metodo_pago_check" value="Dólares">
                        <span class="toggle-switch-label">Dólares</span>
                        <span class="toggle-switch-slider"></span>
                    </label>
                    <div class="payment-input-container hidden">
                        <input type="number" name="monto_dolares" placeholder="Monto en USD" step="0.01">
                    </div>
                </div>
                <div class="payment-option">
                    <label class="toggle-switch-group">
                        <input type="checkbox" name="metodo_pago_check" value="Pesos (Efectivo)">
                        <span class="toggle-switch-label">Pesos (Efectivo)</span>
                        <span class="toggle-switch-slider"></span>
                    </label>
                    <div class="payment-input-container hidden">
                        <input type="number" name="monto_efectivo" placeholder="Monto en ARS" step="0.01">
                    </div>
                </div>
                <div class="payment-option">
                    <label class="toggle-switch-group">
                        <input type="checkbox" name="metodo_pago_check" value="Pesos (Transferencia)">
                        <span class="toggle-switch-label">Pesos (Transferencia)</span>
                        <span class="toggle-switch-slider"></span>
                    </label>
                    <div class="payment-input-container hidden">
                        <input type="number" name="monto_transferencia" placeholder="Monto en ARS" step="0.01">
                    </div>
                </div>
            </div>
        </div>
    `;

    // --- Se eliminó la variable canjeHtml ---

    s.promptContainer.innerHTML = `
        <div class="container container-sm wholesale-sale-modal-box">
            <h3>Registrar Venta a ${clientName}</h3>
            <form id="wholesale-sale-start-form" data-client-id="${clientId}" data-client-name="${clientName}" novalidate>
                <div class="form-group">
                    <label>ID de la Venta (Ej: VTA-050)</label>
                    <input type="text" id="ws-sale-id" name="sale_id" required>
                </div>
                ${metodosDePagoHtml}
                <div class="form-group">
                    <label>Cotización del Dólar (si aplica)</label>
                    <input type="number" id="ws-cotizacion" name="cotizacion_dolar" placeholder="Ej: 1200">
                </div>
                <!-- Se eliminó el HTML y los campos del Plan Canje de aquí -->
                <div class="prompt-buttons">
                    <button type="submit" class="prompt-button confirm">Iniciar Carga de Equipos</button>
                    <button type="button" class="prompt-button cancel">Cancelar</button>
                </div>
            </form>
        </div>`;

    const form = document.getElementById('wholesale-sale-start-form');
    form.querySelectorAll('input[name="metodo_pago_check"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const container = e.target.closest('.payment-option').querySelector('.payment-input-container');
            container.classList.toggle('hidden', !e.target.checked);
        });
    });

    // --- Se eliminó el listener para el checkbox de canje ---
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function initiateWholesaleSale(form) {
    const formData = new FormData(form);
    const saleId = formData.get('sale_id').trim();
    const montoUsd = parseFloat(formData.get('monto_dolares')) || 0;
    const montoArsEfectivo = parseFloat(formData.get('monto_efectivo')) || 0;
    const montoArsTransferencia = parseFloat(formData.get('monto_transferencia')) || 0;
    
    // --- Lógica de canje eliminada ---

    if (!saleId) {
        showGlobalFeedback("El ID de la venta es obligatorio.", "error");
        return;
    }
    if (montoUsd === 0 && montoArsEfectivo === 0 && montoArsTransferencia === 0) {
        showGlobalFeedback("Debes ingresar al menos un monto de pago.", "error");
        return;
    }
    
    wholesaleSaleContext = {
        clientId: form.dataset.clientId,
        clientName: form.dataset.clientName,
        saleId: saleId,
        payment: {
            usd: montoUsd,
            ars_efectivo: montoArsEfectivo,
            ars_transferencia: montoArsTransferencia,
        },
        cotizacion: parseFloat(formData.get('cotizacion_dolar')) || 1,
        // --- Propiedades de canje eliminadas del contexto ---
        huboCanje: false, 
        valorCanjeUSD: 0,
        canjeModelo: null,
        items: [],
        totalSaleValue: 0
    };

    s.promptContainer.innerHTML = '';
    showGlobalFeedback(`Venta ${saleId} iniciada. Comienza a escanear los equipos a vender.`, 'info', 4000);
    
    resetManagementView(false, false, true);
    switchView('management', s.tabManagement);
}
// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function processWholesaleItem(imei) {
    showFeedback("Buscando IMEI...", "loading");
    try {
        const imeiDoc = await db.collection("stock_individual").doc(imei.trim()).get();
        
        if (!imeiDoc.exists || imeiDoc.data().estado !== 'en_stock') {
            throw new Error(`El IMEI ${imei} no existe en el stock o ya fue vendido.`);
        }
        
        const itemDetails = imeiDoc.data();
        s.feedbackMessage.classList.add('hidden');
        
        s.promptContainer.innerHTML = `
            <div class="ingreso-modal-box">
                <h3>Vender ${itemDetails.modelo}</h3>
                <p style="color: var(--text-muted); text-align: center; margin-top: -1.5rem; margin-bottom: 2rem;">IMEI: ${imei}</p>
                <form id="wholesale-item-price-form">
                    <div class="form-group">
                        <input type="number" id="ws-item-price" name="precio_venta" required placeholder=" " step="0.01">
                        <label for="ws-item-price">Precio de Venta (USD) para este equipo</label>
                    </div>
                    <div class="prompt-buttons">
                        <button type="submit" class="prompt-button confirm">Agregar a la Venta</button>
                        <button type="button" class="prompt-button cancel">Cancelar Equipo</button>
                    </div>
                </form>
            </div>`;

        document.getElementById('wholesale-item-price-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const price = parseFloat(e.target.precio_venta.value);
            if (isNaN(price) || price <= 0) {
                showGlobalFeedback("Ingresa un precio de venta válido.", "error");
                return;
            }

            wholesaleSaleContext.items.push({
                imei: imei.trim(),
                details: itemDetails,
                precio_venta_usd: price
            });
            wholesaleSaleContext.totalSaleValue += price;

            s.promptContainer.innerHTML = '';
            showFeedback(`${itemDetails.modelo} agregado. Escanea o ingresa el siguiente.`, "success");
            
            // --- INICIO DE LA CORRECCIÓN CLAVE ---
            // En lugar de llamar a startScanner(), reseteamos la vista.
            // El 'true' final indica que estamos en una venta mayorista.
            resetManagementView(false, false, true);
            // --- FIN DE LA CORRECCIÓN CLAVE ---
        });
        
    } catch (error) {
        showFeedback(error.message, "error");
        console.error(error);
        // Si hay un error, también reseteamos la vista para poder continuar.
        resetManagementView(false, false, true);
    }
}

function renderWholesaleLoader() {
    s.managementTitle.textContent = `Venta a ${wholesaleSaleContext.clientName} (ID: ${wholesaleSaleContext.saleId})`;
    
    s.productForm.querySelectorAll('.form-group, #product-form-submit-btn').forEach(el => {
        el.style.display = 'none';
    });

    const oldLoader = s.managementView.querySelector('#wholesale-sale-imei-loader');
    if(oldLoader) oldLoader.remove();
    
    const itemsHtml = wholesaleSaleContext.items.map(item => `
        <div class="wholesale-sale-item-row">
            <span class="item-info">${item.details.modelo} - ${item.details.color}</span>
            <span class="item-price">${formatearUSD(item.precio_venta_usd)}</span>
        </div>
    `).join('');

    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'wholesale-sale-imei-loader';
    loaderDiv.innerHTML = `
        <div class="details-box">
            <div class="detail-item"><span>Total Acumulado:</span> <strong>${formatearUSD(wholesaleSaleContext.totalSaleValue)}</strong></div>
            <div class="detail-item"><span>Equipos Cargados:</span> <strong>${wholesaleSaleContext.items.length}</strong></div>
        </div>
        <h3>Equipos en esta Venta</h3>
        <div id="wholesale-sale-items-container">${itemsHtml || '<p style="text-align:center; color: var(--text-muted);">Aún no has agregado equipos.</p>'}</div>`;

    s.productForm.prepend(loaderDiv);
    s.productForm.classList.remove('hidden');
}

async function finalizeWholesaleSale(form) {
    const btn = form.querySelector('button[type="submit"]');
    toggleSpinner(btn, true);

    const formData = new FormData(form);
    const saleId = formData.get('sale_id').trim();

    // ===== INICIO DE LA MODIFICACIÓN CLAVE =====
    // Hacemos la lectura de datos más segura, verificando qué checkboxes están marcados.
    const metodosSeleccionados = formData.getAll('metodo_pago_check');

    const montoUsdEfectivo = metodosSeleccionados.includes('Dólares') ? parseFloat(formData.get('monto_dolares')) || 0 : 0;
    const montoArsEfectivo = metodosSeleccionados.includes('Pesos (Efectivo)') ? parseFloat(formData.get('monto_efectivo')) || 0 : 0;
    const montoArsTransferencia = metodosSeleccionados.includes('Pesos (Transferencia)') ? parseFloat(formData.get('monto_transferencia')) || 0 : 0;
    const montoUsdTransferencia = metodosSeleccionados.includes('Dólares (Transferencia)') ? parseFloat(formData.get('monto_transferencia_usd')) || 0 : 0;
    
    const cuentaDestinoArsValue = metodosSeleccionados.includes('Pesos (Transferencia)') ? formData.get('cuenta_destino_ars') : null;
    const cuentaDestinoUsdValue = metodosSeleccionados.includes('Dólares (Transferencia)') ? formData.get('cuenta_destino_usd') : null;
    
    const pagoEnPesos = montoArsEfectivo > 0 || montoArsTransferencia > 0;
    const cotizacion = pagoEnPesos ? parseFloat(formData.get('cotizacion_dolar')) || 1 : 1;
    // ===== FIN DE LA MODIFICACIÓN CLAVE =====

    if (!saleId) {
        showGlobalFeedback("El ID de la venta es obligatorio.", "error");
        toggleSpinner(btn, false);
        return;
    }
    if (montoArsTransferencia > 0 && !cuentaDestinoArsValue) {
        showGlobalFeedback("Debes seleccionar una cuenta ARS para la transferencia.", "error");
        toggleSpinner(btn, false);
        return;
    }
    if (montoUsdTransferencia > 0 && !cuentaDestinoUsdValue) {
        showGlobalFeedback("Debes seleccionar una cuenta USD para la transferencia.", "error");
        toggleSpinner(btn, false);
        return;
    }

    try {
        const { clientId, clientName, items, totalSaleValue } = wholesaleSaleContext;
        
        const usarSaldo = formData.get('usar_saldo_cliente') === 'on';
        
        await db.runTransaction(async (t) => {
            const saleDate = firebase.firestore.FieldValue.serverTimestamp();
            const wholesaleSaleRef = db.collection('ventas_mayoristas').doc();
            
            let creditoAplicado = 0;
            const clientRef = db.collection('clientes_mayoristas').doc(clientId);
            
            if (usarSaldo) {
                const clientDoc = await t.get(clientRef);
                const saldoActual = clientDoc.data().deuda_usd || 0;
                if (saldoActual < 0) {
                    creditoAplicado = Math.min(totalSaleValue, Math.abs(saldoActual));
                }
            }

            const totalPagadoPesos = montoArsEfectivo + montoArsTransferencia;
            const totalPagadoUSD = montoUsdEfectivo + montoUsdTransferencia + (totalPagadoPesos > 0 ? (totalPagadoPesos / cotizacion) : 0);
            const deudaGenerada = totalSaleValue - totalPagadoUSD - creditoAplicado;
            
            const masterSaleData = {
                clienteId: clientId,
                clienteNombre: clientName,
                venta_id_manual: saleId,
                fecha_venta: saleDate,
                total_venta_usd: totalSaleValue,
                pago_recibido: {
                    usd: montoUsdEfectivo,
                    ars_efectivo: montoArsEfectivo,
                    ars_transferencia: montoArsTransferencia,
                    usd_transferencia: montoUsdTransferencia,
                    cotizacion_dolar: cotizacion,
                    total_pagado_usd: totalPagadoUSD
                },
                saldo_favor_aplicado: creditoAplicado,
                deuda_generada_usd: deudaGenerada > 0.01 ? deudaGenerada : 0,
                cantidad_equipos: items.length,
            };

            if (montoArsTransferencia > 0) {
                const [cuentaId, cuentaNombre] = cuentaDestinoArsValue.split('|');
                masterSaleData.pago_recibido.cuenta_destino_id = cuentaId;
                masterSaleData.pago_recibido.cuenta_destino_nombre = cuentaNombre;
                const cuentaRef = db.collection('cuentas_financieras').doc(cuentaId);
                t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(montoArsTransferencia) });
            }
            
            if (montoUsdTransferencia > 0) {
                const [cuentaId, cuentaNombre] = cuentaDestinoUsdValue.split('|');
                masterSaleData.pago_recibido.cuenta_destino_usd_id = cuentaId;
                masterSaleData.pago_recibido.cuenta_destino_usd_nombre = cuentaNombre;
                const cuentaRef = db.collection('cuentas_financieras').doc(cuentaId);
                t.update(cuentaRef, { saldo_actual_usd: firebase.firestore.FieldValue.increment(montoUsdTransferencia) });
            }

            t.set(wholesaleSaleRef, masterSaleData);

            for (const item of items) {
                const ventaIndividualRef = db.collection('ventas').doc();
                t.set(ventaIndividualRef, {
                    imei_vendido: item.imei,
                    producto: item.details,
                    precio_venta_usd: item.precio_venta_usd,
                    metodo_pago: 'Venta Mayorista',
                    vendedor: `Mayorista: ${clientName}`,
                    fecha_venta: saleDate,
                    venta_mayorista_ref: wholesaleSaleRef.id,
                });
                const stockRef = db.collection('stock_individual').doc(item.imei);
                t.update(stockRef, { estado: 'vendido' });
            }

            const cambioNetoEnDeuda = totalSaleValue - totalPagadoUSD;
            
            t.update(clientRef, {
                total_comprado_usd: firebase.firestore.FieldValue.increment(totalSaleValue),
                deuda_usd: firebase.firestore.FieldValue.increment(cambioNetoEnDeuda),
                fecha_ultima_compra: saleDate
            });
        });

        showGlobalFeedback(`¡Venta mayorista ${saleId} registrada con éxito!`, 'success', 5000);
        wholesaleSaleContext = null;
        s.promptContainer.innerHTML = '';
        resetManagementView();
        switchView('wholesale', s.tabWholesale);
        updateReports();
        loadFinancialData();

    } catch (error) {
        console.error("Error al finalizar la venta mayorista:", error);
        showGlobalFeedback("Error crítico al registrar la venta. Revisa la consola.", "error", 8000);
    } finally {
        toggleSpinner(btn, false);
    }
}

async function loadIngresos() {
    s.ingresosList.innerHTML = `<p class="dashboard-loader" style="grid-column: 1 / -1;">Cargando ingresos...</p>`;
    s.ingresosPeriodTotalArsEfectivo.textContent = '...';
    s.ingresosPeriodTotalArsTransferencia.textContent = '...';
    s.ingresosPeriodTotalUsd.textContent = '...';
    // ===== INICIO DE LA MODIFICACIÓN =====
    const totalUsdTransferenciaEl = document.getElementById('ingresos-period-total-usd-transferencia');
    if(totalUsdTransferenciaEl) totalUsdTransferenciaEl.textContent = '...';
    // ===== FIN DE LA MODIFICACIÓN =====
    toggleSpinner(s.btnApplyIngresosFilter, true);
    
    let startDate = s.filterIngresosStartDate.value;
    let endDate = s.filterIngresosEndDate.value;

    try {
        let query = db.collection('ingresos_caja').orderBy('fecha', 'desc');
        
        if (startDate) {
            query = query.where('fecha', '>=', new Date(startDate + 'T00:00:00'));
        }
        if (endDate) {
            query = query.where('fecha', '<=', new Date(endDate + 'T23:59:59'));
        }
        
        const snapshot = await query.get();
        const ingresos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        let totalArsEfectivo = 0;
        let totalArsTransferencia = 0;
        let totalUsd = 0;
        // ===== INICIO DE LA MODIFICACIÓN =====
        let totalUsdTransferencia = 0;

        ingresos.forEach(ingreso => {
            if (ingreso.metodo === 'Dólares') {
                totalUsd += ingreso.monto;
            } else if (ingreso.metodo === 'Pesos (Efectivo)') {
                totalArsEfectivo += ingreso.monto;
            } else if (ingreso.metodo === 'Pesos (Transferencia)') {
                totalArsTransferencia += ingreso.monto;
            } else if (ingreso.metodo === 'Dólares (Transferencia)') {
                totalUsdTransferencia += ingreso.monto;
            }
        });

        s.ingresosPeriodTotalArsEfectivo.textContent = formatearARS(totalArsEfectivo);
        s.ingresosPeriodTotalArsTransferencia.textContent = formatearARS(totalArsTransferencia);
        s.ingresosPeriodTotalUsd.textContent = formatearUSD(totalUsd);
        if(totalUsdTransferenciaEl) totalUsdTransferenciaEl.textContent = formatearUSD(totalUsdTransferencia);
        // ===== FIN DE LA MODIFICACIÓN =====
        
        const ingresosAgrupados = ingresos.reduce((acc, ingreso) => {
            const categoria = ingreso.categoria || 'Sin Categoría';
            if (!acc[categoria]) {
                acc[categoria] = [];
            }
            acc[categoria].push(ingreso);
            return acc;
        }, {});
        
        renderIngresosList(ingresosAgrupados);

    } catch (error) {
        handleDBError(error, s.ingresosList, "ingresos");
        s.ingresosPeriodTotalArsEfectivo.textContent = 'Error';
        s.ingresosPeriodTotalArsTransferencia.textContent = 'Error';
        s.ingresosPeriodTotalUsd.textContent = 'Error';
        // ===== INICIO DE LA MODIFICACIÓN =====
        if(totalUsdTransferenciaEl) totalUsdTransferenciaEl.textContent = 'Error';
        // ===== FIN DE LA MODIFICACIÓN =====
    } finally {
        toggleSpinner(s.btnApplyIngresosFilter, false);
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
function renderIngresosList(ingresosAgrupados) {
    if (Object.keys(ingresosAgrupados).length === 0) {
        s.ingresosList.innerHTML = `<p class="dashboard-loader" style="grid-column: 1 / -1;">No hay ingresos para mostrar en este período.</p>`;
        return;
    }

    // Usamos Object.keys para iterar sobre cada categoría del objeto
    s.ingresosList.innerHTML = Object.keys(ingresosAgrupados).map(categoria => {
        const ingresosDeCategoria = ingresosAgrupados[categoria];
        const totalCategoria = ingresosDeCategoria.reduce((sum, ing) => sum + ing.monto, 0);
        const moneda = ingresosDeCategoria[0].metodo === 'Dólares' ? 'USD' : 'ARS';
        
        // Creamos la lista de detalles para esta categoría
        const detallesHtml = ingresosDeCategoria.map(ingreso => {
            const ingresoJSON = JSON.stringify(ingreso).replace(/'/g, "\\'");
            return `
            <div class="ingreso-detail-item">
                <div class="detail-info">
                    <span class="detail-description">${ingreso.descripcion || 'Ingreso general'}</span>
                    <span class="detail-date">${new Date((ingreso.fecha?.seconds || 0) * 1000).toLocaleString('es-AR')}</span>
                </div>
                <div class="detail-actions">
                    <span class="detail-amount">${ingreso.metodo === 'Dólares' ? formatearUSD(ingreso.monto) : formatearARS(ingreso.monto)}</span>
                    <button class="edit-btn btn-edit-ingreso" title="Editar Ingreso" data-ingreso-item='${ingresoJSON}' data-ingreso-id="${ingreso.id}">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="delete-btn" title="Eliminar Ingreso" onclick="deleteIngreso('${ingreso.id}', '${ingreso.categoria}', ${ingreso.monto}, '${ingreso.metodo}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>`;
        }).join('');

        // Creamos la tarjeta principal de la categoría
        return `
        <div class="ingreso-group-card">
            <div class="ingreso-group-header">
                <div class="header-info">
                    <span class="header-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </span>
                    <div class="header-text">
                        <span class="header-category">${categoria}</span>
                        <span class="header-item-count">${ingresosDeCategoria.length} movimiento(s)</span>
                    </div>
                </div>
                <div class="header-summary">
                    <span class="header-total-amount">${moneda === 'USD' ? formatearUSD(totalCategoria) : formatearARS(totalCategoria)}</span>
                    <svg class="chevron-down" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
                </div>
            </div>
            <div class="ingreso-group-details">
                ${detallesHtml}
            </div>
        </div>`;
    }).join('');

    // Añadimos los listeners para los botones de editar
    document.querySelectorAll('.btn-edit-ingreso').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const ingresoItem = JSON.parse(button.dataset.ingresoItem.replace(/\\'/g, "'"));
            promptToEditIngreso(ingresoItem, button.dataset.ingresoId);
        });
    });
}

async function promptToAddIngreso() {
    await loadAndPopulateSelects(); 

    // ===== INICIO DE LA MODIFICACIÓN =====
    // Añadimos la nueva opción de pago
    const metodoOptions = [...metodosDePago, "Dólares (Transferencia)"].map(m => `<option value="${m}">${m}</option>`).join('');
    
    // Filtramos las cuentas por moneda
    const accountsArsOptions = financialAccounts.filter(acc => acc.moneda === 'ARS').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('');
    const accountsUsdOptions = financialAccounts.filter(acc => acc.moneda === 'USD').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('');
    
    const accountArsSelectHtml = `<div id="ingreso-cuenta-ars-group" class="form-group hidden" style="margin-top: 1rem;"><select name="cuenta_destino_ars" required><option value="" disabled selected></option>${accountsArsOptions}</select><label>Acreditar en Cuenta ARS</label></div>`;
    const accountUsdSelectHtml = `<div id="ingreso-cuenta-usd-group" class="form-group hidden" style="margin-top: 1rem;"><select name="cuenta_destino_usd" required><option value="" disabled selected></option>${accountsUsdOptions}</select><label>Acreditar en Cuenta USD</label></div>`;
    // ===== FIN DE LA MODIFICACIÓN =====

    const categoriaOptions = ingresosCategorias.map(c => `<option value="${c}">${c}</option>`).join('');

    s.promptContainer.innerHTML = `
    <div class="ingreso-modal-box">
        <h3>Registrar Nuevo Ingreso</h3>
        <form id="ingreso-form" novalidate data-mode="create">
            <div class="form-group">
                <input type="number" id="ingreso-monto" name="monto" required placeholder=" " step="0.01">
                <label for="ingreso-monto">Monto</label>
            </div>
            <div class="form-group">
                <select id="ingreso-metodo" name="metodo" required>
                    <option value="" disabled selected></option>
                    ${metodoOptions}
                </select>
                <label for="ingreso-metodo">Método de Ingreso</label>
            </div>
            
            <!-- ===== INICIO DE LA MODIFICACIÓN ===== -->
            ${accountArsSelectHtml}
            ${accountUsdSelectHtml}
            <!-- ===== FIN DE LA MODIFICACIÓN ===== -->
            
            <div class="form-group">
                <select id="ingreso-categoria-select" name="categoria_existente" required>
                    <option value="" disabled selected></option>
                    ${categoriaOptions}
                    <option value="--nueva--">** Crear Nueva Categoría **</option>
                </select>
                <label for="ingreso-categoria-select">Categoría</label>
                <button type="button" id="btn-delete-category" class="delete-icon-btn" title="Eliminar categoría seleccionada" style="position: absolute; right: 40px; top: 0; display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
            <div id="nueva-categoria-group" class="form-group hidden">
                <input type="text" id="ingreso-categoria-nueva" name="categoria_nueva" placeholder=" ">
                <label for="ingreso-categoria-nueva">Nombre de la Nueva Categoría</label>
            </div>
            <div class="form-group">
                <textarea id="ingreso-descripcion" name="descripcion" rows="1" placeholder=" "></textarea>
                <label for="ingreso-descripcion">Descripción (opcional)</label>
            </div>
            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Guardar Ingreso</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;

    const categoriaSelect = document.getElementById('ingreso-categoria-select');
    const nuevaCategoriaGroup = document.getElementById('nueva-categoria-group');
    const deleteCategoryBtn = document.getElementById('btn-delete-category');
    
    // ===== INICIO DE LA MODIFICACIÓN =====
    const metodoSelect = document.getElementById('ingreso-metodo');
    const cuentaArsGroup = document.getElementById('ingreso-cuenta-ars-group');
    const cuentaUsdGroup = document.getElementById('ingreso-cuenta-usd-group');
    metodoSelect.addEventListener('change', () => {
        const selectedMethod = metodoSelect.value;
        const isTransferArs = selectedMethod === 'Pesos (Transferencia)';
        const isTransferUsd = selectedMethod === 'Dólares (Transferencia)';
        
        cuentaArsGroup.classList.toggle('hidden', !isTransferArs);
        cuentaArsGroup.querySelector('select').required = isTransferArs;
        
        cuentaUsdGroup.classList.toggle('hidden', !isTransferUsd);
        cuentaUsdGroup.querySelector('select').required = isTransferUsd;
    });
    // ===== FIN DE LA MODIFICACIÓN =====

    categoriaSelect.addEventListener('change', () => {
        const selectedValue = categoriaSelect.value;
        const isNew = selectedValue === '--nueva--';
        nuevaCategoriaGroup.classList.toggle('hidden', !isNew);
        document.getElementById('ingreso-categoria-nueva').required = isNew;
        if (selectedValue && !isNew) {
            deleteCategoryBtn.style.display = 'flex';
        } else {
            deleteCategoryBtn.style.display = 'none';
        }
    });

    deleteCategoryBtn.addEventListener('click', () => {
        const categoryToDelete = categoriaSelect.value;
        if (categoryToDelete && categoryToDelete !== '--nueva--') {
            deleteIngresoCategoria(categoryToDelete);
        }
    });

    const textarea = document.getElementById('ingreso-descripcion');
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }
}

async function deleteIngresoCategoria(categoryName) {
    const message = `¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?\n\nEsta acción es irreversible y la eliminará de la lista para siempre.`;
    showConfirmationModal('Confirmar Eliminación de Categoría', message, async () => {
        try {
            // Buscamos el documento por su nombre para obtener su ID
            const querySnapshot = await db.collection('ingresos_categorias').where('nombre', '==', categoryName).get();
            if (querySnapshot.empty) {
                throw new Error("La categoría no fue encontrada. Puede que ya haya sido eliminada.");
            }
            
            // Borramos el documento usando su ID
            const docId = querySnapshot.docs[0].id;
            await db.collection('ingresos_categorias').doc(docId).delete();

            showGlobalFeedback(`Categoría "${categoryName}" eliminada con éxito.`, 'success');
            
            // Cerramos y volvemos a abrir el modal para que se refresque la lista de categorías
            s.promptContainer.innerHTML = '';
            promptToAddIngreso();

        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
            showGlobalFeedback(error.message || 'No se pudo eliminar la categoría.', 'error');
        }
    });
}

async function promptToEditIngreso(ingreso, ingresoId) {
    await loadAndPopulateSelects();
    const categoriaOptions = ingresosCategorias.map(c => `<option value="${c}" ${ingreso.categoria === c ? 'selected' : ''}>${c}</option>`).join('');
    const metodoOptions = metodosDePago.map(m => `<option value="${m}" ${ingreso.metodo === m ? 'selected' : ''}>${m}</option>`).join('');

    s.promptContainer.innerHTML = `
    <div class="ingreso-modal-box">
        <h3>Editar Ingreso</h3>
        <form id="ingreso-form" novalidate data-mode="edit" data-ingreso-id="${ingresoId}">
            <div class="form-group">
                <input type="number" id="ingreso-monto" name="monto" required placeholder=" " step="0.01" value="${ingreso.monto || ''}">
                <label for="ingreso-monto">Monto</label>
            </div>
            <div class="form-group">
                <select id="ingreso-metodo" name="metodo" required>${metodoOptions}</select>
                <label for="ingreso-metodo">Método de Ingreso</label>
            </div>
            <div class="form-group">
                <select id="ingreso-categoria-select" name="categoria" required>${categoriaOptions}</select>
                <label for="ingreso-categoria-select">Categoría</label>
            </div>
            <div class="form-group">
                <textarea id="ingreso-descripcion" name="descripcion" rows="1" placeholder=" ">${ingreso.descripcion || ''}</textarea>
                <label for="ingreso-descripcion">Descripción (opcional)</label>
            </div>
            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Actualizar Ingreso</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;

    const textarea = document.getElementById('ingreso-descripcion');
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }
}


async function saveIngreso(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    
    let categoria = formData.get('categoria_existente');
    if (categoria === '--nueva--') {
        categoria = formData.get('categoria_nueva').trim();
        if (categoria) {
            await db.collection('ingresos_categorias').add({ nombre: categoria });
            ingresosCategorias.push(categoria);
            ingresosCategorias.sort();
        }
    }

    if (!categoria) {
        showGlobalFeedback("Debes seleccionar o crear una categoría.", "error");
        toggleSpinner(btn, false);
        return;
    }

    const ingresoData = {
        monto: parseFloat(formData.get('monto')),
        metodo: formData.get('metodo'),
        categoria: categoria,
        descripcion: formData.get('descripcion'), 
        fecha: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // ===== INICIO DE LA MODIFICACIÓN =====
    const cuentaDestinoArsValue = formData.get('cuenta_destino_ars');
    const cuentaDestinoUsdValue = formData.get('cuenta_destino_usd');
    
    if (ingresoData.metodo === 'Pesos (Transferencia)') {
        if (!cuentaDestinoArsValue) {
            showGlobalFeedback("Debes seleccionar una cuenta para la transferencia en ARS.", "error");
            toggleSpinner(btn, false);
            return;
        }
        const [id, nombre] = cuentaDestinoArsValue.split('|');
        ingresoData.cuenta_destino_id = id;
        ingresoData.cuenta_destino_nombre = nombre;
    } else if (ingresoData.metodo === 'Dólares (Transferencia)') {
        if (!cuentaDestinoUsdValue) {
            showGlobalFeedback("Debes seleccionar una cuenta para la transferencia en USD.", "error");
            toggleSpinner(btn, false);
            return;
        }
        const [id, nombre] = cuentaDestinoUsdValue.split('|');
        ingresoData.cuenta_destino_usd_id = id;
        ingresoData.cuenta_destino_usd_nombre = nombre;
    }
    // ===== FIN DE LA MODIFICACIÓN =====

    try {
        await db.runTransaction(async t => {
            const ingresoRef = db.collection('ingresos_caja').doc();
            t.set(ingresoRef, ingresoData);

            if (ingresoData.cuenta_destino_id) { // Transferencia ARS
                const cuentaRef = db.collection('cuentas_financieras').doc(ingresoData.cuenta_destino_id);
                t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(ingresoData.monto) });
            } else if (ingresoData.cuenta_destino_usd_id) { // Transferencia USD
                const cuentaRef = db.collection('cuentas_financieras').doc(ingresoData.cuenta_destino_usd_id);
                t.update(cuentaRef, { saldo_actual_usd: firebase.firestore.FieldValue.increment(ingresoData.monto) });
            }
        });

        showGlobalFeedback('Ingreso registrado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        if(s.ingresosSection && !s.ingresosSection.classList.contains('hidden')) {
            loadIngresos();
        }
        loadFinancialData(); 
        updateReports();
    } catch (error) {
        console.error("Error al guardar el ingreso:", error);
        showGlobalFeedback('Error al registrar el ingreso', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

async function updateIngreso(ingresoId, btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);

    const ingresoUpdateData = {
        monto: parseFloat(formData.get('monto')),
        metodo: formData.get('metodo'),
        categoria: formData.get('categoria'),
        descripcion: formData.get('descripcion'), 
    };

    try {
        await db.collection('ingresos_caja').doc(ingresoId).update(ingresoUpdateData);
        showGlobalFeedback('Ingreso actualizado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        loadIngresos();
        updateReports();
    } catch (error) {
        console.error("Error al actualizar el ingreso:", error);
        showGlobalFeedback('Error al actualizar el ingreso', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}


function deleteIngreso(id, categoria, monto, metodo) {
    // Usamos el método para formatear correctamente el monto en el mensaje de confirmación
    const montoFormateado = metodo.includes('Dólares') ? formatearUSD(monto) : formatearARS(monto);
    const message = `Categoría: ${categoria}<br>Monto: <strong>${montoFormateado}</strong><br><br>¿Estás seguro de que quieres eliminar este ingreso? Si fue una transferencia, el monto se descontará del balance de la cuenta correspondiente.`;
    
    showConfirmationModal('Confirmar Eliminación', message, async () => {
        try {
            // ===== INICIO DE LA MODIFICACIÓN =====
            // Usamos una transacción para garantizar la consistencia de los datos
            await db.runTransaction(async t => {
                const ingresoRef = db.collection('ingresos_caja').doc(id);
                const ingresoDoc = await t.get(ingresoRef);

                if (!ingresoDoc.exists) {
                    throw new Error("El ingreso ya no existe. Puede que haya sido eliminado por otro usuario.");
                }

                const ingresoData = ingresoDoc.data();
                const montoARevertir = ingresoData.monto;

                // 1. Verificamos si fue una transferencia en ARS y revertimos el saldo
                if (ingresoData.cuenta_destino_id) {
                    const cuentaRef = db.collection('cuentas_financieras').doc(ingresoData.cuenta_destino_id);
                    t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(-montoARevertir) });
                }

                // 2. Verificamos si fue una transferencia en USD y revertimos el saldo
                if (ingresoData.cuenta_destino_usd_id) {
                    const cuentaRef = db.collection('cuentas_financieras').doc(ingresoData.cuenta_destino_usd_id);
                    t.update(cuentaRef, { saldo_actual_usd: firebase.firestore.FieldValue.increment(-montoARevertir) });
                }

                // 3. Una vez revertido el saldo (si aplica), eliminamos el registro del ingreso
                t.delete(ingresoRef);
            });

            showGlobalFeedback('Ingreso eliminado y balance de cuenta actualizado.', 'success');
            loadIngresos();
            updateReports();
            loadFinancialData(); // <-- CLAVE: Recargamos la vista financiera para ver el cambio
            // ===== FIN DE LA MODIFICACIÓN =====

        } catch (error) {
            console.error("Error al eliminar ingreso:", error);
            showGlobalFeedback(error.message || 'No se pudo eliminar el ingreso.', 'error');
        }
    });
}
async function loadProviders() {
    s.providersListContainer.innerHTML = `<p class="dashboard-loader">Cargando proveedores...</p>`;
    
    // ===== INICIO DE LA MODIFICACIÓN =====
    // Preparamos los elementos del DOM para los nuevos KPIs
    const debtTotalEl = document.getElementById('kpi-provider-debt-total');
    const balanceTotalEl = document.getElementById('kpi-provider-balance-total');
    if (debtTotalEl) debtTotalEl.textContent = '...';
    if (balanceTotalEl) balanceTotalEl.textContent = '...';
    // ===== FIN DE LA MODIFICACIÓN =====

    try {
        const snapshot = await db.collection('proveedores').orderBy('nombre').get();
        if (snapshot.empty) {
            s.providersListContainer.innerHTML = `<p class="dashboard-loader">No hay proveedores creados. ¡Agrega el primero!</p>`;
            // Ponemos los contadores en cero si no hay proveedores
            if (debtTotalEl) debtTotalEl.textContent = formatearUSD(0);
            if (balanceTotalEl) balanceTotalEl.textContent = formatearUSD(0);
            return;
        }

        // ===== INICIO DE LA MODIFICACIÓN =====
        // 1. Inicializamos los contadores
        let totalDeuda = 0;
        let totalSaldoFavor = 0;
        
        const providers = snapshot.docs.map(doc => {
            const providerData = doc.data();
            const debt = providerData.deuda_usd || 0;

            // 2. Sumamos a la categoría correcta
            if (debt > 0) {
                totalDeuda += debt;
            } else if (debt < 0) {
                totalSaldoFavor += Math.abs(debt); // Sumamos el valor absoluto
            }
            
            return { id: doc.id, ...providerData };
        });

        // 3. Actualizamos el HTML con los totales calculados
        if (debtTotalEl) debtTotalEl.textContent = formatearUSD(totalDeuda);
        if (balanceTotalEl) balanceTotalEl.textContent = formatearUSD(totalSaldoFavor);
        // ===== FIN DE LA MODIFICACIÓN =====

        renderProviders(providers);

    } catch (error) {
        handleDBError(error, s.providersListContainer, "proveedores");
        if (debtTotalEl) debtTotalEl.textContent = 'Error';
        if (balanceTotalEl) balanceTotalEl.textContent = 'Error';
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function renderProviders(providers) {
    s.providersListContainer.innerHTML = providers.map(provider => {
        const debt = provider.deuda_usd || 0;
        const deleteTitle = debt !== 0 ? 'No se puede eliminar un proveedor con saldo o deuda pendiente' : 'Eliminar Proveedor';

        let statLabel = 'Deuda Pendiente';
        let statClass = 'debt';
        let statValueDisplay = formatearUSD(debt);
        let paymentButtonHtml = '';

        if (debt < 0) {
            statLabel = 'Saldo a Favor';
            statClass = 'zero'; 
            statValueDisplay = formatearUSD(Math.abs(debt));
            paymentButtonHtml = `
            <button class="pcm-action-btn btn-collect-balance" title="Cobrar el saldo a favor de este proveedor">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="m12 12 4 10 5-5-10-4z"/></svg>
                <span>Cobrar Saldo</span>
            </button>`;
        } else {
            statLabel = (debt > 0) ? 'Deuda Pendiente' : 'Deuda Pendiente';
            statClass = (debt > 0) ? 'debt' : 'zero';
            paymentButtonHtml = `
            <button class="pcm-action-btn btn-register-payment" title="Registrar un pago o abono">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <span>Registrar Pago</span>
            </button>`;
        }
        
        // ===== INICIO DE LA MODIFICACIÓN =====
        // Hemos eliminado la sección pcm-stats y movido el botón pcm-primary-action
        // directamente dentro de pcm-actions, al principio.
        return `
        <div class="provider-card-modern" data-provider-id="${provider.id}" data-debt-value="${debt}">
            
            <div class="pcm-header">
                <div class="pcm-info">
                    <h3>${provider.nombre}</h3>
                    <p>${provider.contacto || 'Sin contacto especificado'}</p>
                </div>
                <button class="pcm-delete-btn btn-delete-provider" title="${deleteTitle}" ${debt !== 0 ? 'disabled' : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>

            <div class="pcm-balance-display">
                <span class="stat-label">${statLabel}</span>
                <span class="stat-value ${statClass}">${statValueDisplay}</span>
            </div>

            <div class="pcm-actions">
                <button class="pcm-primary-action btn-batch-load">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span>Cargar Lote</span>
                </button>
                ${paymentButtonHtml}
                <button class="pcm-action-btn btn-view-batches" title="Ver el historial de lotes cargados">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>Ver Lotes</span>
                </button>
                <button class="pcm-action-btn btn-view-payments" title="Ver el historial de pagos realizados">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span>Ver Pagos</span>
                </button>
            </div>
        </div>`;
        // ===== FIN DE LA MODIFICACIÓN =====
    }).join('');
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function promptToAddProvider() {
    s.promptContainer.innerHTML = `
        <div class="ingreso-modal-box">
            <h3>Agregar Nuevo Proveedor</h3>
            <form id="provider-form" novalidate>
                <div class="form-group">
                    <input type="text" id="provider-name" name="nombre" required placeholder=" ">
                    <label for="provider-name">Nombre del Proveedor</label>
                </div>
                <div class="form-group">
                    <textarea id="provider-contact" name="contacto" rows="1" placeholder=" "></textarea>
                    <label for="provider-contact">Notas / Contacto (Opcional)</label>
                </div>

                <hr style="border-color:var(--border-dark);margin:1rem 0 2rem;">

                <div class="form-group">
                    <select id="provider-initial-balance-type" name="balance_type">
                        <option value="">Sin balance inicial</option>
                        <option value="deuda">Ingresa con Deuda</option>
                        <option value="favor">Ingresa con Saldo a Favor</option>
                    </select>
                    <label for="provider-initial-balance-type">Balance Inicial (Opcional)</label>
                </div>

                <div id="provider-initial-balance-amount-group" class="form-group hidden">
                    <input type="number" id="provider-initial-balance-amount" name="balance_amount" step="0.01" placeholder=" ">
                    <label for="provider-initial-balance-amount">Monto del Balance (USD)</label>
                </div>

                <div class="prompt-buttons" style="margin-top: 2rem;">
                    <button type="submit" class="prompt-button confirm spinner-btn">
                        <span class="btn-text">Guardar Proveedor</span>
                        <div class="spinner"></div>
                    </button>
                    <button type="button" class="prompt-button cancel">Cancelar</button>
                </div>
            </form>
        </div>`;

    const textarea = document.getElementById('provider-contact');
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }

    const balanceTypeSelect = document.getElementById('provider-initial-balance-type');
    const amountGroup = document.getElementById('provider-initial-balance-amount-group');
    const amountInput = document.getElementById('provider-initial-balance-amount');

    balanceTypeSelect.addEventListener('change', () => {
        if (balanceTypeSelect.value) {
            amountGroup.classList.remove('hidden');
            amountInput.required = true;
        } else {
            amountGroup.classList.add('hidden');
            amountInput.required = false;
        }
    });
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function saveProvider(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;

    const balanceType = form.balance_type.value;
    const balanceAmount = parseFloat(form.balance_amount.value) || 0;
    
    let initialDebt = 0;
    if (balanceType === 'deuda') {
        initialDebt = balanceAmount; // Se guarda como número positivo
    } else if (balanceType === 'favor') {
        initialDebt = -balanceAmount; // Se guarda como número negativo
    }

    const providerData = {
        nombre: form.nombre.value.trim(),
        contacto: form.contacto.value.trim(),
        deuda_usd: initialDebt, // Usamos el valor calculado
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
    s.promptContainer.innerHTML = `
        <div class="container container-sm">
            <div class="prompt-box">
                <h3>Paso 1: Identificar Lote</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">Ingresa un ID único para este lote de ${providerName}.</p>
                <form id="batch-id-form">
                    <div class="form-group">
                        <label for="batch-number">ID del Lote</label>
                        <input type="text" id="batch-number" name="batchNumber" required placeholder="Ej: LOTE-PROV-001">
                    </div>
                    <div class="prompt-buttons">
                        <button type="submit" class="prompt-button confirm">Siguiente</button>
                        <button type="button" class="prompt-button cancel">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>`;

    document.getElementById('batch-id-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const batchIdManual = e.target.batchNumber.value.trim();
        if (!batchIdManual) {
            showGlobalFeedback("El ID del lote no puede estar vacío.", "error");
            return;
        }
        // Iniciamos el contexto de carga de lote
        batchLoadContext = {
            providerId,
            providerName,
            batchIdManual,
            modelosCargados: {},
            // Propiedades añadidas para el nuevo flujo
            itemsCargados: [], 
            totalCostoAcumulado: 0 
        };
        // Pasamos al siguiente paso
        showModelSelectionStep();
    });
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU ARCHIVO SCRIPT.JS

function showModelSelectionStep() {
    const modelosHtml = modelos.map(modelo => {
        // Mantenemos el contador para saber cuántos equipos se han cargado
        const equiposCargados = batchLoadContext.modelosCargados[modelo]?.length || 0;
        const countBadge = equiposCargados > 0 ? `<span class="notification-badge" style="position: static; transform: translateX(5px); background-color: var(--success-bg);">${equiposCargados}</span>` : '';

        // === INICIO DE LA CORRECCIÓN ===
        // Se eliminó la lógica que añadía 'disabled' y 'checked'.
        // El input ahora es siempre un checkbox simple y sin marcar.
        return `
            <div class="checkbox-group">
                <input type="checkbox" id="modelo-${modelo.replace(/\s+/g, '-')}" value="${modelo}">
                <label for="modelo-${modelo.replace(/\s+/g, '-')}">${modelo}</label>
                ${countBadge}
            </div>
        `;
        // === FIN DE LA CORRECCIÓN ===
    }).join('');

    s.promptContainer.innerHTML = `
        <div class="container container-sm">
            <div class="prompt-box">
                <h3>Paso 2: Cargar Equipos por Modelo</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Lote: <strong>${batchLoadContext.batchIdManual}</strong></p>
                <div id="modelos-list-container" style="max-height: 300px; overflow-y: auto; padding: 5px; border: 1px solid var(--border-dark); border-radius: 8px; margin-bottom: 1rem;">
                    ${modelosHtml}
                </div>
                <div class="prompt-buttons">
                    <button id="btn-finalize-lote" class="prompt-button confirm">Finalizar Lote y Asignar Costo</button>
                    <button id="btn-cancel-lote" class="prompt-button cancel">Cancelar Lote</button>
                </div>
            </div>
        </div>`;

    // === INICIO DE LA CORRECCIÓN ===
    // Se modifica el listener para que cada clic sea una acción, sin importar el estado 'checked'
    document.querySelectorAll('#modelos-list-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            // Prevenimos el comportamiento por defecto del checkbox (marcar/desmarcar)
            e.preventDefault(); 
            
            // Siempre ejecutamos la acción de ir a cargar el modelo seleccionado
            const modeloSeleccionado = e.target.value;
            batchLoadContext.currentModel = modeloSeleccionado;
            switchView('management', s.tabManagement);
            s.promptContainer.innerHTML = ''; 
        });
    });
    // === FIN DE LA CORRECCIÓN ===

    document.getElementById('btn-finalize-lote').addEventListener('click', promptToAssignLoteCost);
    
    document.getElementById('btn-cancel-lote').addEventListener('click', () => {
        showConfirmationModal('¿Cancelar Lote?', 'Se perderán todos los equipos cargados en este lote. ¿Estás seguro?', () => {
            batchLoadContext = null;
            s.promptContainer.innerHTML = '';
            switchView('providers', s.tabProviders);
        });
    });
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function promptToAssignLoteCost() {
    let totalEquiposCargados = batchLoadContext.itemsCargados.length;

    if (totalEquiposCargados === 0) {
        showGlobalFeedback("No has cargado ningún equipo en este lote.", "error");
        showModelSelectionStep();
        return;
    }

    let saldoAFavor = 0;
    let deudaFinalEstimada = batchLoadContext.totalCostoAcumulado;
    let saldoHtml = '';

    try {
        const providerDoc = await db.collection('proveedores').doc(batchLoadContext.providerId).get();
        if (providerDoc.exists) {
            const saldoActual = providerDoc.data().deuda_usd || 0;
            if (saldoActual < 0) {
                saldoAFavor = Math.abs(saldoActual);
                deudaFinalEstimada = batchLoadContext.totalCostoAcumulado - saldoAFavor;

                saldoHtml = `
                <div class="details-box" style="margin-top: 1rem; border-color: var(--success-bg);">
                    <div class="detail-item">
                        <span>Saldo a Favor disponible:</span>
                        <strong style="color: var(--success-bg);">${formatearUSD(saldoAFavor)}</strong>
                    </div>
                    <div class="checkbox-group" style="justify-content: center; padding-top: 10px;">
                        <input type="checkbox" id="usar-saldo-favor" name="usar_saldo" checked>
                        <label for="usar-saldo-favor">Usar saldo para este lote</label>
                    </div>
                </div>`;
            }
        }
    } catch (error) {
        console.error("Error al obtener saldo del proveedor:", error);
        showGlobalFeedback("No se pudo obtener el saldo del proveedor.", "error");
    }

    const itemsDetailHtml = batchLoadContext.itemsCargados.map(item => `
        <div class="detail-item">
            <span>${item.modelo} ${item.color} ${item.almacenamiento}</span>
            <strong>${formatearUSD(item.precio_costo_usd)}</strong>
        </div>
    `).join('');

    s.promptContainer.innerHTML = `
        <div class="container container-sm">
            <div class="prompt-box">
                <h3>Finalizar y Confirmar Lote</h3>
                <p style="color: var(--text-muted); text-align: center;">Lote: <strong>${batchLoadContext.batchIdManual}</strong> para <strong>${batchLoadContext.providerName}</strong></p>
                <div class="details-box" style="margin-top: 1.5rem; text-align: center; background-color: #1e1e1e;">
                     <div class="detail-item" style="flex-direction: column;">
                        <span style="font-size: 1rem; color: var(--text-muted);">Costo Total del Lote</span>
                        <strong style="font-size: 2.2rem; color: var(--brand-yellow);">${formatearUSD(batchLoadContext.totalCostoAcumulado)}</strong>
                    </div>
                     <div class="detail-item">
                        <span>Total de Equipos:</span>
                        <strong>${totalEquiposCargados}</strong>
                    </div>
                </div>

                ${saldoHtml}

                <div class="details-box" style="margin-top: 1rem; border-color: var(--brand-yellow);">
                     <div class="detail-item" style="flex-direction: column;">
                        <span style="font-size: 1rem; color: var(--text-muted);">Deuda a Generar (Estimada)</span>
                        <strong id="deuda-final-display" style="font-size: 2.2rem; color: ${deudaFinalEstimada >= 0 ? 'var(--error-bg)' : 'var(--success-bg)'};">
                            ${formatearUSD(deudaFinalEstimada)}
                        </strong>
                    </div>
                </div>

                <h4 style="margin-top: 2rem; text-align: center; color: var(--text-muted);">Resumen de Equipos Cargados</h4>
                <div class="details-box" style="max-height: 200px; overflow-y: auto; padding: 1rem;">
                    ${itemsDetailHtml || '<p>No hay equipos en este lote.</p>'}
                </div>
                <div class="prompt-buttons" style="margin-top: 2rem;">
                    <button id="btn-save-batch-final" class="prompt-button confirm spinner-btn">
                        <span class="btn-text">Confirmar y Guardar Lote</span>
                        <div class="spinner"></div>
                    </button>
                    <button id="btn-back-to-models" class="prompt-button cancel" style="background-color: #555;">Volver y Cargar Más</button>
                </div>
            </div>
        </div>`;
    
    const usarSaldoCheckbox = document.getElementById('usar-saldo-favor');
    if (usarSaldoCheckbox) {
        usarSaldoCheckbox.addEventListener('change', () => {
            const deudaDisplay = document.getElementById('deuda-final-display');
            if (usarSaldoCheckbox.checked) {
                const nuevaDeuda = batchLoadContext.totalCostoAcumulado - saldoAFavor;
                deudaDisplay.textContent = formatearUSD(nuevaDeuda);
                deudaDisplay.style.color = nuevaDeuda >= 0 ? 'var(--error-bg)' : 'var(--success-bg)';
            } else {
                deudaDisplay.textContent = formatearUSD(batchLoadContext.totalCostoAcumulado);
                deudaDisplay.style.color = 'var(--error-bg)';
            }
        });
    }

    document.getElementById('btn-back-to-models').addEventListener('click', () => {
        showModelSelectionStep();
    });

    document.getElementById('btn-save-batch-final').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        toggleSpinner(btn, true);

        const costoTotalUSD = batchLoadContext.totalCostoAcumulado;
        const usarSaldo = usarSaldoCheckbox ? usarSaldoCheckbox.checked : false;
        
        let creditoAplicadoReal = 0;

        try {
            const loteRef = db.collection('lotes').doc();
            
            await db.runTransaction(async t => {
                const providerRef = db.collection('proveedores').doc(batchLoadContext.providerId);
                
                if (usarSaldo && saldoAFavor > 0) {
                    const providerDoc = await t.get(providerRef);
                    const saldoActual = providerDoc.data().deuda_usd || 0;
                    if (saldoActual < 0) {
                        creditoAplicadoReal = Math.min(costoTotalUSD, Math.abs(saldoActual));
                    }
                }
                
                t.update(providerRef, { deuda_usd: firebase.firestore.FieldValue.increment(costoTotalUSD) });

                const imeisTotales = batchLoadContext.itemsCargados.map(item => item.imei);
                t.set(loteRef, {
                    numero_lote: batchLoadContext.batchIdManual,
                    proveedorId: batchLoadContext.providerId,
                    proveedorNombre: batchLoadContext.providerName,
                    costo_total_usd: costoTotalUSD,
                    fecha_carga: firebase.firestore.FieldValue.serverTimestamp(),
                    imeis: imeisTotales,
                    detalle_modelos: batchLoadContext.modelosCargados,
                    saldo_favor_aplicado: creditoAplicadoReal
                });
            });

            showGlobalFeedback("Lote completo guardado con éxito.", "success");
            s.promptContainer.innerHTML = '';
            batchLoadContext = null;
            switchView('providers', s.tabProviders);
            loadProviders();
            loadStock();

        } catch (error) {
            console.error("Error al guardar el lote completo:", error);
            showGlobalFeedback("Error al guardar el lote. Revisa la consola.", "error");
        } finally {
            toggleSpinner(btn, false);
        }
    });
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
        switchView('management', s.tabManagement);

    } catch (error) {
        console.error("Error al iniciar la carga de lote:", error);
        showGlobalFeedback('Error al iniciar la carga de lote', 'error');
    }
}

async function promptToRegisterPayment(providerName, currentDebt) {
    paymentContext = { id: paymentContext.id, name: providerName };

    if (!financialAccounts || financialAccounts.length === 0) {
        try {
            const accountsSnapshot = await db.collection('cuentas_financieras').orderBy('nombre').get();
            financialAccounts = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) { showGlobalFeedback("Error al cargar las cuentas financieras.", "error"); return; }
    }
    
    const lotesSnapshot = await db.collection('lotes').where('proveedorId', '==', paymentContext.id).orderBy('fecha_carga', 'desc').get();
    
    const lotesOptions = lotesSnapshot.docs.map(doc => {
        const lote = doc.data();
        let loteDescripcion = lote.modelo || (lote.detalle_modelos ? `Múltiples (${Object.keys(lote.detalle_modelos).join(', ')})` : 'Sin detalle');
        return `<option value="${lote.numero_lote}">${lote.numero_lote} (${loteDescripcion})</option>`;
    }).join('');

    const accountsArsOptionsHtml = financialAccounts.filter(acc => acc.moneda === 'ARS').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre} (${formatearARS(acc.saldo_actual_ars)})</option>`).join('');
    const accountsUsdOptionsHtml = financialAccounts.filter(acc => acc.moneda === 'USD').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre} (${formatearUSD(acc.saldo_actual_usd)})</option>`).join('');

    const pagoHtml = `
        <div class="form-group payment-details-group">
            <label>Método(s) de Pago</label>
            <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="pay-usd-efectivo" class="payment-method-cb"><span class="toggle-switch-label">Dólares (Efectivo)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="dolares" placeholder="Monto USD" step="0.01"></div></div>
            <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="pay-ars-efectivo" class="payment-method-cb"><span class="toggle-switch-label">Pesos (Efectivo)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="efectivo" placeholder="Monto ARS" step="0.01"></div></div>
            <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="pay-ars-transfer" class="payment-method-cb"><span class="toggle-switch-label">Transferencia (ARS)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="transferencia" placeholder="Monto ARS" step="0.01"><select name="cuenta_origen_ars">${accountsArsOptionsHtml}</select></div></div>
            <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="pay-usd-transfer" class="payment-method-cb"><span class="toggle-switch-label">Transferencia (USD)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="transferencia_usd" placeholder="Monto USD" step="0.01"><select name="cuenta_origen_usd">${accountsUsdOptionsHtml}</select></div></div>
        </div>
        <div id="cotizacion-dolar-group" class="form-group hidden"><label for="cotizacion_dolar">Cotización del Dólar (Opcional si el pago total es en ARS)</label><input type="number" id="cotizacion_dolar" name="cotizacion_dolar" placeholder="Valor del dólar blue" step="0.01"></div>
    `;

    s.promptContainer.innerHTML = `
        <div class="container container-sm"> <div class="prompt-box">
                <h3>Registrar Pago a ${providerName}</h3>
                <p>Deuda actual: <strong>${formatearUSD(currentDebt)}</strong></p>
                
                <!-- ===== CORRECCIÓN AQUÍ: SE AÑADIÓ id="payment-form" ===== -->
                <form id="payment-form">
                    <div class="form-group"><label for="payment-total">Monto Total del Pago (USD)</label><input type="number" id="payment-total" name="total" step="0.01" required></div>
                    <div class="form-group"><label for="lote-asociado">Asociar a Lote (Opcional)</label><select id="lote-asociado" name="loteAsociado"><option value="">Ninguno / Pago general</option>${lotesOptions}</select></div>
                    ${pagoHtml}
                    <div class="form-group"><label for="payment-notes">Notas (Opcional)</label><textarea id="payment-notes" name="notas" rows="2" placeholder="Ej: Pago parcial del Lote-123"></textarea></div>
                    <div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Registrar Pago</span><div class="spinner"></div></button><button type="button" class="prompt-button cancel">Cancelar</button></div>
                </form>

            </div> </div>`;
    
    const form = document.getElementById('payment-form');
    
    form.addEventListener('input', (e) => {
        if (e.target.id === 'payment-total') {
            const usdCheckbox = form.querySelector('[name="pay-usd-efectivo"]');
            if (usdCheckbox && usdCheckbox.checked) {
                form.querySelector('[name="dolares"]').value = e.target.value;
            }
        }
    });

    form.addEventListener('change', (e) => {
        if (e.target.matches('.payment-method-cb')) {
            const container = e.target.closest('.payment-option');
            const fieldsDiv = container.querySelector('.payment-input-container');
            if (fieldsDiv) {
                const isChecked = e.target.checked;
                fieldsDiv.classList.toggle('hidden', !isChecked);
                const input = fieldsDiv.querySelector('input');
                const select = fieldsDiv.querySelector('select');
                if(input) input.required = isChecked;
                if(select) select.required = isChecked;
            }
            
            const cotizacionGroup = document.getElementById('cotizacion-dolar-group');
            const pagoEnPesos = form.querySelector('[name="pay-ars-efectivo"]').checked || form.querySelector('[name="pay-ars-transfer"]').checked;
            cotizacionGroup.classList.toggle('hidden', !pagoEnPesos);
            
            if (e.target.name === 'pay-usd-efectivo' && e.target.checked) {
                document.getElementById('payment-total').dispatchEvent(new Event('input'));
            }
        }
    });
}

async function saveProviderPayment(form) {
    const btn = form.querySelector('button[type="submit"]');
    toggleSpinner(btn, true);
    
    const providerId = paymentContext.id;
    const providerName = paymentContext.name;
    const formData = new FormData(form);
    const totalPaymentUSD = parseFloat(formData.get('total'));
    const loteAsociado = formData.get('loteAsociado');
    const notas = (formData.get('notas') || '').trim();
    
    if (isNaN(totalPaymentUSD) || totalPaymentUSD <= 0) {
        showGlobalFeedback("El monto total del pago debe ser un número válido y mayor a cero.", "error");
        toggleSpinner(btn, false); return;
    }

    // ===== INICIO DE LA MODIFICACIÓN =====
    const usdAmountEfectivo = parseFloat(formData.get('dolares')) || 0;
    const arsEfectivoAmount = parseFloat(formData.get('efectivo')) || 0;
    const arsTransferAmount = parseFloat(formData.get('transferencia')) || 0;
    const usdTransferAmount = parseFloat(formData.get('transferencia_usd')) || 0;

    const cotizacion = parseFloat(formData.get('cotizacion_dolar')) || 0;
    
    if ((usdAmountEfectivo + arsEfectivoAmount + arsTransferAmount + usdTransferAmount) === 0) {
        showGlobalFeedback("Debes especificar al menos un método de pago con su monto.", "error");
        toggleSpinner(btn, false); return;
    }
    
    const cuentaOrigenArsValue = formData.get('cuenta_origen_ars');
    const cuentaOrigenUsdValue = formData.get('cuenta_origen_usd');
    if (arsTransferAmount > 0 && !cuentaOrigenArsValue) {
        showGlobalFeedback("Debes seleccionar una cuenta de origen para la transferencia en ARS.", "error");
        toggleSpinner(btn, false); return;
    }
    if (usdTransferAmount > 0 && !cuentaOrigenUsdValue) {
        showGlobalFeedback("Debes seleccionar una cuenta de origen para la transferencia en USD.", "error");
        toggleSpinner(btn, false); return;
    }
    // Si se paga en pesos, la cotización es necesaria para cuadrar el total en USD.
    const pagoEnPesos = arsEfectivoAmount > 0 || arsTransferAmount > 0;
    if (pagoEnPesos && cotizacion <= 0) {
        showGlobalFeedback("Debes ingresar una cotización válida para pagos en pesos.", "error");
        toggleSpinner(btn, false); return;
    }
    // ===== FIN DE LA MODIFICACIÓN =====
    
    try {
        await db.runTransaction(async t => {
            const fecha = firebase.firestore.FieldValue.serverTimestamp();
            const descripcionBase = `Pago a ${providerName}${loteAsociado ? ` (Lote: ${loteAsociado})` : ' (Pago General)'}`;
            const paymentRef = db.collection('pagos_proveedores').doc();
            const newPagoId = paymentRef.id;

            const gastosParaCaja = [];
            const pagosParaHistorial = [];
            
            if (usdAmountEfectivo > 0) {
                pagosParaHistorial.push({ monto: usdAmountEfectivo, moneda: 'USD (Efectivo)' });
                gastosParaCaja.push({ categoria: 'Pago a Proveedor', descripcion: descripcionBase, monto: usdAmountEfectivo, metodo_pago: 'Dólares', fecha, pagoId: newPagoId, providerId });
            }
            if (arsEfectivoAmount > 0) {
                pagosParaHistorial.push({ monto: arsEfectivoAmount, moneda: 'ARS (Efectivo)' });
                gastosParaCaja.push({ categoria: 'Pago a Proveedor', descripcion: descripcionBase, monto: arsEfectivoAmount, metodo_pago: 'Pesos (Efectivo)', fecha, pagoId: newPagoId, providerId, cotizacion_dolar: cotizacion });
            }
            if (arsTransferAmount > 0) {
                pagosParaHistorial.push({ monto: arsTransferAmount, moneda: 'ARS (Transferencia)' });
                const [id, nombre] = cuentaOrigenArsValue.split('|');
                gastosParaCaja.push({ categoria: 'Pago a Proveedor', descripcion: descripcionBase, monto: arsTransferAmount, metodo_pago: 'Pesos (Transferencia)', fecha, pagoId: newPagoId, providerId, cuenta_origen_id: id, cuenta_origen_nombre: nombre, cotizacion_dolar: cotizacion });
                const cuentaRef = db.collection('cuentas_financieras').doc(id);
                t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(-arsTransferAmount) });
            }
            if (usdTransferAmount > 0) {
                pagosParaHistorial.push({ monto: usdTransferAmount, moneda: 'USD (Transferencia)' });
                const [id, nombre] = cuentaOrigenUsdValue.split('|');
                // El gasto se registra en USD, sin cotización.
                gastosParaCaja.push({ categoria: 'Pago a Proveedor', descripcion: descripcionBase, monto: usdTransferAmount, metodo_pago: 'Dólares (Transferencia)', fecha, pagoId: newPagoId, providerId, cuenta_origen_id: id, cuenta_origen_nombre: nombre });
                const cuentaRef = db.collection('cuentas_financieras').doc(id);
                t.update(cuentaRef, { saldo_actual_usd: firebase.firestore.FieldValue.increment(-usdTransferAmount) });
            }

            t.set(paymentRef, { providerId, proveedorNombre: providerName, monto_total_usd: totalPaymentUSD, lote_asociado: loteAsociado || null, detalle_pago: pagosParaHistorial, fecha, notas, cotizacion_dolar: cotizacion || null });
            gastosParaCaja.forEach(gasto => { const gastoRef = db.collection('gastos').doc(); t.set(gastoRef, gasto); });
            const providerRef = db.collection('proveedores').doc(providerId);
            t.update(providerRef, { deuda_usd: firebase.firestore.FieldValue.increment(-totalPaymentUSD) });
        });
        
        showGlobalFeedback('Pago a proveedor registrado y descontado de caja.', 'success');
        s.promptContainer.innerHTML = '';
        loadProviders();
        updateReports();
        loadFinancialData();

    } catch (error) {
        console.error("Error al registrar el pago:", error);
        showGlobalFeedback('Error al registrar el pago.', 'error');
    } finally {
        toggleSpinner(btn, false);
        paymentContext = null;
    }
}

async function revertProviderPayment(gastoId, pagoId, kpiType, period) {
    try {
        await db.runTransaction(async t => {
            // --- FASE 1: LEER TODOS LOS DATOS PRIMERO ---
            // Preparamos las referencias a los documentos que podríamos necesitar.
            const gastoRef = db.collection('gastos').doc(gastoId);
            let pagoRef, providerRef;
            let pagoData = null;
            let providerExists = false;

            if (pagoId) {
                pagoRef = db.collection('pagos_proveedores').doc(pagoId);
                const pagoDoc = await t.get(pagoRef); // Primera lectura

                if (pagoDoc.exists) {
                    pagoData = pagoDoc.data();
                    providerRef = db.collection('proveedores').doc(pagoData.providerId);
                    const providerDoc = await t.get(providerRef); // Segunda lectura
                    providerExists = providerDoc.exists;
                }
            }

            // --- FASE 2: EJECUTAR TODAS LAS ESCRITURAS DESPUÉS ---
            // Ahora que todas las lecturas terminaron, podemos escribir.

            // 1. Siempre eliminamos el registro de gasto.
            t.delete(gastoRef);

            // 2. Si encontramos el registro de pago, lo procesamos.
            if (pagoData) {
                // Si el proveedor todavía existe, le devolvemos la deuda.
                if (providerExists) {
                    t.update(providerRef, {
                        deuda_usd: firebase.firestore.FieldValue.increment(pagoData.monto_total_usd)
                    });
                } else {
                    console.warn(`Proveedor con ID ${pagoData.providerId} no encontrado. No se puede restaurar la deuda.`);
                }
                // Eliminamos el registro de pago.
                t.delete(pagoRef);
            }
        });
        
        showGlobalFeedback("Pago a proveedor revertido/eliminado con éxito.", "success");
        updateReports();
        loadProviders();
        showKpiDetail(kpiType, period);

    } catch (error) {
        console.error("Error al revertir el pago a proveedor:", error);
        showGlobalFeedback(error.message || "Error al revertir el pago.", "error");
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
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
            .where('providerId', '==', providerId)
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
                    ${pagos.map(pago => {
                        // --- INICIO DE LA MODIFICACIÓN ---
                        // Añadimos la cotización al detalle si existe
                        const detallePago = pago.detalle_pago.map(d => `${d.moneda === 'USD' ? formatearUSD(d.monto) : formatearARS(d.monto)}`).join(' + ');
                        const cotizacionInfo = pago.cotizacion_dolar ? `<br><small class="time-muted">CT: ${formatearARS(pago.cotizacion_dolar)}</small>` : '';
                        // --- FIN DE LA MODIFICACIÓN ---
                        return `
                        <tr>
                            <td>${pago.fecha.toDate().toLocaleString('es-AR')}</td>
                            <td>${formatearUSD(pago.monto_total_usd)}</td>
                            <td>${pago.lote_asociado || 'N/A'}</td>
                            <td>${detallePago}${cotizacionInfo}</td>
                            <td>${pago.notas || ''}</td>
                        </tr>`
                    }).join('')}
                </tbody>
            </table>`;
        contentDiv.innerHTML = tableHTML;

    } catch(error) {
        handleDBError(error, contentDiv, 'historial de pagos');
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function showBatchHistory(providerId, providerName) {
    s.promptContainer.innerHTML = `
    <div class="container batch-history-modal">
        <h3>Historial de Lotes de ${providerName}</h3>
        <div id="batch-list-container">
            <p class="dashboard-loader">Cargando historial...</p>
        </div>
        <div id="batch-detail-container">
            <h4>Selecciona un lote para ver el detalle</h4>
        </div>
        <div class="prompt-buttons" style="justify-content: flex-end; margin-top: 1.5rem;">
            <button class="prompt-button cancel" style="width: auto; flex: 0 1 120px;">Cerrar</button>
        </div>
    </div>`;

    const batchListContainer = document.getElementById('batch-list-container');
    try {
        const lotesPromise = db.collection('lotes')
            .where('proveedorId', '==', providerId)
            .orderBy('fecha_carga', 'desc')
            .get();
        
        const pagosPromise = db.collection('pagos_proveedores')
            .where('providerId', '==', providerId)
            .get();

        const [lotesSnapshot, pagosSnapshot] = await Promise.all([lotesPromise, pagosPromise]);
        
        if (lotesSnapshot.empty) {
            batchListContainer.innerHTML = '<p class="dashboard-loader">Este proveedor no tiene lotes registrados.</p>';
            return;
        }

        const pagosPorLote = {};
        pagosSnapshot.forEach(doc => {
            const pago = doc.data();
            if (pago.lote_asociado) {
                pagosPorLote[pago.lote_asociado] = (pagosPorLote[pago.lote_asociado] || 0) + pago.monto_total_usd;
            }
        });

        const lotes = lotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        batchListContainer.innerHTML = lotes.map(lote => {
            const costoTotal = lote.costo_total_usd || 0;

            // ===== INICIO DE LA CORRECCIÓN CLAVE =====
            // Ahora, el "total pagado" considera tanto los pagos directos como el saldo a favor que se aplicó.
            const totalPagado = (pagosPorLote[lote.numero_lote] || 0) + (lote.saldo_favor_aplicado || 0);
            // ===== FIN DE LA CORRECCIÓN CLAVE =====
            
            let statusHtml = '';
            let restanteHtml = '';

            if (costoTotal > 0) {
                const restante = costoTotal - totalPagado;
                if (restante <= 0.01) {
                    statusHtml = `<div class="lote-status pagado">✓ Pagado</div>`;
                    restanteHtml = `<small class="time-muted" style="color: var(--success-bg); font-weight: 500;">Completo</small>`;
                } else if (totalPagado > 0) {
                    const porcentaje = Math.round((totalPagado / costoTotal) * 100);
                    statusHtml = `<div class="lote-status parcial">${porcentaje}% Pagado</div>`;
                    restanteHtml = `<small class="time-muted" style="color: var(--error-bg); font-weight: 500;">Faltan ${formatearUSD(restante)}</small>`;
                } else {
                    statusHtml = `<div class="lote-status pendiente">Pendiente</div>`;
                    restanteHtml = `<small class="time-muted" style="color: var(--error-bg); font-weight: 500;">Faltan ${formatearUSD(restante)}</small>`;
                }
            }

            return `
            <div class="batch-list-item" data-batch-id="${lote.id}">
                <div class="list-item-content" style="flex-grow: 1; display: flex; justify-content: space-between; align-items: center;">
                    <div class="batch-info">
                        Lote #${lote.numero_lote} <span>(${new Date(lote.fecha_carga.seconds * 1000).toLocaleDateString('es-AR')})</span>
                        ${statusHtml}
                    </div>
                    <div class="batch-cost" style="display: flex; flex-direction: column; align-items: flex-end;">
                        ${formatearUSD(lote.costo_total_usd)}
                        ${restanteHtml}
                    </div>
                </div>
                <button class="delete-icon-btn btn-delete-batch" title="Eliminar Lote">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `}).join('');

        batchListContainer.querySelectorAll('.list-item-content').forEach(itemContent => {
            itemContent.addEventListener('click', async (e) => {
                const parentItem = e.currentTarget.closest('.batch-list-item');
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
                deleteBatch(loteData.id, loteData.numero_lote, providerId, providerName, loteData.costo_total_usd);
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

// REEMPLAZA ESTA FUNCIÓN

function deleteBatch(batchId, batchNumber, providerId, providerName, batchCost) {
    const message = `¿Estás seguro de que quieres eliminar el Lote #${batchNumber}?\n\nEsta acción hará lo siguiente:\n- Se eliminará el registro del lote.\n- Se restaurará la deuda de ${formatearUSD(batchCost)} al proveedor.\n- ¡NO se eliminarán los equipos ya cargados al stock!`;
    
    showConfirmationModal('Confirmar Eliminación de Lote', message, async () => {
        try {
            await db.runTransaction(async t => {
                const loteRef = db.collection('lotes').doc(batchId);
                const providerRef = db.collection('proveedores').doc(providerId);

                // Restaurar la deuda al proveedor
                t.update(providerRef, {
                    deuda_usd: firebase.firestore.FieldValue.increment(batchCost)
                });
                // Eliminar el lote
                t.delete(loteRef);
            });
            
            showGlobalFeedback(`Lote #${batchNumber} eliminado y deuda restaurada.`, 'success');
            s.promptContainer.innerHTML = ''; // Cierra el modal actual
            loadProviders(); // Recarga la lista de proveedores para ver la deuda actualizada
            updateReports(); // Actualiza los informes

        } catch (error) {
            console.error("Error al eliminar el lote:", error);
            showGlobalFeedback('No se pudo eliminar el lote.', 'error');
        }
    });
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function showKpiDetail(kpiType, period) {
    const now = new Date();
    let startDate, endDate, title = '';

    if (period === 'dia') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        title = `Detalle de Caja del Día - ${kpiType.replace(/_/g, ' ').toUpperCase()}`;
    } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        title = `Detalle de Caja del Mes - ${kpiType.replace(/_/g, ' ').toUpperCase()}`;
    }

    s.promptContainer.innerHTML = `<div class="container kpi-detail-modal"><h3>${title}</h3><div id="kpi-detail-content"><p class="dashboard-loader">Cargando transacciones...</p></div><div class="prompt-buttons" style="justify-content: center;"><button class="prompt-button cancel">Cerrar</button></div></div>`;
    const detailContent = document.getElementById('kpi-detail-content');

    try {
        const transactions = [];
        const kpiMoneda = kpiType.includes('dolares') || kpiType.includes('usd') ? 'USD' : 'ARS';
        
        const promises = [
            db.collection('ventas').where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).get(),
            db.collection('ingresos_caja').where('fecha', '>=', startDate).where('fecha', '<=', endDate).get(),
            db.collection('gastos').where('fecha', '>=', startDate).where('fecha', '<=', endDate).get(),
            db.collection('ventas_mayoristas').where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).get(),
            db.collection('movimientos_internos').where('fecha', '>=', startDate).where('fecha', '<=', endDate).get()
        ];
        
        const [salesSnap, miscIncomesSnap, expensesSnap, wholesaleSalesSnap, internalMovesSnap] = await Promise.all(promises);
        
        const addTransaction = (data) => { if (data.monto && data.monto > 0) transactions.push(data); };

        salesSnap.forEach(doc => { const venta = doc.data(); if (kpiType === 'efectivo_ars') addTransaction({ id: doc.id, fecha: venta.fecha_venta.toDate(), tipo: 'Ingreso', concepto: `Venta: ${venta.producto.modelo}`, monto: venta.monto_efectivo, moneda: kpiMoneda, data: venta, collection: 'ventas' }); if (kpiType === 'transferencia_ars') addTransaction({ id: doc.id, fecha: venta.fecha_venta.toDate(), tipo: 'Ingreso', concepto: `Venta: ${venta.producto.modelo}`, monto: venta.monto_transferencia, moneda: kpiMoneda, data: venta, collection: 'ventas' }); if (kpiType === 'dolares') addTransaction({ id: doc.id, fecha: venta.fecha_venta.toDate(), tipo: 'Ingreso', concepto: `Venta: ${venta.producto.modelo}`, monto: venta.monto_dolares, moneda: kpiMoneda, data: venta, collection: 'ventas' }); if (kpiType === 'transferencia_usd') addTransaction({ id: doc.id, fecha: venta.fecha_venta.toDate(), tipo: 'Ingreso', concepto: `Venta: ${venta.producto.modelo}`, monto: venta.monto_transferencia_usd, moneda: kpiMoneda, data: venta, collection: 'ventas' }); });
        miscIncomesSnap.forEach(doc => { const ingreso = doc.data(); if ((kpiType === 'efectivo_ars' && ingreso.metodo === 'Pesos (Efectivo)') || (kpiType === 'transferencia_ars' && ingreso.metodo === 'Pesos (Transferencia)') || (kpiType === 'dolares' && ingreso.metodo === 'Dólares') || (kpiType === 'transferencia_usd' && ingreso.metodo === 'Dólares (Transferencia)')) { addTransaction({ id: doc.id, fecha: ingreso.fecha.toDate(), tipo: 'Ingreso', concepto: `Ingreso: ${ingreso.categoria}`, monto: ingreso.monto, moneda: kpiMoneda, data: ingreso, collection: 'ingresos_caja' }); } });
        wholesaleSalesSnap.forEach(doc => { 
            const sale = doc.data();
            const payment = sale.pago_recibido || {}; 
            const concepto = `Cobranza Mayorista: ${sale.venta_id_manual}`;
            if (kpiType === 'efectivo_ars') addTransaction({ id: doc.id, fecha: sale.fecha_venta.toDate(), tipo: 'Ingreso', concepto, monto: payment.ars_efectivo, moneda: kpiMoneda, data: sale, collection: 'ventas_mayoristas' });
            if (kpiType === 'transferencia_ars') addTransaction({ id: doc.id, fecha: sale.fecha_venta.toDate(), tipo: 'Ingreso', concepto, monto: payment.ars_transferencia, moneda: kpiMoneda, data: sale, collection: 'ventas_mayoristas' });
            if (kpiType === 'dolares') addTransaction({ id: doc.id, fecha: sale.fecha_venta.toDate(), tipo: 'Ingreso', concepto, monto: payment.usd, moneda: kpiMoneda, data: sale, collection: 'ventas_mayoristas' });
            if (kpiType === 'transferencia_usd') addTransaction({ id: doc.id, fecha: sale.fecha_venta.toDate(), tipo: 'Ingreso', concepto, monto: payment.usd_transferencia, moneda: kpiMoneda, data: sale, collection: 'ventas_mayoristas' });
        });
        expensesSnap.forEach(doc => { 
            const gasto = doc.data();
            const concepto = `Gasto: ${gasto.descripcion || gasto.categoria}`;
            if ((kpiType === 'efectivo_ars' && gasto.metodo_pago === 'Pesos (Efectivo)') || (kpiType === 'transferencia_ars' && gasto.metodo_pago === 'Pesos (Transferencia)') || (kpiType === 'dolares' && gasto.metodo_pago === 'Dólares') || (kpiType === 'transferencia_usd' && gasto.metodo_pago === 'Dólares (Transferencia)')) {
                addTransaction({ id: doc.id, fecha: gasto.fecha.toDate(), tipo: 'Egreso', concepto: concepto, monto: gasto.monto, moneda: kpiMoneda, data: gasto, collection: 'gastos' });
            }
        });
        internalMovesSnap.forEach(doc => {
            const move = doc.data();
            if (kpiType === 'transferencia_ars' && move.cuenta_origen_id) {
                let conceptoEgreso = '';
                if (move.tipo === 'Retiro a Caja') conceptoEgreso = `Retiro a Caja (Efectivo)`;
                if (move.tipo === 'Retiro a Caja (USD)') conceptoEgreso = `Retiro a Caja (Dólares)`;
                if (move.tipo === 'Transferencia entre Cuentas') conceptoEgreso = `Enviado a: ${move.cuenta_destino_nombre}`;
                if (conceptoEgreso) addTransaction({ id: doc.id, fecha: move.fecha.toDate(), tipo: 'Egreso', concepto: conceptoEgreso, monto: move.monto_ars, moneda: 'ARS', data: move, collection: 'movimientos_internos' });
            }
            if (kpiType === 'efectivo_ars' && move.tipo === 'Retiro a Caja') {
                 addTransaction({ id: doc.id, fecha: move.fecha.toDate(), tipo: 'Ingreso', concepto: `Ingreso desde Cta. ${move.cuenta_origen_nombre}`, monto: move.monto_ars, moneda: 'ARS', data: move, collection: 'movimientos_internos' });
            }
        });
        
        transactions.sort((a, b) => b.fecha - a.fecha);

        if (transactions.length === 0) {
            detailContent.innerHTML = `<p class="dashboard-loader">No hay movimientos para este período.</p>`;
            return;
        }

        const tableHTML = `
            <div class="table-container"><table><thead><tr><th>Fecha</th><th>Tipo</th><th>Concepto</th><th>Monto</th><th>Acciones</th></tr></thead>
            <tbody>${transactions.map(t => {
                const deleteButtonHtml = t.collection !== 'movimientos_internos' ? `<button class="delete-btn btn-delete-kpi-item" title="Eliminar/Revertir"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>` : '';
                return `<tr data-id="${t.id}" data-type="${t.tipo}" data-collection="${t.collection}" data-item='${JSON.stringify(t.data).replace(/'/g, "\\'")}'>
                    <td data-label="Fecha">${t.fecha.toLocaleString('es-AR')}</td>
                    <td data-label="Tipo">${t.tipo}</td>
                    <td data-label="Concepto">${t.concepto}</td>
                    <td data-label="Monto" class="${t.tipo === 'Ingreso' ? 'income' : 'outcome'}">${t.tipo === 'Egreso' ? '-' : ''}${t.moneda === 'USD' ? formatearUSD(t.monto) : formatearARS(t.monto)}</td>
                    <td data-label="Acciones" class="actions-cell">${deleteButtonHtml}</td></tr>`;
            }).join('')}</tbody></table></div>`;
        detailContent.innerHTML = tableHTML;

        // ===================== INICIO DE LA MODIFICACIÓN =====================
        // Se actualiza el listener del botón de eliminar para que sea más inteligente.
        detailContent.querySelectorAll('.btn-delete-kpi-item').forEach(btn => btn.addEventListener('click', (e) => {
            const row = e.currentTarget.closest('tr');
            const id = row.dataset.id;
            const collection = row.dataset.collection;
            const data = JSON.parse(row.dataset.item.replace(/\\'/g, "'"));
            
            // Si es una operación de cambio de moneda, llama a la nueva función
            if (data.categoria === 'Cambio de Moneda' && data.exchangeId) {
                deleteCurrencyExchangeTransaction(data, kpiType, period);
            } 
            // Si no, sigue con la lógica anterior
            else if (collection === 'ventas') {
                handleSaleDeletion(id, data);
            } else if (collection === 'ingresos_caja' || collection === 'gastos') {
                const type = collection === 'gastos' ? 'Gasto' : 'Ingreso';
                showConfirmationModal(`Eliminar ${type}`, `¿Seguro que quieres eliminar este movimiento?`, () => deleteSimpleTransaction(id, collection, kpiType, period));
            }
        }));
        // ====================== FIN DE LA MODIFICACIÓN =======================

    } catch (error) {
        handleDBError(error, detailContent, `el detalle de ${kpiType}`);
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function showProfitDetail(period) {
    const now = new Date();
    let startDate, endDate, title;

    if (period === 'dia') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        title = 'Detalle de Ganancias del Día';
    } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        title = 'Detalle de Ganancias del Mes';
    }

    s.promptContainer.innerHTML = `<div class="container kpi-detail-modal"><h3>${title}</h3><div id="kpi-profit-detail-content" class="table-container"><p class="dashboard-loader">Cargando detalle de ganancias...</p></div><div class="prompt-buttons" style="justify-content: center;"><button class="prompt-button cancel">Cerrar</button></div></div>`;
    const detailContent = document.getElementById('kpi-profit-detail-content');

    try {
        const salesQuery = db.collection('ventas').where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate);
        const salesSnapshot = await salesQuery.get();
        if (salesSnapshot.empty) {
            detailContent.innerHTML = `<p class="dashboard-loader">No hay ventas con ganancias en este período.</p>`;
            return;
        }

        const costPromises = salesSnapshot.docs.map(saleDoc => db.collection("stock_individual").doc(saleDoc.data().imei_vendido).get());
        const costDocs = await Promise.all(costPromises);
        const costMap = new Map(costDocs.map(doc => [doc.id, doc.data()?.precio_costo_usd || 0]));

        // ===================== INICIO DE LA MODIFICACIÓN =====================
        // Añadimos el atributo 'data-label' a cada celda (<td>)
        let tableHTML = `<table><thead><tr><th>Producto</th><th>Precio Venta</th><th>Costo Producto</th><th>Comisión</th><th>Ganancia Neta</th></tr></thead><tbody>`;
        salesSnapshot.forEach(doc => {
            const venta = doc.data();
            const precioVenta = venta.precio_venta_usd || 0;
            const costoProducto = costMap.get(venta.imei_vendido) || 0;
            const comision = venta.comision_vendedor_usd || 0;
            const ganancia = precioVenta - costoProducto - comision;

            tableHTML += `<tr>
                    <td data-label="Producto">${venta.producto.modelo || 'Producto Desc.'}</td>
                    <td data-label="Precio Venta" class="income">${formatearUSD(precioVenta)}</td>
                    <td data-label="Costo Producto" class="outcome">-${formatearUSD(costoProducto)}</td>
                    <td data-label="Comisión" class="outcome">-${formatearUSD(comision)}</td>
                    <td data-label="Ganancia Neta" style="font-weight:bold; color:var(--brand-yellow);">${formatearUSD(ganancia)}</td>
                </tr>`;
        });
        // ====================== FIN DE LA MODIFICACIÓN =======================
        tableHTML += '</tbody></table>';
        detailContent.innerHTML = tableHTML;

    } catch (error) {
        handleDBError(error, detailContent, `el detalle de ganancias`);
    }
}

async function deleteSimpleTransaction(id, collectionName, kpiType, period) {
    try {
        await db.collection(collectionName).doc(id).delete();
        showGlobalFeedback("Registro eliminado correctamente.", "success");
        updateReports();
        if (collectionName === 'gastos') loadGastos();
        if (collectionName === 'ingresos_caja') loadIngresos();
        showKpiDetail(kpiType, period);
    } catch (error) {
        console.error(`Error al eliminar registro de ${collectionName}:`, error);
        showGlobalFeedback("No se pudo eliminar el registro.", "error");
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


// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function loadCommissions() {
    s.commissionsResultsContainer.innerHTML = `<p class="dashboard-loader">Calculando comisiones...</p>`;
    
    try {
        // ===================== INICIO DE LA CORRECCIÓN CLAVE (1/2) =====================
        // Se elimina la referencia al filtro de vendedor que ya no existe.
        // La consulta ahora siempre busca a todos los vendedores.
        const vendorsToQuery = vendedores;
        // ====================== FIN DE LA CORRECCIÓN CLAVE =======================

        if (vendorsToQuery.length === 0) {
            s.commissionsResultsContainer.innerHTML = `<p class="dashboard-loader">No hay vendedores para mostrar.</p>`;
            return;
        }

        const vendorPromises = vendorsToQuery.map(name => db.collection('vendedores').doc(name).get());
        const vendorDocs = await Promise.all(vendorPromises);
        const vendorData = {};
        vendorDocs.forEach(doc => {
            if (doc.exists) {
                vendorData[doc.id] = { ...doc.data() };
            } else {
                vendorData[doc.id] = { nombre: doc.id, comision_pendiente_usd: 0 };
            }
        });

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        
        // ===================== INICIO DE LA CORRECCIÓN CLAVE (2/2) =====================
        // Se elimina el .where('comision_vendedor_usd', '>', 0) de la consulta inicial
        // para evitar el conflicto con el filtro de fecha que reportaba la consola.
        let salesQuery = db.collection("ventas");
        let adjustmentsQuery = db.collection("ajustes_comisiones");

        salesQuery = salesQuery.where('fecha_venta', '>=', startOfDay).where('fecha_venta', '<=', endOfDay);
        adjustmentsQuery = adjustmentsQuery.where('fecha', '>=', startOfDay).where('fecha', '<=', endOfDay);
        
        const [salesSnapshot, adjustmentsSnapshot] = await Promise.all([salesQuery.get(), adjustmentsQuery.get()]);

        const commissionEventsByVendor = {};

        // El filtro de comision > 0 se hace aquí, en el código, para que la consulta sea válida.
        salesSnapshot.docs.forEach(doc => {
            const sale = doc.data();
            if ((sale.comision_vendedor_usd || 0) > 0) {
                const vendorName = sale.vendedor;
                if (!commissionEventsByVendor[vendorName]) commissionEventsByVendor[vendorName] = [];
                commissionEventsByVendor[vendorName].push({
                    type: 'venta', date: sale.fecha_venta.toDate(),
                    description: `${sale.producto.modelo || 'Producto'} ${sale.producto.color || ''}`,
                    amount: sale.comision_vendedor_usd
                });
            }
        });
        // ====================== FIN DE LA CORRECCIÓN CLAVE =======================

        adjustmentsSnapshot.docs.forEach(doc => {
            const adjustment = doc.data();
            const vendorName = adjustment.vendedor;
            if (!commissionEventsByVendor[vendorName]) commissionEventsByVendor[vendorName] = [];
            commissionEventsByVendor[vendorName].push({
                type: 'ajuste', date: adjustment.fecha.toDate(),
                description: adjustment.motivo || 'Ajuste manual',
                amount: adjustment.monto_usd
            });
        });

        renderCommissions(vendorData, commissionEventsByVendor);

    } catch (error) {
        handleDBError(error, s.commissionsResultsContainer, "comisiones");
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA
function renderCommissions(vendorData, commissionEventsByVendor) {
    if (Object.keys(vendorData).length === 0) {
        s.commissionsResultsContainer.innerHTML = `<p class="dashboard-loader">No hay vendedores creados. ¡Crea el primero!</p>`;
        return;
    }

    const today = new Date().toISOString().slice(0, 10);
    let html = '';
    for (const vendorName in vendorData) {
        const vendor = vendorData[vendorName];
        const events = commissionEventsByVendor[vendorName] || [];
        
        events.sort((a, b) => b.date - a.date);

        const totalPendingAmount = vendor.comision_pendiente_usd || 0;
        
        const eventsListHtml = events.map(event => {
            if (event.type === 'ajuste') {
                return `<div class="commission-sale-item" style="border-left: 4px solid var(--info-bg);"><div class="commission-sale-main"><span class="commission-sale-product" style="font-style: italic;">Ajuste Manual: ${event.description}</span><span class="commission-sale-amount" style="color: var(--info-bg);">${formatearUSD(event.amount)}</span></div><span class="commission-sale-date">${event.date.toLocaleString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})} hs</span></div>`;
            }
            return `<div class="commission-sale-item"><div class="commission-sale-main"><span class="commission-sale-product">${event.description}</span><span class="commission-sale-amount">${formatearUSD(event.amount)}</span></div><span class="commission-sale-date">${event.date.toLocaleString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})} hs</span></div>`;
        }).join('');

        // ===================== INICIO DE LA MODIFICACIÓN =====================
        // Se añade el HTML de los filtros dentro de cada tarjeta.
        const filtersHtml = `
            <div class="commission-filters">
                <div class="filter-group">
                    <label>Desde</label>
                    <input type="date" class="commission-start-date" value="${today}">
                </div>
                <div class="filter-group">
                    <label>Hasta</label>
                    <input type="date" class="commission-end-date" value="${today}">
                </div>
                <div class="filter-group">
                    <button class="btn-filter-commission" data-vendor="${vendorName}">Filtrar</button>
                </div>
            </div>`;
        // ====================== FIN DE LA MODIFICACIÓN =======================

        html += `
            <div class="commission-vendor-card" data-vendor-name="${vendorName}">
                <div class="vendor-card-header">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <h3>${vendorName}</h3>
                        <button class="pcm-delete-btn btn-add-balance" title="Sumar saldo a favor (Bono, adelanto, etc.)" style="border: 1px solid var(--success-bg);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-bg)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                        <button class="pcm-delete-btn btn-delete-vendedor" title="Eliminar Vendedor"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    </div>
                    <div class="vendor-commission-details">
                         <span class="vendor-total-commission" title="Comisión PENDIENTE de pago">${formatearUSD(totalPendingAmount)}</span>
                         <button class="btn-pay-commission" data-pending-amount="${totalPendingAmount}" title="Registrar un pago de comisión a este vendedor" ${totalPendingAmount <= 0 ? 'disabled' : ''}>Pagar Comisión</button>
                    </div>
                </div>
                
                <div class="commission-sales-list" id="details-list-${vendorName.replace(/\s+/g, '')}">
                    ${eventsListHtml || '<p class="dashboard-loader" style="font-size:0.9rem; padding: 1rem 0;">No hay comisiones para mostrar hoy.</p>'}
                </div>

                ${filtersHtml} 

                <div class="commission-payment-history" id="history-${vendorName.replace(/\s+/g, '')}"></div>
            </div>
        `;
    }
    s.commissionsResultsContainer.innerHTML = html;

    // Se añaden listeners a los nuevos botones de "Filtrar"
    document.querySelectorAll('.btn-filter-commission').forEach(button => {
        button.addEventListener('click', (e) => {
            filterVendorHistory(e.currentTarget);
        });
    });

    Object.keys(vendorData).forEach(vendorName => {
        showCommissionPaymentHistory(vendorName);
    });
}

async function promptToPayCommission(vendorName, pendingAmount) {
    // Nos aseguramos de tener la lista de cuentas financieras actualizada
    if (!financialAccounts || financialAccounts.length === 0) {
        try {
            const accountsSnapshot = await db.collection('cuentas_financieras').orderBy('nombre').get();
            financialAccounts = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            showGlobalFeedback("Error al cargar las cuentas financieras.", "error");
            return;
        }
    }

    const metodoOptions = metodosDePago.map(m => `<option value="${m}">${m}</option>`).join('');
    
    // ===================== INICIO DE LA MODIFICACIÓN =====================
    // Creamos el HTML para el selector de cuentas, mostrando el saldo de cada una
    const accountsOptionsHtml = financialAccounts.length > 0
        ? financialAccounts.map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre} (${formatearARS(acc.saldo_actual_ars)})</option>`).join('')
        : '<option value="" disabled>No hay cuentas creadas</option>';

    const accountSelectHtml = `
        <div class="form-group" style="margin-top: 1.5rem;">
            <select name="cuenta_origen" required>
                <option value="" disabled selected></option>
                ${accountsOptionsHtml}
            </select>
            <label>Pagar desde la Cuenta</label>
        </div>
    `;
    // ====================== FIN DE LA MODIFICACIÓN =======================

   s.promptContainer.innerHTML = `
   <div class="ingreso-modal-box">
       <h3>Pagar Comisión a ${vendorName}</h3>
       <p style="text-align:center; color: var(--text-muted); margin-top:-1.5rem; margin-bottom: 2rem;">Deuda de comisión actual: <strong>${formatearUSD(pendingAmount)}</strong></p>
       <form id="commission-payment-form" data-vendor-name="${vendorName}" novalidate>
           <div class="form-group">
               <input type="number" id="payment-monto-usd" name="monto_usd" required placeholder=" " step="0.01" max="${pendingAmount}" value="${pendingAmount > 0 ? pendingAmount : ''}">
               <label for="payment-monto-usd">Monto a Pagar (USD)</label>
           </div>
           
           <div class="form-group">
               <select id="payment-metodo" name="metodo_pago" required>
                   <option value="" disabled selected></option>
                   ${metodoOptions}
               </select>
               <label for="payment-metodo">Pagar Con</label>
           </div>

           <div id="ars-payment-fields" class="payment-details-group hidden">
               <div class="form-group">
                   <input type="number" id="payment-cotizacion" name="cotizacion_dolar" placeholder=" ">
                   <label for="payment-cotizacion">Cotización del Dólar</label>
               </div>
               <div class="form-group">
                   <input type="number" id="payment-monto-ars" name="monto_ars" placeholder=" " readonly>
                   <label for="payment-monto-ars">Monto Equivalente (ARS)</label>
               </div>
               <!-- ===================== INICIO DE LA MODIFICACIÓN ===================== -->
               ${accountSelectHtml} <!-- Insertamos el nuevo selector aquí -->
               <!-- ====================== FIN DE LA MODIFICACIÓN ======================= -->
           </div>

           <div class="prompt-buttons">
               <button type="submit" class="prompt-button confirm spinner-btn">
                   <span class="btn-text">Registrar Pago</span>
                   <div class="spinner"></div>
               </button>
               <button type="button" class="prompt-button cancel">Cancelar</button>
           </div>
       </form>
   </div>`;
   
   const form = document.getElementById('commission-payment-form');
   const metodoSelect = form.querySelector('#payment-metodo');
   const arsFields = form.querySelector('#ars-payment-fields');
   const montoUsdInput = form.querySelector('#payment-monto-usd');
   const cotizacionInput = form.querySelector('#payment-cotizacion');
   const montoArsInput = form.querySelector('#payment-monto-ars');
   // ===================== INICIO DE LA MODIFICACIÓN =====================
   const cuentaSelect = form.querySelector('[name="cuenta_origen"]'); // Buscamos el nuevo selector
   // ====================== FIN DE LA MODIFICACIÓN =======================

   const toggleArsFields = () => {
       const show = metodoSelect.value.startsWith('Pesos');
       const isTransfer = metodoSelect.value === 'Pesos (Transferencia)';
       
       arsFields.classList.toggle('hidden', !show);
       cotizacionInput.required = show;
       
       // ===================== INICIO DE LA MODIFICACIÓN =====================
       // El selector de cuenta solo es visible y requerido si es transferencia
       if (cuentaSelect) {
           cuentaSelect.parentElement.classList.toggle('hidden', !isTransfer);
           cuentaSelect.required = isTransfer;
       }
       // ====================== FIN DE LA MODIFICACIÓN =======================
   };

   const calculateArs = () => {
       const montoUsd = parseFloat(montoUsdInput.value) || 0;
       const cotizacion = parseFloat(cotizacionInput.value) || 0;
       if (montoUsd > 0 && cotizacion > 0) {
           montoArsInput.value = (montoUsd * cotizacion).toFixed(2);
       } else {
           montoArsInput.value = '';
       }
   };
   
   metodoSelect.addEventListener('change', toggleArsFields);
   montoUsdInput.addEventListener('input', calculateArs);
   cotizacionInput.addEventListener('input', calculateArs);
   toggleArsFields();
}

async function saveCommissionPayment(form) {
    const btn = form.querySelector('button[type="submit"]');
    toggleSpinner(btn, true);

    const vendorName = form.dataset.vendorName;
    const formData = new FormData(form);
    const montoUsd = parseFloat(formData.get('monto_usd'));
    const metodoPago = formData.get('metodo_pago');
    const descripcion = `Pago de comisión a ${vendorName}`;

    if (isNaN(montoUsd) || montoUsd <= 0) {
        showGlobalFeedback("El monto a pagar en USD debe ser válido y mayor a cero.", "error");
        toggleSpinner(btn, false);
        return;
    }

    const gastoData = {
        categoria: 'Comisiones',
        descripcion,
        vendedor: vendorName,
        fecha: firebase.firestore.FieldValue.serverTimestamp(),
        monto_usd_original: montoUsd 
    };

    let montoArs = 0;
    // ===================== INICIO DE LA MODIFICACIÓN =====================
    let cuentaOrigenValue = null;
    // ====================== FIN DE LA MODIFICACIÓN =======================

    if (metodoPago.startsWith('Pesos')) {
        const cotizacion = parseFloat(formData.get('cotizacion_dolar'));
        if (isNaN(cotizacion) || cotizacion <= 0) {
            showGlobalFeedback("La cotización del dólar es requerida para pagos en pesos.", "error");
            toggleSpinner(btn, false);
            return;
        }
        montoArs = parseFloat(formData.get('monto_ars'));
        if (isNaN(montoArs) || montoArs <= 0) {
            showGlobalFeedback("El monto en ARS es inválido.", "error");
            toggleSpinner(btn, false);
            return;
        }
        gastoData.cotizacion_dolar = cotizacion;
        gastoData.monto = montoArs;
        gastoData.metodo_pago = metodoPago;
        
        // ===================== INICIO DE LA MODIFICACIÓN =====================
        // Si es transferencia, validamos y guardamos los datos de la cuenta
        if (metodoPago === 'Pesos (Transferencia)') {
            cuentaOrigenValue = formData.get('cuenta_origen');
            if (!cuentaOrigenValue) {
                showGlobalFeedback("Debes seleccionar la cuenta de origen para la transferencia.", "error");
                toggleSpinner(btn, false);
                return;
            }
            const [id, nombre] = cuentaOrigenValue.split('|');
            gastoData.cuenta_origen_id = id;
            gastoData.cuenta_origen_nombre = nombre;
        }
        // ====================== FIN DE LA MODIFICACIÓN =======================

    } else { // Pago en Dólares
        gastoData.monto = montoUsd;
        gastoData.metodo_pago = 'Dólares';
    }

    const vendorRef = db.collection('vendedores').doc(vendorName);

    try {
        await db.runTransaction(async (t) => {
            // 1. Actualizar (o crear) la deuda del vendedor
            const vendorDoc = await t.get(vendorRef);
            if (!vendorDoc.exists) {
                t.set(vendorRef, { nombre: vendorName, comision_pendiente_usd: -montoUsd });
            } else {
                t.update(vendorRef, { comision_pendiente_usd: firebase.firestore.FieldValue.increment(-montoUsd) });
            }

            // 2. Crear el registro de Gasto en la caja
            const gastoRef = db.collection('gastos').doc();
            t.set(gastoRef, gastoData);

            // 3. Crear el registro en el historial de 'pagos_comisiones'
            const pagoComisionRef = db.collection('pagos_comisiones').doc();
            t.set(pagoComisionRef, {
                monto_usd: montoUsd,
                metodo_pago: metodoPago,
                vendedor: vendorName,
                fecha: gastoData.fecha,
                descripcion,
                gastoAsociadoId: gastoRef.id
            });
            
            // ===================== INICIO DE LA MODIFICACIÓN =====================
            // 4. (NUEVO) Si fue por transferencia, descontar el saldo de la cuenta financiera
            if (cuentaOrigenValue) {
                const [cuentaId] = cuentaOrigenValue.split('|');
                const cuentaRef = db.collection('cuentas_financieras').doc(cuentaId);
                t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(-montoArs) });
            }
            // ====================== FIN DE LA MODIFICACIÓN =======================
        });

        showGlobalFeedback('Pago de comisión registrado con éxito.', 'success');
        s.promptContainer.innerHTML = '';
        loadCommissions();
        updateReports();
        loadFinancialData(); // Recargamos los datos financieros para ver el saldo actualizado

    } catch (error) {
        console.error("Error al registrar el pago de comisión:", error);
        showGlobalFeedback(error.message || 'Error al registrar el pago.', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

async function showCommissionPaymentHistory(vendorName) {
    const historyContainerId = `history-${vendorName.replace(/\s+/g, '')}`;
    const historyContainer = document.getElementById(historyContainerId);
    if (!historyContainer) return;

    try {
        const snapshot = await db.collection('pagos_comisiones')
            .where('vendedor', '==', vendorName)
            .orderBy('fecha', 'desc')
            .limit(10)
            .get();

        if (snapshot.empty) {
            historyContainer.innerHTML = '';
            return;
        }

        let historyHtml = '<h4>Últimos Pagos Realizados:</h4><ul>';
        snapshot.forEach(doc => {
            const pago = doc.data();
            const pagoId = doc.id;
            
            historyHtml += `
            <li class="commission-payment-item">
                <span>${new Date(pago.fecha.seconds * 1000).toLocaleDateString()} - <strong>${formatearUSD(pago.monto_usd)}</strong> <span>(${pago.metodo_pago})</span></span>
                <button class="delete-btn btn-delete-commission-payment" 
                        title="Revertir este pago"
                        data-pago-id="${pagoId}"
                        data-pago-item='${JSON.stringify(pago).replace(/'/g, "\\'")}'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </li>`;
        });
        historyHtml += '</ul>';
        historyContainer.innerHTML = historyHtml;

        historyContainer.querySelectorAll('.btn-delete-commission-payment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pagoId = e.currentTarget.dataset.pagoId;
                const pagoItem = JSON.parse(e.currentTarget.dataset.pagoItem.replace(/\\'/g, "'"));
                deleteCommissionPayment(pagoId, pagoItem);
            });
        });

    } catch (error) {
        console.error(`Error al cargar historial de pagos para ${vendorName}:`, error);
        historyContainer.innerHTML = '<p style="color:var(--error-bg); font-size: 0.8rem;">Error al cargar historial.</p>';
    }
}

async function deleteCommissionPayment(pagoId, pagoData) {
    const { monto_usd, vendedor, gastoAsociadoId, fecha, metodo_pago } = pagoData;

    const message = `¿Seguro que quieres revertir este pago de ${formatearUSD(monto_usd)} a ${vendedor}?\n\nEsta acción hará lo siguiente:\n- Se eliminará el registro del pago.\n- Se eliminará el gasto correspondiente de la caja.\n- La deuda de comisión del vendedor AUMENTARÁ en ${formatearUSD(monto_usd)}.`;

    showConfirmationModal('Confirmar Reversión de Pago', message, async () => {
        try {
            await db.runTransaction(async t => {
                const pagoRef = db.collection('pagos_comisiones').doc(pagoId);
                const vendorRef = db.collection('vendedores').doc(vendedor);

                if (gastoAsociadoId) {
                    const gastoRef = db.collection('gastos').doc(gastoAsociadoId);
                    t.delete(gastoRef);
                } else {
                    const fiveSecondsBefore = new Date(fecha.seconds * 1000 - 5000);
                    const fiveSecondsAfter = new Date(fecha.seconds * 1000 + 5000);

                    const gastosQuery = db.collection('gastos')
                        .where('categoria', '==', 'Comisiones')
                        .where('vendedor', '==', vendedor)
                        .where('monto_usd_original', '==', monto_usd)
                        .where('metodo_pago', '==', metodo_pago)
                        .where('fecha', '>=', fiveSecondsBefore)
                        .where('fecha', '<=', fiveSecondsAfter)
                        .limit(1);
                    
                    const gastosSnap = await gastosQuery.get();
                    if (!gastosSnap.empty) {
                        const gastoDoc = gastosSnap.docs[0];
                        t.delete(gastoDoc.ref);
                    } else {
                        console.warn(`No se encontró un gasto coincidente para revertir el pago de comisión ${pagoId}. La deuda se restaurará, pero el gasto podría permanecer.`);
                        showGlobalFeedback('No se encontró el gasto asociado, podría quedar un registro huérfano.', 'error', 5000);
                    }
                }
                
                t.delete(pagoRef);
                
                t.update(vendorRef, {
                    comision_pendiente_usd: firebase.firestore.FieldValue.increment(monto_usd)
                });
            });

            showGlobalFeedback('Pago de comisión revertido con éxito.', 'success');
            loadCommissions();
            updateReports();

        } catch (error) {
            console.error("Error al revertir pago de comisión:", error);
            showGlobalFeedback('No se pudo revertir el pago. Revisa la consola.', 'error');
        }
    });
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

async function promptToAddGasto() {
    // Aseguramos tener la lista de cuentas actualizada
    if (!financialAccounts || financialAccounts.length === 0) {
        try {
            const accountsSnapshot = await db.collection('cuentas_financieras').orderBy('nombre').get();
            financialAccounts = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) { showGlobalFeedback("Error al cargar las cuentas financieras.", "error"); return; }
    }

    const categoriaOptions = gastosCategorias.map(c => `<option value="${c}">${c}</option>`).join('');
    
    // ===== INICIO DE LA MODIFICACIÓN (1/3) =====
    // Añadimos el nuevo método de pago a la lista
    const metodoOptions = [...metodosDePago, "Dólares (Transferencia)"].map(m => `<option value="${m}">${m}</option>`).join('');
    // ===== FIN DE LA MODIFICACIÓN =====
    
    const accesoriosOptions = accesoriosSubcategorias.map(s => `<option value="${s}">${s}</option>`).join('');

    // Filtramos las cuentas por ARS y USD para sus respectivos selectores
    const accountsArsOptionsHtml = financialAccounts.filter(acc => acc.moneda === 'ARS').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre} (${formatearARS(acc.saldo_actual_ars)})</option>`).join('');
    const accountsUsdOptionsHtml = financialAccounts.filter(acc => acc.moneda === 'USD').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre} (${formatearUSD(acc.saldo_actual_usd)})</option>`).join('');

    // Creamos los selectores de cuenta para ambas monedas
    const accountArsSelectHtml = `<div id="gasto-cuenta-ars-group" class="form-group hidden" style="margin-top: 1.5rem;"><select name="cuenta_origen_ars" required><option value="" disabled selected></option>${accountsArsOptionsHtml}</select><label>Pagar desde Cuenta ARS</label></div>`;
    const accountUsdSelectHtml = `<div id="gasto-cuenta-usd-group" class="form-group hidden" style="margin-top: 1.5rem;"><select name="cuenta_origen_usd" required><option value="" disabled selected></option>${accountsUsdOptionsHtml}</select><label>Pagar desde Cuenta USD</label></div>`;

    s.promptContainer.innerHTML = `
    <div class="ingreso-modal-box">
        <h3>Registrar Nuevo Gasto</h3>
        <form id="gasto-form" novalidate>
            <div class="form-group">
                <select id="gasto-categoria" name="categoria" required>
                    <option value="" disabled selected></option>
                    ${categoriaOptions}
                </select>
                <label for="gasto-categoria">Categoría</label>
            </div>
            <div id="accesorios-subcategoria-group" class="form-group hidden"><select id="gasto-accesorio-subcategoria" name="subcategoria"><option value="" disabled selected></option>${accesoriosOptions}</select><label for="gasto-accesorio-subcategoria">Subcategoría de Accesorio</label></div>
            <div id="detalle-otro-group" class="form-group hidden"><input type="text" id="gasto-detalle-otro" name="detalle_otro" placeholder=" "><label for="gasto-detalle-otro">Especificar Detalle</label></div>
            <div class="form-group"><input type="number" id="gasto-monto" name="monto" required placeholder=" " step="0.01"><label for="gasto-monto">Monto del Gasto</label></div>
            <div class="form-group">
                <select id="gasto-metodo" name="metodo_pago" required>
                    <option value="" disabled selected></option>
                    ${metodoOptions}
                </select>
                <label for="gasto-metodo">Pagado con</label>
            </div>
            
            <!-- ===== INICIO DE LA MODIFICACIÓN (2/3) - Insertamos ambos selectores ===== -->
            ${accountArsSelectHtml}
            ${accountUsdSelectHtml}
            <!-- ===== FIN DE LA MODIFICACIÓN ===== -->

            <div class="form-group"><textarea id="gasto-descripcion" name="descripcion" rows="1" placeholder=" "></textarea><label for="gasto-descripcion">Descripción (opcional)</label></div>
            <div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Guardar Gasto</span><div class="spinner"></div></button><button type="button" class="prompt-button cancel">Cancelar</button></div>
        </form>
    </div>`;

    const categoriaSelect = document.getElementById('gasto-categoria');
    const accesoriosGroup = document.getElementById('accesorios-subcategoria-group');
    const otroGroup = document.getElementById('detalle-otro-group');
    const metodoSelect = document.getElementById('gasto-metodo');
    const cuentaArsGroup = document.getElementById('gasto-cuenta-ars-group');
    const cuentaUsdGroup = document.getElementById('gasto-cuenta-usd-group');

    categoriaSelect.addEventListener('change', () => {
        const selectedCategory = categoriaSelect.value;
        accesoriosGroup.classList.toggle('hidden', selectedCategory !== 'Accesorios');
        otroGroup.classList.toggle('hidden', selectedCategory !== 'Otro' && selectedCategory !== 'Repuestos');
    });

    // ===== INICIO DE LA MODIFICACIÓN (3/3) - Lógica para mostrar el selector correcto ===== -->
    metodoSelect.addEventListener('change', () => {
        const selectedMethod = metodoSelect.value;
        const isTransferenciaArs = selectedMethod === 'Pesos (Transferencia)';
        const isTransferenciaUsd = selectedMethod === 'Dólares (Transferencia)';

        cuentaArsGroup.classList.toggle('hidden', !isTransferenciaArs);
        cuentaArsGroup.querySelector('select').required = isTransferenciaArs;

        cuentaUsdGroup.classList.toggle('hidden', !isTransferenciaUsd);
        cuentaUsdGroup.querySelector('select').required = isTransferenciaUsd;
    });
    // ===== FIN DE LA MODIFICACIÓN =====

    const textarea = document.getElementById('gasto-descripcion');
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }
}

async function saveGasto(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    
    const gastoData = {
        categoria: formData.get('categoria'),
        monto: parseFloat(formData.get('monto')),
        metodo_pago: formData.get('metodo_pago'),
        descripcion: formData.get('descripcion'),
        fecha: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    if (gastoData.categoria === 'Accesorios') gastoData.subcategoria = formData.get('subcategoria');
    if (gastoData.categoria === 'Otro' || gastoData.categoria === 'Repuestos') gastoData.detalle_otro = formData.get('detalle_otro');

    if (!gastoData.categoria || !gastoData.monto || !gastoData.metodo_pago) {
        showGlobalFeedback("Por favor, completa los campos obligatorios.", "error");
        toggleSpinner(btn, false);
        return;
    }
    
    // ===== INICIO DE LA MODIFICACIÓN - Lógica para ambos tipos de transferencia =====
    const cuentaOrigenArsValue = formData.get('cuenta_origen_ars');
    const cuentaOrigenUsdValue = formData.get('cuenta_origen_usd');

    if (gastoData.metodo_pago === 'Pesos (Transferencia)') {
        if (!cuentaOrigenArsValue) {
            showGlobalFeedback("Debes seleccionar una cuenta para la transferencia en ARS.", "error");
            toggleSpinner(btn, false);
            return;
        }
        const [id, nombre] = cuentaOrigenArsValue.split('|');
        gastoData.cuenta_origen_id = id;
        gastoData.cuenta_origen_nombre = nombre;
    } else if (gastoData.metodo_pago === 'Dólares (Transferencia)') {
        if (!cuentaOrigenUsdValue) {
            showGlobalFeedback("Debes seleccionar una cuenta para la transferencia en USD.", "error");
            toggleSpinner(btn, false);
            return;
        }
        const [id, nombre] = cuentaOrigenUsdValue.split('|');
        gastoData.cuenta_origen_id = id;
        gastoData.cuenta_origen_nombre = nombre;
    }
    // ===== FIN DE LA MODIFICACIÓN =====

    try {
        await db.runTransaction(async t => {
            const gastoRef = db.collection('gastos').doc();
            t.set(gastoRef, gastoData);

            // ===== INICIO DE LA MODIFICACIÓN - Descontar de la cuenta correcta =====
            if (gastoData.cuenta_origen_id) {
                const cuentaRef = db.collection('cuentas_financieras').doc(gastoData.cuenta_origen_id);
                if (gastoData.metodo_pago === 'Pesos (Transferencia)') {
                    t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(-gastoData.monto) });
                } else if (gastoData.metodo_pago === 'Dólares (Transferencia)') {
                    t.update(cuentaRef, { saldo_actual_usd: firebase.firestore.FieldValue.increment(-gastoData.monto) });
                }
            }
            // ===== FIN DE LA MODIFICACIÓN =====
        });

        showGlobalFeedback('Gasto registrado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        if(s.gastosSection && !s.gastosSection.classList.contains('hidden')) loadGastos();
        loadFinancialData();
        updateReports();
    } catch (error) {
        console.error("Error al guardar el gasto:", error);
        showGlobalFeedback('Error al registrar el gasto', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
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
        
        // ===== INICIO DE LA MODIFICACIÓN =====
        // Obtenemos TODOS los gastos del período desde la base de datos.
        const gastosBrutos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filtramos en el código para excluir las categorías que no queremos mostrar AQUÍ.
        // AÑADIMOS 'Retiro de Socio' a la lista de exclusión.
        const gastosFiltrados = gastosBrutos.filter(gasto => 
            gasto.categoria !== 'Pago a Proveedor' && 
            gasto.categoria !== 'Comisiones' &&
            gasto.categoria !== 'Retiro de Socio'
        );
        // ===== FIN DE LA MODIFICACIÓN =====

        // A partir de ahora, usamos la lista ya filtrada (gastosFiltrados)
        const gastosPorCategoria = gastosFiltrados.reduce((acc, gasto) => {
            let montoArs = 0;
            if (gasto.metodo_pago.startsWith('Pesos')) {
                montoArs = gasto.monto || 0;
            }
            if (montoArs > 0) {
                acc[gasto.categoria] = (acc[gasto.categoria] || 0) + montoArs;
            }
            return acc;
        }, {});
        
        renderGastosChart(gastosFiltrados, gastosPorCategoria);
        renderGastosList(gastosFiltrados);

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
            ctx.fillText('Total Gastado (ARS)', centerX, centerY - 12);
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
function renderGastosList(gastos) {
    if (gastos.length === 0) {
        s.gastosList.innerHTML = `<p class="dashboard-loader">No hay gastos para mostrar en este período.</p>`;
        return;
    }
    s.gastosList.innerHTML = gastos.map(gasto => {
        let desc = gasto.descripcion || 'Sin detalles';
        let montoFormateado;
        let deleteButton;
        
        let metodoPagoBadge = '';
        if (gasto.metodo_pago) {
            let badgeClass = ''; let badgeText = '';
            switch (gasto.metodo_pago) {
                case 'Pesos (Efectivo)': badgeClass = 'efectivo'; badgeText = 'Efectivo'; break;
                case 'Pesos (Transferencia)': badgeClass = 'transferencia'; badgeText = 'Transferencia'; break;
                case 'Dólares': badgeClass = 'dolares'; badgeText = 'Dólares'; break;
            }
            if (badgeText) { metodoPagoBadge = `<span class="payment-badge payment-badge--${badgeClass}">${badgeText}</span>`; }
        }

        if (gasto.categoria === 'Comisiones') {
            desc = `Pago a ${gasto.vendedor}. ${gasto.descripcion || ''}`;
            if (gasto.metodo_pago.startsWith('Pesos')) {
                montoFormateado = `${formatearARS(gasto.monto)} <small>(${formatearUSD(gasto.monto_usd_original)})</small>`;
            } else {
                montoFormateado = formatearUSD(gasto.monto);
            }
            deleteButton = `<button class="delete-btn" title="Revertir desde la pestaña Comisiones" disabled><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>`;
        } else {
            if (gasto.categoria === 'Accesorios' && gasto.subcategoria) desc = `${gasto.subcategoria}${gasto.detalle_otro ? `: ${gasto.detalle_otro}` : ''} - ${desc}`;
            if (gasto.categoria === 'Otro' && gasto.detalle_otro) desc = `${gasto.detalle_otro} - ${desc}`;
            montoFormateado = gasto.metodo_pago === 'Dólares' ? formatearUSD(gasto.monto) : formatearARS(gasto.monto);
            deleteButton = `<button class="delete-btn" title="Eliminar Gasto" onclick="deleteGasto('${gasto.id}', '${gasto.categoria}', ${gasto.monto})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>`;
        }

        // ===================== INICIO DE LA MODIFICACIÓN =====================
        // Se agrupan 'details' y 'actions' en un nuevo div 'gasto-item-footer'
        return `<div class="gasto-item" style="border-color: ${categoriaColores[gasto.categoria] || '#cccccc'};">
            <div class="gasto-item-info">
                <div class="gasto-item-header">
                    <div class="gasto-item-cat">${gasto.categoria}</div>
                    ${metodoPagoBadge}
                </div>
                <div class="gasto-item-desc">${desc}</div>
            </div>
            <div class="gasto-item-footer">
                <div class="gasto-item-details">
                    <div class="gasto-item-amount">${montoFormateado}</div>
                    <div class="gasto-item-date">${new Date((gasto.fecha?.seconds || 0) * 1000).toLocaleDateString('es-AR')}</div>
                </div>
                <div class="gasto-item-actions">${deleteButton}</div>
            </div>
        </div>`;
        // ====================== FIN DE LA MODIFICACIÓN =======================
    }).join('');
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function loadStock(direction = 'first') {
    const type = 'stock';

    const imeiFilterValue = s.filterStockImei.value.trim();
    const newFiltersJSON = JSON.stringify([s.filterStockModel.value, s.filterStockProveedor.value, s.filterStockColor.value, s.filterStockGb.value, imeiFilterValue]);

    if (!paginationState[type] || paginationState[type].lastFilters !== newFiltersJSON) {
        direction = 'first';
    }
    
    if (direction === 'first') {
        paginationState[type] = {
            lastFilters: newFiltersJSON,
            currentPage: 1,
            lastVisible: null,
            pageHistory: [null]
        };
    }
    
    // ===== INICIO DE LA CORRECCIÓN DE LÓGICA =====
    // Se rediseñó cómo se construyen los filtros para evitar conflictos.
    let filters = [['estado', '==', 'en_stock']]; // El filtro base siempre se aplica.

    if (imeiFilterValue && imeiFilterValue.length > 0) {
        // Si hay un valor en el filtro de IMEI, se usa EXCLUSIVAMENTE ese filtro.
        filters.push(['imei_last_4', '==', imeiFilterValue]);
    } else {
        // Si el filtro de IMEI está vacío, se aplican los otros filtros de la lista.
        if (s.filterStockModel.value) filters.push(['modelo', '==', s.filterStockModel.value]);
        if (s.filterStockProveedor.value) filters.push(['proveedor', '==', s.filterStockProveedor.value]);
        if (s.filterStockColor.value) filters.push(['color', '==', s.filterStockColor.value]);
        if (s.filterStockGb.value) filters.push(['almacenamiento', '==', s.filterStockGb.value]);
    }
    // ===== FIN DE LA CORRECCIÓN DE LÓGICA =====

    await loadPaginatedData({
        type: type,
        collectionName: 'stock_individual',
        filters: filters,
        orderByField: 'fechaDeCarga',
        orderByDirection: 'desc',
        direction: direction,
        renderFunction: (doc) => {
            const item = doc.data();
            const fechaObj = item.fechaDeCarga ? new Date(item.fechaDeCarga.seconds * 1000) : null;
            let fechaFormateada = fechaObj ? `${String(fechaObj.getDate()).padStart(2, '0')}/${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}<br><small class="time-muted">${String(fechaObj.getHours()).padStart(2, '0')}:${String(fechaObj.getMinutes()).padStart(2, '0')} hs</small>` : 'N/A';
            const itemJSON = JSON.stringify(item).replace(/'/g, "\\'");

            let reparadoIconHtml = '';
            if (item.fueReparado) {
                const tooltipText = item.detalles_reparacion || 'Equipo reparado';
                reparadoIconHtml = `<span class="reparado-badge" title="${tooltipText}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg></span>`;
            }
            
            const modeloConImeiHtml = `
                ${item.modelo || ''} ${reparadoIconHtml}
                <br>
                <small class="time-muted">IMEI: ${item.imei || 'N/A'}</small>
            `;

            return `<tr class="stock-row-clickable" data-item='${itemJSON}' data-imei="${item.imei}">
                <td class="hide-on-mobile">${fechaFormateada}</td>
                <td>${modeloConImeiHtml}</td>
                <td class="hide-on-mobile">${item.proveedor || 'N/A'}</td>
                <td>${item.color || ''}</td>
                <td class="hide-on-mobile">${item.almacenamiento || ''}</td>
                <td>${item.bateria || ''}%</td>
                <td class="hide-on-mobile">${formatearUSD(item.precio_costo_usd)}</td>
                <td class="actions-cell">
                    <button class="edit-btn btn-edit-stock hide-on-mobile" title="Editar Producto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button class="delete-btn btn-delete-stock hide-on-mobile" title="Eliminar Producto"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                </td></tr>`;
        },
        setupEventListeners: () => {
             document.querySelectorAll('.stock-row-clickable').forEach(row => {
                const itemData = JSON.parse(row.dataset.item.replace(/\\'/g, "'"));
                const imei = row.dataset.imei;
                
                const editBtn = row.querySelector('.btn-edit-stock');
                if (editBtn) editBtn.addEventListener('click', () => promptToEditStock(itemData));

                const deleteBtn = row.querySelector('.btn-delete-stock');
                if (deleteBtn) deleteBtn.addEventListener('click', () => {
                    const message = `Producto: ${itemData.modelo} ${itemData.color}\nIMEI: ${imei}\n\nEsta acción eliminará el producto del stock permanentemente.`;
                    showConfirmationModal('¿Seguro que quieres eliminar este producto?', message, () => deleteStockItem(imei, itemData));
                });

                row.addEventListener('click', e => {
                    if (window.innerWidth < 768 && !e.target.closest('button')) {
                        showStockDetailModal(itemData);
                    }
                });
            });
        }
    });
}

function showStockDetailModal(item) {
    const fechaObj = item.fechaDeCarga ? new Date(item.fechaDeCarga.seconds * 1000) : null;
    let fechaFormateada = fechaObj ? fechaObj.toLocaleString('es-AR') : 'N/A';

    // Usamos el contenedor de prompts para mostrar nuestro modal
    s.promptContainer.innerHTML = `
        <div class="container container-sm" style="margin: auto;">
            <div class="prompt-box">
                <h3>Detalles del Producto</h3>
                
                <div class="details-box">
                    <div class="detail-item"><span>Modelo:</span> <strong>${item.modelo || ''}</strong></div>
                    <div class="detail-item"><span>IMEI:</span> <strong>${item.imei || ''}</strong></div>
                    <div class="detail-item"><span>Color:</span> <strong>${item.color || ''}</strong></div>
                    <div class="detail-item"><span>Almacenamiento:</span> <strong>${item.almacenamiento || ''}</strong></div>
                    <div class="detail-item"><span>Batería:</span> <strong>${item.bateria || ''}%</strong></div>
                    <div class="detail-item"><span>Detalles Estéticos:</span> <strong>${item.detalles_esteticos || ''}</strong></div>
                    <div class="detail-item"><span>Costo (USD):</span> <strong>${formatearUSD(item.precio_costo_usd)}</strong></div>
                    <div class="detail-item"><span>Proveedor:</span> <strong>${item.proveedor || 'N/A'}</strong></div>
                    <div class="detail-item"><span>Fecha de Carga:</span> <strong>${fechaFormateada}</strong></div>
                </div>

                <div class="prompt-buttons">
                    <button id="modal-edit-btn" class="prompt-button confirm" style="background-color:#3498db;">Editar</button>
                    <button id="modal-delete-btn" class="prompt-button cancel" style="background-color:var(--error-bg);">Eliminar</button>
                </div>
                 <div class="prompt-buttons" style="margin-top: 1rem;">
                    <button class="prompt-button cancel" style="background-color:#555;">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    // Añadimos la funcionalidad a los botones del modal, reutilizando tus funciones existentes
    document.getElementById('modal-edit-btn').onclick = () => {
        s.promptContainer.innerHTML = ''; // Cerramos el modal de detalle
        promptToEditStock(item);
    };

    document.getElementById('modal-delete-btn').onclick = () => {
        const message = `Producto: ${item.modelo} ${item.color}\nIMEI: ${item.imei}\n\nEsta acción eliminará el producto del stock permanentemente.`;
        // No cerramos el modal de detalle hasta que se confirme la acción
        showConfirmationModal('¿Seguro que quieres eliminar este producto?', message, () => {
            s.promptContainer.innerHTML = ''; // Cerramos el modal de detalle
            deleteStockItem(item.imei, item);
        });
    };
}

function promptToEditStock(item) {
    switchView('management', s.tabManagement);
    resetManagementView();
    s.scanOptions.classList.add('hidden'); 
    s.scannerContainer.classList.add('hidden'); 
    s.feedbackMessage.classList.add('hidden');
    s.managementTitle.textContent = "Editar Producto"; 
    s.productFormSubmitBtn.querySelector('.btn-text').textContent = "Actualizar Producto";
    s.productForm.reset(); 
    
    s.imeiInput.readOnly = false;
    s.imeiInput.value = item.imei;
    s.productForm.dataset.originalImei = item.imei;

    document.getElementById('precio-costo-form').value = item.precio_costo_usd || ''; 
    s.modeloFormSelect.value = item.modelo;
    document.getElementById('bateria').value = item.bateria; 
    s.colorFormSelect.value = item.color;
    s.almacenamientoFormSelect.value = item.almacenamiento; 
    s.detallesFormSelect.value = item.detalles_esteticos;
    s.proveedorFormSelect.value = item.proveedor || '';
    s.productForm.dataset.mode = 'update'; 
    s.productForm.classList.remove('hidden');

    // ===== INICIO DE LA MODIFICACIÓN CLAVE =====
    // Se añade la lógica del interruptor que faltaba en el modo de edición.
    const paraRepararCheck = document.getElementById('para-reparar-check');
    const reparacionFields = document.getElementById('reparacion-fields');
    const defectoInput = document.getElementById('defecto-form');
    const repuestoInput = document.getElementById('repuesto-form');

    paraRepararCheck.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        reparacionFields.classList.toggle('hidden', !isChecked);
        defectoInput.required = isChecked;
        repuestoInput.required = isChecked;
    });
    // ===== FIN DE LA MODIFICACIÓN CLAVE =====
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function loadSales(direction = 'first') {
    const type = 'sales';

    const newFiltersJSON = JSON.stringify([s.filterSalesVendedor.value, s.filterSalesStartDate.value, s.filterSalesEndDate.value]);
    if (!paginationState[type] || paginationState[type].lastFilters !== newFiltersJSON) {
        direction = 'first';
    }
    
    if (direction === 'first') {
        paginationState[type] = {
            lastFilters: newFiltersJSON,
            currentPage: 1,
            lastVisible: null,
            pageHistory: [null]
        };
    }
    
    const filters = [];
    if (s.filterSalesStartDate.value) filters.push(['fecha_venta', '>=', new Date(s.filterSalesStartDate.value + 'T00:00:00')]);
    if (s.filterSalesEndDate.value) filters.push(['fecha_venta', '<=', new Date(s.filterSalesEndDate.value + 'T23:59:59')]);
    if (s.filterSalesVendedor.value) filters.push(['vendedor', '==', s.filterSalesVendedor.value]);

    await loadPaginatedData({
        type: type,
        collectionName: 'ventas',
        filters: filters,
        orderByField: 'fecha_venta',
        orderByDirection: 'desc',
        direction: direction,
        renderFunction: (doc) => {
            const venta = doc.data();
            const fechaObj = venta.fecha_venta ? venta.fecha_venta.toDate() : new Date();
            let fechaFormateada = `${String(fechaObj.getDate()).padStart(2, '0')}/${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}<br><small class="time-muted">${String(fechaObj.getHours()).padStart(2, '0')}:${String(fechaObj.getMinutes()).padStart(2, '0')} hs</small>`;
            const hoy = new Date();
            const diffDias = Math.floor((hoy.getTime() - fechaObj.getTime()) / (1000 * 3600 * 24));
            const diasRestantes = 30 - diffDias;

            let garantiaHtml = '';
            if (diasRestantes > 0) {
                garantiaHtml = `<div class="garantia-icon" data-tooltip="Quedan ${diasRestantes} día${diasRestantes > 1 ? 's' : ''} de garantía"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 12 15 15 9"></polyline></svg></div>`;
            } else {
                // --- INICIO DE LA CORRECCIÓN DEL SVG ---
                // Se corrigió el viewBox="0 0 24" 24" a viewBox="0 0 24 24"
                garantiaHtml = `<div class="garantia-icon" data-tooltip="Garantía vencida"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></div>`;
                // --- FIN DE LA CORRECCIÓN DEL SVG ---
            }
            const ventaJSON = JSON.stringify(venta).replace(/'/g, "\\'");
            return `<tr data-sale-id="${doc.id}" data-sale-item='${ventaJSON}'><td>${fechaFormateada}</td><td>${venta.producto.modelo || ''} ${venta.producto.color || ''}</td><td>${venta.nombre_cliente || '-'}</td><td>${venta.vendedor}</td><td>${formatearUSD(venta.precio_venta_usd)}</td><td>${venta.metodo_pago}</td><td class="garantia-cell">${garantiaHtml}</td><td class="actions-cell"><button class="edit-btn btn-edit-sale" title="Editar Venta"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button><button class="delete-btn btn-delete-sale" title="Revertir Venta"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></td></tr>`;
        },
        setupEventListeners: () => {
             document.querySelectorAll('.garantia-icon').forEach(icon => { let tooltip = null; icon.addEventListener('mouseenter', (e) => { const text = e.currentTarget.dataset.tooltip; tooltip = document.createElement('div'); tooltip.className = 'garantia-tooltip'; tooltip.textContent = text; e.currentTarget.appendChild(tooltip); setTimeout(() => { tooltip.classList.add('visible'); }, 10); }); icon.addEventListener('mouseleave', () => { if (tooltip) { tooltip.classList.remove('visible'); tooltip.addEventListener('transitionend', () => tooltip.remove()); } }); });
            document.querySelectorAll('.btn-edit-sale').forEach(button => button.addEventListener('click', e => { const row = e.currentTarget.closest('tr'); const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'")); promptToEditSale(saleItem, row.dataset.saleId); }));
            
            document.querySelectorAll('.btn-delete-sale').forEach(button => button.addEventListener('click', e => { 
                const row = e.currentTarget.closest('tr');
                const saleId = row.dataset.saleId;
                const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'"));
                handleSaleDeletion(saleId, saleItem);
            }));
        }
    });
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA
function promptToEditSale(sale, saleId) {
    const vendedoresOptions = vendedores.map(v => `<option value="${v}" ${sale.vendedor === v ? 'selected' : ''}>${v}</option>`).join('');
    const pagoOptions = metodosDePago.map(p => `<option value="${p}" ${sale.metodo_pago === p ? 'selected' : ''}>${p}</option>`).join('');
    
    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin:auto;"><div class="prompt-box"><h3>Editar Venta</h3><form id="edit-sale-form"><div class="details-box"><div class="detail-item"><span>Producto:</span> <strong>${sale.producto.modelo || ''}</strong></div><div class="detail-item"><span>IMEI:</span> <strong>${sale.imei_vendido}</strong></div></div>
        <div class="form-group"><label for="edit-precioVenta">Precio (USD)</label><input type="number" id="edit-precioVenta" name="precioVenta" required value="${sale.precio_venta_usd || ''}"></div>
        <div class="form-group"><label for="edit-metodoPago">Método de Pago</label><select id="edit-metodoPago" name="metodoPago" required>${pagoOptions}</select></div>
        <div id="pesos-efectivo-fields" class="payment-details-group hidden"><div class="form-group"><label for="edit-monto-efectivo">Monto Efectivo (ARS)</label><input type="number" id="edit-monto-efectivo" name="monto_efectivo" value="${sale.monto_efectivo || ''}"></div></div>
        <div id="pesos-transferencia-fields" class="payment-details-group hidden"><div class="form-group"><label for="edit-monto-transferencia">Monto Transferido (ARS)</label><input type="number" id="edit-monto-transferencia" name="monto_transferencia" value="${sale.monto_transferencia || ''}"></div><div class="form-group"><label for="edit-obs-transferencia">Obs. Transferencia</label><textarea id="edit-obs-transferencia" name="observaciones_transferencia" rows="2">${sale.observaciones_transferencia || ''}</textarea></div></div>
        <div id="cotizacion-dolar-field" class="form-group hidden"><label for="edit-cotizacion-dolar">Cotización Dólar</label><input type="number" id="edit-cotizacion-dolar" name="cotizacion_dolar" value="${sale.cotizacion_dolar || ''}"></div>
        <div class="form-group"><label for="edit-vendedor">Vendedor</label><select id="edit-vendedor" name="vendedor" required>${vendedoresOptions}</select></div>
        <div id="comision-vendedor-field" class="form-group hidden"><label for="edit-comision-vendedor">Comisión Vendedor (USD)</label><input type="number" id="edit-comision-vendedor" name="comision_vendedor_usd" value="${sale.comision_vendedor_usd || ''}"></div>
        <div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Actualizar Venta</span><div class="spinner"></div></button><button type="button" class="prompt-button cancel">Cancelar</button></div></form></div></div>`;
    
    const form = document.getElementById('edit-sale-form');
    const metodoPagoSelect = form.querySelector('[name="metodoPago"]');
    const vendedorSelect = form.querySelector('[name="vendedor"]');
    const toggleSaleFields = () => {
        form.querySelector('#pesos-efectivo-fields').classList.toggle('hidden', metodoPagoSelect.value !== 'Pesos (Efectivo)');
        form.querySelector('#pesos-transferencia-fields').classList.toggle('hidden', metodoPagoSelect.value !== 'Pesos (Transferencia)');
        form.querySelector('#cotizacion-dolar-field').classList.toggle('hidden', !metodoPagoSelect.value.startsWith('Pesos'));
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

async function deleteSale(saleId) {
    try {
        await db.runTransaction(async t => {
            const saleRef = db.collection("ventas").doc(saleId);
            const saleDoc = await t.get(saleRef);

            if (!saleDoc.exists) throw new Error(`La venta con ID ${saleId} ya no existe.`);
            
            const saleData = saleDoc.data();
            let stockRef = null, stockDoc = null;
            
            // ===== INICIO DE LA MODIFICACIÓN =====
            // Preparamos las variables para ambas monedas
            let cuentaArsRef = null, cuentaArsDoc = null;
            let cuentaUsdRef = null, cuentaUsdDoc = null;
            // ===== FIN DE LA MODIFICACIÓN =====

            if (saleData.imei_vendido) {
                stockRef = db.collection("stock_individual").doc(saleData.imei_vendido);
                stockDoc = await t.get(stockRef);
            }

            // ===== INICIO DE LA MODIFICACIÓN =====
            // Buscamos la cuenta ARS si existe la referencia
            if (saleData.cuenta_destino_id) {
                cuentaArsRef = db.collection("cuentas_financieras").doc(saleData.cuenta_destino_id);
                cuentaArsDoc = await t.get(cuentaArsRef);
            }
            // Buscamos la cuenta USD si existe la referencia
            if (saleData.cuenta_destino_usd_id) {
                cuentaUsdRef = db.collection("cuentas_financieras").doc(saleData.cuenta_destino_usd_id);
                cuentaUsdDoc = await t.get(cuentaUsdRef);
            }

            // Ahora revertimos los saldos
            if (cuentaArsDoc && cuentaArsDoc.exists) {
                const montoARevertir = saleData.monto_transferencia || 0;
                t.update(cuentaArsRef, { 
                    saldo_actual_ars: firebase.firestore.FieldValue.increment(-montoARevertir) 
                });
            } else if (saleData.cuenta_destino_id) {
                console.warn(`La cuenta ARS con ID ${saleData.cuenta_destino_id} fue eliminada. No se pudo revertir el saldo.`);
            }
            
            if (cuentaUsdDoc && cuentaUsdDoc.exists) {
                const montoARevertir = saleData.monto_transferencia_usd || 0;
                t.update(cuentaUsdRef, { 
                    saldo_actual_usd: firebase.firestore.FieldValue.increment(-montoARevertir) 
                });
            } else if (saleData.cuenta_destino_usd_id) {
                console.warn(`La cuenta USD con ID ${saleData.cuenta_destino_usd_id} fue eliminada. No se pudo revertir el saldo.`);
            }
            // ===== FIN DE LA MODIFICACIÓN =====

            if (stockDoc && stockDoc.exists) {
                t.update(stockRef, { estado: 'en_stock' });
            } else if (saleData.imei_vendido) {
                console.warn(`El documento de stock con IMEI ${saleData.imei_vendido} no fue encontrado.`);
            }

            if (saleData.hubo_canje) {
                let pendienteRef;
                if (saleData.canje_a_reparacion && saleData.id_reparacion_pendiente) {
                    pendienteRef = db.collection("reparaciones").doc(saleData.id_reparacion_pendiente);
                } else if (saleData.id_canje_pendiente) {
                    pendienteRef = db.collection("plan_canje_pendientes").doc(saleData.id_canje_pendiente);
                }
                if (pendienteRef) t.delete(pendienteRef);
            }

            t.delete(saleRef);
        });

        showGlobalFeedback("Venta revertida con éxito.", "success");
        
        loadSales();
        loadFinancialData(); // <-- CLAVE: Recargamos los datos financieros
        updateCanjeCount();
        updateReparacionCount();
        updateReports();

    } catch (error) {
        console.error("Error al eliminar la venta:", error);
        showGlobalFeedback("Ocurrió un error inesperado al revertir la venta.", "error", 8000); 
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function handleSaleDeletion(saleId, saleItem) {
    const montoARevertir = saleItem.monto_transferencia || 0;

    if (montoARevertir === 0) {
        const message = `Producto: ${saleItem.producto.modelo}\nIMEI: ${saleItem.imei_vendido}\n\n¿Seguro que quieres revertir esta venta?`;
        showConfirmationModal('Confirmar Reversión', message, () => deleteSale(saleId));
        return;
    }

    try {
        // Obtenemos los datos actualizados de la cuenta antes de hacer nada
        const cuentaDoc = await db.collection('cuentas_financieras').doc(saleItem.cuenta_destino_id).get();
        
        if (!cuentaDoc.exists) {
            const message = `La cuenta financiera asociada a esta venta ('${saleItem.cuenta_destino_nombre}') fue eliminada.\n\n¿Aún deseas revertir la venta? (El saldo no se podrá descontar).`;
            showConfirmationModal('Advertencia: Cuenta Eliminada', message, () => deleteSale(saleId));
            return;
        }

        const saldoActual = cuentaDoc.data().saldo_actual_ars || 0;

        // --- INICIO DE LA LÓGICA CORREGIDA ---
        if (saldoActual < montoARevertir) {
            // Si el saldo es insuficiente, mostramos el modal que permite forzar la reversión
            const nuevoSaldoNegativo = saldoActual - montoARevertir;
            const message = `<strong style="color:var(--error-bg);">¡ADVERTENCIA DE SALDO NEGATIVO!</strong><br><br>El saldo actual de la cuenta '${saleItem.cuenta_destino_nombre}' es de <strong>${formatearARS(saldoActual)}</strong>.<br><br>Revertir esta venta de <strong>${formatearARS(montoARevertir)}</strong> dejará la cuenta con un saldo negativo de <strong>${formatearARS(nuevoSaldoNegativo)}</strong>.<br><br>¿Estás absolutamente seguro de que quieres continuar?`;
            
            // Si el usuario acepta, se llama a deleteSale. Si no, no pasa nada.
            showConfirmationModal('Confirmar Reversión Forzada', message, () => deleteSale(saleId));
        } else {
            // Si hay saldo suficiente, procedemos con la confirmación normal
            const message = `Producto: ${saleItem.producto.modelo}\nIMEI: ${saleItem.imei_vendido}\n\nSe descontarán ${formatearARS(montoARevertir)} de la cuenta '${saleItem.cuenta_destino_nombre}'. ¿Continuar?`;
            showConfirmationModal('Confirmar Reversión', message, () => deleteSale(saleId));
        }
        // --- FIN DE LA LÓGICA CORREGIDA ---

    } catch (error) {
        console.error("Error al verificar saldo antes de eliminar:", error);
        showGlobalFeedback("Error al verificar el saldo de la cuenta.", "error");
    }
}

async function loadSales(direction = 'first') {
    const type = 'sales';

    // ===== INICIO DE LA MODIFICACIÓN (1/3) =====
    // Se añade el nuevo filtro de IMEI al estado de la paginación
    const imeiFilterValue = s.filterSalesImei.value.trim();
    const newFiltersJSON = JSON.stringify([s.filterSalesVendedor.value, s.filterSalesStartDate.value, s.filterSalesEndDate.value, imeiFilterValue]);
    // ===== FIN DE LA MODIFICACIÓN (1/3) =====

    if (!paginationState[type] || paginationState[type].lastFilters !== newFiltersJSON) {
        direction = 'first';
    }
    
    if (direction === 'first') {
        paginationState[type] = {
            lastFilters: newFiltersJSON,
            currentPage: 1,
            lastVisible: null,
            pageHistory: [null]
        };
    }
    
    // ===== INICIO DE LA MODIFICACIÓN (2/3) =====
    // Se añade la lógica para que el filtro de IMEI tenga prioridad
    const filters = [];
    if (imeiFilterValue) {
        // Si se busca por IMEI, se ignora el resto de los filtros
        filters.push(['imei_last_4', '==', imeiFilterValue]);
    } else {
        // Si no, se aplican los filtros normales
        if (s.filterSalesStartDate.value) filters.push(['fecha_venta', '>=', new Date(s.filterSalesStartDate.value + 'T00:00:00')]);
        if (s.filterSalesEndDate.value) filters.push(['fecha_venta', '<=', new Date(s.filterSalesEndDate.value + 'T23:59:59')]);
        if (s.filterSalesVendedor.value) filters.push(['vendedor', '==', s.filterSalesVendedor.value]);
    }
    // ===== FIN DE LA MODIFICACIÓN (2/3) =====

    await loadPaginatedData({
        type: type,
        collectionName: 'ventas',
        filters: filters,
        orderByField: 'fecha_venta',
        orderByDirection: 'desc',
        direction: direction,
        renderFunction: (doc) => {
            const venta = doc.data();
            const fechaObj = venta.fecha_venta ? venta.fecha_venta.toDate() : new Date();
            let fechaFormateada = `${String(fechaObj.getDate()).padStart(2, '0')}/${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}<br><small class="time-muted">${String(fechaObj.getHours()).padStart(2, '0')}:${String(fechaObj.getMinutes()).padStart(2, '0')} hs</small>`;
            const hoy = new Date();
            const diffDias = Math.floor((hoy.getTime() - fechaObj.getTime()) / (1000 * 3600 * 24));
            const diasRestantes = 30 - diffDias;

            let garantiaHtml = '';
            if (diasRestantes > 0) {
                garantiaHtml = `<div class="garantia-icon" data-tooltip="Quedan ${diasRestantes} día${diasRestantes > 1 ? 's' : ''} de garantía"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 12 15 15 9"></polyline></svg></div>`;
            } else {
                garantiaHtml = `<div class="garantia-icon" data-tooltip="Garantía vencida"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></div>`;
            }
            const ventaJSON = JSON.stringify(venta).replace(/'/g, "\\'");
            
            // ===== INICIO DE LA MODIFICACIÓN (3/3) =====
            // Se crea el HTML para mostrar el modelo y el IMEI juntos
            const productoConImeiHtml = `
                ${venta.producto.modelo || ''} ${venta.producto.color || ''}
                <br>
                <small class="time-muted">IMEI: ${venta.imei_vendido || 'N/A'}</small>
            `;
            // Se reemplaza la celda del producto por la nueva variable
            return `<tr data-sale-id="${doc.id}" data-sale-item='${ventaJSON}'><td>${fechaFormateada}</td><td>${productoConImeiHtml}</td><td>${venta.nombre_cliente || '-'}</td><td>${venta.vendedor}</td><td>${formatearUSD(venta.precio_venta_usd)}</td><td>${venta.metodo_pago}</td><td class="garantia-cell">${garantiaHtml}</td><td class="actions-cell"><button class="edit-btn btn-edit-sale" title="Editar Venta"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button><button class="delete-btn btn-delete-sale" title="Revertir Venta"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></td></tr>`;
            // ===== FIN DE LA MODIFICACIÓN (3/3) =====
        },
        setupEventListeners: () => {
             document.querySelectorAll('.garantia-icon').forEach(icon => { let tooltip = null; icon.addEventListener('mouseenter', (e) => { const text = e.currentTarget.dataset.tooltip; tooltip = document.createElement('div'); tooltip.className = 'garantia-tooltip'; tooltip.textContent = text; e.currentTarget.appendChild(tooltip); setTimeout(() => { tooltip.classList.add('visible'); }, 10); }); icon.addEventListener('mouseleave', () => { if (tooltip) { tooltip.classList.remove('visible'); tooltip.addEventListener('transitionend', () => tooltip.remove()); } }); });
            document.querySelectorAll('.btn-edit-sale').forEach(button => button.addEventListener('click', e => { const row = e.currentTarget.closest('tr'); const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'")); promptToEditSale(saleItem, row.dataset.saleId); }));
            
            document.querySelectorAll('.btn-delete-sale').forEach(button => button.addEventListener('click', e => { 
                const row = e.currentTarget.closest('tr');
                const saleId = row.dataset.saleId;
                const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'"));
                handleSaleDeletion(saleId, saleItem);
            }));
        }
    });
}

async function loadCanjes() {
    s.canjeTableContainer.innerHTML = `<p class="dashboard-loader">Cargando pendientes...</p>`;
    try {
        const query = db.collection("plan_canje_pendientes").where("estado", "==", "pendiente_de_carga").orderBy("fecha_canje", "desc");
        const querySnapshot = await query.get();
        if (querySnapshot.empty) { 
            s.canjeTableContainer.innerHTML = `<p class="dashboard-loader">No hay equipos pendientes de carga.</p>`; 
            return; 
        }
        
        let tableHTML = `<table><thead><tr><th>Fecha Canje</th><th>Modelo Recibido</th><th>Info Venta Asociada</th><th>Valor Toma (USD)</th><th>Acción</th></tr></thead><tbody>`;
        
        querySnapshot.forEach(doc => { 
            const item = doc.data();
            const fechaObj = item.fecha_canje ? item.fecha_canje.toDate() : null;
            let fechaFormateada = fechaObj ? `${String(fechaObj.getDate()).padStart(2, '0')}/${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}<br><small class="time-muted">${String(fechaObj.getHours()).padStart(2, '0')}:${String(fechaObj.getMinutes()).padStart(2, '0')} hs</small>` : 'N/A';
            let ventaInfo = item.observaciones_canje || '';
            if (item.producto_vendido) ventaInfo = `A cambio de ${item.producto_vendido}. ${ventaInfo}`;
            const itemJSON = JSON.stringify(item).replace(/'/g, "\\'");
            tableHTML += `<tr data-canje-id="${doc.id}" data-item='${itemJSON}'>
                            <td>${fechaFormateada}</td>
                            <td>${item.modelo_recibido}</td>
                            <td>${ventaInfo}</td>
                            <td>${formatearUSD(item.valor_toma_usd)}</td>
                            <td><button class="control-btn btn-cargar-canje" style="background-color: var(--success-bg);">Cargar a Stock</button></td>
                          </tr>`; 
        });
        
        s.canjeTableContainer.innerHTML = tableHTML + `</tbody></table>`;
        
        document.querySelectorAll('.btn-cargar-canje').forEach(button => {
            button.addEventListener('click', (e) => { 
                const row = e.currentTarget.closest('tr');
                const canjeItem = JSON.parse(row.dataset.item.replace(/\\'/g, "'"));
                cargarCanje(row.dataset.canjeId, canjeItem); 
            });
        });
    } catch (error) { handleDBError(error, s.canjeTableContainer, "pendientes de canje"); }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function cargarCanje(docId, canjeData) {
    const valorTomaNumerico = canjeData.valor_toma_usd || 0;

    canjeContext = { 
        docId, 
        modelo: canjeData.modelo_recibido,
        valorToma: valorTomaNumerico,
        fullData: canjeData 
    };

    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin: auto;"><div class="prompt-box"><h3>Cargar IMEI para ${canjeData.modelo_recibido}</h3><p style="color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">¿Cómo deseas ingresar el IMEI del equipo de canje?</p><div class="prompt-buttons"><button id="btn-canje-scan" class="prompt-button confirm">Escanear IMEI</button><button id="btn-canje-manual" class="prompt-button confirm" style="background-color: #555;">Ingresar Manualmente</button></div><div class="prompt-buttons" style="margin-top: 1rem;"><button class="prompt-button cancel">Cancelar</button></div></div></div>`;
            
    // ===== INICIO DE LA CORRECCIÓN CLAVE =====
    // Esta es la nueva lógica para cambiar de vista sin borrar la memoria.
    const setupAndSwitchView = () => {
        s.promptContainer.innerHTML = '';
        // 1. Ocultamos todas las vistas principales
        document.querySelectorAll('#app-container > div[id$="-view"]').forEach(view => {
            view.classList.add('hidden');
        });
        // 2. Mostramos solo la vista de gestión
        s.managementView.classList.remove('hidden');
    };

    document.getElementById('btn-canje-scan').onclick = () => {
        setupAndSwitchView();
        // Llamamos a resetManagementView AHORA, pasándole true para que NO borre canjeContext
        resetManagementView(false, true); 
        startScanner();
    };
    
    document.getElementById('btn-canje-manual').onclick = () => {
        setupAndSwitchView();
        // Llamamos a resetManagementView AHORA, pasándole true para que NO borre canjeContext
        resetManagementView(false, true);
        promptForManualImeiInput();
    };
    // ===== FIN DE LA CORRECCIÓN CLAVE =====

    s.promptContainer.querySelector('.prompt-button.cancel').addEventListener('click', () => {
        canjeContext = null;
    });
}

function handleDBError(error, container, context) {
    console.error(`Error cargando ${context}:`, error);
    let msg = `Error al cargar ${context}.`;
    if (error.code === 'failed-precondition' || error.code === 'invalid-argument') msg = `Error en la consulta de ${context}. Revisa los filtros y la consola (F12) para más detalles.`;
    container.innerHTML = `<p class="dashboard-loader" style="color:var(--error-bg)">${msg}</p>`;
}

const html5QrCode = new Html5Qrcode("scanner-container");

// REEMPLAZA ESTAS FUNCIONES EN TU SCRIPT.JS

function startScanner(context = null) {
    let feedbackText = 'Escanea un IMEI para empezar';
    if (context && context.modelo) {
        feedbackText = `Escanea el IMEI para el ${context.modelo} del plan canje...`;
    } else if (batchLoadContext) {
        feedbackText = `Cargando lote de ${batchLoadContext.model}. Escanea el siguiente IMEI.`;
    } else if (wholesaleSaleContext) {
        feedbackText = `Escanea el IMEI del equipo para la venta a ${wholesaleSaleContext.clientName}.`;
    }
    
    showFeedback(feedbackText, 'info');

    s.scanOptions.classList.remove('hidden');
    s.scannerContainer.classList.remove('hidden');
    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: { width: 250, height: 150 } }, 
        async (decodedText) => { 
            try { await html5QrCode.stop(); } catch(err) {} 
            onScanSuccess(decodedText, context); 
        }, 
        (errorMessage) => {}
    ).catch((err) => { 
        showFeedback("Error al iniciar cámara. Revisa los permisos.", "error"); 
    });
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA
function promptForManualImeiInput(e) {
    if(e) e.preventDefault();
    let promptTitle = 'Ingresar IMEI Manualmente';
    if (canjeContext) promptTitle = `Ingresar IMEI para ${canjeContext.modelo}`;
    else if (batchLoadContext) promptTitle = `Ingresar IMEI para ${batchLoadContext.currentModel}`;
    else if (wholesaleSaleContext) promptTitle = `Ingresar IMEI para venta a ${wholesaleSaleContext.clientName}`;

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
// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU ARCHIVO SCRIPT.JS

async function onScanSuccess(imei) {
    s.feedbackMessage.classList.add('hidden');
    
    if (canjeContext) {
        // ===== INICIO DE LA CORRECCIÓN CLAVE =====
        // Ahora pasamos también el canjeContext.valorToma para que el
        // formulario sepa que viene de un canje y guarde su ID correctamente.
        showAddProductForm(null, imei, canjeContext.modelo, canjeContext.docId, canjeContext.valorToma);
        // ===== FIN DE LA CORRECCIÓN CLAVE =====

    } else if (batchLoadContext) {
        showAddProductForm(null, imei);
    } else if (wholesaleSaleContext) {
        await processWholesaleItem(imei);
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

function promptForManualImeiInput(e) {
    if(e) e.preventDefault();
    let promptTitle = 'Ingresar IMEI Manualmente';
    if (canjeContext) promptTitle = `Ingresar IMEI para ${canjeContext.modelo}`;
    else if (batchLoadContext) promptTitle = `Ingresar IMEI para ${batchLoadContext.model}`;
    else if (wholesaleSaleContext) promptTitle = `Ingresar IMEI para venta a ${wholesaleSaleContext.clientName}`;

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


// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU ARCHIVO SCRIPT.JS

function showAddProductForm(e, imei = '', modelo = '', canjeId = null, valorToma = null) {
    if(e) e.preventDefault();
    
    // ===== INICIO DE LA CORRECCIÓN CLAVE =====
    // Verificamos si estamos en un contexto de canje ANTES de resetear la vista.
    const isCanjeActive = !!canjeId;
    // Llamamos a la función de reseteo, pero ahora le pasamos el "aviso"
    // para que no borre el canjeContext si está activo.
    resetManagementView(batchLoadContext ? true : false, isCanjeActive); 
    // ===== FIN DE LA CORRECCIÓN CLAVE =====
    
    s.scanOptions.classList.add('hidden');
    s.scannerContainer.classList.add('hidden');
    s.imeiInput.readOnly = !!imei;
    s.imeiInput.value = imei;

    populateSelect(s.modeloFormSelect, modelos, "Selecciona...");

    if (canjeId && valorToma !== null) {
        s.modeloFormSelect.value = modelo;
        document.getElementById('precio-costo-form').value = valorToma;
        s.proveedorFormSelect.value = "Usado (Plan Canje)";
        s.productForm.dataset.canjeId = canjeId;
    } 
    else if (batchLoadContext) {
        s.proveedorFormSelect.value = batchLoadContext.providerName;
        s.modeloFormSelect.value = batchLoadContext.currentModel;
        s.managementTitle.textContent = `Cargando ${batchLoadContext.currentModel} (${batchLoadContext.modelosCargados[batchLoadContext.currentModel]?.length || 0} cargados)`;
    }
    
    s.productForm.classList.remove('hidden');
    
    const paraRepararCheck = document.getElementById('para-reparar-check');
    const reparacionFields = document.getElementById('reparacion-fields');
    const defectoInput = document.getElementById('defecto-form');
    const repuestoInput = document.getElementById('repuesto-form');

    if (canjeContext && canjeContext.fullData && canjeContext.fullData.para_reparar) {
        paraRepararCheck.checked = true;
        reparacionFields.classList.remove('hidden');
        defectoInput.value = canjeContext.fullData.defecto || '';
        repuestoInput.value = canjeContext.fullData.repuesto_necesario || '';
        defectoInput.required = true;
        repuestoInput.required = true;
    }

    paraRepararCheck.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        reparacionFields.classList.toggle('hidden', !isChecked);
        defectoInput.required = isChecked;
        repuestoInput.required = isChecked;
    });

    if (!imei) {
        s.imeiInput.focus();
    } else if (!document.getElementById('precio-costo-form').value) {
        document.getElementById('precio-costo-form').focus();
    } else {
        document.getElementById('bateria').focus();
    }
}

async function promptToSell(imei, details) {
    if (!financialAccounts || financialAccounts.length === 0) {
        try {
            const accountsSnapshot = await db.collection('cuentas_financieras').orderBy('nombre').get();
            financialAccounts = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error al recargar cuentas para el modal de venta:", error);
            showGlobalFeedback("Error al cargar las cuentas. Intenta refrescar la página.", "error");
            return;
        }
    }

    const vendedoresOptions = vendedores.map(v => `<option value="${v}">${v}</option>`).join('');
    const modelosOptions = modelos.map(m => `<option value="${m}">${m}</option>`).join('');
    
    // ===== INICIO DE LA MODIFICACIÓN =====
    // Filtramos las cuentas por moneda para los selectores
    const accountsArsOptions = financialAccounts.filter(acc => acc.moneda === 'ARS').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('');
    const accountsUsdOptions = financialAccounts.filter(acc => acc.moneda === 'USD').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('');

    const metodosDePagoHtml = `
        <div class="form-group">
            <label>Método(s) de Pago</label>
            <div id="payment-methods-container">
                <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Dólares"><span class="toggle-switch-label">Dólares (Efectivo)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="monto_dolares" placeholder="Monto en USD" step="0.01"></div></div>
                <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Pesos (Efectivo)"><span class="toggle-switch-label">Pesos (Efectivo)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="monto_efectivo" placeholder="Monto en ARS" step="0.01"></div></div>
                
                <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Pesos (Transferencia)"><span class="toggle-switch-label">Transferencia (ARS)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="monto_transferencia" placeholder="Monto en ARS" step="0.01"><select name="cuenta_destino_ars"><option value="">Seleccione cuenta ARS...</option>${accountsArsOptions}</select></div></div>
                <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Dólares (Transferencia)"><span class="toggle-switch-label">Transferencia (USD)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="monto_transferencia_usd" placeholder="Monto en USD" step="0.01"><select name="cuenta_destino_usd"><option value="">Seleccione cuenta USD...</option>${accountsUsdOptions}</select></div></div>
            </div>
        </div>`;
    // ===== FIN DE LA MODIFICACIÓN =====

    const canjeHtml = `<hr style="border-color:var(--border-dark);margin:1.5rem 0;"><label class="toggle-switch-group"><input type="checkbox" id="acepta-canje" name="acepta-canje"><span class="toggle-switch-label">Acepta Plan Canje</span><span class="toggle-switch-slider"></span></label><div id="plan-canje-fields" class="hidden"><h4>Detalles del Equipo Recibido</h4><div class="form-group"><label for="sell-canje-modelo">Modelo Recibido</label><select id="sell-canje-modelo" name="canje-modelo">${modelosOptions}</select></div><div class="form-group"><label for="sell-canje-valor">Valor Toma (USD)</label><input type="number" id="sell-canje-valor" name="canje-valor"></div><div class="form-group"><label for="sell-canje-observaciones">Observaciones</label><textarea id="sell-canje-observaciones" name="canje-observaciones" rows="2"></textarea></div><label class="toggle-switch-group"><input type="checkbox" id="canje-para-reparar-check" name="canje-para-reparar"><span class="toggle-switch-label">Equipo de Canje Dañado (Enviar a Reparación)</span><span class="toggle-switch-slider"></span></label><div id="canje-reparacion-fields" class="hidden" style="animation: fadeIn 0.4s;"><div class="form-group"><label for="canje-defecto-form">Defecto del Equipo Recibido</label><input type="text" id="canje-defecto-form" name="canje-defecto" placeholder="Ej: Pantalla rota, no enciende..."></div><div class="form-group"><label for="canje-repuesto-form">Repuesto Necesario</label><input type="text" id="canje-repuesto-form" name="canje-repuesto" placeholder="Ej: Módulo de pantalla iPhone 12 Pro..."></div></div></div>`;

    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin:auto;"><div class="prompt-box"><h3>Registrar Venta</h3><form id="sell-form"><div class="details-box"><div class="detail-item"><span>Vendiendo:</span> <strong>${details.modelo || ''}</strong></div><div class="detail-item"><span>IMEI:</span> <strong>${imei}</strong></div></div><div class="form-group"><label for="sell-nombre-cliente">Nombre del Cliente (Opcional)</label><input type="text" id="sell-nombre-cliente" name="nombre_cliente"></div><div class="form-group"><label for="sell-precio-venta">Precio Venta TOTAL (USD)</label><input type="number" id="sell-precio-venta" name="precioVenta" required></div>${metodosDePagoHtml}<div class="form-group"><label for="sell-cotizacion-dolar">Cotización Dólar (si aplica)</label><input type="number" id="sell-cotizacion-dolar" name="cotizacion_dolar" placeholder="Ej: 1200"></div><div class="form-group"><label for="sell-vendedor">Vendedor</label><select id="sell-vendedor" name="vendedor" required><option value="">Seleccione...</option>${vendedoresOptions}</select></div><div id="comision-vendedor-field" class="form-group hidden"><label for="sell-comision-vendedor">Comisión Vendedor (USD)</label><input type="number" id="sell-comision-vendedor" name="comision_vendedor_usd"></div>${canjeHtml}<div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Registrar Venta</span><div class="spinner"></div></button><button type="button" class="prompt-button cancel">Cancelar</button></div></form></div></div>`;
    
    const form = document.getElementById('sell-form');
    form.addEventListener('change', (e) => {
        const target = e.target;
        if (target.matches('input[name="metodo_pago_check"]')) {
            const container = target.closest('.payment-option').querySelector('.payment-input-container');
            container.classList.toggle('hidden', !target.checked);
        }
        if (target.id === 'sell-vendedor') { form.querySelector('#comision-vendedor-field').classList.toggle('hidden', !target.value); }
        if (target.id === 'acepta-canje') { document.getElementById('plan-canje-fields').classList.toggle('hidden', !target.checked); }
        if (target.id === 'canje-para-reparar-check') { document.getElementById('canje-reparacion-fields').classList.toggle('hidden', !target.checked); }
    });
    form.addEventListener('submit', (e) => { e.preventDefault(); registerSale(imei, details, e.target.querySelector('button[type="submit"]')); });
}

async function registerSale(imei, productDetails, btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);

    const ventaTotalUSD = parseFloat(formData.get('precioVenta')) || 0;
    const valorCanjeUSD = formData.get('acepta-canje') === 'on' ? (parseFloat(formData.get('canje-valor')) || 0) : 0;
    const cotizacion = parseFloat(formData.get('cotizacion_dolar')) || 1;
    
    const montoDolares = parseFloat(formData.get('monto_dolares')) || 0;
    const montoEfectivo = parseFloat(formData.get('monto_efectivo')) || 0;
    const montoTransferencia = parseFloat(formData.get('monto_transferencia')) || 0;
    const montoTransferenciaUsd = parseFloat(formData.get('monto_transferencia_usd')) || 0;
    
    const cuentaDestinoArsValue = formData.get('cuenta_destino_ars');
    const cuentaDestinoUsdValue = formData.get('cuenta_destino_usd');

    if (montoDolares === 0 && montoEfectivo === 0 && montoTransferencia === 0 && montoTransferenciaUsd === 0) {
        showGlobalFeedback("Debes ingresar un monto para al menos un método de pago.", "error");
        toggleSpinner(btn, false); return;
    }
    if (montoTransferencia > 0 && !cuentaDestinoArsValue) {
        showGlobalFeedback("Debes seleccionar una cuenta de destino para la transferencia en ARS.", "error");
        toggleSpinner(btn, false); return;
    }
     if (montoTransferenciaUsd > 0 && !cuentaDestinoUsdValue) {
        showGlobalFeedback("Debes seleccionar una cuenta de destino para la transferencia en USD.", "error");
        toggleSpinner(btn, false); return;
    }

    const pagosRecibidos = [];
    if (montoDolares > 0) pagosRecibidos.push('Dólares (Efectivo)');
    if (montoEfectivo > 0) pagosRecibidos.push('Pesos (Efectivo)');
    if (montoTransferencia > 0) pagosRecibidos.push('Pesos (Transferencia)');
    if (montoTransferenciaUsd > 0) pagosRecibidos.push('Dólares (Transferencia)');

    const saleData = {
        imei_vendido: imei,
        imei_last_4: imei.slice(-4),
        producto: productDetails,
        precio_venta_usd: ventaTotalUSD,
        nombre_cliente: formData.get('nombre_cliente').trim() || null,
        metodo_pago: pagosRecibidos.join(' + '),
        vendedor: formData.get('vendedor'),
        comision_vendedor_usd: parseFloat(formData.get('comision_vendedor_usd')) || 0,
        fecha_venta: firebase.firestore.FieldValue.serverTimestamp(),
        hubo_canje: valorCanjeUSD > 0,
        valor_toma_canje_usd: valorCanjeUSD,
        cotizacion_dolar: cotizacion,
        monto_dolares: montoDolares,
        monto_efectivo: montoEfectivo,
        monto_transferencia: montoTransferencia,
        monto_transferencia_usd: montoTransferenciaUsd,
        comision_pagada: false
    };
    
    if (montoTransferencia > 0 && cuentaDestinoArsValue) {
        const [id, nombre] = cuentaDestinoArsValue.split('|');
        saleData.cuenta_destino_id = id;
        saleData.cuenta_destino_nombre = nombre;
    }
    if (montoTransferenciaUsd > 0 && cuentaDestinoUsdValue) {
        const [id, nombre] = cuentaDestinoUsdValue.split('|');
        saleData.cuenta_destino_usd_id = id;
        saleData.cuenta_destino_usd_nombre = nombre;
    }

    try {
        await db.runTransaction(async (t) => {
            const saleRef = db.collection("ventas").doc();
            t.update(db.collection("stock_individual").doc(imei), { estado: 'vendido' });
            
            if (saleData.monto_transferencia > 0 && saleData.cuenta_destino_id) {
                const cuentaRef = db.collection("cuentas_financieras").doc(saleData.cuenta_destino_id);
                t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(saleData.monto_transferencia) });
            }

            if (saleData.monto_transferencia_usd > 0 && saleData.cuenta_destino_usd_id) {
                const cuentaRef = db.collection("cuentas_financieras").doc(saleData.cuenta_destino_usd_id);
                t.update(cuentaRef, { saldo_actual_usd: firebase.firestore.FieldValue.increment(saleData.monto_transferencia_usd) });
            }

            // ===================== INICIO DE LA CORRECCIÓN CLAVE =====================
            // Si la venta tiene una comisión, la sumamos al total pendiente del vendedor.
            if (saleData.comision_vendedor_usd > 0) {
                const vendorRef = db.collection("vendedores").doc(saleData.vendedor);
                // Usamos FieldValue.increment para sumar de forma segura el nuevo valor.
                // Esto funciona aunque el vendedor no exista, creando el campo si es necesario.
                t.update(vendorRef, { 
                    comision_pendiente_usd: firebase.firestore.FieldValue.increment(saleData.comision_vendedor_usd) 
                });
            }
            // ====================== FIN DE LA CORRECCIÓN CLAVE =======================

            if (saleData.hubo_canje) {
                const canjeParaReparar = formData.get('canje-para-reparar') === 'on';

                if (canjeParaReparar) {
                    const reparacionRef = db.collection("reparaciones").doc();
                    t.set(reparacionRef, {
                        estado_reparacion: 'pendiente_asignar_imei', modelo: formData.get('canje-modelo'),
                        precio_costo_usd: saleData.valor_toma_canje_usd, defecto: formData.get('canje-defecto'),
                        repuesto_necesario: formData.get('canje-repuesto'), observaciones_canje: formData.get('canje-observaciones'),
                        venta_asociada_id: saleRef.id, fechaDeCarga: saleData.fecha_venta,
                        proveedor: "Usado (Plan Canje)"
                    });
                    saleData.id_reparacion_pendiente = reparacionRef.id;
                    saleData.canje_a_reparacion = true;
                } else {
                    const canjeRef = db.collection("plan_canje_pendientes").doc();
                    t.set(canjeRef, { 
                        modelo_recibido: formData.get('canje-modelo'), valor_toma_usd: saleData.valor_toma_canje_usd, 
                        observaciones_canje: formData.get('canje-observaciones'), producto_vendido: `${productDetails.modelo} ${productDetails.color}`, 
                        venta_asociada_id: saleRef.id, fecha_canje: saleData.fecha_venta, 
                        estado: 'pendiente_de_carga' 
                    });
                    saleData.id_canje_pendiente = canjeRef.id;
                }
            }
            t.set(saleRef, saleData);
        });

        updateCanjeCount();
        updateReparacionCount();
        s.promptContainer.innerHTML = '';
        s.managementView.classList.add('hidden');
        switchView('dashboard', s.tabDashboard);
        updateReports();

    } catch (error) { 
        console.error("Error al registrar la venta:", error); 
        alert("Error al procesar la venta. Revisa la consola."); 
    } finally { 
        toggleSpinner(btn, false); 
    }
}

s.productForm.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btn-cancel-product-form') {
        e.preventDefault();
        
        showConfirmationModal('¿Cancelar Carga?', '¿Estás seguro de que quieres cancelar la carga de este producto? Se perderán los datos ingresados.', () => {
            // Limpiamos cualquier contexto activo
            canjeContext = null;
            batchLoadContext = null;
            wholesaleSaleContext = null;
            
            // Reseteamos la vista y volvemos al dashboard
            resetManagementView();
            switchView('dashboard', s.tabDashboard);
        });
    }
});

async function handleProductFormSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const form = e.target;
    const mode = form.dataset.mode || 'create';
    toggleSpinner(btn, true);

    const formData = new FormData(form);
    const imei = formData.get('imei').trim();
    if (!imei) {
        showFeedback("El campo IMEI no puede estar vacío.", "error");
        toggleSpinner(btn, false);
        return;
    }

    try {
        if (mode === 'update') {
            const originalImei = form.dataset.originalImei;
            const newImei = imei;
            const paraReparar = formData.get('para-reparar') === 'on';

            // ===== INICIO DE LA MODIFICACIÓN CLAVE =====
            if (paraReparar) {
                // CASO 1: El usuario activó el interruptor para enviar a reparación.
                if (newImei !== originalImei) {
                    throw new Error("No se puede cambiar el IMEI y enviar a reparación al mismo tiempo. Guarda un cambio a la vez.");
                }
                
                await db.runTransaction(async (t) => {
                    const stockRef = db.collection("stock_individual").doc(originalImei);
                    const reparacionRef = db.collection("reparaciones").doc(originalImei);

                    const stockDoc = await t.get(stockRef);
                    if (!stockDoc.exists) throw new Error("El producto que intentas mover ya no existe en el stock.");
                    const stockData = stockDoc.data();

                    const reparacionData = {
                        ...stockData,
                        estado_reparacion: 'en_proceso',
                        defecto: formData.get('defecto'),
                        repuesto_necesario: formData.get('repuesto'),
                        fechaDeCarga: stockData.fechaDeCarga // Mantiene la fecha de carga original
                    };
                    
                    t.set(reparacionRef, reparacionData); // Crea el registro en reparaciones
                    t.delete(stockRef); // Elimina el registro del stock
                });

                showGlobalFeedback("Producto enviado a reparación con éxito.", "success");
                setTimeout(() => {
                    resetManagementView();
                    switchView('dashboard', s.tabDashboard);
                    switchDashboardView('reparacion', s.btnShowReparacion);
                    updateReparacionCount();
                    updateReports();
                }, 1500);

            } else {
                // CASO 2: Es una actualización normal, sin enviar a reparación.
                const unitData = {
                    precio_costo_usd: parseFloat(formData.get('precio_costo_usd')) || 0,
                    modelo: formData.get('modelo'),
                    color: formData.get('color'),
                    bateria: parseInt(formData.get('bateria')),
                    almacenamiento: formData.get('almacenamiento'),
                    detalles_esteticos: formData.get('detalles'),
                    proveedor: formData.get('proveedor'),
                };

                if (newImei === originalImei) {
                    await db.collection("stock_individual").doc(originalImei).update(unitData);
                } else {
                    await db.runTransaction(async (t) => {
                        const oldDocRef = db.collection("stock_individual").doc(originalImei);
                        const newDocRef = db.collection("stock_individual").doc(newImei);
                        const newDocSnapshot = await t.get(newDocRef);
                        if (newDocSnapshot.exists) {
                            throw new Error(`El nuevo IMEI "${newImei}" ya existe en el stock.`);
                        }
                        const oldDoc = await t.get(oldDocRef);
                        const oldData = oldDoc.data();
                        const newUnitData = {
                            ...unitData,
                            imei: newImei,
                            imei_last_4: newImei.slice(-4),
                            estado: 'en_stock',
                            fechaDeCarga: oldData.fechaDeCarga
                        };
                        t.set(newDocRef, newUnitData);
                        t.delete(oldDocRef);
                    });
                }
                
                showGlobalFeedback("¡Producto actualizado con éxito!", "success");
                setTimeout(() => {
                    resetManagementView();
                    switchView('dashboard', s.tabDashboard);
                    loadStock();
                    updateReports();
                }, 1500);
            }
            // ===== FIN DE LA MODIFICACIÓN CLAVE =====

        } else { // MODO CREAR (sin cambios)
            const paraReparar = formData.get('para-reparar') === 'on';
            const costoIndividual = parseFloat(formData.get('precio_costo_usd')) || 0;
            const commonData = {
                imei,
                imei_last_4: imei.slice(-4),
                precio_costo_usd: costoIndividual,
                modelo: formData.get('modelo'),
                color: formData.get('color'),
                bateria: parseInt(formData.get('bateria')),
                almacenamiento: formData.get('almacenamiento'),
                detalles_esteticos: formData.get('detalles'),
                proveedor: batchLoadContext ? batchLoadContext.providerName : formData.get('proveedor'),
                fechaDeCarga: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.runTransaction(async (t) => {
                const stockRef = db.collection("stock_individual").doc(imei);
                const reparacionRef = db.collection("reparaciones").doc(imei);
                const [stockDoc, reparacionDoc] = await Promise.all([t.get(stockRef), t.get(reparacionRef)]);
                
                if ((stockDoc.exists && stockDoc.data().estado === 'en_stock') || reparacionDoc.exists) {
                    throw new Error(`El IMEI ${imei} ya se encuentra activo en el stock o en reparación.`);
                }

                if (paraReparar) {
                    const reparacionData = { ...commonData, estado_reparacion: 'en_proceso', defecto: formData.get('defecto'), repuesto_necesario: formData.get('repuesto') };
                    t.set(reparacionRef, reparacionData);
                } else {
                    const unitData = { ...commonData, estado: 'en_stock' };
                    t.set(stockRef, unitData);
                }
                
                const canjeId = form.dataset.canjeId;
                if (canjeId) {
                    const canjeRef = db.collection("plan_canje_pendientes").doc(canjeId);
                    t.delete(canjeRef);
                }
            });
            
            if (batchLoadContext && batchLoadContext.currentModel) {
                const modeloActual = batchLoadContext.currentModel;
                if (!batchLoadContext.modelosCargados[modeloActual]) {
                    batchLoadContext.modelosCargados[modeloActual] = [];
                }
                batchLoadContext.modelosCargados[modeloActual].push(imei);
                
                batchLoadContext.totalCostoAcumulado += costoIndividual;
                batchLoadContext.itemsCargados.push(commonData);

                const count = batchLoadContext.modelosCargados[modeloActual].length;
                let message = `¡Éxito! ${modeloActual} añadido. Cargados de este modelo: ${count}`;
                if (paraReparar) {
                    message += " (Enviado a Reparación)";
                    updateReparacionCount();
                }
                showFeedback(message, "success");
                
                setTimeout(() => { resetManagementView(true); }, 1500);

            } else {
                let message = `¡Éxito! ${commonData.modelo} añadido.`;
                if (paraReparar) {
                    message = `¡Éxito! ${commonData.modelo} enviado a la lista de reparación.`;
                    updateReparacionCount();
                } else {
                    message = `¡Éxito! ${commonData.modelo} añadido al stock.`;
                }
                showFeedback(message, "success");

                setTimeout(() => {
                    const vinoDeCanje = !!form.dataset.canjeId; 
                    resetManagementView();
                    switchView('dashboard', s.tabDashboard);

                    if (vinoDeCanje) {
                        switchDashboardView('canje', s.btnShowCanje);
                        updateCanjeCount();
                    } else if (paraReparar) {
                        switchDashboardView('reparacion', s.btnShowReparacion);
                    } else {
                        switchDashboardView('stock', s.btnShowStock);
                    }
                    
                    updateReports();
                }, 1500);
            }
        }
    } catch (error) {
        showFeedback(error.message || `Error al guardar el producto.`, "error");
        console.error("Error en handleProductFormSubmit:", error);
    } finally {
        toggleSpinner(btn, false);
    }
}


function resetManagementView(isBatchLoad = false, isCanje = false, isWholesaleSale = false) {
    s.promptContainer.innerHTML = '';
    s.feedbackMessage.classList.add('hidden');

    const wholesaleLoader = s.managementView.querySelector('#wholesale-sale-imei-loader');
    if (wholesaleLoader) wholesaleLoader.remove();
    
    s.productForm.querySelectorAll('.form-group, #product-form-submit-btn').forEach(el => {
        el.style.display = 'block';
    });

    s.productForm.reset();
    s.productForm.classList.add('hidden');
    
    s.scanOptions.classList.remove('hidden');
    s.scannerContainer.classList.add('hidden');

    s.managementTitle.textContent = "Gestión de IMEI";
    if (s.productFormSubmitBtn) {
        s.productFormSubmitBtn.querySelector('.btn-text').textContent = "Guardar Producto";
        
        const cancelButtonHtml = '<button type="button" id="btn-cancel-product-form" class="prompt-button cancel" style="margin-top: 1rem; background-color: var(--error-bg);">Cancelar</button>';
        const existingCancelBtn = s.productForm.querySelector('#btn-cancel-product-form');
        if (!existingCancelBtn) {
            s.productFormSubmitBtn.insertAdjacentHTML('afterend', cancelButtonHtml);
        }
    }

    const existingEndBtn = s.managementView.querySelector('.control-btn[id^="btn-end-"]');
    if (existingEndBtn) existingEndBtn.remove();
    
    const existingTitleBtn = s.managementTitle.nextElementSibling;
    if (existingTitleBtn && existingTitleBtn.matches('.control-btn')) {
        existingTitleBtn.remove();
    }
    
    if (batchLoadContext && batchLoadContext.currentModel) {
        const count = batchLoadContext.modelosCargados[batchLoadContext.currentModel]?.length || 0;
        s.managementTitle.textContent = `Cargando ${batchLoadContext.currentModel} (${count} cargados)`;
        
        const endModelLoadBtn = document.createElement('button');
        endModelLoadBtn.id = 'btn-end-model-load';
        endModelLoadBtn.className = 'control-btn';
        endModelLoadBtn.style.backgroundColor = 'var(--info-bg)';
        endModelLoadBtn.textContent = `Finalizar Carga de ${batchLoadContext.currentModel}`;
        
        endModelLoadBtn.onclick = () => {
            batchLoadContext.currentModel = null;
            s.managementView.classList.add('hidden'); 
            showModelSelectionStep(); 
        };

        s.managementTitle.insertAdjacentElement('afterend', endModelLoadBtn);
    }
    
    if (!isCanje) canjeContext = null;
    if (!isWholesaleSale) {
        if (!batchLoadContext || !batchLoadContext.currentModel) {
            batchLoadContext = null;
        }
    }

    if (isWholesaleSale && wholesaleSaleContext) {
        renderWholesaleLoader();
        s.scanOptions.classList.remove('hidden');
        const endBtn = document.createElement('button');
        endBtn.id = 'btn-end-process';
        endBtn.className = 'control-btn';
        endBtn.style.backgroundColor = 'var(--success-bg)';
        endBtn.textContent = 'Finalizar Carga y Registrar Venta';
        // MODIFICADO: Ahora llama al prompt final
        endBtn.onclick = () => promptToFinalizeWholesaleSale(); 
        s.managementTitle.insertAdjacentElement('afterend', endBtn);
    }
    
    delete s.productForm.dataset.mode;
    delete s.productForm.dataset.canjeId;
}

async function promptToFinalizeWholesaleSale() {
    if (!wholesaleSaleContext || wholesaleSaleContext.items.length === 0) {
        showGlobalFeedback("No has agregado ningún equipo a la venta.", "error");
        return;
    }

    const { clientId, clientName, totalSaleValue } = wholesaleSaleContext;

    let saldoAFavor = 0;
    let deudaFinalEstimada = totalSaleValue;
    let saldoHtml = '';

    try {
        const clientDoc = await db.collection('clientes_mayoristas').doc(clientId).get();
        if (clientDoc.exists) {
            const saldoActual = clientDoc.data().deuda_usd || 0;
            if (saldoActual < 0) {
                saldoAFavor = Math.abs(saldoActual);
                deudaFinalEstimada = totalSaleValue - saldoAFavor;

                saldoHtml = `
                <div class="details-box" style="margin-top: 1rem; border-color: var(--success-bg);">
                    <div class="detail-item">
                        <span>Saldo a Favor disponible:</span>
                        <strong style="color: var(--success-bg);">${formatearUSD(saldoAFavor)}</strong>
                    </div>
                    <div class="checkbox-group" style="justify-content: center; padding-top: 10px;">
                        <input type="checkbox" id="usar-saldo-cliente" name="usar_saldo_cliente" checked>
                        <label for="usar-saldo-cliente">Usar saldo para esta venta</label>
                    </div>
                </div>`;
            }
        }
    } catch (error) {
        console.error("Error al obtener saldo del cliente:", error);
        showGlobalFeedback("No se pudo obtener el saldo del cliente.", "error");
    }

    // ===== INICIO DE LA MODIFICACIÓN =====
    // Filtramos las cuentas por moneda y creamos los desplegables
    const accountsArsOptions = financialAccounts.filter(acc => acc.moneda === 'ARS').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('');
    const accountsUsdOptions = financialAccounts.filter(acc => acc.moneda === 'USD').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('');

    const metodosDePagoHtml = `
        <div class="form-group">
            <label>Monto(s) que paga AHORA</label>
            <div id="payment-methods-container">
                <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Dólares"><span class="toggle-switch-label">Paga con Dólares (Efectivo)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="monto_dolares" placeholder="Monto en USD" step="0.01"></div></div>
                <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Pesos (Efectivo)"><span class="toggle-switch-label">Paga con Pesos (Efectivo)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="monto_efectivo" placeholder="Monto en ARS" step="0.01"></div></div>
                <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Pesos (Transferencia)"><span class="toggle-switch-label">Paga con Transferencia (ARS)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="monto_transferencia" placeholder="Monto en ARS" step="0.01"><select name="cuenta_destino_ars">${accountsArsOptions}</select></div></div>
                <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Dólares (Transferencia)"><span class="toggle-switch-label">Paga con Transferencia (USD)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="monto_transferencia_usd" placeholder="Monto en USD" step="0.01"><select name="cuenta_destino_usd">${accountsUsdOptions}</select></div></div>
            </div>
        </div>`;
    // ===== FIN DE LA MODIFICACIÓN =====

    s.promptContainer.innerHTML = `
    <div class="container container-sm wholesale-sale-modal-box">
        <h3>Finalizar Venta a ${clientName}</h3>
        <form id="wholesale-sale-finalize-form" novalidate>
            <div class="details-box" style="text-align:center; padding: 1rem; margin-bottom: 2rem;">
                <div class="detail-item" style="flex-direction: column;">
                    <span style="font-size: 1rem; color: var(--text-muted);">Monto Total de la Venta</span>
                    <strong style="font-size: 2.2rem; color: var(--brand-yellow);">${formatearUSD(totalSaleValue)}</strong>
                </div>
            </div>

            ${saldoHtml}
            
            <div id="deuda-final-container" class="details-box" style="margin-top: 1rem; border-color: var(--brand-yellow); display: ${deudaFinalEstimada > 0 ? 'block' : 'none'};">
                 <div class="detail-item" style="flex-direction: column;">
                    <span style="font-size: 1rem; color: var(--text-muted);">Deuda Restante a Pagar</span>
                    <strong id="deuda-final-display" style="font-size: 2.2rem; color: var(--error-bg);">
                        ${formatearUSD(deudaFinalEstimada)}
                    </strong>
                </div>
            </div>

            <div class="form-group">
                <label>ID de la Venta (Ej: VTA-050)</label>
                <input type="text" name="sale_id" required>
            </div>
            ${metodosDePagoHtml}
            <div class="form-group">
                <label>Cotización del Dólar (si se paga en ARS)</label>
                <input type="number" name="cotizacion_dolar" placeholder="Ej: 1200">
            </div>
            
            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Confirmar y Guardar Venta</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;
    
    const form = document.getElementById('wholesale-sale-finalize-form');
    const usarSaldoCheckbox = document.getElementById('usar-saldo-cliente');
    if (usarSaldoCheckbox) {
        usarSaldoCheckbox.addEventListener('change', () => {
            const deudaDisplay = document.getElementById('deuda-final-display');
            const deudaContainer = document.getElementById('deuda-final-container');
            let nuevaDeuda;
            if (usarSaldoCheckbox.checked) {
                nuevaDeuda = totalSaleValue - saldoAFavor;
            } else {
                nuevaDeuda = totalSaleValue;
            }
            deudaDisplay.textContent = formatearUSD(nuevaDeuda);
            deudaContainer.style.display = nuevaDeuda > 0 ? 'block' : 'none';
        });
    }

    form.querySelectorAll('input[name="metodo_pago_check"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const container = e.target.closest('.payment-option').querySelector('.payment-input-container');
            container.classList.toggle('hidden', !e.target.checked);
            
            const select = container.querySelector('select');
            if(select) {
                select.required = e.target.checked;
            }
        });
    });
}
function showFeedback(message, type = 'info') {
    s.feedbackMessage.textContent = message;
    s.feedbackMessage.className = `feedback-message ${type}`;
    s.feedbackMessage.classList.remove('hidden');
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function showWholesaleHistory(clientId, clientName) {
    s.promptContainer.innerHTML = `
    <div class="container wholesale-history-modal">
        <h3>Historial de Movimientos</h3>
        <p class="client-name-subtitle">${clientName}</p>
        <div id="wholesale-history-content" class="table-container">
            <p class="dashboard-loader">Cargando historial...</p>
        </div>
        <div class="prompt-buttons" style="justify-content: center; margin-top: 1.5rem;">
            <button class="prompt-button cancel">Cerrar</button>
        </div>
    </div>`;

    const contentDiv = document.getElementById('wholesale-history-content');
    try {
        const salesPromise = db.collection('ventas_mayoristas').where('clienteId', '==', clientId).get();
        const paymentsPromise = db.collection('pagos_mayoristas').where('clienteId', '==', clientId).get();
        const [salesSnapshot, paymentsSnapshot] = await Promise.all([salesPromise, paymentsPromise]);

        let transactions = [];
        salesSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ ...data, id: doc.id, type: 'venta', date: data.fecha_venta.toDate() }); });
        paymentsSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ ...data, id: doc.id, type: 'pago', date: data.fecha.toDate() }); });
        transactions.sort((a, b) => b.date - a.date);

        if (transactions.length === 0) { contentDiv.innerHTML = '<p class="dashboard-loader">Este cliente no tiene movimientos registrados.</p>'; return; }

        const tableHTML = `
            <table>
                <thead> <tr> <th>Fecha</th> <th>Tipo</th> <th>Detalle</th> <th style="color: var(--error-bg);">Debe</th> <th style="color: var(--success-bg);">Haber</th> <th style="text-align:right;">Acciones</th> </tr> </thead>
                <tbody>
                    ${transactions.map(item => {
                        if (item.type === 'venta') {
                            const saleJSON = JSON.stringify(item).replace(/'/g, "\\'");
                            return `
                            <tr data-sale-id="${item.id}" data-sale-item='${saleJSON}'>
                                <td>${item.date.toLocaleString('es-AR')}</td> <td>Venta</td> <td>ID: ${item.venta_id_manual} (${item.cantidad_equipos} equipos)</td>
                                <td>${formatearUSD(item.total_venta_usd)}</td> <td>${formatearUSD(item.pago_recibido.total_pagado_usd || 0)}</td>
                                <td class="actions-cell"> <button class="control-btn btn-view-sale-detail" style="background-color: var(--info-bg);">Ver Detalle</button> <button class="control-btn btn-revert-sale">Revertir</button> </td>
                            </tr>`;
                        } else { // type === 'pago'
                            // --- INICIO DE LA MODIFICACIÓN ---
                            let detallePago = item.notas || 'Pago a cuenta';
                            if (item.venta_manual_id_asociada) {
                                detallePago = `Saldo Venta #${item.venta_manual_id_asociada}`;
                            }
                            // --- FIN DE LA MODIFICACIÓN ---
                            return `
                            <tr class="payment-row">
                                <td>${item.date.toLocaleString('es-AR')}</td> <td>Pago</td>
                                <td>${detallePago}</td>
                                <td></td> <td style="color: var(--success-bg); font-weight: bold;">${formatearUSD(item.monto_total_usd)}</td>
                                <td class="actions-cell">
                                    <button class="delete-btn btn-delete-ws-payment" title="Eliminar Pago" disabled>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </td>
                            </tr>`;
                        }
                    }).join('')}
                </tbody>
            </table>`;
        contentDiv.innerHTML = tableHTML;
        
        contentDiv.querySelectorAll('.btn-view-sale-detail').forEach(button => button.addEventListener('click', (e) => { const row = e.currentTarget.closest('tr'); const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'")); showWholesaleSaleDetail(row.dataset.saleId, saleItem); }));
        contentDiv.querySelectorAll('.btn-revert-sale').forEach(button => button.addEventListener('click', (e) => { const row = e.currentTarget.closest('tr'); const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'")); revertWholesaleSale(row.dataset.saleId, saleItem, () => showWholesaleHistory(clientId, clientName)); }));
    } catch (error) {
        handleDBError(error, contentDiv, 'historial de compras');
    }
}

async function showWholesaleSaleDetail(masterSaleId, masterSaleData) {
    s.promptContainer.innerHTML = `
    <div class="container wholesale-history-modal">
        <h3>Detalle de Venta: ${masterSaleData.venta_id_manual}</h3>
        <p class="client-name-subtitle">Cliente: ${masterSaleData.clienteNombre}</p>
        <div id="wholesale-detail-content" class="table-container">
            <p class="dashboard-loader">Cargando detalle de equipos...</p>
        </div>
        <div class="prompt-buttons" style="justify-content: center; margin-top: 1.5rem;">
            <button class="prompt-button cancel">Cerrar</button>
        </div>
    </div>`;

    const detailContent = document.getElementById('wholesale-detail-content');
    try {
        const individualSalesQuery = db.collection('ventas').where('venta_mayorista_ref', '==', masterSaleId);
        const snapshot = await individualSalesQuery.get();

        if (snapshot.empty) {
            detailContent.innerHTML = '<p class="dashboard-loader">No se encontraron los equipos detallados para esta venta.</p>';
            return;
        }

        const items = snapshot.docs.map(doc => doc.data());

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>IMEI</th>
                        <th>Modelo</th>
                        <th>Color</th>
                        <th>Batería</th>
                        <th>Precio Venta (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>${item.imei_vendido}</td>
                            <td>${item.producto.modelo}</td>
                            <td>${item.producto.color}</td>
                            <td>${item.producto.bateria}%</td>
                            <td>${formatearUSD(item.precio_venta_usd)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
        detailContent.innerHTML = tableHTML;

    } catch (error) {
        handleDBError(error, detailContent, `el detalle de la venta ${masterSaleData.venta_id_manual}`);
    }
}

function revertWholesaleSale(masterSaleId, masterSaleData, callback) {
    const message = `¿Estás seguro de que quieres revertir la venta <strong>${masterSaleData.venta_id_manual}</strong> por un total de <strong>${formatearUSD(masterSaleData.total_venta_usd)}</strong>?
    <br><br>
    <strong style="color:var(--error-bg);">¡ATENCIÓN!</strong> Esta acción es irreversible y hará lo siguiente:
    <ul>
        <li>Los <strong>${masterSaleData.cantidad_equipos} equipos</strong> de esta venta volverán al stock.</li>
        <li>Se eliminarán todos los registros de venta asociados.</li>
        <li>El total comprado y la deuda del cliente <strong>${masterSaleData.clienteNombre}</strong> se reajustarán.</li>
    </ul>`;

    showConfirmationModal('Confirmar Reversión de Venta Mayorista', message, async () => {
        try {
            showGlobalFeedback('Revirtiendo venta mayorista...', 'loading', 5000);

            const individualSalesQuery = db.collection('ventas').where('venta_mayorista_ref', '==', masterSaleId);
            const individualSalesSnapshot = await individualSalesQuery.get();

            await db.runTransaction(async t => {
                const masterSaleRef = db.collection('ventas_mayoristas').doc(masterSaleId);
                const clientRef = db.collection('clientes_mayoristas').doc(masterSaleData.clienteId);

                if (!individualSalesSnapshot.empty) {
                    for (const doc of individualSalesSnapshot.docs) {
                        const ventaIndividual = doc.data();
                        const imei = ventaIndividual.imei_vendido;
                        if (imei) {
                            const stockRef = db.collection('stock_individual').doc(imei);
                            t.update(stockRef, { estado: 'en_stock' });
                        }
                        t.delete(doc.ref);
                    }
                } else {
                    console.warn(`No se encontraron registros de venta individuales para la venta maestra ${masterSaleId}. Se procederá a eliminar solo el registro maestro.`);
                }

                const clientDoc = await t.get(clientRef).catch(() => null);
                if (clientDoc && clientDoc.exists) {
                    
                    // ===== INICIO DE LA MODIFICACIÓN CLAVE =====
                    // 1. Calculamos la deuda neta que generó esta venta.
                    const pagoRecibido = masterSaleData.pago_recibido.total_pagado_usd || 0;
                    const cambioNetoEnDeuda = masterSaleData.total_venta_usd - pagoRecibido;
                    
                    // 2. Actualizamos tanto el total comprado como la deuda del cliente.
                    t.update(clientRef, {
                        total_comprado_usd: firebase.firestore.FieldValue.increment(-masterSaleData.total_venta_usd),
                        deuda_usd: firebase.firestore.FieldValue.increment(-cambioNetoEnDeuda)
                    });
                    // ===== FIN DE LA MODIFICACIÓN CLAVE =====

                } else {
                     console.warn(`El cliente ${masterSaleData.clienteId} no fue encontrado. No se puede actualizar su total de compra.`);
                }
                
                t.delete(masterSaleRef);
            });

            showGlobalFeedback(`Venta ${masterSaleData.venta_id_manual} revertida con éxito.`, 'success');
            
            if (callback && typeof callback === 'function') {
                callback();
            } else {
                loadWholesaleClients();
                updateReports();
            }

        } catch (error) {
            console.error("Error al revertir la venta mayorista:", error);
            showGlobalFeedback(error.message || "Error crítico al revertir la venta. Revisa la consola.", "error", 6000);
        } finally {
            const modal = document.getElementById('confirmation-modal-overlay');
            if(modal) modal.remove();
        }
    });
}

async function resyncWholesaleClientTotal(clientId, clientName) {
    const message = `Esto recalculará TANTO el "Total Comprado" como el "Saldo Deudor" para <strong>${clientName}</strong> basándose en todo su historial de ventas y pagos.
    <br><br>
    Esta acción corregirá cualquier inconsistencia en los saldos. ¿Deseas continuar?`;
    
    showConfirmationModal('Recalcular Saldos Completos del Cliente', message, async () => {
        try {
            showGlobalFeedback('Resincronizando saldos, por favor espera...', 'info', 3000);

            // 1. Obtenemos TODAS las ventas y TODOS los pagos del cliente.
            const salesPromise = db.collection('ventas_mayoristas').where('clienteId', '==', clientId).get();
            const paymentsPromise = db.collection('pagos_mayoristas').where('clienteId', '==', clientId).get();

            const [salesSnapshot, paymentsSnapshot] = await Promise.all([salesPromise, paymentsPromise]);

            // 2. Inicializamos los contadores a cero.
            let totalSalesValue = 0;
            let totalPaidValue = 0;

            // 3. Sumamos todas las ventas y los pagos realizados DENTRO de cada venta.
            salesSnapshot.forEach(doc => {
                const sale = doc.data();
                totalSalesValue += sale.total_venta_usd || 0;
                // Sumamos el pago que se hizo al momento de esa venta específica
                if (sale.pago_recibido && sale.pago_recibido.total_pagado_usd) {
                    totalPaidValue += sale.pago_recibido.total_pagado_usd;
                }
            });

            // 4. Sumamos todos los pagos a cuenta que se hicieron por separado.
            paymentsSnapshot.forEach(doc => {
                totalPaidValue += doc.data().monto_total_usd || 0;
            });

            // 5. Calculamos la nueva deuda real.
            const newDebt = totalSalesValue - totalPaidValue;

            // 6. Actualizamos el documento del cliente con AMBOS valores correctos.
            await db.collection('clientes_mayoristas').doc(clientId).update({
                total_comprado_usd: totalSalesValue,
                deuda_usd: newDebt
            });

            showGlobalFeedback(`¡Éxito! Saldos para "${clientName}" resincronizados.`, 'success');
            loadWholesaleClients(); // Esto refrescará la tarjeta con los valores correctos.

        } catch (error) {
            console.error("Error al resincronizar los saldos del cliente:", error);
            showGlobalFeedback("Error al resincronizar. Revisa la consola.", "error");
        }
    });
}
// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function renderWholesaleClients(clients) {
    if (!clients || clients.length === 0) {
        s.wholesaleClientsListContainer.innerHTML = `<p class="dashboard-loader">No hay clientes mayoristas. ¡Agrega el primero!</p>`;
        return;
    }

    s.wholesaleClientsListContainer.innerHTML = clients.map(client => {
        const totalComprado = client.total_comprado_usd || 0;
        const deuda = client.deuda_usd || 0;
        const ultimaCompra = client.fecha_ultima_compra ? new Date(client.fecha_ultima_compra.seconds * 1000).toLocaleDateString('es-AR') : 'Nunca';
        const deleteTitle = 'Eliminar Cliente (irreversible)';

        let statLabel = 'Saldo Deudor';
        let statClass = 'debt';
        let statValueDisplay = formatearUSD(deuda);

        if (deuda < 0) {
            statLabel = 'Saldo a Favor';
            statClass = 'zero';
            statValueDisplay = formatearUSD(Math.abs(deuda));
        } else if (deuda === 0) {
            statClass = 'zero';
        }

        // ===== INICIO DE LA MODIFICACIÓN =====
        // Se cambió la estructura de .pcm-stats por una nueva llamada .pcm-balance-stacked
        // para apilar los saldos verticalmente y evitar desbordamientos.
        return `
        <div class="provider-card-modern" data-client-id="${client.id}" data-debt-value="${deuda}">
            
            <div class="pcm-header">
                <div class="pcm-info">
                    <h3>${client.nombre}</h3>
                    <p>Última Compra: ${ultimaCompra}</p>
                </div>
                <button class="pcm-delete-btn btn-delete-wholesale-client" title="${deleteTitle}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>

            <div class="pcm-balance-stacked">
                <div class="stacked-stat-item">
                    <span class="stat-label">Total Comprado</span>
                    <span class="stat-value" style="color: var(--brand-yellow);">${formatearUSD(totalComprado)}</span>
                </div>
                <div class="stacked-stat-item">
                    <span class="stat-label">${statLabel}</span>
                    <span class="stat-value ${statClass}">${statValueDisplay}</span>
                </div>
            </div>

            <div class="pcm-actions">
                 <button class="pcm-primary-action btn-new-wholesale-sale">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span>Registrar Venta</span>
                </button>
                <button class="pcm-action-btn btn-register-ws-payment" title="Registrar Pago a Cuenta">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    <span>Registrar Pago</span>
                </button>
                <button class="pcm-action-btn btn-view-wholesale-history" title="Ver historial de ventas y pagos">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span>Ver Historial</span>
                </button>
                <button class="pcm-action-btn btn-resync-client" title="Recalcular el total comprado del cliente">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    <span>Resincronizar</span>
                </button>
            </div>
        </div>`;
        // ===== FIN DE LA MODIFICACIÓN =====
    }).join('');
}

function deleteWholesaleClient(clientId, clientName) {
    const message = `¿Estás seguro de que quieres eliminar al cliente "<strong>${clientName}</strong>"?<br><br><strong style="color: var(--error-bg);">¡ATENCIÓN!</strong> Esta acción es irreversible y también <strong>eliminará TODAS sus ventas asociadas</strong> y devolverá los equipos al stock.`;
    
    showConfirmationModal('Confirmar Eliminación Completa', message, async () => {
        try {
            showGlobalFeedback('Eliminando cliente y revirtiendo sus ventas... Por favor espera.', 'loading', 10000);

            // 1. Buscar todas las ventas maestras de este cliente.
            const salesSnapshot = await db.collection('ventas_mayoristas')
                .where('clienteId', '==', clientId)
                .get();
            
            // 2. Por cada venta maestra, ejecutar la lógica de reversión.
            for (const saleDoc of salesSnapshot.docs) {
                const saleId = saleDoc.id;
                const saleData = saleDoc.data();

                await db.runTransaction(async t => {
                    const masterSaleRef = db.collection('ventas_mayoristas').doc(saleId);
                    
                    // Buscar ventas individuales asociadas
                    const individualSalesQuery = db.collection('ventas').where('venta_mayorista_ref', '==', saleId);
                    const individualSalesSnapshot = await individualSalesQuery.get(); 

                    for (const doc of individualSalesSnapshot.docs) {
                        const ventaIndividual = doc.data();
                        const imei = ventaIndividual.imei_vendido;
                        if (imei) {
                            const stockRef = db.collection('stock_individual').doc(imei);
                            t.update(stockRef, { estado: 'en_stock' });
                        }
                        t.delete(doc.ref);
                    }
                    
                    // Eliminar la venta maestra
                    t.delete(masterSaleRef);
                });
            }

            // 3. Una vez revertidas todas las ventas, eliminar al cliente.
            await db.collection('clientes_mayoristas').doc(clientId).delete();

            showGlobalFeedback(`Cliente "${clientName}" y todas sus ventas han sido eliminados.`, 'success');
            loadWholesaleClients(); // Recargar la lista de clientes
            updateReports(); // Actualizar los KPIs de caja

        } catch (error) {
            console.error("Error eliminando cliente y sus ventas:", error);
            showGlobalFeedback('Error crítico al eliminar el cliente. Revisa la consola.', 'error');
        }
    });
}

async function loadReparaciones() {
    s.reparacionTableContainer.innerHTML = `<p class="dashboard-loader">Cargando equipos para reparar...</p>`;
    try {
        const querySnapshot = await db.collection("reparaciones").orderBy("fechaDeCarga", "desc").get();
        if (querySnapshot.empty) {
            s.reparacionTableContainer.innerHTML = `<p class="dashboard-loader">No hay equipos pendientes de reparación.</p>`;
            return;
        }

        let tableHTML = `<table><thead><tr><th>Fecha Carga</th><th>Modelo</th><th>Origen</th><th>Defecto</th><th>Repuesto Necesario</th><th>Costo (USD)</th><th>Acción</th></tr></thead><tbody>`;

        querySnapshot.forEach(doc => {
            const item = doc.data();
            const fechaObj = item.fechaDeCarga ? new Date(item.fechaDeCarga.seconds * 1000) : null;
            let fechaFormateada = fechaObj ? `${String(fechaObj.getDate()).padStart(2, '0')}/${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}` : 'N/A';
            const itemJSON = JSON.stringify(item).replace(/'/g, "\\'");
            
            const accionHtml = `<label class="toggle-switch-group"><input type="checkbox" class="reparado-checkbox" data-item-id="${doc.id}" data-item-data='${itemJSON}'><span class="toggle-switch-label">Reparado</span><span class="toggle-switch-slider"></span></label>`;

            tableHTML += `<tr>
                <td>${fechaFormateada}</td>
                <td>${item.modelo || ''} ${item.color || ''}<br><small class="time-muted">IMEI: ${item.imei || 'Pendiente'}</small></td>
                <td>${item.proveedor || 'N/A'}</td> 
                <td>${item.defecto || 'N/A'}</td>
                <td>${item.repuesto_necesario || 'N/A'}</td>
                <td>${formatearUSD(item.precio_costo_usd)}</td>
                <td>${accionHtml}</td>
            </tr>`;
        });
        s.reparacionTableContainer.innerHTML = tableHTML + `</tbody></table>`;

        s.reparacionTableContainer.querySelectorAll('.reparado-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const docId = e.target.dataset.itemId;
                    const itemData = JSON.parse(e.target.dataset.itemData.replace(/\\'/g, "'"));
                    promptToFinalizeReparacion(docId, itemData);
                    e.target.checked = false; 
                }
            });
        });

    } catch (error) {
        handleDBError(error, s.reparacionTableContainer, "equipos en reparación");
    }
}

async function marcarComoReparado(itemId, itemData) {
    showGlobalFeedback("Moviendo equipo a stock...", "loading");
    try {
        const stockData = { ...itemData };
        delete stockData.defecto;
        delete stockData.repuesto_necesario;
        stockData.estado = 'en_stock';
        stockData.fueReparado = true;
        stockData.fechaDeCarga = firebase.firestore.FieldValue.serverTimestamp(); 

        await db.runTransaction(async (t) => {
            const reparacionRef = db.collection("reparaciones").doc(itemId);
            const stockRef = db.collection("stock_individual").doc(itemId);

            t.delete(reparacionRef);
            t.set(stockRef, stockData);
        });

        showGlobalFeedback("¡Equipo movido a stock con éxito!", "success");
        loadReparaciones();
        
        // ===== ACTUALIZAMOS EL CONTADOR AQUÍ =====
        updateReparacionCount();
        
        updateReports();

    } catch (error) {
        console.error("Error al marcar como reparado:", error);
        showGlobalFeedback("Error al mover el equipo a stock. Revisa la consola.", "error");
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function promptToFinalizeReparacion(docId, itemData) {
    const formHtml = `
        <div class="container container-sm" style="margin: auto;">
            <h3>Finalizar Reparación y Cargar a Stock</h3>
            <p style="color:var(--text-muted); text-align: center; margin-bottom: 2rem;">Completa los datos finales del ${itemData.modelo}.</p>
            <form id="finalize-reparacion-form" data-doc-id="${docId}">
                <div class="form-group">
                    <label for="imei-form">IMEI</label>
                    <input type="text" id="imei-form" name="imei" value="${itemData.imei || ''}" required>
                </div>
                <div class="form-group">
                    <label for="bateria">Condición de Batería (%)</label>
                    <input type="number" id="bateria" name="bateria" placeholder="Ej: 89" min="1" max="100" value="${itemData.bateria || ''}" required>
                </div>
                <div class="form-group">
                    <label for="color-form">Color</label>
                    <select id="color-form" name="color" required>${colores.map(c => `<option value="${c}" ${itemData.color === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
                </div>
                <div class="form-group">
                    <label for="almacenamiento-form">Almacenamiento</label>
                    <select id="almacenamiento-form" name="almacenamiento" required>${almacenamientos.map(a => `<option value="${a}" ${itemData.almacenamiento === a ? 'selected' : ''}>${a}</option>`).join('')}</select>
                </div>
                <div class="form-group">
                    <label for="detalles-form">Detalles Estéticos</label>
                    <select id="detalles-form" name="detalles" required>${detallesEsteticos.map(d => `<option value="${d}" ${itemData.detalles_esteticos === d ? 'selected' : ''}>${d}</option>`).join('')}</select>
                </div>
                
                <div class="form-group">
                    <label for="detalles-reparacion">Detalles de la Reparación (Observación)</label>
                    <textarea id="detalles-reparacion" name="detalles_reparacion" rows="2" placeholder="Ej: Se cambió el módulo de la pantalla por uno original." required></textarea>
                </div>

                <div class="form-group">
                    <label for="proveedor-final-form">Origen del Equipo</label>
                    <input type="text" id="proveedor-final-form" name="proveedor" value="${itemData.proveedor || 'N/A'}" readonly style="background-color: #222; cursor: not-allowed;">
                </div>
                <div class="prompt-buttons">
                    <button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Mover a Stock</span><div class="spinner"></div></button>
                    <button type="button" class="prompt-button cancel">Cancelar</button>
                </div>
            </form>
        </div>`;
    
    s.promptContainer.innerHTML = formHtml;
    document.getElementById('finalize-reparacion-form').dataset.originalData = JSON.stringify(itemData);
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function saveFinalizedReparacion(form) {
    const btn = form.querySelector('button[type="submit"]');
    toggleSpinner(btn, true);

    const docId = form.dataset.docId;
    const originalData = JSON.parse(form.dataset.originalData);
    const formData = new FormData(form);
    const imei = formData.get('imei').trim();

    if (!imei) {
        showGlobalFeedback("El IMEI es obligatorio.", "error");
        toggleSpinner(btn, false);
        return;
    }

    try {
        const stockData = {
            ...originalData,
            imei: imei,
            // ===== MODIFICACIÓN AQUÍ: AÑADIMOS EL NUEVO CAMPO =====
            imei_last_4: imei.slice(-4),
            bateria: parseInt(formData.get('bateria')),
            color: formData.get('color'),
            almacenamiento: formData.get('almacenamiento'),
            detalles_esteticos: formData.get('detalles'),
            estado: 'en_stock',
            fueReparado: true,
            fechaDeCarga: firebase.firestore.FieldValue.serverTimestamp(),
            detalles_reparacion: formData.get('detalles_reparacion').trim()
        };
        
        delete stockData.defecto;
        delete stockData.repuesto_necesario;
        delete stockData.estado_reparacion;
        delete stockData.venta_asociada_id;
        delete stockData.observaciones_canje;

        await db.runTransaction(async (t) => {
            const reparacionRef = db.collection("reparaciones").doc(docId);
            const stockRef = db.collection("stock_individual").doc(imei);

            t.delete(reparacionRef);
            t.set(stockRef, stockData);
        });

        s.promptContainer.innerHTML = '';
        showGlobalFeedback("¡Equipo movido a stock con éxito!", "success");
        loadReparaciones();
        updateReparacionCount();
        updateReports();

    } catch (error) {
        console.error("Error al finalizar la reparación:", error);
        showGlobalFeedback("Error al mover el equipo a stock. Revisa la consola.", "error");
    } finally {
        toggleSpinner(btn, false);
    }
}

async function loadPaginatedData(config) {
    const { type, collectionName, filters, orderByField, orderByDirection = 'asc', direction, renderFunction, setupEventListeners } = config;
    
    const s_pagination = s[`${type}PaginationControls`];
    const s_tableContainer = s[`${type}TableContainer`];
    const s_itemsPerPage = s[`${type}ItemsPerPage`];
    const s_prevPage = s[`${type}PrevPage`];
    const s_nextPage = s[`${type}NextPage`];
    const s_pageInfo = s[`${type}PageInfo`];
    const s_filterBtn = type === 'stock' ? s.btnApplyStockFilters : s.btnApplySalesFilters;
    
    s_tableContainer.innerHTML = `<p class="dashboard-loader">Cargando...</p>`;
    toggleSpinner(s_filterBtn, true);

    try {
        const state = paginationState[type];
        let itemsPerPage = parseInt(s_itemsPerPage.value);
        const seeAll = s_itemsPerPage.value === 'all';
        if (seeAll) itemsPerPage = 500;

        let query = db.collection(collectionName);

        filters.forEach(filter => {
            query = query.where(filter[0], filter[1], filter[2]);
        });
        
        query = query.orderBy(orderByField, orderByDirection);

        if (direction === 'next' && state.lastVisible) {
            state.currentPage++;
            state.pageHistory.push(state.lastVisible);
            query = query.startAfter(state.lastVisible);
        } else if (direction === 'prev' && state.currentPage > 1) {
            state.currentPage--;
            state.pageHistory.pop();
            const prevPageStart = state.pageHistory[state.pageHistory.length - 1];
            if (prevPageStart) {
                query = query.startAfter(prevPageStart);
            }
        }
        
        query = query.limit(itemsPerPage);
        const querySnapshot = await query.get();

        s_pagination.classList.remove('hidden');

        if (querySnapshot.empty && state.currentPage === 1) {
            s_tableContainer.innerHTML = `<p class="dashboard-loader">No se encontraron resultados con los filtros aplicados.</p>`;
            s_pagination.classList.add('hidden');
            return;
        }
        
        if (querySnapshot.empty) {
            s_tableContainer.innerHTML = `<p class="dashboard-loader">No hay más resultados para mostrar.</p>`;
            s_nextPage.disabled = true;
            return;
        }

        let tableHeader = type === 'stock' 
            ? '<tr><th class="hide-on-mobile">Fecha Carga</th><th>Modelo</th><th class="hide-on-mobile">Proveedor</th><th>Color</th><th class="hide-on-mobile">GB</th><th>Batería</th><th class="hide-on-mobile">Costo (USD)</th><th>Acciones</th></tr>'
            : '<tr><th>Fecha</th><th>Producto</th><th>Cliente</th><th>Vendedor</th><th>Precio (USD)</th><th>Pago</th><th>Garantía</th><th>Acciones</th></tr>';

        let tableHTML = `<table><thead>${tableHeader}</thead><tbody>`;
        querySnapshot.forEach(doc => {
            tableHTML += renderFunction(doc);
        });
        s_tableContainer.innerHTML = tableHTML + `</tbody></table>`;
        
        state.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        
        s_pageInfo.textContent = `Página ${state.currentPage}`;
        s_prevPage.disabled = state.currentPage === 1 || seeAll;
        
        let nextQuery = db.collection(collectionName);
        filters.forEach(filter => { nextQuery = nextQuery.where(filter[0], filter[1], filter[2]); });
        nextQuery = nextQuery.orderBy(orderByField, orderByDirection).startAfter(state.lastVisible).limit(1);
        const nextSnapshot = await nextQuery.get();
        s_nextPage.disabled = nextSnapshot.empty || seeAll;
        
        if(seeAll) {
             s_pageInfo.textContent = `Mostrando todos (${querySnapshot.size})`;
        }

        if (setupEventListeners) setupEventListeners();

    } catch (error) {
        handleDBError(error, s_tableContainer, type);
        s_pagination.classList.add('hidden');
    } finally {
        toggleSpinner(s_filterBtn, false);
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function promptToRegisterWholesalePayment(clientId, clientName, currentDebt) {
    paymentContext = { id: clientId, name: clientName };

    let salesWithDebtOptions = '<option value="">Pago General a Cuenta</option>';
    try {
        const salesSnapshot = await db.collection('ventas_mayoristas').where('clienteId', '==', clientId).where('deuda_generada_usd', '>', 0).orderBy('deuda_generada_usd', 'desc').get();
        salesSnapshot.forEach(doc => {
            const sale = doc.data();
            const fecha = sale.fecha_venta.toDate().toLocaleDateString('es-AR');
            salesWithDebtOptions += `<option value="${doc.id}|${sale.venta_id_manual}">${sale.venta_id_manual} (${fecha}) - Pendiente: ${formatearUSD(sale.deuda_generada_usd)}</option>`;
        });
    } catch (error) {
        console.error("Error buscando ventas con deuda:", error);
        showGlobalFeedback("No se pudieron cargar las ventas pendientes.", "error");
    }

    if (!financialAccounts || financialAccounts.length === 0) {
        try {
            const accountsSnapshot = await db.collection('cuentas_financieras').orderBy('nombre').get();
            financialAccounts = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) { showGlobalFeedback("Error al cargar las cuentas financieras.", "error"); return; }
    }
    
    // ===== INICIO DE LA MODIFICACIÓN (1/2) - Creamos los selectores para AMBAS monedas =====
    const accountsArsOptionsHtml = financialAccounts.filter(acc => acc.moneda === 'ARS').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre} (${formatearARS(acc.saldo_actual_ars)})</option>`).join('');
    const accountsUsdOptionsHtml = financialAccounts.filter(acc => acc.moneda === 'USD').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre} (${formatearUSD(acc.saldo_actual_usd)})</option>`).join('');

    const accountArsSelectHtml = `<div class="form-group" style="margin-top: 1.5rem;"><select name="cuenta_destino_ars"><option value="">Seleccione cuenta...</option>${accountsArsOptionsHtml}</select><label>Acreditar en Cuenta ARS</label></div>`;
    const accountUsdSelectHtml = `<div class="form-group" style="margin-top: 1.5rem;"><select name="cuenta_destino_usd"><option value="">Seleccione cuenta...</option>${accountsUsdOptionsHtml}</select><label>Acreditar en Cuenta USD</label></div>`;
    // ===== FIN DE LA MODIFICACIÓN =====
    
    const cotizacionHtml = `<div id="cotizacion-dolar-group" class="form-group hidden" style="margin-top: 1.5rem;"><input type="number" name="cotizacion_dolar" placeholder="Valor del dólar blue" step="0.01"><label>Cotización del Dólar</label></div>`;

    s.promptContainer.innerHTML = `
        <div class="container container-sm">
            <div class="prompt-box">
                <h3>Registrar Pago de ${clientName}</h3>
                <p>${currentDebt >= 0 ? `Deuda actual: <strong>${formatearUSD(currentDebt)}</strong>` : `Saldo a favor actual: <strong style="color: var(--success-bg);">${formatearUSD(Math.abs(currentDebt))}</strong>`}</p>
                <form id="wholesale-payment-form">
                    <div class="form-group"><label for="venta-asociada">Aplicar pago a Venta Específica (Opcional)</label><select id="venta-asociada" name="venta_asociada">${salesWithDebtOptions}</select></div>
                    <div class="form-group"><label for="payment-total">Monto del Pago (USD)</label><input type="number" id="payment-total" name="total" step="0.01" required></div>
                    <div class="form-group payment-details-group">
                        <label>Ingresa a Caja como</label>
                        
                        <!-- ===== INICIO DE LA MODIFICACIÓN (2/2) - Se añade el nuevo bloque de Transferencia USD ===== -->
                        <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" id="pay-usd" name="pay-usd" class="payment-method-cb"><span class="toggle-switch-label">Dólares (Efectivo)</span><span class="toggle-switch-slider"></span></label><div id="pay-usd-fields" class="payment-input-container hidden"><input type="number" name="dolares" placeholder="Monto USD"></div></div>
                        <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" id="pay-ars-efectivo" name="pay-ars-efectivo" class="payment-method-cb"><span class="toggle-switch-label">Pesos (Efectivo)</span><span class="toggle-switch-slider"></span></label><div id="pay-ars-efectivo-fields" class="payment-input-container hidden"><input type="number" name="efectivo" placeholder="Monto ARS"></div></div>
                        <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" id="pay-ars-transfer" name="pay-ars-transfer" class="payment-method-cb"><span class="toggle-switch-label">Transferencia (ARS)</span><span class="toggle-switch-slider"></span></label><div id="pay-ars-transfer-fields" class="payment-input-container hidden"><input type="number" name="transferencia" placeholder="Monto ARS">${accountArsSelectHtml}</div></div>
                        <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" id="pay-usd-transfer" name="pay-usd-transfer" class="payment-method-cb"><span class="toggle-switch-label">Transferencia (USD)</span><span class="toggle-switch-slider"></span></label><div id="pay-usd-transfer-fields" class="payment-input-container hidden"><input type="number" name="transferencia_usd" placeholder="Monto USD">${accountUsdSelectHtml}</div></div>
                        <!-- ===== FIN DE LA MODIFICACIÓN ===== -->
                        
                        ${cotizacionHtml}
                    </div>
                    <div class="form-group"><label for="payment-notes">Notas (Opcional)</label><textarea id="payment-notes" name="notas" rows="2" placeholder="Ej: Saldo de la VTA-050"></textarea></div>
                    <div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Registrar Pago</span><div class="spinner"></div></button><button type="button" class="prompt-button cancel">Cancelar</button></div>
                </form>
            </div>
        </div>`;
}

async function saveWholesalePayment(form) {
    const btn = form.querySelector('button[type="submit"]');
    toggleSpinner(btn, true);

    const clientId = paymentContext.id;
    const clientName = paymentContext.name;
    const formData = new FormData(form);
    const totalPaymentUSD = parseFloat(formData.get('total'));
    const notas = (formData.get('notas') || '').trim();
    
    // ===== INICIO DE LA MODIFICACIÓN (1/2) - Leemos los nuevos campos del formulario =====
    const usdAmount = parseFloat(formData.get('dolares')) || 0;
    const arsEfectivoAmount = parseFloat(formData.get('efectivo')) || 0;
    const arsTransferAmount = parseFloat(formData.get('transferencia')) || 0;
    const usdTransferAmount = parseFloat(formData.get('transferencia_usd')) || 0;
    
    const cuentaDestinoArsValue = formData.get('cuenta_destino_ars');
    const cuentaDestinoUsdValue = formData.get('cuenta_destino_usd');
    const cotizacion = parseFloat(formData.get('cotizacion_dolar')) || 0;
    // ===== FIN DE LA MODIFICACIÓN =====

    const ventaAsociadaValue = formData.get('venta_asociada');
    let ventaAsociadaId = null;
    let ventaManualIdAsociada = null;
    if (ventaAsociadaValue) {
        [ventaAsociadaId, ventaManualIdAsociada] = ventaAsociadaValue.split('|');
    }

    if (isNaN(totalPaymentUSD) || totalPaymentUSD <= 0) { showGlobalFeedback("El monto del pago debe ser válido y mayor a cero.", "error"); toggleSpinner(btn, false); return; }
    if ((usdAmount + arsEfectivoAmount + arsTransferAmount + usdTransferAmount) === 0) { showGlobalFeedback("Debes especificar cómo ingresa el pago a la caja.", "error"); toggleSpinner(btn, false); return; }
    if (arsTransferAmount > 0 && !cuentaDestinoArsValue) { showGlobalFeedback("Debes seleccionar una cuenta de destino para la transferencia en ARS.", "error"); toggleSpinner(btn, false); return; }
    if (usdTransferAmount > 0 && !cuentaDestinoUsdValue) { showGlobalFeedback("Debes seleccionar una cuenta de destino para la transferencia en USD.", "error"); toggleSpinner(btn, false); return; }
    if ((arsEfectivoAmount > 0 || arsTransferAmount > 0) && cotizacion <= 0) { showGlobalFeedback("Debes ingresar una cotización válida para pagos en pesos.", "error"); toggleSpinner(btn, false); return; }

    try {
        await db.runTransaction(async t => {
            const fecha = firebase.firestore.FieldValue.serverTimestamp();
            const clientRef = db.collection('clientes_mayoristas').doc(clientId);
            
            t.update(clientRef, { deuda_usd: firebase.firestore.FieldValue.increment(-totalPaymentUSD) });

            if (ventaAsociadaId) {
                const ventaRef = db.collection('ventas_mayoristas').doc(ventaAsociadaId);
                t.update(ventaRef, { deuda_generada_usd: firebase.firestore.FieldValue.increment(-totalPaymentUSD) });
            }

            const pagoRef = db.collection('pagos_mayoristas').doc();
            t.set(pagoRef, {
                clienteId: clientId,
                clienteNombre: clientName,
                monto_total_usd: totalPaymentUSD,
                fecha,
                notas,
                cotizacion_dolar: cotizacion,
                venta_asociada_id: ventaAsociadaId,
                venta_manual_id_asociada: ventaManualIdAsociada
            });

            let descripcionBase = `Cobranza de C/C a ${clientName}`;
            if (ventaManualIdAsociada) {
                descripcionBase = `Pago de Venta #${ventaManualIdAsociada} de ${clientName}`;
            }
            if (usdAmount > 0) { t.set(db.collection('ingresos_caja').doc(), { categoria: 'Cobranza Mayorista', descripcion: descripcionBase, monto: usdAmount, metodo: 'Dólares', fecha }); }
            if (arsEfectivoAmount > 0) { t.set(db.collection('ingresos_caja').doc(), { categoria: 'Cobranza Mayorista', descripcion: descripcionBase, monto: arsEfectivoAmount, metodo: 'Pesos (Efectivo)', fecha, cotizacion_dolar: cotizacion }); }
            if (arsTransferAmount > 0) {
                const [cuentaId, cuentaNombre] = cuentaDestinoArsValue.split('|');
                t.set(db.collection('ingresos_caja').doc(), { categoria: 'Cobranza Mayorista', descripcion: descripcionBase, monto: arsTransferAmount, metodo: 'Pesos (Transferencia)', fecha, cuenta_destino_id: cuentaId, cuenta_destino_nombre: cuentaNombre, cotizacion_dolar: cotizacion });
                const cuentaRef = db.collection('cuentas_financieras').doc(cuentaId);
                t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(arsTransferAmount) });
            }
            // ===== INICIO DE LA MODIFICACIÓN (2/2) - Lógica para guardar la transferencia en USD =====
            if (usdTransferAmount > 0) {
                const [cuentaId, cuentaNombre] = cuentaDestinoUsdValue.split('|');
                t.set(db.collection('ingresos_caja').doc(), { 
                    categoria: 'Cobranza Mayorista', 
                    descripcion: descripcionBase, 
                    monto: usdTransferAmount, 
                    metodo: 'Dólares (Transferencia)', 
                    fecha, 
                    cuenta_destino_usd_id: cuentaId, 
                    cuenta_destino_usd_nombre: cuentaNombre 
                });
                const cuentaRef = db.collection('cuentas_financieras').doc(cuentaId);
                t.update(cuentaRef, { saldo_actual_usd: firebase.firestore.FieldValue.increment(usdTransferAmount) });
            }
            // ===== FIN DE LA MODIFICACIÓN =====
        });

        showGlobalFeedback('Pago de cliente registrado con éxito.', 'success');
        s.promptContainer.innerHTML = '';
        loadWholesaleClients();
        loadFinancialData();
        updateReports();
    } catch (error) {
        console.error("Error al registrar el pago del cliente:", error);
        showGlobalFeedback('Error al registrar el pago.', 'error');
    } finally {
        toggleSpinner(btn, false);
        paymentContext = null;
    }
}

async function loadFinancialData() {
    if (!s.accountsListContainer) return;
    s.accountsListContainer.innerHTML = `<p class="dashboard-loader">Cargando cuentas...</p>`;
    // ===== INICIO DE LA MODIFICACIÓN =====
    const totalArsEl = document.getElementById('financiera-total-balance-ars');
    const totalUsdEl = document.getElementById('financiera-total-balance-usd');
    if (totalArsEl) totalArsEl.textContent = '...';
    if (totalUsdEl) totalUsdEl.textContent = '...';
    // ===== FIN DE LA MODIFICACIÓN =====

    try {
        const snapshot = await db.collection('cuentas_financieras').orderBy('nombre').get();
        
        // ===== INICIO DE LA MODIFICACIÓN =====
        let totalBalanceArs = 0;
        let totalBalanceUsd = 0;
        
        financialAccounts = snapshot.docs.map(doc => {
            const data = doc.data();
            totalBalanceArs += data.saldo_actual_ars || 0;
            totalBalanceUsd += data.saldo_actual_usd || 0;
            return { id: doc.id, ...data };
        });

        if (totalArsEl) totalArsEl.textContent = formatearARS(totalBalanceArs);
        if (totalUsdEl) totalUsdEl.textContent = formatearUSD(totalBalanceUsd);
        // ===== FIN DE LA MODIFICACIÓN =====
        
        renderFinancialAccounts(financialAccounts);

    } catch (error) {
        handleDBError(error, s.accountsListContainer, "cuentas financieras");
        // ===== INICIO DE LA MODIFICACIÓN =====
        if (totalArsEl) totalArsEl.textContent = 'Error';
        if (totalUsdEl) totalUsdEl.textContent = 'Error';
        // ===== FIN DE LA MODIFICACIÓN =====
    }
}

function renderFinancialAccounts(accounts) {
    if (accounts.length === 0) {
        s.accountsListContainer.innerHTML = `<p class="dashboard-loader" style="grid-column: 1 / -1;">No has creado ninguna cuenta. ¡Crea la primera para empezar!</p>`;
        return;
    }

    s.accountsListContainer.innerHTML = accounts.map(account => `
        <div class="account-card" data-account-id="${account.id}" style="animation-delay: ${accounts.indexOf(account) * 100}ms;">
            <div class="account-card-header">
                <span class="account-name">
                    ${account.nombre}
                    <span class="account-currency-badge">${account.moneda || 'N/A'}</span>
                </span>
                ${account.alias ? `<span class="account-alias">${account.alias}</span>` : ''}
            </div>
            <div class="account-card-balance">
                <span class="balance-value">${account.moneda === 'USD' ? formatearUSD(account.saldo_actual_usd) : formatearARS(account.saldo_actual_ars)}</span>
            </div>
            ${account.detalles ? `<p style="text-align:center; color: var(--text-muted); font-size: 0.9rem; margin-top: auto;">${account.detalles}</p>` : ''}
            <div class="account-card-actions">
                <button class="action-btn-icon btn-move-money" title="Mover / Cobrar Dinero de esta Cuenta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                </button>
                <button class="action-btn-icon btn-delete-account" title="Eliminar Cuenta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        </div>
        <!-- Contenedor para el detalle desplegable -->
        <div class="account-history-container" data-container-for="${account.id}"></div>
    `).join('');
}

function promptToCreateAccount() {
    s.promptContainer.innerHTML = `
    <div class="financiera-modal-box">
        <h3>Crear Nueva Cuenta</h3>
        <form id="financiera-account-form" novalidate>
            <div class="form-group">
                <input type="text" id="account-name" name="nombre" required placeholder=" ">
                <label for="account-name">Nombre de la Cuenta (Ej: Brubank Twins)</label>
            </div>

            <div class="form-group">
                <select id="account-moneda" name="moneda" required>
                    <option value="" disabled selected></option>
                    <option value="ARS">Pesos (ARS)</option>
                    <option value="USD">Dólares (USD)</option>
                </select>
                <label for="account-moneda">Moneda de la Cuenta</label>
            </div>

            <div class="form-group">
                <input type="text" id="account-alias" name="alias" placeholder=" ">
                <label for="account-alias">Alias o CBU (Opcional)</label>
            </div>
            <div class="form-group">
                <textarea id="account-details" name="detalles" rows="1" placeholder=" "></textarea>
                <label for="account-details">Notas / Detalles (Opcional)</label>
            </div>
            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Guardar Cuenta</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;

    const textarea = document.getElementById('account-details');
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }
}

async function saveFinancialAccount(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const accountData = {
        nombre: form.nombre.value.trim(),
        // ===== INICIO DE LA MODIFICACIÓN =====
        moneda: form.moneda.value, // Guardamos la moneda seleccionada
        // ===== FIN DE LA MODIFICACIÓN =====
        alias: form.alias.value.trim(),
        detalles: form.detalles.value.trim(),
        saldo_actual_ars: 0, 
        saldo_actual_usd: 0, // Añadimos un campo para el saldo en USD
        fecha_creacion: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!accountData.nombre || !accountData.moneda) {
        showGlobalFeedback("El nombre y la moneda de la cuenta son obligatorios.", "error");
        toggleSpinner(btn, false);
        return;
    }

    try {
        await db.collection('cuentas_financieras').add(accountData);
        showGlobalFeedback('Cuenta creada con éxito', 'success');
        s.promptContainer.innerHTML = '';
        loadFinancialData();
    } catch (error) {
        console.error("Error guardando la cuenta:", error);
        showGlobalFeedback('Error al crear la cuenta', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

// 5. FUNCIÓN PARA ELIMINAR UNA CUENTA
function deleteFinancialAccount(accountId) {
    // Primero, recuperamos los datos de la cuenta para mostrar info en el modal
    db.collection('cuentas_financieras').doc(accountId).get().then(doc => {
        if (!doc.exists) {
            showGlobalFeedback("La cuenta ya no existe.", "error");
            return;
        }
        const account = doc.data();
        const message = `¿Estás seguro de que quieres eliminar la cuenta "<strong>${account.nombre}</strong>"?<br><br><strong style="color: var(--error-bg);">¡ATENCIÓN!</strong> Esta acción es irreversible. Solo deberías hacerlo si la cuenta ya no se usa y su saldo es $0.`;
        
        showConfirmationModal('Confirmar Eliminación de Cuenta', message, async () => {
            try {
                await db.collection('cuentas_financieras').doc(accountId).delete();
                showGlobalFeedback(`Cuenta "${account.nombre}" eliminada correctamente.`, 'success');
                loadFinancialData();
            } catch (error) {
                console.error("Error al eliminar la cuenta:", error);
                showGlobalFeedback('No se pudo eliminar la cuenta.', 'error');
            }
        });
    }).catch(error => {
        console.error("Error al obtener datos de la cuenta para eliminar:", error);
        showGlobalFeedback('Error al obtener datos de la cuenta.', 'error');
    });
}

async function toggleAccountHistory(accountCard, accountId, dateRange = null) {
    const historyContainer = s.accountsListContainer.querySelector(`[data-container-for="${accountId}"]`);
    
    if (accountCard.classList.contains('active') && !dateRange) {
        accountCard.classList.remove('active');
        historyContainer.style.maxHeight = null;
        setTimeout(() => { historyContainer.innerHTML = ''; }, 500);
        return;
    }

    s.accountsListContainer.querySelectorAll('.account-card.active').forEach(card => {
        if (card !== accountCard) {
            card.classList.remove('active');
            const otherContainer = card.nextElementSibling;
            otherContainer.style.maxHeight = null;
            setTimeout(() => { otherContainer.innerHTML = ''; }, 500);
        }
    });

    accountCard.classList.add('active');
    
    let startDate, endDate;
    if (dateRange) {
        startDate = dateRange.start;
        endDate = dateRange.end;
    } else {
        const now = new Date();
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    const filtersHtml = `<div class="filters-container" id="history-filter-container" style="padding: 1rem; background-color: #111;"><div class="filter-group"><label>Desde</label><input type="date" id="history-start-date-${accountId}" class="history-start-date"></div><div class="filter-group"><label>Hasta</label><input type="date" id="history-end-date-${accountId}" class="history-end-date"></div><div class="filter-group"><button class="btn-filter-history">Filtrar</button></div></div>`;
    historyContainer.innerHTML = filtersHtml + `<div id="history-results-wrapper"> <p class="dashboard-loader" style="padding: 1rem 0;">Buscando transacciones...</p> </div>`;
    const resultsWrapper = historyContainer.querySelector('#history-results-wrapper');

    try {
        const salesPromise = db.collection('ventas').where('cuenta_destino_id', '==', accountId).where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).orderBy('fecha_venta', 'desc').get();
        const salesUsdPromise = db.collection('ventas').where('cuenta_destino_usd_id', '==', accountId).where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).orderBy('fecha_venta', 'desc').get();
        const ingresosPromise = db.collection('ingresos_caja').where('cuenta_destino_id', '==', accountId).where('fecha', '>=', startDate).where('fecha', '<=', endDate).orderBy('fecha', 'desc').get();
        const ingresosUsdPromise = db.collection('ingresos_caja').where('cuenta_destino_usd_id', '==', accountId).where('fecha', '>=', startDate).where('fecha', '<=', endDate).orderBy('fecha', 'desc').get();
        const transferInPromise = db.collection('movimientos_internos').where('cuenta_destino_id', '==', accountId).where('fecha', '>=', startDate).where('fecha', '<=', endDate).orderBy('fecha', 'desc').get();
        const transferOutPromise = db.collection('movimientos_internos').where('cuenta_origen_id', '==', accountId).where('fecha', '>=', startDate).where('fecha', '<=', endDate).orderBy('fecha', 'desc').get();
        const todosLosGastosPromise = db.collection('gastos').where('cuenta_origen_id', '==', accountId).where('fecha', '>=', startDate).where('fecha', '<=', endDate).orderBy('fecha', 'desc').get();
        const wholesalePaymentsPromise = db.collection('ventas_mayoristas').where('pago_recibido.cuenta_destino_id', '==', accountId).where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).orderBy('fecha_venta', 'desc').get();
        const wholesalePaymentsUsdPromise = db.collection('ventas_mayoristas').where('pago_recibido.cuenta_destino_usd_id', '==', accountId).where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).orderBy('fecha_venta', 'desc').get();
        
        // ===== INICIO DE LA CORRECCIÓN CLAVE =====
        // El último elemento de la lista tenía un nombre de variable incorrecto.
        const [ 
            salesSnapshot, salesUsdSnapshot, ingresosSnapshot, ingresosUsdSnapshot, transferInSnapshot, 
            transferOutSnapshot, todosLosGastosSnapshot, wholesalePaymentsSnapshot, wholesalePaymentsUsdSnapshot 
        ] = await Promise.all([ 
            salesPromise, salesUsdPromise, ingresosPromise, ingresosUsdPromise, transferInPromise, transferOutPromise, 
            todosLosGastosPromise, wholesalePaymentsPromise, wholesalePaymentsUsdPromise // <--- AQUÍ ESTABA EL ERROR CORREGIDO
        ]);
        // ===== FIN DE LA CORRECCIÓN CLAVE =====

        let transactions = [];
        salesSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ date: data.fecha_venta.toDate(), type: 'Ingreso', description: `Venta: ${data.producto.modelo}`, amount: data.monto_transferencia, moneda: 'ARS' }); });
        ingresosSnapshot.forEach(doc => { const data = doc.data(); let description = `Ingreso: ${data.categoria}`; if (data.categoria === 'Cobranza Mayorista') { description = data.descripcion; } transactions.push({ date: data.fecha.toDate(), type: 'Ingreso', description: description, amount: data.monto, moneda: 'ARS' }); });
        salesUsdSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ date: data.fecha_venta.toDate(), type: 'Ingreso', description: `Venta: ${data.producto.modelo}`, amount: data.monto_transferencia_usd, moneda: 'USD' }); });
        ingresosUsdSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ date: data.fecha.toDate(), type: 'Ingreso', description: `Ingreso: ${data.categoria}`, amount: data.monto, moneda: 'USD' }); });
        transferInSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ date: data.fecha.toDate(), type: 'Ingreso', description: `Recibido de: ${data.cuenta_origen_nombre}`, amount: data.monto_ars, moneda: 'ARS' }); });
        transferOutSnapshot.forEach(doc => { const data = doc.data(); let description = ''; if (data.tipo === 'Transferencia entre Cuentas') { description = `Enviado a: ${data.cuenta_destino_nombre}`; } else if (data.tipo === 'Retiro a Caja') { description = `Retiro a Caja (Efectivo)`; } else if (data.tipo === 'Retiro a Caja (USD)') { description = `Retiro a Caja (Dólares)`; } transactions.push({ date: data.fecha.toDate(), type: 'Egreso', description: description, amount: -data.monto_ars, moneda: 'ARS' }); });
        wholesalePaymentsSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ date: data.fecha_venta.toDate(), type: 'Ingreso', description: `Cobro Vta. Mayorista: ${data.clienteNombre}`, amount: data.pago_recibido.ars_transferencia, moneda: 'ARS' }); });
        wholesalePaymentsUsdSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ date: data.fecha_venta.toDate(), type: 'Ingreso', description: `Cobro Vta. Mayorista: ${data.clienteNombre}`, amount: data.pago_recibido.usd_transferencia, moneda: 'USD' }); });
        
        todosLosGastosSnapshot.forEach(doc => {
            const data = doc.data();
            let description = `Gasto: ${data.categoria}`;
            if (data.categoria === 'Comisiones') description = `Comisión: ${data.vendedor || 'N/A'}`;
            if (data.categoria === 'Pago a Proveedor') description = data.descripcion || 'Pago a Proveedor';
            
            const moneda = data.metodo_pago === 'Dólares (Transferencia)' ? 'USD' : 'ARS';
            transactions.push({ date: data.fecha.toDate(), type: 'Egreso', description, amount: -data.monto, moneda });
        });
        
        transactions.sort((a, b) => b.date - a.date);
        
        resultsWrapper.innerHTML = ''; 

        if (transactions.length === 0) {
            resultsWrapper.innerHTML = `<div class="history-content-wrapper"><p class="dashboard-loader">No hay movimientos para este período.</p></div>`;
        } else {
            const tableHTML = `
                <div class="history-content-wrapper">
                    <table>
                        <thead><tr><th>Fecha</th><th>Tipo</th><th>Concepto</th><th style="text-align:right;">Monto</th></tr></thead>
                        <tbody>
                            ${transactions.map(item => `
                                <tr>
                                    <td data-label="Fecha">${item.date.toLocaleString('es-AR')}</td>
                                    <td data-label="Tipo"><span style="color: ${item.type === 'Ingreso' ? 'var(--success-bg)' : 'var(--error-bg)'}; font-weight: 500;">${item.type}</span></td>
                                    <td data-label="Concepto">${item.description}</td>
                                    <td data-label="Monto" style="font-weight: 600; color: ${item.amount > 0 ? 'inherit' : 'var(--error-bg)'};">${item.moneda === 'USD' ? formatearUSD(item.amount) : formatearARS(item.amount)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`;
            resultsWrapper.innerHTML = tableHTML;
        }
    } catch (error) {
        console.error("Error al cargar historial de cuenta:", error);
        let errorMessage = `<p class="dashboard-loader" style="color: var(--error-bg);">Error al cargar el historial.`;
        if (error.message && error.message.includes("index")) {
            const linkRegex = /(https?:\/\/[^\s]+)/;
            const linkMatch = error.message.match(linkRegex);
            if (linkMatch) { errorMessage += `<br><br><strong style="color: #fff;">ACCIÓN REQUERIDA:</strong><br>Firebase necesita un nuevo índice. Por favor, haz clic en el siguiente enlace para crearlo:<br><a href="${linkMatch[0]}" target="_blank" style="color: var(--brand-yellow); word-break: break-all;">Crear Índice en Firebase</a>`; }
        }
        errorMessage += `</p>`;
        resultsWrapper.innerHTML = `<div class="history-content-wrapper">${errorMessage}</div>`;
    }
    
    const startDateInput = historyContainer.querySelector('.history-start-date');
    const endDateInput = historyContainer.querySelector('.history-end-date');
    startDateInput.valueAsDate = startDate;
    endDateInput.valueAsDate = endDate;

    const filterBtn = historyContainer.querySelector('.btn-filter-history');
    filterBtn.addEventListener('click', () => {
        const newStartDate = new Date(startDateInput.value + 'T00:00:00');
        const newEndDate = new Date(endDateInput.value + 'T23:59:59');
        toggleAccountHistory(accountCard, accountId, { start: newStartDate, end: newEndDate });
    });
    
    historyContainer.style.maxHeight = historyContainer.scrollHeight + "px";
}

function promptToMoveMoney(accountId, accountName) {
    const account = financialAccounts.find(acc => acc.id === accountId);
    if (!account) {
        showGlobalFeedback("No se encontró la cuenta.", "error");
        return;
    }

    const otherAccountsOptions = financialAccounts
        .filter(acc => acc.id !== accountId) // Excluimos la cuenta actual
        .map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`)
        .join('');

    s.promptContainer.innerHTML = `
    <div class="financiera-modal-box">
        <h3>Mover Dinero de ${accountName}</h3>
        <p style="text-align:center; color: var(--text-muted); margin-top:-2rem; margin-bottom: 2rem;">Saldo actual: <strong>${formatearARS(account.saldo_actual_ars)}</strong></p>
        
        <form id="move-money-form" novalidate data-account-id="${accountId}" data-account-name="${accountName}">
            <div class="form-group">
                <select id="move-type" name="move_type" required>
                    <option value="" disabled selected></option>
                    <option value="to_cash_ars">Retirar a Caja (Pesos)</option>
                    <option value="to_cash_usd">Retirar a Caja (Dólares)</option>
                    <option value="to_other_account" ${!otherAccountsOptions ? 'disabled' : ''}>Transferir a otra cuenta</option>
                </select>
                <label for="move-type">Tipo de Movimiento</label>
            </div>

            <div id="amount-ars-group" class="form-group hidden">
                <input type="number" name="amount_ars" placeholder=" " step="0.01" max="${account.saldo_actual_ars}">
                <label>Monto a Retirar (ARS)</label>
            </div>

            <div id="conversion-group" class="hidden">
                <div class="form-group">
                    <input type="number" name="amount_usd" placeholder=" " step="0.01">
                    <label>Monto Recibido (USD)</label>
                </div>
                <div class="form-group">
                    <input type="number" name="cotizacion" placeholder=" ">
                    <label>A cotización de</label>
                </div>
            </div>

            <div id="destination-account-group" class="form-group hidden">
                <select name="destination_account">
                    <option value="" disabled selected>Seleccione cuenta destino...</option>
                    ${otherAccountsOptions}
                </select>
                <label>Transferir a</label>
            </div>
            
            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Confirmar Movimiento</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;

    const form = document.getElementById('move-money-form');
    const moveTypeSelect = form.querySelector('#move-type');
    
    moveTypeSelect.addEventListener('change', () => {
        const type = moveTypeSelect.value;
        form.querySelector('#amount-ars-group').classList.toggle('hidden', !type);
        form.querySelector('#conversion-group').classList.toggle('hidden', type !== 'to_cash_usd');
        form.querySelector('#destination-account-group').classList.toggle('hidden', type !== 'to_other_account');
        
        form.amount_ars.required = (type === 'to_cash_ars' || type === 'to_other_account');
        form.amount_usd.required = (type === 'to_cash_usd');
    });
}


// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function executeMoneyMovement(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    
    const sourceAccountId = form.dataset.accountId;
    const sourceAccountName = form.dataset.accountName;
    const moveType = formData.get('move_type');
    const amountArs = parseFloat(formData.get('amount_ars')) || 0;

    try {
        await db.runTransaction(async t => {
            const sourceAccountRef = db.collection('cuentas_financieras').doc(sourceAccountId);
            const fechaMovimiento = firebase.firestore.FieldValue.serverTimestamp();

            // Restamos SIEMPRE el dinero de la cuenta de origen
            t.update(sourceAccountRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(-amountArs) });
            
            if (moveType === 'to_cash_ars') {
                if (amountArs <= 0) throw new Error("El monto a retirar debe ser mayor a cero.");
                
                // YA NO CREAMOS un ingreso_caja. Solo el movimiento interno.
                const movimientoRef = db.collection('movimientos_internos').doc();
                t.set(movimientoRef, {
                    fecha: fechaMovimiento,
                    monto_ars: amountArs,
                    cuenta_origen_id: sourceAccountId,
                    cuenta_origen_nombre: sourceAccountName,
                    cuenta_destino_nombre: 'Caja (Pesos)',
                    tipo: 'Retiro a Caja'
                });

            } else if (moveType === 'to_cash_usd') {
                const amountUsd = parseFloat(formData.get('amount_usd')) || 0;
                if (amountArs <= 0 || amountUsd <= 0) throw new Error("Ambos montos (ARS y USD) son requeridos.");

                // Creamos el ingreso_caja para DÓLARES, porque es una moneda diferente
                const ingresoUsdRef = db.collection('ingresos_caja').doc();
                t.set(ingresoUsdRef, {
                    categoria: 'Retiro de Cuenta (Dólares)',
                    descripcion: `Retiro de ${formatearARS(amountArs)} desde ${sourceAccountName}`,
                    monto: amountUsd,
                    metodo: 'Dólares',
                    fecha: fechaMovimiento
                });
                
                // Y también el movimiento interno para registrar la SALIDA de ARS
                const movimientoArsRef = db.collection('movimientos_internos').doc();
                t.set(movimientoArsRef, {
                    fecha: fechaMovimiento,
                    monto_ars: amountArs,
                    cuenta_origen_id: sourceAccountId,
                    cuenta_origen_nombre: sourceAccountName,
                    cuenta_destino_nombre: 'Caja (Dólares)',
                    tipo: 'Retiro a Caja (USD)'
                });

            } else if (moveType === 'to_other_account') {
                const destinationValue = formData.get('destination_account');
                if (amountArs <= 0 || !destinationValue) throw new Error("El monto y la cuenta de destino son requeridos.");
                
                const [destinationAccountId, destinationAccountName] = destinationValue.split('|');
                const destinationAccountRef = db.collection('cuentas_financieras').doc(destinationAccountId);

                const movimientoRef = db.collection('movimientos_internos').doc();
                t.set(movimientoRef, {
                    fecha: fechaMovimiento,
                    monto_ars: amountArs,
                    cuenta_origen_id: sourceAccountId,
                    cuenta_origen_nombre: sourceAccountName,
                    cuenta_destino_id: destinationAccountId,
                    cuenta_destino_nombre: destinationAccountName,
                    tipo: 'Transferencia entre Cuentas'
                });
                
                t.update(destinationAccountRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(amountArs) });
            }
        });

        showGlobalFeedback('Movimiento realizado con éxito.', 'success');
        s.promptContainer.innerHTML = '';
        loadFinancialData();
        updateReports();

    } catch (error) {
        console.error("Error al ejecutar el movimiento:", error);
        showGlobalFeedback(error.message || 'Error al procesar el movimiento.', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

// Función que se dispara desde un nuevo botón en la sección de comisiones
function promptToAddVendedor() {
    s.promptContainer.innerHTML = `
    <div class="ingreso-modal-box">
        <h3>Crear Nuevo Vendedor</h3>
        <form id="vendedor-form" novalidate>
            <div class="form-group">
                <input type="text" id="vendedor-name" name="nombre" required placeholder=" ">
                <label for="vendedor-name">Nombre del Vendedor</label>
            </div>
            
            <div class="form-group">
                <input type="number" id="vendedor-saldo-inicial" name="saldo_inicial" placeholder=" " step="0.01" min="0">
                <label for="vendedor-saldo-inicial">Saldo Inicial a Favor (USD - Opcional)</label>
            </div>

            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Guardar Vendedor</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA
async function saveVendedor(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    
    const saldoInicial = parseFloat(form.saldo_inicial.value) || 0;
    
    const vendedorData = {
        nombre: form.nombre.value.trim(),
        // ===================== INICIO DE LA MODIFICACIÓN =====================
        // Guardamos el saldo inicial en un campo separado para mantenerlo como referencia histórica.
        saldo_inicial_usd: saldoInicial,
        // El saldo pendiente actual comienza siendo igual al saldo inicial.
        comision_pendiente_usd: saldoInicial,
        // ====================== FIN DE LA MODIFICACIÓN =======================
        fecha_creacion: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!vendedorData.nombre) {
        showGlobalFeedback("El nombre del vendedor es obligatorio.", "error");
        toggleSpinner(btn, false);
        return;
    }

    try {
        await db.collection('vendedores').doc(vendedorData.nombre).set(vendedorData, { merge: true }); // Usamos merge:true por si el vendedor ya existe
        showGlobalFeedback('Vendedor agregado/actualizado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        await loadAndPopulateSelects();
        loadCommissions();
    } catch (error) {
        console.error("Error guardando al vendedor:", error);
        showGlobalFeedback('Error al guardar. Es posible que ya exista un vendedor con ese nombre.', 'error', 5000);
    } finally {
        toggleSpinner(btn, false);
    }
}

// Función para eliminar un vendedor
function deleteVendedor(vendorName) {
    const message = `¿Estás seguro de que quieres eliminar al vendedor "<strong>${vendorName}</strong>"?<br><br>Esta acción es irreversible. Se eliminará de la lista y de los filtros.`;
    
    showConfirmationModal('Confirmar Eliminación de Vendedor', message, async () => {
        try {
            await db.collection('vendedores').doc(vendorName).delete();
            showGlobalFeedback(`Vendedor "${vendorName}" eliminado correctamente.`, 'success');
            await loadAndPopulateSelects(); // Actualizamos los selects de toda la app
            loadCommissions(); // Recargamos la vista
        } catch (error) {
            console.error("Error al eliminar al vendedor:", error);
            showGlobalFeedback('No se pudo eliminar al vendedor.', 'error');
        }
    });
}

// AÑADE ESTA NUEVA FUNCIÓN COMPLETA AL FINAL DE TU SCRIPT.JS

async function exportDailySummaryToExcel() {
    const btn = document.getElementById('btn-export-daily-summary');
    toggleSpinner(btn, true);

    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        // 1. OBTENER TODOS LOS DATOS DEL DÍA
        const fetchData = async (collection, dateField) => db.collection(collection).where(dateField, '>=', startOfDay).where(dateField, '<=', endOfDay).get();
        
        const [
            salesSnap, 
            expensesSnap, 
            miscIncomesSnap, 
            wholesaleSalesSnap
        ] = await Promise.all([
            fetchData('ventas', 'fecha_venta'),
            fetchData('gastos', 'fecha'),
            fetchData('ingresos_caja', 'fecha'),
            fetchData('ventas_mayoristas', 'fecha_venta')
        ]);

        // 2. PROCESAR LOS DATOS PARA CADA HOJA DEL EXCEL
        
        // Hoja 1: Detalle de Ventas
        let salesDetails = [];
        if (!salesSnap.empty) {
            const costPromises = salesSnap.docs.map(doc => db.collection("stock_individual").doc(doc.data().imei_vendido).get());
            const costDocs = await Promise.all(costPromises);
            const costMap = new Map(costDocs.map(doc => [doc.id, doc.data()?.precio_costo_usd || 0]));

            salesSnap.forEach(doc => {
                const venta = doc.data();
                const costo = costMap.get(venta.imei_vendido) || 0;
                const ganancia = (venta.precio_venta_usd || 0) - costo - (venta.comision_vendedor_usd || 0);
                salesDetails.push({
                    "Fecha y Hora": venta.fecha_venta.toDate().toLocaleString('es-AR'),
                    "Producto": `${venta.producto.modelo} ${venta.producto.almacenamiento}`,
                    "IMEI": venta.imei_vendido,
                    "Vendedor": venta.vendedor,
                    "Cliente": venta.nombre_cliente || '-',
                    "Precio Venta (USD)": venta.precio_venta_usd || 0,
                    "Costo (USD)": costo,
                    "Comisión (USD)": venta.comision_vendedor_usd || 0,
                    "Ganancia Neta (USD)": ganancia,
                    "Método Pago": venta.metodo_pago,
                    "Monto Dólares": venta.monto_dolares || 0,
                    "Monto Efectivo ARS": venta.monto_efectivo || 0,
                    "Monto Transf. ARS": venta.monto_transferencia || 0
                });
            });
        }

        // Hoja 2: Detalle de Gastos
        const expensesDetails = expensesSnap.docs.map(doc => {
            const gasto = doc.data();
            return {
                "Fecha y Hora": gasto.fecha.toDate().toLocaleString('es-AR'),
                "Categoría": gasto.categoria,
                "Descripción": gasto.descripcion || gasto.detalle_otro || '-',
                "Monto": gasto.monto,
                "Método de Pago": gasto.metodo_pago
            };
        });

        // Hoja 3: Detalle de Ingresos Varios
        const incomeDetails = miscIncomesSnap.docs.map(doc => {
            const ingreso = doc.data();
            return {
                "Fecha y Hora": ingreso.fecha.toDate().toLocaleString('es-AR'),
                "Categoría": ingreso.categoria,
                "Descripción": ingreso.descripcion || '-',
                "Monto": ingreso.monto,
                "Método de Ingreso": ingreso.metodo
            };
        });

        // Hoja 4: Resumen General
        let summary = {
            ingreso_dolares: 0, ingreso_efectivo_ars: 0, ingreso_transferencia_ars: 0,
            gastos_dolares: 0, gastos_efectivo_ars: 0, gastos_transferencia_ars: 0,
            ganancia_neta_usd: 0
        };
        salesDetails.forEach(v => {
            summary.ingreso_dolares += v["Monto Dólares"];
            summary.ingreso_efectivo_ars += v["Monto Efectivo ARS"];
            summary.ingreso_transferencia_ars += v["Monto Transf. ARS"];
            summary.ganancia_neta_usd += v["Ganancia Neta (USD)"];
        });
        wholesaleSalesSnap.forEach(doc => {
            const pago = doc.data().pago_recibido || {};
            summary.ingreso_dolares += pago.usd || 0;
            summary.ingreso_efectivo_ars += pago.ars_efectivo || 0;
            summary.ingreso_transferencia_ars += pago.ars_transferencia || 0;
        });
        incomeDetails.forEach(i => {
            if (i["Método de Ingreso"] === 'Dólares') summary.ingreso_dolares += i.Monto;
            if (i["Método de Ingreso"] === 'Pesos (Efectivo)') summary.ingreso_efectivo_ars += i.Monto;
            if (i["Método de Ingreso"] === 'Pesos (Transferencia)') summary.ingreso_transferencia_ars += i.Monto;
        });
        expensesDetails.forEach(g => {
            if (g["Método de Pago"] === 'Dólares') summary.gastos_dolares += g.Monto;
            if (g["Método de Pago"] === 'Pesos (Efectivo)') summary.gastos_efectivo_ars += g.Monto;
            if (g["Método de Pago"] === 'Pesos (Transferencia)') summary.gastos_transferencia_ars += g.Monto;
        });
        
        const summaryData = [
            { "Concepto": "Ingreso Total Dólares", "Monto": formatearUSD(summary.ingreso_dolares) },
            { "Concepto": "Ingreso Total Efectivo (ARS)", "Monto": formatearARS(summary.ingreso_efectivo_ars) },
            { "Concepto": "Ingreso Total Transferencia (ARS)", "Monto": formatearARS(summary.ingreso_transferencia_ars) },
            {}, // Fila vacía para separar
            { "Concepto": "Gastos Totales Dólares", "Monto": formatearUSD(summary.gastos_dolares) },
            { "Concepto": "Gastos Totales Efectivo (ARS)", "Monto": formatearARS(summary.gastos_efectivo_ars) },
            { "Concepto": "Gastos Totales Transferencia (ARS)", "Monto": formatearARS(summary.gastos_transferencia_ars) },
            {}, // Fila vacía para separar
            { "Concepto": "GANANCIA NETA TOTAL (PROFIT)", "Monto": formatearUSD(summary.ganancia_neta_usd) },
        ];

        // 3. CREAR Y DESCARGAR EL ARCHIVO EXCEL
        const wb = XLSX.utils.book_new();
        const wsSummary = XLSX.utils.json_to_sheet(summaryData);
        const wsSales = XLSX.utils.json_to_sheet(salesDetails);
        const wsExpenses = XLSX.utils.json_to_sheet(expensesDetails);
        const wsIncomes = XLSX.utils.json_to_sheet(incomeDetails);

        XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen General");
        XLSX.utils.book_append_sheet(wb, wsSales, "Detalle de Ventas");
        XLSX.utils.book_append_sheet(wb, wsExpenses, "Detalle de Gastos");
        XLSX.utils.book_append_sheet(wb, wsIncomes, "Detalle de Ingresos Varios");

        const fileName = `Reporte_Diario_iPhoneTwins_${now.toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        showGlobalFeedback('Reporte diario generado con éxito.', 'success');

    } catch (error) {
        console.error("Error al generar el reporte diario:", error);
        showGlobalFeedback('Error al generar el reporte diario. Revisa la consola.', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function promptToCollectBalance(providerId, providerName, balanceAmount) {
    const metodoOptions = metodosDePago.map(m => `<option value="${m}">${m}</option>`).join('');
    const accountsOptionsHtml = financialAccounts.length > 0
        ? financialAccounts.map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('')
        : '<option value="" disabled>No hay cuentas creadas</option>';
    
    const accountSelectHtml = `
        <div id="cobro-cuenta-group" class="form-group hidden" style="margin-top: 1rem;">
            <select name="cuenta_destino" required>
                <option value="" disabled selected></option>
                ${accountsOptionsHtml}
            </select>
            <label>Acreditar en Cuenta</label>
        </div>`;
    
    // ===== INICIO DE LA MODIFICACIÓN =====
    // Nuevo HTML para los campos de cotización y monto en ARS
    const arsFieldsHtml = `
        <div id="cobro-ars-fields" class="payment-details-group hidden">
            <div class="form-group">
                <input type="number" id="cobro-cotizacion" name="cotizacion_dolar" placeholder=" ">
                <label for="cobro-cotizacion">Cotización del Dólar</label>
            </div>
            <div class="form-group">
                <input type="number" id="cobro-monto-ars" name="monto_ars" placeholder=" " readonly>
                <label for="cobro-monto-ars">Monto a Ingresar (ARS)</label>
            </div>
        </div>`;
    // ===== FIN DE LA MODIFICACIÓN =====

    s.promptContainer.innerHTML = `
    <div class="ingreso-modal-box">
        <h3>Cobrar Saldo a ${providerName}</h3>
        <p style="text-align:center; color: var(--text-muted); margin-top:-1.5rem; margin-bottom: 2rem;">Saldo a favor disponible: <strong>${formatearUSD(balanceAmount)}</strong></p>
        <form id="collect-balance-form" novalidate>
            <div class="form-group">
                <input type="number" id="cobro-monto" name="monto" required placeholder=" " step="0.01" max="${balanceAmount}" value="${balanceAmount.toFixed(2)}">
                <label for="cobro-monto">Monto a Cobrar (USD)</label>
            </div>
            <div class="form-group">
                <select id="cobro-metodo" name="metodo" required>
                    <option value="" disabled selected></option>
                    ${metodoOptions}
                </select>
                <label for="cobro-metodo">Método de Ingreso a Caja</label>
            </div>
            ${arsFieldsHtml} {/* Se insertan los nuevos campos */}
            ${accountSelectHtml}
            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Registrar Cobro</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;

    const form = document.getElementById('collect-balance-form');
    const metodoSelect = form.querySelector('#cobro-metodo');
    const cuentaGroup = form.querySelector('#cobro-cuenta-group');
    const arsFields = form.querySelector('#cobro-ars-fields');
    const montoUsdInput = form.querySelector('#cobro-monto');
    const cotizacionInput = form.querySelector('#cobro-cotizacion');
    const montoArsInput = form.querySelector('#cobro-monto-ars');

    const calculateArs = () => {
        const montoUsd = parseFloat(montoUsdInput.value) || 0;
        const cotizacion = parseFloat(cotizacionInput.value) || 0;
        montoArsInput.value = (montoUsd > 0 && cotizacion > 0) ? (montoUsd * cotizacion).toFixed(2) : '';
    };

    metodoSelect.addEventListener('change', () => {
        const isPesos = metodoSelect.value.startsWith('Pesos');
        const isTransferencia = metodoSelect.value === 'Pesos (Transferencia)';
        
        arsFields.classList.toggle('hidden', !isPesos);
        cotizacionInput.required = isPesos;

        cuentaGroup.classList.toggle('hidden', !isTransferencia);
        cuentaGroup.querySelector('select').required = isTransferencia;
        
        calculateArs();
    });
    
    montoUsdInput.addEventListener('input', calculateArs);
    cotizacionInput.addEventListener('input', calculateArs);
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function saveCollectedBalance(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    
    const providerId = paymentContext.id;
    const providerName = paymentContext.name;
    const montoUSD = parseFloat(formData.get('monto'));
    const metodo = formData.get('metodo');
    const cuentaDestinoValue = formData.get('cuenta_destino');

    if (!montoUSD || montoUSD <= 0 || !metodo) {
        showGlobalFeedback("Completa todos los campos requeridos.", "error");
        toggleSpinner(btn, false);
        return;
    }
    if (metodo === 'Pesos (Transferencia)' && !cuentaDestinoValue) {
        showGlobalFeedback("Debes seleccionar una cuenta para la transferencia.", "error");
        toggleSpinner(btn, false);
        return;
    }

    try {
        await db.runTransaction(async t => {
            const providerRef = db.collection('proveedores').doc(providerId);
            const ingresoRef = db.collection('ingresos_caja').doc();
            
            t.update(providerRef, { deuda_usd: firebase.firestore.FieldValue.increment(montoUSD) });

            const ingresoData = {
                categoria: 'Devolución de Proveedor',
                descripcion: `Cobro de saldo a favor de ${providerName}`,
                monto: montoUSD,
                metodo: metodo,
                fecha: firebase.firestore.FieldValue.serverTimestamp()
            };

            // ===== INICIO DE LA MODIFICACIÓN =====
            // Ahora leemos la cotización y guardamos los datos correctos si el cobro es en pesos
            if (metodo.startsWith('Pesos')) {
                const cotizacion = parseFloat(formData.get('cotizacion_dolar'));
                if (!cotizacion || isNaN(cotizacion) || cotizacion <= 0) {
                    throw new Error("La cotización del dólar es obligatoria y debe ser válida.");
                }
                
                const montoArs = parseFloat(formData.get('monto_ars'));
                ingresoData.monto = montoArs; // El monto del ingreso es en ARS
                ingresoData.cotizacion_dolar = cotizacion;
                ingresoData.monto_usd_original = montoUSD; // Guardamos el valor original en USD como referencia
                
                if (metodo === 'Pesos (Transferencia)') {
                    const [id, nombre] = cuentaDestinoValue.split('|');
                    ingresoData.cuenta_destino_id = id;
                    ingresoData.cuenta_destino_nombre = nombre;
                    
                    const cuentaRef = db.collection('cuentas_financieras').doc(id);
                    t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(montoArs) });
                }
            }
            // ===== FIN DE LA MODIFICACIÓN =====
            
            t.set(ingresoRef, ingresoData);
        });

        showGlobalFeedback('Cobro de saldo registrado con éxito.', 'success');
        s.promptContainer.innerHTML = '';
        paymentContext = null;
        loadProviders();
        loadFinancialData();
        updateReports();

    } catch (error) {
        console.error("Error al guardar el cobro:", error);
        showGlobalFeedback(error.message || 'Error al registrar el cobro.', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

// =======================================================
// =========== INICIO: SECCIÓN DE MENSUALIDAD (VERSIÓN 3.0 - LÓGICA FINAL) ============
// =======================================================

// REEMPLAZA ESTAS DOS FUNCIONES COMPLETAS EN TU SCRIPT.JS

async function loadMensualidadData() {
    s.mensualidadCardsContainer.innerHTML = `<p class="dashboard-loader">Calculando balances...</p>`;
    s.retirosHistoryContainer.innerHTML = `<p class="dashboard-loader">Cargando historial...</p>`;
    
    // --- SETUP DE LA INTERFAZ DE FILTROS ---
    const socioFilterInput = document.getElementById('filter-retiros-socio');
    const startDateInput = document.getElementById('filter-retiros-start-date');
    const endDateInput = document.getElementById('filter-retiros-end-date');
    const filterBtn = document.getElementById('btn-apply-retiros-filter');

    // 1. Llenamos el desplegable de socios
    populateSelect(socioFilterInput, socios, "Todos");

    // 2. Establecemos las fechas por defecto (hoy)
    const today = new Date().toISOString().slice(0, 10);
    startDateInput.value = today;
    endDateInput.value = today;

    // 3. Nos aseguramos de que el botón de filtrar tenga su listener
    if (!filterBtn.dataset.listenerAttached) {
        filterBtn.addEventListener('click', filterRetirosHistory);
        filterBtn.dataset.listenerAttached = 'true';
    }

    try {
        // --- CÁLCULO DE BALANCES GLOBALES ---
        const allRetirosSnapshot = await db.collection('retiros_socios').get();
        const allRetiros = allRetirosSnapshot.docs.map(doc => doc.data());

        const totalesRetirados = { "Agustín": 0, "Tomás": 0, "Julián": 0 };
        allRetiros.forEach(retiro => {
            if (totalesRetirados.hasOwnProperty(retiro.socio)) {
                totalesRetirados[retiro.socio] += retiro.monto_equivalente_usd || 0;
            }
        });

        const balances = calcularBalances(totalesRetirados);
        renderMensualidadCards(balances);

        // --- CARGA INICIAL DEL HISTORIAL DEL DÍA ---
        await filterRetirosHistory();

    } catch (error) {
        handleDBError(error, s.mensualidadCardsContainer, "los datos de mensualidad");
        s.retirosHistoryContainer.innerHTML = '';
    }
}

async function filterRetirosHistory() {
    s.retirosHistoryContainer.innerHTML = `<p class="dashboard-loader">Filtrando historial...</p>`;
    
    // Simplemente leemos los valores actuales de los filtros
    const startDate = new Date(document.getElementById('filter-retiros-start-date').value + 'T00:00:00');
    const endDate = new Date(document.getElementById('filter-retiros-end-date').value + 'T23:59:59');
    const selectedSocio = document.getElementById('filter-retiros-socio').value;

    try {
        let query = db.collection('retiros_socios')
            .where('fecha', '>=', startDate)
            .where('fecha', '<=', endDate);
        
        if (selectedSocio) {
            query = query.where('socio', '==', selectedSocio);
        }
        
        query = query.orderBy('fecha', 'desc');
        
        const filteredSnapshot = await query.get();
        const historialFiltrado = filteredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        renderRetirosHistory(historialFiltrado);

    } catch (error) {
        handleDBError(error, s.retirosHistoryContainer, "el historial de retiros");
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function filterRetirosHistory() {
    s.retirosHistoryContainer.innerHTML = `<p class="dashboard-loader">Filtrando historial...</p>`;
    let startDateInput = document.getElementById('filter-retiros-start-date');
    let endDateInput = document.getElementById('filter-retiros-end-date');
    
    // ===== INICIO DE LA MODIFICACIÓN =====
    // Obtenemos la referencia al nuevo filtro de socio
    let socioFilterInput = document.getElementById('filter-retiros-socio');

    // Si el filtro de socio está vacío, lo poblamos
    if (socioFilterInput.innerHTML === '') {
        populateSelect(socioFilterInput, socios, "Todos");
    }
    // ===== FIN DE LA MODIFICACIÓN =====

    if (!startDateInput.value && !endDateInput.value) {
        const today = new Date().toISOString().slice(0, 10);
        startDateInput.value = today;
        endDateInput.value = today;
    }

    const startDate = new Date(startDateInput.value + 'T00:00:00');
    const endDate = new Date(endDateInput.value + 'T23:59:59');
    
    // ===== INICIO DE LA MODIFICACIÓN =====
    // Leemos el valor del socio seleccionado
    const selectedSocio = socioFilterInput.value;
    // ===== FIN DE LA MODIFICACIÓN =====

    try {
        let query = db.collection('retiros_socios')
            .where('fecha', '>=', startDate)
            .where('fecha', '<=', endDate);
        
        // ===== INICIO DE LA MODIFICACIÓN =====
        // Si se seleccionó un socio específico, añadimos esa condición a la consulta
        if (selectedSocio) {
            query = query.where('socio', '==', selectedSocio);
        }
        // ===== FIN DE LA MODIFICACIÓN =====
        
        // Siempre ordenamos por fecha al final
        query = query.orderBy('fecha', 'desc');
        
        const filteredSnapshot = await query.get();
        const historialFiltrado = filteredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        renderRetirosHistory(historialFiltrado);

    } catch (error) {
        handleDBError(error, s.retirosHistoryContainer, "el historial de retiros");
    }
}

function calcularBalances(totales) {
    const balances = { "Agustín": 0, "Tomás": 0, "Julián": 0 };
    const maximoRetirado = Math.max(...Object.values(totales));

    if (maximoRetirado === 0) return balances; // Si nadie retiró nada, todos están en 0

    // Caso especial: si todos retiraron exactamente lo mismo
    const todosIguales = Object.values(totales).every(val => val === maximoRetirado);
    if (todosIguales) return balances; // Todos están balanceados, se quedan en 0

    // Lógica principal
    for (const socio in totales) {
        if (totales[socio] < maximoRetirado) {
            // Este socio tiene crédito a favor para alcanzar al que más retiró
            balances[socio] = maximoRetirado - totales[socio];
        } else {
            // Este es el socio que más retiró. Su "deuda" con el sistema es lo que retiró.
            balances[socio] = -totales[socio];
        }
    }
    return balances;
}

function renderMensualidadCards(balances) {
    s.mensualidadCardsContainer.innerHTML = socios.map(socio => {
        const balance = balances[socio] || 0;
        const tieneCredito = balance > 0.01;
        const estaAdelantado = balance < -0.01;
        const displayAmount = formatearUSD(Math.abs(balance));
        
        let label = 'Balanceado';
        if (tieneCredito) label = 'Crédito a favor para retirar';
        if (estaAdelantado) label = 'Retirado de más';
        
        let colorClass = '';
        if (tieneCredito) colorClass = 'negative'; // Verde
        if (estaAdelantado) colorClass = 'positive'; // Rojo
        
        return `
        <div class="socio-card">
            <div class="socio-card-header">
                <h3>${socio}</h3>
                <button class="btn-add-retiro" data-socio="${socio}" title="Registrar nuevo retiro para ${socio}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
            <div class="socio-balance-container">
                <div class="socio-balance-label">${label}</div>
                <div class="socio-balance-amount ${colorClass}">${displayAmount}</div>
            </div>
        </div>`;
    }).join('');

    document.querySelectorAll('.btn-add-retiro').forEach(btn => {
        btn.addEventListener('click', () => {
            promptToRegisterRetiro(btn.dataset.socio);
        });
    });
}

function renderRetirosHistory(historial) {
    if (historial.length === 0) {
        s.retirosHistoryContainer.innerHTML = `<p class="dashboard-loader">No hay retiros para mostrar en este período.</p>`;
    } else {
        s.retirosHistoryContainer.innerHTML = `
        <table>
            <thead><tr><th>Fecha</th><th>Socio</th><th>Descripción</th><th>Monto (Equiv. USD)</th><th>Acciones</th></tr></thead>
            <tbody>
                ${historial.map(retiro => {
                    const socioClass = `retiro-socio-${retiro.socio.toLowerCase()}`;
                    const retiroJSON = JSON.stringify(retiro).replace(/'/g, "\\'");
                    // Formateamos la fecha para incluir la hora
                    const fechaConHora = retiro.fecha.toDate().toLocaleString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: false
                    }).replace(',', '');

                    return `
                    <tr>
                        <td>${fechaConHora} hs</td>
                        <td class="${socioClass}">${retiro.socio}</td>
                        <td>${retiro.descripcion}</td>
                        <td style="text-align:right;">${formatearUSD(retiro.monto_equivalente_usd)}</td>
                        <td class="actions-cell">
                            <button class="delete-btn btn-delete-retiro" title="Revertir este retiro" data-retiro-id="${retiro.id}" data-item='${retiroJSON}'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
    }

    document.querySelectorAll('.btn-delete-retiro').forEach(btn => {
        btn.addEventListener('click', () => {
            const retiroId = btn.dataset.retiroId;
            const retiroData = JSON.parse(btn.dataset.item.replace(/\\'/g, "'"));
            deleteRetiroSocio(retiroId, retiroData);
        });
    });
}

function promptToRegisterRetiro(socioName) {
    const metodoOptions = metodosDePago.map(m => `<option value="${m}">${m}</option>`).join('');
    const accountsOptionsHtml = financialAccounts.length > 0
        ? financialAccounts.map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('')
        : '<option value="" disabled>No hay cuentas creadas</option>';

    s.promptContainer.innerHTML = `
    <div class="ingreso-modal-box">
        <h3>Nuevo Retiro de ${socioName}</h3>
        <form id="retiro-socio-form" data-socio="${socioName}" novalidate>
            <div class="form-group">
                <select id="retiro-metodo" name="metodo_pago" required>
                    <option value="" disabled selected></option>
                    ${metodoOptions}
                </select>
                <label for="retiro-metodo">Retirar de Caja</label>
            </div>
            <div class="form-group">
                <input type="number" id="retiro-monto" name="monto" required placeholder=" " step="0.01">
                <label for="retiro-monto">Monto Retirado</label>
            </div>
            <div id="retiro-cotizacion-group" class="form-group hidden">
                <input type="number" id="retiro-cotizacion" name="cotizacion_dolar" placeholder=" ">
                <label for="retiro-cotizacion">Cotización del Dólar</label>
            </div>
            <div id="retiro-cuenta-group" class="form-group hidden">
                <select name="cuenta_origen" required>
                    <option value="" disabled selected></option>
                    ${accountsOptionsHtml}
                </select>
                <label>Desde la Cuenta</label>
            </div>
            <div class="form-group">
                <textarea id="retiro-descripcion" name="descripcion" rows="1" placeholder=" "></textarea>
                <label for="retiro-descripcion">Descripción (Opcional)</label>
            </div>
            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Guardar Retiro</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;

    const form = document.getElementById('retiro-socio-form');
    const metodoSelect = form.querySelector('#retiro-metodo');
    const cotizacionGroup = form.querySelector('#retiro-cotizacion-group');
    const cuentaGroup = form.querySelector('#retiro-cuenta-group');

    metodoSelect.addEventListener('change', () => {
        const isPesos = metodoSelect.value.startsWith('Pesos');
        const isTransfer = metodoSelect.value === 'Pesos (Transferencia)';
        cotizacionGroup.classList.toggle('hidden', !isPesos);
        cotizacionGroup.querySelector('input').required = isPesos;
        cuentaGroup.classList.toggle('hidden', !isTransfer);
        cuentaGroup.querySelector('select').required = isTransfer;
    });
}

async function saveRetiroSocio(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const socio = form.dataset.socio;
    const formData = new FormData(form);

    const monto = parseFloat(formData.get('monto'));
    const metodo_pago = formData.get('metodo_pago');
    const cotizacion = parseFloat(formData.get('cotizacion_dolar')) || 1;
    
    let monto_equivalente_usd = 0;
    if (metodo_pago === 'Dólares') {
        monto_equivalente_usd = monto;
    } else if (metodo_pago.startsWith('Pesos')) {
        if (!cotizacion || cotizacion <= 0) {
            showGlobalFeedback("La cotización del dólar es requerida para retiros en pesos.", "error");
            toggleSpinner(btn, false);
            return;
        }
        monto_equivalente_usd = monto / cotizacion;
    }

    try {
        await db.runTransaction(async t => {
            const retiroRef = db.collection('retiros_socios').doc();
            const gastoRef = db.collection('gastos').doc();
            
            const fechaServer = firebase.firestore.FieldValue.serverTimestamp();

            const retiroData = {
                socio,
                monto,
                metodo_pago,
                cotizacion_dolar: metodo_pago.startsWith('Pesos') ? cotizacion : null,
                monto_equivalente_usd,
                descripcion: formData.get('descripcion') || `Retiro de ${socio}`,
                fecha: fechaServer,
                gastoAsociadoId: gastoRef.id
            };

            const gastoData = {
                categoria: 'Retiro de Socio',
                descripcion: retiroData.descripcion,
                monto,
                metodo_pago,
                fecha: fechaServer
            };

            if (metodo_pago === 'Pesos (Transferencia)') {
                const cuentaValue = formData.get('cuenta_origen');
                if (!cuentaValue) throw new Error("Debe seleccionar una cuenta de origen.");
                const [cuentaId, cuentaNombre] = cuentaValue.split('|');
                
                // Añadimos la info de la cuenta al registro de retiro para la reversión
                retiroData.cuenta_origen_id = cuentaId;
                retiroData.cuenta_origen_nombre = cuentaNombre;
                
                const cuentaRef = db.collection('cuentas_financieras').doc(cuentaId);
                t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(-monto) });
            }

            t.set(retiroRef, retiroData);
            t.set(gastoRef, gastoData);
        });

        showGlobalFeedback(`Retiro de ${socio} registrado con éxito.`, 'success');
        s.promptContainer.innerHTML = '';
        loadMensualidadData();
        updateReports();
        loadFinancialData();

    } catch(error) {
        console.error("Error al registrar el retiro:", error);
        showGlobalFeedback(error.message || 'No se pudo registrar el retiro.', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

async function deleteRetiroSocio(retiroId, retiroData) {
    const { socio, monto_equivalente_usd, gastoAsociadoId } = retiroData;
    const message = `¿Seguro que quieres revertir este retiro de ${socio} por ${formatearUSD(monto_equivalente_usd)}?
    <br><br>
    Esta acción eliminará el retiro, eliminará el gasto de la caja y devolverá el dinero si fue por transferencia.`;

    showConfirmationModal('Confirmar Reversión', message, async () => {
        try {
            await db.runTransaction(async t => {
                const retiroRef = db.collection('retiros_socios').doc(retiroId);
                
                if (gastoAsociadoId) {
                    const gastoRef = db.collection('gastos').doc(gastoAsociadoId);
                    t.delete(gastoRef);
                } else {
                    console.warn("No se encontró ID de gasto asociado para este retiro.");
                }

                if (retiroData.metodo_pago === 'Pesos (Transferencia)' && retiroData.cuenta_origen_id) {
                    const cuentaRef = db.collection('cuentas_financieras').doc(retiroData.cuenta_origen_id);
                    t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(retiroData.monto) });
                }

                t.delete(retiroRef);
            });

            showGlobalFeedback('Retiro revertido con éxito.', 'success');
            loadMensualidadData();
            updateReports();
            loadFinancialData();

        } catch (error) {
            console.error("Error al revertir el retiro:", error);
            showGlobalFeedback('No se pudo revertir el retiro.', 'error');
        }
    });
}

function promptToMakeDeposit() {
    const accountsArsOptions = financialAccounts.filter(acc => acc.moneda === 'ARS' && acc.nombre !== 'Caja').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('');
    const accountsUsdOptions = financialAccounts.filter(acc => acc.moneda === 'USD' && acc.nombre !== 'Caja USD').map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('');

    s.promptContainer.innerHTML = `
    <div class="ingreso-modal-box">
        <h3>Realizar Depósito desde Caja</h3>
        <form id="deposit-form" novalidate>
            <div class="form-group">
                <select id="deposit-type" name="deposit_type" required>
                    <option value="" disabled selected></option>
                    <option value="ars_to_account">Desde Caja de Pesos (ARS) a Cuenta Bancaria</option>
                    <option value="usd_to_account">Desde Caja de Dólares (USD) a Cuenta Bancaria</option>
                </select>
                <label for="deposit-type">Tipo de Depósito</label>
            </div>

            <div id="deposit-ars-fields" class="hidden">
                <div class="form-group">
                    <input type="number" name="amount_ars" placeholder=" " step="0.01">
                    <label>Monto a Depositar (ARS)</label>
                </div>
                <div class="form-group">
                    <select name="destination_account_ars">${accountsArsOptions}</select>
                    <label>Depositar en la Cuenta</label>
                </div>
            </div>

            <div id="deposit-usd-fields" class="hidden">
                <div class="form-group">
                    <input type="number" name="amount_usd" placeholder=" " step="0.01">
                    <label>Monto a Depositar (USD)</label>
                </div>
                <div class="form-group">
                    <select name="destination_account_usd">${accountsUsdOptions}</select>
                    <label>Depositar en la Cuenta</label>
                </div>
            </div>

            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Confirmar Depósito</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;

    const form = document.getElementById('deposit-form');
    const depositTypeSelect = form.querySelector('#deposit-type');
    
    depositTypeSelect.addEventListener('change', () => {
        const type = depositTypeSelect.value;
        const arsFields = form.querySelector('#deposit-ars-fields');
        const usdFields = form.querySelector('#deposit-usd-fields');

        arsFields.classList.toggle('hidden', type !== 'ars_to_account');
        arsFields.querySelector('input').required = (type === 'ars_to_account');
        arsFields.querySelector('select').required = (type === 'ars_to_account');

        usdFields.classList.toggle('hidden', type !== 'usd_to_account');
        usdFields.querySelector('input').required = (type === 'usd_to_account');
        usdFields.querySelector('select').required = (type === 'usd_to_account');
    });
}

async function saveDeposit(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    const depositType = formData.get('deposit_type');

    try {
        await db.runTransaction(async t => {
            const fechaMovimiento = firebase.firestore.FieldValue.serverTimestamp();
            const gastoRef = db.collection('gastos').doc();
            const ingresoRef = db.collection('ingresos_caja').doc();

            if (depositType === 'ars_to_account') {
                const amount = parseFloat(formData.get('amount_ars'));
                const destValue = formData.get('destination_account_ars');
                if (!amount || amount <= 0 || !destValue) throw new Error("Monto y cuenta de destino son requeridos.");
                
                const [destId, destName] = destValue.split('|');
                const destRef = db.collection('cuentas_financieras').doc(destId);

                // 1. Crea un gasto para sacar el dinero de la caja de efectivo
                t.set(gastoRef, {
                    categoria: 'Movimiento Interno',
                    descripcion: `Depósito a cuenta ${destName}`,
                    monto: amount,
                    metodo_pago: 'Pesos (Efectivo)',
                    fecha: fechaMovimiento
                });

                // 2. Crea un ingreso para meter el dinero en la cuenta de transferencia
                t.set(ingresoRef, {
                    categoria: 'Movimiento Interno',
                    descripcion: 'Depósito desde Caja de Efectivo',
                    monto: amount,
                    metodo: 'Pesos (Transferencia)',
                    fecha: fechaMovimiento,
                    cuenta_destino_id: destId,
                    cuenta_destino_nombre: destName
                });
                
                // 3. Actualiza el saldo de la cuenta
                t.update(destRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(amount) });

            } else if (depositType === 'usd_to_account') {
                const amount = parseFloat(formData.get('amount_usd'));
                const destValue = formData.get('destination_account_usd');
                if (!amount || amount <= 0 || !destValue) throw new Error("Monto y cuenta de destino son requeridos.");

                const [destId, destName] = destValue.split('|');
                const destRef = db.collection('cuentas_financieras').doc(destId);
                
                // 1. Crea un gasto para sacar el dinero de la caja de dólares
                t.set(gastoRef, {
                    categoria: 'Movimiento Interno',
                    descripcion: `Depósito a cuenta ${destName}`,
                    monto: amount,
                    metodo_pago: 'Dólares',
                    fecha: fechaMovimiento
                });

                // 2. Crea un ingreso para meter el dinero en la cuenta de transferencia USD
                t.set(ingresoRef, {
                    categoria: 'Movimiento Interno',
                    descripcion: 'Depósito desde Caja de Dólares',
                    monto: amount,
                    metodo: 'Dólares (Transferencia)',
                    fecha: fechaMovimiento,
                    cuenta_destino_usd_id: destId,
                    cuenta_destino_usd_nombre: destName
                });

                // 3. Actualiza el saldo de la cuenta
                t.update(destRef, { saldo_actual_usd: firebase.firestore.FieldValue.increment(amount) });
            }
        });

        showGlobalFeedback('Depósito realizado y saldos actualizados con éxito.', 'success');
        s.promptContainer.innerHTML = '';
        loadFinancialData();
        updateReports();

    } catch (error) {
        console.error("Error al registrar el depósito:", error);
        showGlobalFeedback(error.message || 'Error al procesar el depósito.', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

// AÑADE ESTA FUNCIÓN COMPLETA AL FINAL DE TU SCRIPT.JS
async function resincronizarSaldosDeVendedores() {
    const message = `Esta acción recalculará el saldo pendiente de TODOS los vendedores basándose en su saldo inicial y su historial completo de ventas y pagos.
    <br><br>
    Esto es útil para corregir cualquier discrepancia en los totales. ¿Deseas continuar?`;

    showConfirmationModal('Confirmar Resincronización de Saldos', message, async () => {
        const loadingFeedbackId = 'resync-loading';
        showGlobalFeedback('Resincronizando saldos de todos los vendedores, por favor espera...', 'loading', 15000);

        try {
            // 1. Obtenemos todos los datos necesarios en paralelo
            const vendorsPromise = db.collection('vendedores').get();
            const salesPromise = db.collection('ventas').where('comision_vendedor_usd', '>', 0).get();
            const paymentsPromise = db.collection('pagos_comisiones').get();
            
            const [vendorsSnapshot, salesSnapshot, paymentsSnapshot] = await Promise.all([vendorsPromise, salesPromise, paymentsPromise]);

            // 2. Procesamos y agrupamos los datos para un acceso rápido
            const salesByVendor = {};
            salesSnapshot.forEach(doc => {
                const sale = doc.data();
                if (!salesByVendor[sale.vendedor]) salesByVendor[sale.vendedor] = [];
                salesByVendor[sale.vendedor].push(sale.comision_vendedor_usd);
            });

            const paymentsByVendor = {};
            paymentsSnapshot.forEach(doc => {
                const payment = doc.data();
                if (!paymentsByVendor[payment.vendedor]) paymentsByVendor[payment.vendedor] = [];
                paymentsByVendor[payment.vendedor].push(payment.monto_usd);
            });

            // 3. Iteramos sobre cada vendedor y recalculamos su saldo
            const batch = db.batch();
            let vendorsUpdatedCount = 0;

            vendorsSnapshot.forEach(vendorDoc => {
                const vendorName = vendorDoc.id;
                const vendorData = vendorDoc.data();
                
                // El saldo inicial es el que se guardó al crearlo o 0 por defecto
                const saldoInicial = vendorData.saldo_inicial_usd || 0;
                
                // Sumamos todas las comisiones de su historial
                const totalComisiones = (salesByVendor[vendorName] || []).reduce((sum, current) => sum + current, 0);
                
                // Sumamos todos los pagos que se le han hecho
                const totalPagos = (paymentsByVendor[vendorName] || []).reduce((sum, current) => sum + current, 0);

                // Calculamos el nuevo saldo pendiente correcto
                const nuevoSaldoCalculado = saldoInicial + totalComisiones - totalPagos;
                
                // Preparamos la actualización en un batch para eficiencia
                const vendorRef = db.collection('vendedores').doc(vendorName);
                batch.update(vendorRef, { comision_pendiente_usd: nuevoSaldoCalculado });
                vendorsUpdatedCount++;
            });

            // 4. Ejecutamos todas las actualizaciones a la vez
            await batch.commit();

            showGlobalFeedback(`¡Éxito! Se han resincronizado los saldos de ${vendorsUpdatedCount} vendedores.`, 'success');
            
            // 5. Recargamos la vista de comisiones para mostrar los datos corregidos
            loadCommissions();

        } catch (error) {
            console.error("Error durante la resincronización de saldos:", error);
            showGlobalFeedback('Error crítico durante la resincronización. Revisa la consola.', 'error');
        }
    });
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA
function promptToAddCommissionBalance(vendorName) {
    // ===================== INICIO DE LA MODIFICACIÓN =====================
    // Se ha cambiado el HTML interno para usar el estilo de formulario moderno
    // que soluciona el problema de superposición de la etiqueta.
    s.promptContainer.innerHTML = `
    <div class="ingreso-modal-box">
        <h3>Sumar Saldo a ${vendorName}</h3>
        <form id="add-commission-form" data-vendor-name="${vendorName}" novalidate>
            <div class="form-group">
                <input type="number" id="add-commission-amount" name="amount" required placeholder=" " step="0.01" min="0.01">
                <label for="add-commission-amount">Monto a Sumar (USD)</label>
            </div>
            <div class="form-group">
                <textarea id="add-commission-reason" name="reason" rows="1" placeholder=" "></textarea>
                <label for="add-commission-reason">Motivo (Ej: Bono, Adelanto, Ajuste) - Opcional</label>
            </div>
            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Confirmar y Sumar</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;
    // ====================== FIN DE LA MODIFICACIÓN =======================

    const textarea = document.getElementById('add-commission-reason');
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }
}

// AÑADE ESTA OTRA FUNCIÓN NUEVA AL FINAL DEL SCRIPT
async function saveAddedCommissionBalance(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const vendorName = form.dataset.vendorName;
    const amount = parseFloat(form.amount.value);
    const reason = form.reason.value.trim() || 'Ajuste manual de saldo';

    if (!vendorName || isNaN(amount) || amount <= 0) {
        showGlobalFeedback("El monto debe ser un número válido y mayor a cero.", "error");
        toggleSpinner(btn, false);
        return;
    }

    try {
        const vendorRef = db.collection('vendedores').doc(vendorName);
        
        // Usamos una transacción para asegurar la consistencia.
        await db.runTransaction(async (t) => {
            // Creamos un registro del ajuste para tener un historial.
            const adjustmentRef = db.collection('ajustes_comisiones').doc();
            t.set(adjustmentRef, {
                vendedor: vendorName,
                monto_usd: amount,
                motivo: reason,
                tipo: 'SUMA_MANUAL',
                fecha: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Incrementamos el saldo pendiente del vendedor.
            t.update(vendorRef, {
                comision_pendiente_usd: firebase.firestore.FieldValue.increment(amount)
            });
        });

        showGlobalFeedback(`Se sumaron ${formatearUSD(amount)} al saldo de ${vendorName}.`, 'success');
        s.promptContainer.innerHTML = '';
        loadCommissions(); // Recargamos la vista para mostrar el nuevo total.

    } catch (error) {
        console.error("Error al sumar saldo al vendedor:", error);
        showGlobalFeedback("Error al actualizar el saldo del vendedor.", "error");
    } finally {
        toggleSpinner(btn, false);
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function filterVendorHistory(filterButton) {
    const vendorName = filterButton.dataset.vendor;
    const card = filterButton.closest('.commission-vendor-card');
    const startDate = card.querySelector('.commission-start-date').value;
    const endDate = card.querySelector('.commission-end-date').value;
    const detailsListContainer = card.querySelector('.commission-sales-list');

    if (!startDate || !endDate) {
        showGlobalFeedback("Debes seleccionar una fecha de inicio y fin.", "error");
        return;
    }

    detailsListContainer.innerHTML = `<p class="dashboard-loader">Buscando historial...</p>`;

    try {
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T23:59:59');

        // ===================== INICIO DE LA CORRECCIÓN CLAVE =====================
        // Se elimina el ".where('comision_vendedor_usd', '>', 0)" de la consulta
        // para evitar el error de Firebase.
        let salesQuery = db.collection("ventas")
            .where("vendedor", "==", vendorName)
            .where('fecha_venta', '>=', start)
            .where('fecha_venta', '<=', end);
        // ====================== FIN DE LA CORRECCIÓN CLAVE =======================
            
        let adjustmentsQuery = db.collection("ajustes_comisiones").where("vendedor", "==", vendorName).where('fecha', '>=', start).where('fecha', '<=', end);

        const [salesSnapshot, adjustmentsSnapshot] = await Promise.all([salesQuery.get(), adjustmentsQuery.get()]);

        let commissionEvents = [];

        // ===================== INICIO DE LA CORRECCIÓN CLAVE =====================
        // El filtro para comisiones mayores a cero se aplica ahora aquí, en el código.
        salesSnapshot.docs.forEach(doc => {
            const sale = doc.data();
            if ((sale.comision_vendedor_usd || 0) > 0) {
                commissionEvents.push({ type: 'venta', date: sale.fecha_venta.toDate(), description: `${sale.producto.modelo || 'Producto'} ${sale.producto.color || ''}`, amount: sale.comision_vendedor_usd });
            }
        });
        // ====================== FIN DE LA CORRECCIÓN CLAVE =======================

        adjustmentsSnapshot.docs.forEach(doc => {
            const adjustment = doc.data();
            commissionEvents.push({ type: 'ajuste', date: adjustment.fecha.toDate(), description: adjustment.motivo || 'Ajuste manual', amount: adjustment.monto_usd });
        });

        if (commissionEvents.length === 0) {
            detailsListContainer.innerHTML = `<p class="dashboard-loader" style="font-size:0.9rem; padding: 1rem 0;">No se encontraron comisiones en este período.</p>`;
            return;
        }

        commissionEvents.sort((a, b) => b.date - a.date);

        const eventsListHtml = commissionEvents.map(event => {
            if (event.type === 'ajuste') {
                return `<div class="commission-sale-item" style="border-left: 4px solid var(--info-bg);"><div class="commission-sale-main"><span class="commission-sale-product" style="font-style: italic;">Ajuste Manual: ${event.description}</span><span class="commission-sale-amount" style="color: var(--info-bg);">${formatearUSD(event.amount)}</span></div><span class="commission-sale-date">${event.date.toLocaleString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})} hs</span></div>`;
            }
            return `<div class="commission-sale-item"><div class="commission-sale-main"><span class="commission-sale-product">${event.description}</span><span class="commission-sale-amount">${formatearUSD(event.amount)}</span></div><span class="commission-sale-date">${event.date.toLocaleString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})} hs</span></div>`;
        }).join('');

        detailsListContainer.innerHTML = eventsListHtml;

    } catch (error) {
        console.error("Error filtrando historial del vendedor:", error);
        detailsListContainer.innerHTML = `<p class="dashboard-loader" style="color:var(--error-bg);">Error al cargar el historial.</p>`;
    }
}

// AÑADE ESTA FUNCIÓN COMPLETA AL FINAL DE TU SCRIPT.JS
function promptForCurrencyExchange() {
    s.promptContainer.innerHTML = `
    <div class="ingreso-modal-box">
        <h3>Cambio de Moneda</h3>
        <p style="text-align:center; color: var(--text-muted); margin-top:-1.5rem; margin-bottom: 2rem;">Selecciona el tipo de operación que quieres realizar.</p>
        <div class="prompt-buttons">
            <button id="btn-sell-usd-flow" class="prompt-button confirm">Vender Dólares (a Pesos)</button>
            <button id="btn-buy-usd-flow" class="prompt-button confirm" style="background-color: var(--success-bg);">Comprar Dólares (con Pesos)</button>
        </div>
        <div class="prompt-buttons" style="margin-top: 1rem;">
            <button class="prompt-button cancel">Cancelar</button>
        </div>
    </div>`;

    document.getElementById('btn-sell-usd-flow').onclick = () => promptForExchangeDetails('sell-usd');
    document.getElementById('btn-buy-usd-flow').onclick = () => promptForExchangeDetails('buy-usd');
}

// AÑADE ESTA OTRA FUNCIÓN COMPLETA AL FINAL DE TU SCRIPT.JS
function promptForExchangeDetails(mode) {
    const isSelling = mode === 'sell-usd';
    const title = isSelling ? "Vender Dólares a Pesos" : "Comprar Dólares con Pesos";
    const primaryLabel = isSelling ? "Monto a Vender (USD)" : "Monto a Gastar (ARS)";
    const secondaryLabel = isSelling ? "Recibirás (ARS)" : "Recibirás (USD)";
    const primaryName = isSelling ? "amount_usd" : "amount_ars";
    const secondaryName = isSelling ? "result_ars" : "result_usd";

    s.promptContainer.innerHTML = `
    <div class="ingreso-modal-box">
        <h3>${title}</h3>
        <form id="currency-exchange-form" data-mode="${mode}" novalidate>
            <div class="form-group">
                <input type="number" id="exchange-primary-amount" name="${primaryName}" required placeholder=" " step="0.01">
                <label for="exchange-primary-amount">${primaryLabel}</label>
            </div>
            <div class="form-group">
                <input type="number" id="exchange-cotizacion" name="cotizacion" required placeholder=" " step="0.01">
                <label for="exchange-cotizacion">Cotización del Dólar</label>
            </div>
            <div class="form-group">
                <input type="text" id="exchange-result-amount" name="${secondaryName}" readonly style="background-color: #222; color: var(--brand-yellow); font-weight: bold;">
                <label for="exchange-result-amount">${secondaryLabel}</label>
            </div>
            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Confirmar Operación</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;

    const form = document.getElementById('currency-exchange-form');
    const primaryInput = form.querySelector('#exchange-primary-amount');
    const cotizacionInput = form.querySelector('#exchange-cotizacion');
    const resultInput = form.querySelector('#exchange-result-amount');

    const calculateResult = () => {
        const primaryAmount = parseFloat(primaryInput.value) || 0;
        const cotizacion = parseFloat(cotizacionInput.value) || 0;
        if (primaryAmount > 0 && cotizacion > 0) {
            const result = isSelling ? primaryAmount * cotizacion : primaryAmount / cotizacion;
            resultInput.value = result.toFixed(2);
        } else {
            resultInput.value = '';
        }
    };

    primaryInput.addEventListener('input', calculateResult);
    cotizacionInput.addEventListener('input', calculateResult);
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function saveCurrencyExchange(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const mode = form.dataset.mode;
    const formData = new FormData(form);
    
    const primaryAmount = parseFloat(formData.get(mode === 'sell-usd' ? 'amount_usd' : 'amount_ars'));
    const cotizacion = parseFloat(formData.get('cotizacion'));

    if (isNaN(primaryAmount) || primaryAmount <= 0 || isNaN(cotizacion) || cotizacion <= 0) {
        showGlobalFeedback("Debes ingresar un monto y una cotización válidos.", "error");
        toggleSpinner(btn, false);
        return;
    }

    try {
        // ===================== INICIO DE LA MODIFICACIÓN (1/2) =====================
        // Creamos un ID único para vincular ambas transacciones (gasto e ingreso).
        const exchangeId = db.collection('gastos').doc().id;
        // ====================== FIN DE LA MODIFICACIÓN =======================

        await db.runTransaction(async t => {
            const fecha = firebase.firestore.FieldValue.serverTimestamp();
            const gastoRef = db.collection('gastos').doc();
            const ingresoRef = db.collection('ingresos_caja').doc();

            if (mode === 'sell-usd') { // Vender Dólares
                const montoArsResult = primaryAmount * cotizacion;
                t.set(gastoRef, {
                    categoria: 'Cambio de Moneda',
                    descripcion: `Venta de ${formatearUSD(primaryAmount)} a ${formatearARS(cotizacion)}`,
                    monto: primaryAmount,
                    metodo_pago: 'Dólares',
                    fecha,
                    exchangeId: exchangeId // Guardamos el ID de vínculo
                });
                t.set(ingresoRef, {
                    categoria: 'Cambio de Moneda',
                    descripcion: `Ingreso por venta de dólares`,
                    monto: montoArsResult,
                    metodo: 'Pesos (Efectivo)',
                    fecha,
                    exchangeId: exchangeId // Guardamos el MISMO ID de vínculo
                });

            } else { // Comprar Dólares
                const montoUsdResult = primaryAmount / cotizacion;
                
                // ===================== INICIO DE LA MODIFICACIÓN (2/2) =====================
                // Ahora los datos del gasto y del ingreso también incluyen el ID de vínculo.
                t.set(gastoRef, {
                    categoria: 'Cambio de Moneda',
                    descripcion: `Compra de dólares con ${formatearARS(primaryAmount)} a ${formatearARS(cotizacion)}`,
                    monto: primaryAmount,
                    metodo_pago: 'Pesos (Efectivo)',
                    fecha,
                    exchangeId: exchangeId
                });
                t.set(ingresoRef, {
                    categoria: 'Cambio de Moneda',
                    descripcion: `Ingreso por compra a ${formatearARS(cotizacion)}`,
                    monto: montoUsdResult,
                    metodo: 'Dólares',
                    fecha,
                    exchangeId: exchangeId
                });
                // ====================== FIN DE LA MODIFICACIÓN =======================
            }
        });
        showGlobalFeedback("Operación de cambio registrada con éxito.", "success");
        s.promptContainer.innerHTML = '';
        updateReports();

    } catch (error) {
        console.error("Error al registrar el cambio de moneda:", error);
        showGlobalFeedback("Error al procesar la operación. Revisa la consola.", "error");
    } finally {
        toggleSpinner(btn, false);
    }
}

// AÑADE ESTA FUNCIÓN NUEVA AL FINAL DEL SCRIPT
async function deleteCurrencyExchangeTransaction(data, kpiType, period) {
    const { exchangeId } = data;
    if (!exchangeId) {
        showGlobalFeedback("Error: no se pudo encontrar el ID de la operación vinculada.", "error");
        return;
    }

    const message = `Esta es una operación de cambio de moneda vinculada. Si continúas, se eliminarán <strong>tanto el Gasto como el Ingreso</strong> asociados a esta operación.<br><br>¿Estás seguro de que quieres revertir la operación completa?`;

    showConfirmationModal('Confirmar Reversión de Operación', message, async () => {
        try {
            await db.runTransaction(async t => {
                // Buscar tanto el gasto como el ingreso que compartan el mismo ID de operación
                const gastoQuery = db.collection('gastos').where('exchangeId', '==', exchangeId);
                const ingresoQuery = db.collection('ingresos_caja').where('exchangeId', '==', exchangeId);
                
                const [gastoSnapshot, ingresoSnapshot] = await Promise.all([gastoQuery.get(), ingresoQuery.get()]);

                // Eliminar los documentos encontrados
                gastoSnapshot.forEach(doc => t.delete(doc.ref));
                ingresoSnapshot.forEach(doc => t.delete(doc.ref));
            });

            showGlobalFeedback("Operación de cambio revertida con éxito.", "success");
            updateReports(); // Actualizamos los KPIs principales
            showKpiDetail(kpiType, period); // Recargamos la vista de detalle

        } catch (error) {
            console.error("Error al revertir la operación de cambio:", error);
            showGlobalFeedback("No se pudo revertir la operación. Revisa la consola.", "error");
        }
    });
}