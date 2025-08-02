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

let vendedores = ["Equipo Twins", "Pollo", "Victo", "Mili", "Hasha","Juan"];
const colores = ["Negro espacial", "Plata", "Dorado", "Púrpura oscuro", "Rojo (Product RED)", "Azul", "Verde", "Blanco estelar", "Medianoche", "Titanio Natural", "Titanio Azul", "Otro"];
const almacenamientos = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const detallesEsteticos = ["Como Nuevo (Sin detalles)", "Excelente (Mínimos detalles)", "Bueno (Detalles de uso visibles)", "Regular (Marcas o rayones notorios)"];
const modelos = [ "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max", "iPhone 12 Mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max", "iPhone 13 Mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",];
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
        btnCalculateCommissions: document.getElementById('btn-calculate-commissions'),
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
        // ===============================================
        // === INICIO: NUEVAS REFERENCIAS PARA FINANCIERA ===
        // ===============================================
        tabFinanciera: document.getElementById('tab-financiera'),
        financieraView: document.getElementById('financiera-view'),
        btnAddAccount: document.getElementById('btn-add-account'),
        financieraTotalBalance: document.getElementById('financiera-total-balance'),
        accountsListContainer: document.getElementById('accounts-list-container'),
        // ===============================================
        // ==== FIN: NUEVAS REFERENCIAS PARA FINANCIERA ====
        // ===============================================
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU ARCHIVO SCRIPT.JS
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
            } else if (form.id === 'provider-form') { saveProvider(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'gasto-form') { saveGasto(form.querySelector('button[type="submit"]'));
            } else if (form.id === 'ingreso-form') {
                const mode = form.dataset.mode || 'create';
                if (mode === 'create') { saveIngreso(form.querySelector('button[type="submit"]'));
                } else { updateIngreso(form.dataset.ingresoId, form.querySelector('button[type="submit"]')); }
            } else if (form.id === 'commission-payment-form') { saveCommissionPayment(form);
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
            } else if (form.id === 'vendedor-form') {
                saveVendedor(form.querySelector('button[type="submit"]'));
            }
        }
    });
    
    s.filterCommissionsVendedor.addEventListener('change', loadCommissions);
    s.filterCommissionsStartDate.addEventListener('change', loadCommissions);
    s.filterCommissionsEndDate.addEventListener('change', loadCommissions);

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
    s.btnHacerCaja.addEventListener('click', generarCajaDiaria);
    s.btnAddProvider.addEventListener('click', promptToAddProvider);
    s.btnAddWholesaleClient.addEventListener('click', promptToAddWholesaleClient);
    
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
        if (button.classList.contains('btn-register-payment')) {
            const debtString = card.querySelector('.stat-value.debt')?.textContent || 'US$ 0,00';
            const debtAmount = parseFloat(debtString.replace(/[^0-9,-]+/g,"").replace(',', '.'));
            paymentContext = { id: providerId, name: providerName };
            promptToRegisterPayment(providerName, debtAmount);
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
            const debtString = clientCard.querySelector('.stat-value.debt')?.textContent || 'US$ 0,00';
            const debtAmount = parseFloat(debtString.replace(/[^0-9,-]+/g,"").replace(',', '.'));
            promptToRegisterWholesalePayment(clientId, clientName, debtAmount);
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
    });
    
    if (s.reportsView) {
        s.reportsView.addEventListener('click', (e) => {
            const kpiCard = e.target.closest('.kpi-card');
            if (!kpiCard) return;
            const kpiValueDiv = kpiCard.querySelector('.kpi-value');
            if (!kpiValueDiv) return;
            const id = kpiValueDiv.id;
            switch (id) {
                case 'kpi-dollars-day': showKpiDetail('dolares', 'dia'); break;
                case 'kpi-cash-day': showKpiDetail('efectivo_ars', 'dia'); break;
                case 'kpi-transfer-day': showKpiDetail('transferencia_ars', 'dia'); break;
                case 'kpi-dollars-month': showKpiDetail('dolares', 'mes'); break;
                case 'kpi-cash-month': showKpiDetail('efectivo_ars', 'mes'); break;
                case 'kpi-transfer-month': showKpiDetail('transferencia_ars', 'mes'); break;
                case 'kpi-profit-day': showProfitDetail('dia'); break;
                case 'kpi-profit-month': showProfitDetail('mes'); break;
            }
        });
    }

    // ===================== INICIO DEL CÓDIGO AÑADIDO =====================
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
    // ====================== FIN DEL CÓDIGO AÑADIDO =======================

    s.stockItemsPerPage.addEventListener('change', () => loadStock('first'));
    s.stockNextPage.addEventListener('click', () => loadStock('next'));
    s.stockPrevPage.addEventListener('click', () => loadStock('prev'));

    s.salesItemsPerPage.addEventListener('change', () => loadSales('first'));
    s.salesNextPage.addEventListener('click', () => loadSales('next'));
    s.salesPrevPage.addEventListener('click', () => loadSales('prev'));
}

async function loadStock(direction = 'first') {
    const type = 'stock';

    const newFiltersJSON = JSON.stringify([s.filterStockModel.value, s.filterStockProveedor.value, s.filterStockColor.value, s.filterStockGb.value]);
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
    
    const filters = [['estado', '==', 'en_stock']];
    if (s.filterStockModel.value) filters.push(['modelo', '==', s.filterStockModel.value]);
    if (s.filterStockProveedor.value) filters.push(['proveedor', '==', s.filterStockProveedor.value]);
    if (s.filterStockColor.value) filters.push(['color', '==', s.filterStockColor.value]);
    if (s.filterStockGb.value) filters.push(['almacenamiento', '==', s.filterStockGb.value]);

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

            let reparadoIconHtml = item.fueReparado ? `<span class="reparado-badge" title="Equipo reparado"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg></span>` : '';
            
            return `<tr class="stock-row-clickable" data-item='${itemJSON}' data-imei="${item.imei}">
                <td class="hide-on-mobile">${fechaFormateada}</td>
                <td>${item.modelo || ''} ${reparadoIconHtml}</td>
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function updateReports() {
    const kpiElements = [
        s.kpiStockValue, s.kpiStockCount,
        s.kpiDollarsDay, s.kpiCashDay, s.kpiTransferDay,
        s.kpiProfitDay, s.kpiExpensesDayUsd, s.kpiExpensesDayCash, s.kpiExpensesDayTransfer,
        s.kpiDollarsMonth, s.kpiCashMonth, s.kpiTransferMonth,
        s.kpiProfitMonth, s.kpiExpensesMonthUsd, s.kpiExpensesMonthCash, s.kpiExpensesMonthTransfer,
        document.getElementById('kpi-reparacion-count')
    ];
    kpiElements.forEach(el => { if (el) el.textContent = '...'; });

    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const fetchData = async (collection, dateField, start, end) => {
            return db.collection(collection).where(dateField, '>=', start).where(dateField, '<=', end).get();
        };

        const [
            stockSnap, reparacionesSnap,
            salesDaySnap, salesMonthSnap,
            expensesDaySnap, expensesMonthSnap,
            miscIncomesDaySnap, miscIncomesMonthSnap,
            wholesaleSalesDaySnap, wholesaleSalesMonthSnap,
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

        s.kpiStockValue.textContent = formatearUSD(totalStockValue + totalReparacionValue);
        s.kpiStockCount.textContent = stockSnap.size;
        document.getElementById('kpi-reparacion-count').textContent = reparacionesSnap.size;

        const processEntries = async (salesSnapshot, miscIncomesSnap, expensesSnap, wholesaleSalesSnapshot, internalMovesSnap) => {
            let totalIncomes = { usd: 0, cash: 0, transfer: 0 };
            let totalExpenses = { usd: 0, cash: 0, transfer: 0 };
            let totalProfit = 0;
        
            if (!salesSnapshot.empty) {
                const costPromises = salesSnapshot.docs.map(saleDoc => db.collection("stock_individual").doc(saleDoc.data().imei_vendido).get());
                const costDocs = await Promise.all(costPromises);
                const costMap = new Map(costDocs.map(doc => [doc.id, doc.data()?.precio_costo_usd || 0]));
                salesSnapshot.forEach(doc => {
                    const venta = doc.data();
                    const cost = costMap.get(venta.imei_vendido) || 0;
                    const commission = venta.comision_vendedor_usd || 0;
                    totalProfit += (venta.precio_venta_usd || 0) - cost - commission;
                    totalIncomes.usd += venta.monto_dolares || 0;
                    totalIncomes.cash += venta.monto_efectivo || 0;
                    totalIncomes.transfer += venta.monto_transferencia || 0;
                });
            }
            
            wholesaleSalesSnapshot.forEach(doc => {
                const sale = doc.data();
                const payment = sale.pago_recibido || {};
                totalIncomes.usd += payment.usd || 0;
                totalIncomes.cash += payment.ars_efectivo || 0;
                totalIncomes.transfer += payment.ars_transferencia || 0;
            });

            miscIncomesSnap.forEach(doc => {
                const ingreso = doc.data();
                if (ingreso.fecha) {
                    if (ingreso.metodo === 'Dólares') totalIncomes.usd += ingreso.monto || 0;
                    if (ingreso.metodo === 'Pesos (Efectivo)') totalIncomes.cash += ingreso.monto;
                    if (ingreso.metodo === 'Pesos (Transferencia)') totalIncomes.transfer += ingreso.monto;
                }
            });
            
            expensesSnap.forEach(doc => {
                const gasto = doc.data();
                if (gasto.fecha) {
                    if (gasto.metodo_pago === 'Dólares') totalExpenses.usd += gasto.monto || 0;
                    if (gasto.metodo_pago === 'Pesos (Efectivo)') totalExpenses.cash += gasto.monto || 0;
                    if (gasto.metodo_pago === 'Pesos (Transferencia)') totalExpenses.transfer += gasto.monto || 0;
                }
            });
            
            // --- LÓGICA CENTRALIZADA PARA MOVIMIENTOS INTERNOS ---
            internalMovesSnap.forEach(doc => {
                const move = doc.data();
                if (move.fecha) {
                    if (move.tipo === 'Retiro a Caja') {
                        // El dinero sale de la caja de transferencias
                        totalIncomes.transfer -= move.monto_ars;
                        // Y entra a la caja de efectivo
                        totalIncomes.cash += move.monto_ars; 
                    } else if (move.tipo === 'Retiro a Caja (USD)') {
                        // El dinero en ARS sale de la caja de transferencias
                        totalIncomes.transfer -= move.monto_ars;
                        // El ingreso en USD ya se cuenta a través de 'ingresos_caja'
                    }
                }
            });
            
            const netIncomes = {
                usd: totalIncomes.usd - totalExpenses.usd,
                cash: totalIncomes.cash - totalExpenses.cash,
                transfer: totalIncomes.transfer - totalExpenses.transfer,
            };
        
            return { netIncomes, expenses: totalExpenses, profit: totalProfit };
        };

        const daily = await processEntries(salesDaySnap, miscIncomesDaySnap, expensesDaySnap, wholesaleSalesDaySnap, internalMovesDaySnap);
        s.kpiDollarsDay.textContent = formatearUSD(daily.netIncomes.usd);
        s.kpiCashDay.textContent = formatearARS(daily.netIncomes.cash);
        s.kpiTransferDay.textContent = formatearARS(daily.netIncomes.transfer);
        s.kpiProfitDay.textContent = formatearUSD(daily.profit);
        s.kpiExpensesDayUsd.textContent = formatearUSD(daily.expenses.usd);
        s.kpiExpensesDayCash.textContent = formatearARS(daily.expenses.cash);
        s.kpiExpensesDayTransfer.textContent = formatearARS(daily.expenses.transfer);

        const monthly = await processEntries(salesMonthSnap, miscIncomesMonthSnap, expensesMonthSnap, wholesaleSalesMonthSnap, internalMovesMonthSnap);
        s.kpiDollarsMonth.textContent = formatearUSD(monthly.netIncomes.usd);
        s.kpiCashMonth.textContent = formatearARS(monthly.netIncomes.cash);
        s.kpiTransferMonth.textContent = formatearARS(monthly.netIncomes.transfer);
        s.kpiProfitMonth.textContent = formatearUSD(monthly.profit);
        s.kpiExpensesMonthUsd.textContent = formatearUSD(monthly.expenses.usd);
        s.kpiExpensesMonthCash.textContent = formatearARS(monthly.expenses.cash);
        s.kpiExpensesMonthTransfer.textContent = formatearARS(monthly.expenses.transfer);

    } catch (error) {
        console.error("Error al actualizar los informes:", error);
        kpiElements.forEach(el => { if(el) el.textContent = 'Error'; });
    }
}
// REEMPLAZA ESTA FUNCIÓN COMPLETA
async function handleAuthStateChange(user) {
    if (user) {
        s.loginContainer.innerHTML = ''; 
        s.loginContainer.classList.add('hidden');
        s.appContainer.classList.remove('hidden');
        await loadAndPopulateSelects();
        switchView('dashboard', s.tabDashboard);
        updateCanjeCount();
        
        // ===== LLAMADA A LA NUEVA FUNCIÓN AÑADIDA AQUÍ =====
        updateReparacionCount();

        setTimeout(() => {
            moveDashboardSlider(document.querySelector('.control-btn.active'));
            moveNavSlider(document.querySelector('.nav-tab.active'));
        }, 100);
    } else {
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
                            <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <svg id="eye-off-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <button type="submit" class="spinner-btn">
                    <span class="btn-text">Entrar</span>
                    <div class="spinner"></div>
                </button>
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
    const views = ['dashboard', 'providers', 'wholesale', 'reports', 'financiera', 'management'];
    
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
    // ===================== INICIO DE LA CORRECCIÓN =====================
    // Se elimina la condición 'if' restrictiva. Ahora SIEMPRE se llamará
    // a resetManagementView al entrar a la pestaña, asegurando que la UI se actualice.
    } else if (view === 'management') {
        resetManagementView();
    }
    // ====================== FIN DE LA CORRECCIÓN =======================
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
    try {
        const snapshot = await db.collection('clientes_mayoristas').orderBy('nombre').get();
        if (snapshot.empty) {
            s.wholesaleClientsListContainer.innerHTML = `<p class="dashboard-loader">No hay clientes mayoristas. ¡Agrega el primero!</p>`;
            return;
        }
        const clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderWholesaleClients(clients);
    } catch (error) {
        handleDBError(error, s.wholesaleClientsListContainer, "clientes mayoristas");
    }
}


function promptToAddWholesaleClient() {
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
                <div class="prompt-buttons">
                    <button type="submit" class="prompt-button confirm spinner-btn">
                        <span class="btn-text">Guardar Cliente</span>
                        <div class="spinner"></div>
                    </button>
                    <button type="button" class="prompt-button cancel">Cancelar</button>
                </div>
            </form>
        </div>`;
    
    const textarea = document.getElementById('ws-client-notes');
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }
}

// REEMPLAZA ESTA FUNCIÓN EN TU SCRIPT.JS
async function saveWholesaleClient(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const clientData = {
        nombre: form.nombre.value.trim(),
        notas: form.notas.value.trim(),
        total_comprado_usd: 0,
        deuda_usd: 0, // <--- CAMPO AÑADIDO AQUÍ
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function finalizeWholesaleSale(form) {
    const btn = form.querySelector('button[type="submit"]');
    toggleSpinner(btn, true);

    const formData = new FormData(form);
    const saleId = formData.get('sale_id').trim();

    const montoUsd = parseFloat(formData.get('monto_dolares')) || 0;
    const montoArsEfectivo = parseFloat(formData.get('monto_efectivo')) || 0;
    const montoArsTransferencia = parseFloat(formData.get('monto_transferencia')) || 0;
    
    // CORRECCIÓN: Usamos un valor por defecto de 1 para la cotización si no se ingresa
    const cotizacion = parseFloat(formData.get('cotizacion_dolar')) || 1;

    if (!saleId) {
        showGlobalFeedback("El ID de la venta es obligatorio.", "error");
        toggleSpinner(btn, false);
        return;
    }

    try {
        const { clientId, clientName, items, totalSaleValue } = wholesaleSaleContext;

        const totalPagadoPesos = montoArsEfectivo + montoArsTransferencia;
        const totalPagadoUSD = montoUsd + (totalPagadoPesos > 0 ? (totalPagadoPesos / cotizacion) : 0);
        const deudaGenerada = totalSaleValue - totalPagadoUSD;
        
        await db.runTransaction(async (t) => {
            const saleDate = firebase.firestore.FieldValue.serverTimestamp();
            const wholesaleSaleRef = db.collection('ventas_mayoristas').doc();
            
            const masterSaleData = {
                clienteId: clientId,
                clienteNombre: clientName,
                venta_id_manual: saleId,
                fecha_venta: saleDate,
                total_venta_usd: totalSaleValue,
                pago_recibido: {
                    usd: montoUsd,
                    ars_efectivo: montoArsEfectivo,
                    ars_transferencia: montoArsTransferencia,
                    cotizacion_dolar: cotizacion,
                    total_pagado_usd: totalPagadoUSD // Guardamos el total pagado calculado
                },
                deuda_generada_usd: deudaGenerada > 0.01 ? deudaGenerada : 0,
                cantidad_equipos: items.length,
            };
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

            const clientRef = db.collection('clientes_mayoristas').doc(clientId);
            t.update(clientRef, {
                total_comprado_usd: firebase.firestore.FieldValue.increment(totalSaleValue),
                deuda_usd: firebase.firestore.FieldValue.increment(deudaGenerada),
                fecha_ultima_compra: saleDate
            });
        });

        showGlobalFeedback(`¡Venta mayorista ${saleId} registrada con éxito!`, 'success', 5000);
        wholesaleSaleContext = null;
        s.promptContainer.innerHTML = '';
        resetManagementView();
        switchView('wholesale', s.tabWholesale);
        updateReports();

    } catch (error) {
        console.error("Error al finalizar la venta mayorista:", error);
        showGlobalFeedback("Error crítico al registrar la venta. Revisa la consola.", "error", 8000);
        toggleSpinner(btn, false);
    }
}


// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function loadIngresos() {
    s.ingresosList.innerHTML = `<p class="dashboard-loader" style="grid-column: 1 / -1;">Cargando ingresos...</p>`;
    s.ingresosPeriodTotalArsEfectivo.textContent = '...';
    s.ingresosPeriodTotalArsTransferencia.textContent = '...';
    s.ingresosPeriodTotalUsd.textContent = '...';
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
        ingresos.forEach(ingreso => {
            if (ingreso.metodo === 'Dólares') {
                totalUsd += ingreso.monto;
            } else if (ingreso.metodo === 'Pesos (Efectivo)') {
                totalArsEfectivo += ingreso.monto;
            } else if (ingreso.metodo === 'Pesos (Transferencia)') {
                totalArsTransferencia += ingreso.monto;
            }
        });

        s.ingresosPeriodTotalArsEfectivo.textContent = formatearARS(totalArsEfectivo);
        s.ingresosPeriodTotalArsTransferencia.textContent = formatearARS(totalArsTransferencia);
        s.ingresosPeriodTotalUsd.textContent = formatearUSD(totalUsd);
        
        // ===================== INICIO DE LA MODIFICACIÓN =====================
        // Agrupamos los ingresos por categoría
        const ingresosAgrupados = ingresos.reduce((acc, ingreso) => {
            const categoria = ingreso.categoria || 'Sin Categoría';
            if (!acc[categoria]) {
                acc[categoria] = []; // Si no existe la categoría en el acumulador, la creamos
            }
            acc[categoria].push(ingreso); // Añadimos el ingreso a su categoría
            return acc;
        }, {});
        
        // Pasamos el objeto agrupado a la función de renderizado
        renderIngresosList(ingresosAgrupados);
        // ====================== FIN DE LA MODIFICACIÓN =======================

    } catch (error) {
        handleDBError(error, s.ingresosList, "ingresos");
        s.ingresosPeriodTotalArsEfectivo.textContent = 'Error';
        s.ingresosPeriodTotalArsTransferencia.textContent = 'Error';
        s.ingresosPeriodTotalUsd.textContent = 'Error';
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA
async function promptToAddIngreso() {
    await loadAndPopulateSelects(); 

    const categoriaOptions = ingresosCategorias.map(c => `<option value="${c}">${c}</option>`).join('');
    const metodoOptions = metodosDePago.map(m => `<option value="${m}">${m}</option>`).join('');

    // Preparamos el desplegable de cuentas, igual que en la venta
    const accountsOptionsHtml = financialAccounts.length > 0
        ? financialAccounts.map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('')
        : '<option value="" disabled>No hay cuentas creadas</option>';
    
    const accountSelectHtml = `
        <div id="ingreso-cuenta-group" class="form-group hidden" style="margin-top: 1rem;">
            <select name="cuenta_destino" required>
                <option value="" disabled selected></option>
                ${accountsOptionsHtml}
            </select>
            <label>Acreditar en Cuenta</label>
        </div>`;

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
            ${accountSelectHtml}
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
    
    // Lógica para mostrar/ocultar el desplegable de cuentas
    const metodoSelect = document.getElementById('ingreso-metodo');
    const cuentaGroup = document.getElementById('ingreso-cuenta-group');
    metodoSelect.addEventListener('change', () => {
        const isTransferencia = metodoSelect.value === 'Pesos (Transferencia)';
        cuentaGroup.classList.toggle('hidden', !isTransferencia);
        cuentaGroup.querySelector('select').required = isTransferencia;
    });

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


// REEMPLAZA ESTA FUNCIÓN COMPLETA
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
    
    const cuentaDestinoValue = formData.get('cuenta_destino');
    if (ingresoData.metodo === 'Pesos (Transferencia)') {
        if (!cuentaDestinoValue) {
            showGlobalFeedback("Debes seleccionar una cuenta para la transferencia.", "error");
            toggleSpinner(btn, false);
            return;
        }
        const [id, nombre] = cuentaDestinoValue.split('|');
        ingresoData.cuenta_destino_id = id;
        ingresoData.cuenta_destino_nombre = nombre;
    }

    try {
        await db.runTransaction(async t => {
            // Guardamos el ingreso
            const ingresoRef = db.collection('ingresos_caja').doc();
            t.set(ingresoRef, ingresoData);

            // Si es transferencia, actualizamos el saldo de la cuenta
            if (ingresoData.cuenta_destino_id) {
                const cuentaRef = db.collection('cuentas_financieras').doc(ingresoData.cuenta_destino_id);
                t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(ingresoData.monto) });
            }
        });

        showGlobalFeedback('Ingreso registrado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        if(s.ingresosSection && !s.ingresosSection.classList.contains('hidden')) {
            loadIngresos();
        }
        loadFinancialData(); // Actualizamos la vista financiera
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
    const montoFormateado = metodo === 'Dólares' ? formatearUSD(monto) : formatearARS(monto);
    const message = `Categoría: ${categoria}\nMonto: ${montoFormateado}\n\n¿Estás seguro de que quieres eliminar este ingreso? Esta acción es irreversible.`;
    showConfirmationModal('Confirmar Eliminación', message, async () => {
        try {
            await db.collection('ingresos_caja').doc(id).delete();
            showGlobalFeedback('Ingreso eliminado correctamente.', 'success');
            loadIngresos();
            updateReports();
        } catch (error) {
            console.error("Error al eliminar ingreso:", error);
            showGlobalFeedback('No se pudo eliminar el ingreso.', 'error');
        }
    });
}


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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function renderProviders(providers) {
    s.providersListContainer.innerHTML = providers.map(provider => {
        const debt = provider.deuda_usd || 0;
        const deleteTitle = debt > 0 ? 'No se puede eliminar un proveedor con deuda pendiente' : 'Eliminar Proveedor';
        
        // --- INICIO DE LA NUEVA ESTRUCTURA HTML ---
        return `
        <div class="provider-card-modern" data-provider-id="${provider.id}">
            
            <div class="pcm-header">
                <div class="pcm-info">
                    <h3>${provider.nombre}</h3>
                    <p>${provider.contacto || 'Sin contacto especificado'}</p>
                </div>
                <button class="pcm-delete-btn btn-delete-provider" title="${deleteTitle}" ${debt > 0 ? 'disabled' : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>

            <div class="pcm-stats">
                <div class="stat-item">
                    <span class="stat-label">Deuda Pendiente</span>
                    <span class="stat-value ${debt === 0 ? 'zero' : 'debt'}">${formatearUSD(debt)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Acción Principal</span>
                    <button class="pcm-primary-action btn-batch-load">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span>Cargar Lote</span>
                    </button>
                </div>
            </div>

            <div class="pcm-actions">
                <button class="pcm-action-btn btn-register-payment" title="Registrar un pago para saldar la deuda" ${debt === 0 ? 'disabled' : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    <span>Registrar Pago</span>
                </button>
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
        // --- FIN DE LA NUEVA ESTRUCTURA HTML ---
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

function showModelSelectionStep() {
    const modelosHtml = modelos.map(modelo => {
        const equiposCargados = batchLoadContext.modelosCargados[modelo]?.length || 0;
        const checkDisabled = equiposCargados > 0 ? 'disabled' : '';
        const checkChecked = equiposCargados > 0 ? 'checked' : '';
        const countBadge = equiposCargados > 0 ? `<span class="notification-badge" style="position: static; transform: translateX(5px); background-color: var(--success-bg);">${equiposCargados}</span>` : '';

        return `
            <div class="checkbox-group">
                <input type="checkbox" id="modelo-${modelo.replace(/\s+/g, '-')}" value="${modelo}" ${checkDisabled} ${checkChecked}>
                <label for="modelo-${modelo.replace(/\s+/g, '-')}">${modelo}</label>
                ${countBadge}
            </div>
        `;
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

    document.querySelectorAll('#modelos-list-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            if (e.target.checked) {
                const modeloSeleccionado = e.target.value;
                batchLoadContext.currentModel = modeloSeleccionado;
                switchView('management', s.tabManagement);
                s.promptContainer.innerHTML = ''; 
            }
        });
    });

    // Llamada a la función de finalización actualizada
    document.getElementById('btn-finalize-lote').addEventListener('click', promptToAssignLoteCost);
    
    document.getElementById('btn-cancel-lote').addEventListener('click', () => {
        showConfirmationModal('¿Cancelar Lote?', 'Se perderán todos los equipos cargados en este lote. ¿Estás seguro?', () => {
            batchLoadContext = null;
            s.promptContainer.innerHTML = '';
            switchView('providers', s.tabProviders);
        });
    });
}

async function promptToAssignLoteCost() {
    let totalEquiposCargados = batchLoadContext.itemsCargados.length;

    if (totalEquiposCargados === 0) {
        showGlobalFeedback("No has cargado ningún equipo en este lote.", "error");
        showModelSelectionStep(); // Volvemos a la selección si no hay nada que finalizar
        return;
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
                <p style="color: var(--text-muted); text-align: center;">
                    Lote: <strong>${batchLoadContext.batchIdManual}</strong> para <strong>${batchLoadContext.providerName}</strong>
                </p>

                <div class="details-box" style="margin-top: 1.5rem; text-align: center; background-color: #1e1e1e;">
                     <div class="detail-item" style="flex-direction: column;">
                        <span style="font-size: 1rem; color: var(--text-muted);">Costo Total del Lote (Calculado)</span>
                        <strong style="font-size: 2.2rem; color: var(--brand-yellow);">${formatearUSD(batchLoadContext.totalCostoAcumulado)}</strong>
                    </div>
                     <div class="detail-item">
                        <span>Total de Equipos:</span>
                        <strong>${totalEquiposCargados}</strong>
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
        </div>
    `;

    document.getElementById('btn-back-to-models').addEventListener('click', () => {
        showModelSelectionStep();
    });

    document.getElementById('btn-save-batch-final').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        toggleSpinner(btn, true);

        const costoTotalUSD = batchLoadContext.totalCostoAcumulado;

        try {
            const loteRef = db.collection('lotes').doc();
            
            await db.runTransaction(async t => {
                const providerRef = db.collection('proveedores').doc(batchLoadContext.providerId);
                t.update(providerRef, { deuda_usd: firebase.firestore.FieldValue.increment(costoTotalUSD) });

                const imeisTotales = batchLoadContext.itemsCargados.map(item => item.imei);
                t.set(loteRef, {
                    numero_lote: batchLoadContext.batchIdManual,
                    proveedorId: batchLoadContext.providerId,
                    proveedorNombre: batchLoadContext.providerName,
                    costo_total_usd: costoTotalUSD,
                    fecha_carga: firebase.firestore.FieldValue.serverTimestamp(),
                    imeis: imeisTotales,
                    detalle_modelos: batchLoadContext.modelosCargados
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function promptToRegisterPayment(providerName, currentDebt) {
    // Primero, nos aseguramos de tener el contexto correcto para el proveedor
    paymentContext = { id: paymentContext.id, name: providerName };

    const lotesSnapshot = await db.collection('lotes').where('proveedorId', '==', paymentContext.id).orderBy('fecha_carga', 'desc').get();
    
    const lotesOptions = lotesSnapshot.docs.map(doc => {
        const lote = doc.data();
        
        // --- INICIO DE LA CORRECCIÓN ---
        // Lógica para mostrar una descripción inteligente del lote
        let loteDescripcion = '';
        if (lote.modelo) {
            // Caso 1: Es un lote antiguo, con un solo modelo.
            loteDescripcion = lote.modelo;
        } else if (lote.detalle_modelos) {
            // Caso 2: Es un lote nuevo, con múltiples modelos.
            const modelosEnLote = Object.keys(lote.detalle_modelos).join(', ');
            loteDescripcion = `Múltiples (${modelosEnLote})`;
        } else {
            // Caso 3: Es un lote sin modelo definido (poco probable, pero lo manejamos).
            loteDescripcion = 'Sin detalle de modelo';
        }
        
        return `<option value="${lote.numero_lote}">${lote.numero_lote} (${loteDescripcion})</option>`;
        // --- FIN DE LA CORRECCIÓN ---

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
    
    if ((usdAmount + arsEfectivoAmount + arsTransferAmount) === 0) {
        showGlobalFeedback("Debes especificar al menos un método de pago con su monto.", "error");
        toggleSpinner(btn, false);
        return;
    }
    
    try {
        await db.runTransaction(async t => {
            const fecha = firebase.firestore.FieldValue.serverTimestamp();
            const descripcionBase = `Pago a ${providerName}${loteAsociado ? ` (Lote: ${loteAsociado})` : ' (Pago General)'}`;

            // --- LÓGICA CORREGIDA ---

            const paymentRef = db.collection('pagos_proveedores').doc();
            const newPagoId = paymentRef.id;

            const gastosParaCaja = [];
            const pagosParaHistorial = [];
            
            if (usdAmount > 0) {
                pagosParaHistorial.push({ monto: usdAmount, moneda: 'USD' });
                gastosParaCaja.push({ categoria: 'Pago a Proveedor', descripcion: descripcionBase, monto: usdAmount, metodo_pago: 'Dólares', fecha: fecha, pagoId: newPagoId, providerId: providerId });
            }
            if (arsEfectivoAmount > 0) {
                pagosParaHistorial.push({ monto: arsEfectivoAmount, moneda: 'ARS (Efectivo)' });
                gastosParaCaja.push({ categoria: 'Pago a Proveedor', descripcion: descripcionBase, monto: arsEfectivoAmount, metodo_pago: 'Pesos (Efectivo)', fecha: fecha, pagoId: newPagoId, providerId: providerId });
            }
            if (arsTransferAmount > 0) {
                pagosParaHistorial.push({ monto: arsTransferAmount, moneda: 'ARS (Transferencia)' });
                gastosParaCaja.push({ categoria: 'Pago a Proveedor', descripcion: descripcionBase, monto: arsTransferAmount, metodo_pago: 'Pesos (Transferencia)', fecha: fecha, pagoId: newPagoId, providerId: providerId });
            }

            // Guardamos el historial
            t.set(paymentRef, {
                providerId: providerId, // Aseguramos que el ID esté aquí
                proveedorNombre: providerName,
                monto_total_usd: totalPaymentUSD,
                lote_asociado: loteAsociado || null,
                detalle_pago: pagosParaHistorial,
                fecha,
                notas: notas
            });

            // Guardamos los gastos
            gastosParaCaja.forEach(gasto => {
                const gastoRef = db.collection('gastos').doc();
                t.set(gastoRef, gasto);
            });
            
            // Actualizamos la deuda
            const providerRef = db.collection('proveedores').doc(providerId);
            t.update(providerRef, { deuda_usd: firebase.firestore.FieldValue.increment(-totalPaymentUSD) });
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
        paymentContext = null;
    }
}

// AÑADE ESTA NUEVA FUNCIÓN
// REEMPLAZA ESTA FUNCIÓN
// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

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

// REEMPLAZA ESTA FUNCIÓN COMPLETA

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
        // --- ESTA ES LA CORRECCIÓN CLAVE ---
        // Buscamos directamente por el campo 'providerId' que ahora nos aseguramos de guardar.
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
        // --- INICIO DE LA MODIFICACIÓN: Obtenemos lotes y pagos al mismo tiempo ---
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

        // Procesamos los pagos para tener una suma por cada lote
        const pagosPorLote = {};
        pagosSnapshot.forEach(doc => {
            const pago = doc.data();
            if (pago.lote_asociado) {
                pagosPorLote[pago.lote_asociado] = (pagosPorLote[pago.lote_asociado] || 0) + pago.monto_total_usd;
            }
        });

        const lotes = lotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // --- FIN DE LA MODIFICACIÓN ---
        
        batchListContainer.innerHTML = lotes.map(lote => {
            // --- CÁLCULO Y GENERACIÓN DEL ESTADO DE PAGO ---
            const costoTotal = lote.costo_total_usd || 0;
            const totalPagado = pagosPorLote[lote.numero_lote] || 0;
            let statusHtml = '';

            if (costoTotal > 0) {
                if (totalPagado >= costoTotal) {
                    statusHtml = `<div class="lote-status pagado">✓ Pagado</div>`;
                } else if (totalPagado > 0) {
                    const porcentaje = Math.round((totalPagado / costoTotal) * 100);
                    statusHtml = `<div class="lote-status parcial">${porcentaje}% Pagado</div>`;
                } else {
                    statusHtml = `<div class="lote-status pendiente">Pendiente</div>`;
                }
            }
            // --- FIN DEL CÁLCULO ---

            return `
            <div class="batch-list-item" data-batch-id="${lote.id}">
                <div class="list-item-content" style="flex-grow: 1; display: flex; justify-content: space-between; align-items: center;">
                    <div class="batch-info">
                        Lote #${lote.numero_lote} <span>(${new Date(lote.fecha_carga.seconds * 1000).toLocaleDateString('es-AR')})</span>
                        ${statusHtml}  <!-- INDICADOR AÑADIDO AQUÍ -->
                    </div>
                    <div class="batch-cost">${formatearUSD(lote.costo_total_usd)}</div>
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
        const kpiMoneda = kpiType.includes('dolares') ? 'USD' : 'ARS';
        
        const promises = [
            db.collection('ventas').where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).get(),
            db.collection('ingresos_caja').where('fecha', '>=', startDate).where('fecha', '<=', endDate).get(),
            db.collection('gastos').where('fecha', '>=', startDate).where('fecha', '<=', endDate).get(),
            db.collection('ventas_mayoristas').where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).get(),
            db.collection('movimientos_internos').where('fecha', '>=', startDate).where('fecha', '<=', endDate).get()
        ];
        const [salesSnap, miscIncomesSnap, expensesSnap, wholesaleSalesSnap, internalMovesSnap] = await Promise.all(promises);
        
        const addTransaction = (data) => {
            if (data.monto && data.monto > 0) transactions.push(data);
        };

        salesSnap.forEach(doc => {
            const venta = doc.data();
            if (kpiType === 'efectivo_ars') addTransaction({ id: doc.id, fecha: venta.fecha_venta.toDate(), tipo: 'Ingreso', concepto: `Venta: ${venta.producto.modelo}`, monto: venta.monto_efectivo, moneda: kpiMoneda, data: venta, collection: 'ventas' });
            if (kpiType === 'transferencia_ars') addTransaction({ id: doc.id, fecha: venta.fecha_venta.toDate(), tipo: 'Ingreso', concepto: `Venta: ${venta.producto.modelo}`, monto: venta.monto_transferencia, moneda: kpiMoneda, data: venta, collection: 'ventas' });
            if (kpiType === 'dolares') addTransaction({ id: doc.id, fecha: venta.fecha_venta.toDate(), tipo: 'Ingreso', concepto: `Venta: ${venta.producto.modelo}`, monto: venta.monto_dolares, moneda: kpiMoneda, data: venta, collection: 'ventas' });
        });
        
        miscIncomesSnap.forEach(doc => {
            const ingreso = doc.data();
            if ((kpiType === 'efectivo_ars' && ingreso.metodo === 'Pesos (Efectivo)') || (kpiType === 'transferencia_ars' && ingreso.metodo === 'Pesos (Transferencia)') || (kpiType === 'dolares' && ingreso.metodo === 'Dólares')) {
                addTransaction({ id: doc.id, fecha: ingreso.fecha.toDate(), tipo: 'Ingreso', concepto: `Ingreso: ${ingreso.categoria}`, monto: ingreso.monto, moneda: kpiMoneda, data: ingreso, collection: 'ingresos_caja' });
            }
        });

        wholesaleSalesSnap.forEach(doc => {
            const sale = doc.data(), payment = sale.pago_recibido || {};
            let monto = 0, concepto = `Cobranza Mayorista: ${sale.venta_id_manual}`;
            if (kpiType === 'efectivo_ars') monto = payment.ars_efectivo;
            if (kpiType === 'transferencia_ars') monto = payment.ars_transferencia;
            if (kpiType === 'dolares') monto = payment.usd;
            addTransaction({ id: doc.id, fecha: sale.fecha_venta.toDate(), tipo: 'Ingreso', concepto, monto, moneda: kpiMoneda, data: sale, collection: 'ventas_mayoristas' });
        });
        
        expensesSnap.forEach(doc => {
            const gasto = doc.data();
            if ((kpiType === 'efectivo_ars' && gasto.metodo_pago === 'Pesos (Efectivo)') || (kpiType === 'transferencia_ars' && gasto.metodo_pago === 'Pesos (Transferencia)') || (kpiType === 'dolares' && gasto.metodo_pago === 'Dólares')) {
                addTransaction({ id: doc.id, fecha: gasto.fecha.toDate(), tipo: 'Egreso', concepto: `Gasto: ${gasto.descripcion || gasto.categoria}`, monto: gasto.monto, moneda: kpiMoneda, data: gasto, collection: 'gastos' });
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
                    <td>${t.fecha.toLocaleString('es-AR')}</td><td>${t.tipo}</td><td>${t.concepto}</td>
                    <td class="${t.tipo === 'Ingreso' ? 'income' : 'outcome'}">${t.tipo === 'Egreso' ? '-' : ''}${t.moneda === 'USD' ? formatearUSD(t.monto) : formatearARS(t.monto)}</td>
                    <td class="actions-cell">${deleteButtonHtml}</td></tr>`;
            }).join('')}</tbody></table></div>`;
        detailContent.innerHTML = tableHTML;

        detailContent.querySelectorAll('.btn-delete-kpi-item').forEach(btn => btn.addEventListener('click', (e) => {
            const row = e.currentTarget.closest('tr');
            const id = row.dataset.id;
            const collection = row.dataset.collection;
            const data = JSON.parse(row.dataset.item.replace(/\\'/g, "'"));
            
            if (collection === 'ventas') handleSaleDeletion(id, data);
            else if (collection === 'ingresos_caja' || collection === 'gastos') {
                const type = collection === 'gastos' ? 'Gasto' : 'Ingreso';
                showConfirmationModal(`Eliminar ${type}`, `¿Seguro que quieres eliminar este movimiento?`, () => deleteSimpleTransaction(id, collection, kpiType, period));
            }
        }));

    } catch (error) {
        handleDBError(error, detailContent, `el detalle de ${kpiType}`);
    }
}

// NUEVA FUNCIÓN PARA VER DETALLE DE GANANCIAS
async function showProfitDetail(period) {
    const now = new Date();
    let startDate, endDate, title;

    if (period === 'dia') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        title = 'Detalle de Ganancias del Día';
    } else { // 'mes'
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        title = 'Detalle de Ganancias del Mes';
    }

    s.promptContainer.innerHTML = `
        <div class="container kpi-detail-modal">
            <h3>${title}</h3>
            <div id="kpi-profit-detail-content" class="table-container">
                <p class="dashboard-loader">Cargando detalle de ganancias...</p>
            </div>
            <div class="prompt-buttons" style="justify-content: center;">
                <button class="prompt-button cancel">Cerrar</button>
            </div>
        </div>`;
    
    const detailContent = document.getElementById('kpi-profit-detail-content');

    try {
        const salesQuery = db.collection('ventas')
            .where('fecha_venta', '>=', startDate)
            .where('fecha_venta', '<=', endDate);
        
        const salesSnapshot = await salesQuery.get();

        if (salesSnapshot.empty) {
            detailContent.innerHTML = `<p class="dashboard-loader">No hay ventas con ganancias en este período.</p>`;
            return;
        }

        const costPromises = salesSnapshot.docs.map(saleDoc => 
            db.collection("stock_individual").doc(saleDoc.data().imei_vendido).get()
        );
        const costDocs = await Promise.all(costPromises);
        const costMap = new Map(costDocs.map(doc => [doc.id, doc.data()?.precio_costo_usd || 0]));

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio Venta</th>
                        <th>Costo Producto</th>
                        <th>Comisión</th>
                        <th>Ganancia Neta</th>
                    </tr>
                </thead>
                <tbody>
        `;

        salesSnapshot.forEach(doc => {
            const venta = doc.data();
            const precioVenta = venta.precio_venta_usd || 0;
            const costoProducto = costMap.get(venta.imei_vendido) || 0;
            const comision = venta.comision_vendedor_usd || 0;
            const ganancia = precioVenta - costoProducto - comision;

            tableHTML += `
                <tr>
                    <td>${venta.producto.modelo || 'Producto Desc.'}</td>
                    <td class="income">${formatearUSD(precioVenta)}</td>
                    <td class="outcome">-${formatearUSD(costoProducto)}</td>
                    <td class="outcome">-${formatearUSD(comision)}</td>
                    <td style="font-weight:bold; color:var(--brand-yellow);">${formatearUSD(ganancia)}</td>
                </tr>
            `;
        });

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
    toggleSpinner(s.btnCalculateCommissions, true);
    
    try {
        const vendorNameFilter = s.filterCommissionsVendedor.value;
        const vendorsToQuery = vendorNameFilter ? [vendorNameFilter] : vendedores;

        if (vendorsToQuery.length === 0) {
            s.commissionsResultsContainer.innerHTML = `<p class="dashboard-loader">No hay vendedores para mostrar.</p>`;
            toggleSpinner(s.btnCalculateCommissions, false);
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

        // --- INICIO DE LA CORRECCIÓN ---
        // 1. Quitamos el filtro de desigualdad en 'comision_vendedor_usd'
        let salesQuery = db.collection("ventas"); 
        
        if (vendorNameFilter) {
            salesQuery = salesQuery.where("vendedor", "==", vendorNameFilter);
        }
        
        const startDate = s.filterCommissionsStartDate.value;
        const endDate = s.filterCommissionsEndDate.value;
        if (startDate) {
            salesQuery = salesQuery.where('fecha_venta', '>=', new Date(startDate + 'T00:00:00'));
        }
        if (endDate) {
            salesQuery = salesQuery.where('fecha_venta', '<=', new Date(endDate + 'T23:59:59'));
        }
        
        const salesSnapshot = await salesQuery.get();

        // 2. Filtramos por comisión > 0 en el lado del cliente
        const salesByVendor = salesSnapshot.docs
            .filter(doc => (doc.data().comision_vendedor_usd || 0) > 0) // <--- Filtro en JavaScript
            .reduce((acc, doc) => {
                const sale = doc.data();
                const vendorName = sale.vendedor;
                if (!acc[vendorName]) {
                    acc[vendorName] = [];
                }
                acc[vendorName].push(sale);
                return acc;
            }, {});
        // --- FIN DE LA CORRECCIÓN ---
        
        renderCommissions(vendorData, salesByVendor);

    } catch (error) {
        handleDBError(error, s.commissionsResultsContainer, "comisiones");
    } finally {
        toggleSpinner(s.btnCalculateCommissions, false);
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA
function renderCommissions(vendorData, salesByVendor) {
    if (Object.keys(vendorData).length === 0) {
        s.commissionsResultsContainer.innerHTML = `<p class="dashboard-loader">No hay vendedores creados. ¡Crea el primero!</p>`;
        return;
    }

    let html = '';
    for (const vendorName in vendorData) {
        const vendor = vendorData[vendorName];
        const sales = salesByVendor[vendorName] || [];

        const currentPeriodCommission = sales.reduce((sum, sale) => sum + (sale.comision_vendedor_usd || 0), 0);
        const totalPendingAmount = (vendor.comision_pendiente_usd || 0) + currentPeriodCommission;
        
        const salesListHtml = sales.map(sale => `
            <div class="commission-sale-item">
                <div class="commission-sale-main">
                    <span class="commission-sale-product">${sale.producto.modelo || 'Producto desc.'} ${sale.producto.color || ''}</span>
                    <span class="commission-sale-amount">${formatearUSD(sale.comision_vendedor_usd)}</span>
                </div>
                <span class="commission-sale-date">${new Date((sale.fecha_venta?.seconds || 0) * 1000).toLocaleString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})} hs</span>
            </div>
        `).join('');

        // ===================== INICIO DE LA MODIFICACIÓN =====================
        // Se añade un botón de eliminar en la cabecera de la tarjeta
        html += `
            <div class="commission-vendor-card" data-vendor-name="${vendorName}">
                <div class="vendor-card-header">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <h3>${vendorName}</h3>
                        <button class="pcm-delete-btn btn-delete-vendedor" title="Eliminar Vendedor">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                    <div class="vendor-commission-details">
                         <span class="vendor-total-commission" title="Comisión PENDIENTE de pago">${formatearUSD(totalPendingAmount)}</span>
                         <button class="btn-pay-commission" data-pending-amount="${totalPendingAmount}" title="Registrar un pago de comisión a este vendedor" ${totalPendingAmount <= 0 ? 'disabled' : ''}>Pagar Comisión</button>
                    </div>
                </div>
                ${salesListHtml ? `<div class="commission-sales-list">${salesListHtml}</div>` : '<p class="dashboard-loader" style="font-size:0.9rem; padding: 1rem 0;">No hay nuevas comisiones en este período.</p>'}
                <div class="commission-payment-history" id="history-${vendorName.replace(/\s+/g, '')}"></div>
            </div>
        `;
        // ====================== FIN DE LA MODIFICACIÓN =======================
    }
    s.commissionsResultsContainer.innerHTML = html;

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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function promptToAddGasto() {
    // Aseguramos tener la lista de cuentas actualizada
    if (!financialAccounts || financialAccounts.length === 0) {
        try {
            const accountsSnapshot = await db.collection('cuentas_financieras').orderBy('nombre').get();
            financialAccounts = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) { showGlobalFeedback("Error al cargar las cuentas financieras.", "error"); return; }
    }

    const categoriaOptions = gastosCategorias.map(c => `<option value="${c}">${c}</option>`).join('');
    const metodoOptions = metodosDePago.map(m => `<option value="${m}">${m}</option>`).join('');
    const accesoriosOptions = accesoriosSubcategorias.map(s => `<option value="${s}">${s}</option>`).join('');

    // ===================== INICIO DE LA MODIFICACIÓN =====================
    // Creamos el HTML para el selector de cuentas de origen
    const accountsOptionsHtml = financialAccounts.length > 0
        ? financialAccounts.map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre} (${formatearARS(acc.saldo_actual_ars)})</option>`).join('')
        : '<option value="" disabled>No hay cuentas creadas</option>';

    const accountSelectHtml = `
        <div id="gasto-cuenta-group" class="form-group hidden" style="margin-top: 1.5rem;">
            <select name="cuenta_origen" required>
                <option value="" disabled selected></option>
                ${accountsOptionsHtml}
            </select>
            <label>Pagar desde la Cuenta</label>
        </div>`;
    // ====================== FIN DE LA MODIFICACIÓN =======================

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

            <div id="accesorios-subcategoria-group" class="form-group hidden">
                <select id="gasto-accesorio-subcategoria" name="subcategoria">
                    <option value="" disabled selected></option>
                    ${accesoriosOptions}
                </select>
                <label for="gasto-accesorio-subcategoria">Subcategoría de Accesorio</label>
            </div>
            
            <div id="detalle-otro-group" class="form-group hidden">
                 <input type="text" id="gasto-detalle-otro" name="detalle_otro" placeholder=" ">
                 <label for="gasto-detalle-otro">Especificar Detalle</label>
            </div>

            <div class="form-group">
                <input type="number" id="gasto-monto" name="monto" required placeholder=" " step="0.01">
                <label for="gasto-monto">Monto del Gasto</label>
            </div>

            <div class="form-group">
                <select id="gasto-metodo" name="metodo_pago" required>
                     <option value="" disabled selected></option>
                    ${metodoOptions}
                </select>
                <label for="gasto-metodo">Pagado con</label>
            </div>
            
            <!-- Insertamos el nuevo selector de cuentas aquí -->
            ${accountSelectHtml}

            <div class="form-group">
                <textarea id="gasto-descripcion" name="descripcion" rows="1" placeholder=" "></textarea>
                <label for="gasto-descripcion">Descripción (opcional)</label>
            </div>

            <div class="prompt-buttons">
                <button type="submit" class="prompt-button confirm spinner-btn">
                    <span class="btn-text">Guardar Gasto</span>
                    <div class="spinner"></div>
                </button>
                <button type="button" class="prompt-button cancel">Cancelar</button>
            </div>
        </form>
    </div>`;

    const categoriaSelect = document.getElementById('gasto-categoria');
    const accesoriosGroup = document.getElementById('accesorios-subcategoria-group');
    const otroGroup = document.getElementById('detalle-otro-group');
    // ===================== INICIO DE LA MODIFICACIÓN =====================
    const metodoSelect = document.getElementById('gasto-metodo');
    const cuentaGroup = document.getElementById('gasto-cuenta-group');
    // ====================== FIN DE LA MODIFICACIÓN =======================

    categoriaSelect.addEventListener('change', () => {
        const selectedCategory = categoriaSelect.value;
        accesoriosGroup.classList.toggle('hidden', selectedCategory !== 'Accesorios');
        otroGroup.classList.toggle('hidden', selectedCategory !== 'Otro' && selectedCategory !== 'Repuestos');
    });

    // ===================== INICIO DE LA MODIFICACIÓN =====================
    // Lógica para mostrar/ocultar y hacer requerido el selector de cuentas
    metodoSelect.addEventListener('change', () => {
        const isTransferencia = metodoSelect.value === 'Pesos (Transferencia)';
        cuentaGroup.classList.toggle('hidden', !isTransferencia);
        cuentaGroup.querySelector('select').required = isTransferencia;
    });
    // ====================== FIN DE LA MODIFICACIÓN =======================

    const textarea = document.getElementById('gasto-descripcion');
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
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
    
    if (gastoData.categoria === 'Accesorios') {
        gastoData.subcategoria = formData.get('subcategoria');
    }
    if (gastoData.categoria === 'Otro' || gastoData.categoria === 'Repuestos') {
        gastoData.detalle_otro = formData.get('detalle_otro');
    }

    if (!gastoData.categoria || !gastoData.monto || !gastoData.metodo_pago) {
        showGlobalFeedback("Por favor, completa los campos obligatorios.", "error");
        toggleSpinner(btn, false);
        return;
    }
    
    // ===================== INICIO DE LA MODIFICACIÓN =====================
    const cuentaOrigenValue = formData.get('cuenta_origen');
    if (gastoData.metodo_pago === 'Pesos (Transferencia)') {
        if (!cuentaOrigenValue) {
            showGlobalFeedback("Debes seleccionar una cuenta para la transferencia.", "error");
            toggleSpinner(btn, false);
            return;
        }
        const [id, nombre] = cuentaOrigenValue.split('|');
        gastoData.cuenta_origen_id = id;
        gastoData.cuenta_origen_nombre = nombre;
    }
    // ====================== FIN DE LA MODIFICACIÓN =======================

    try {
        // ===================== INICIO DE LA MODIFICACIÓN =====================
        // Usamos una transacción para asegurar la consistencia de los datos
        await db.runTransaction(async t => {
            // 1. Guardamos el gasto
            const gastoRef = db.collection('gastos').doc();
            t.set(gastoRef, gastoData);

            // 2. Si es transferencia, actualizamos el saldo de la cuenta
            if (gastoData.cuenta_origen_id) {
                const cuentaRef = db.collection('cuentas_financieras').doc(gastoData.cuenta_origen_id);
                // Usamos FieldValue.increment con un número negativo para restar
                t.update(cuentaRef, { saldo_actual_ars: firebase.firestore.FieldValue.increment(-gastoData.monto) });
            }
        });
        // ====================== FIN DE LA MODIFICACIÓN =======================

        showGlobalFeedback('Gasto registrado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        if(s.gastosSection && !s.gastosSection.classList.contains('hidden')) {
            loadGastos();
        }
        // Actualizamos las otras vistas para que reflejen el cambio
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
        const gastos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const gastosPorCategoria = gastos.reduce((acc, gasto) => {
            let montoArs = 0;
            if (gasto.metodo_pago.startsWith('Pesos')) {
                montoArs = gasto.monto || 0;
            } else if (gasto.metodo_pago === 'Dólares' && gasto.categoria === 'Comisiones') {
                montoArs = (gasto.monto_usd_original || 0) * (gasto.cotizacion_dolar || 0);
            }
            if (montoArs > 0) {
                acc[gasto.categoria] = (acc[gasto.categoria] || 0) + montoArs;
            }
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
        
        // ===================== INICIO DE LA MODIFICACIÓN =====================
        // Generamos la etiqueta (badge) para el método de pago
        let metodoPagoBadge = '';
        if (gasto.metodo_pago) {
            let badgeClass = '';
            let badgeText = '';

            switch (gasto.metodo_pago) {
                case 'Pesos (Efectivo)':
                    badgeClass = 'efectivo';
                    badgeText = 'Efectivo';
                    break;
                case 'Pesos (Transferencia)':
                    badgeClass = 'transferencia';
                    badgeText = 'Transferencia';
                    break;
                case 'Dólares':
                    badgeClass = 'dolares';
                    badgeText = 'Dólares';
                    break;
            }
            if (badgeText) {
                 metodoPagoBadge = `<span class="payment-badge payment-badge--${badgeClass}">${badgeText}</span>`;
            }
        }
        // ====================== FIN DE LA MODIFICACIÓN =======================

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
        // Se añade una nueva estructura 'gasto-item-header' para alinear la categoría y la etiqueta
        return `<div class="gasto-item" style="border-color: ${categoriaColores[gasto.categoria] || '#cccccc'};">
            <div class="gasto-item-info">
                <div class="gasto-item-header">
                    <div class="gasto-item-cat">${gasto.categoria}</div>
                    ${metodoPagoBadge}
                </div>
                <div class="gasto-item-desc">${desc}</div>
            </div>
            <div class="gasto-item-details">
                <div class="gasto-item-amount">${montoFormateado}</div>
                <div class="gasto-item-date">${new Date((gasto.fecha?.seconds || 0) * 1000).toLocaleDateString('es-AR')}</div>
            </div>
            <div class="gasto-item-actions">${deleteButton}</div>
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

// VERSIÓN DEFINITIVA SIN EL BOTÓN "VENDER"
async function loadStock(direction = 'first') {
    const type = 'stock';

    const newFiltersJSON = JSON.stringify([s.filterStockModel.value, s.filterStockProveedor.value, s.filterStockColor.value, s.filterStockGb.value]);
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
    
    const filters = [['estado', '==', 'en_stock']];
    if (s.filterStockModel.value) filters.push(['modelo', '==', s.filterStockModel.value]);
    if (s.filterStockProveedor.value) filters.push(['proveedor', '==', s.filterStockProveedor.value]);
    if (s.filterStockColor.value) filters.push(['color', '==', s.filterStockColor.value]);
    if (s.filterStockGb.value) filters.push(['almacenamiento', '==', s.filterStockGb.value]);

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

            let reparadoIconHtml = item.fueReparado ? `<span class="reparado-badge" title="Equipo reparado"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg></span>` : '';
            
            return `<tr class="stock-row-clickable" data-item='${itemJSON}' data-imei="${item.imei}">
                <td class="hide-on-mobile">${fechaFormateada}</td>
                <td>${item.modelo || ''} ${reparadoIconHtml}</td>
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function deleteSale(saleId) {
    try {
        await db.runTransaction(async t => {
            const saleRef = db.collection("ventas").doc(saleId);
            const saleDoc = await t.get(saleRef);

            if (!saleDoc.exists) throw new Error(`La venta con ID ${saleId} ya no existe.`);
            
            const saleData = saleDoc.data();
            let stockRef = null, stockDoc = null, cuentaRef = null, cuentaDoc = null;

            if (saleData.imei_vendido) {
                stockRef = db.collection("stock_individual").doc(saleData.imei_vendido);
                stockDoc = await t.get(stockRef);
            }
            if (saleData.cuenta_destino_id) {
                cuentaRef = db.collection("cuentas_financieras").doc(saleData.cuenta_destino_id);
                cuentaDoc = await t.get(cuentaRef);
            }

            if (cuentaDoc && cuentaDoc.exists) {
                const montoARevertir = saleData.monto_transferencia || 0;
                t.update(cuentaRef, { 
                    saldo_actual_ars: firebase.firestore.FieldValue.increment(-montoARevertir) 
                });
            } else if (saleData.cuenta_destino_id) {
                console.warn(`La cuenta financiera con ID ${saleData.cuenta_destino_id} fue eliminada. No se pudo revertir el saldo, pero la venta se eliminará.`);
            }

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
        loadFinancialData();
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA
function cargarCanje(docId, canjeData) {
    const valorTomaNumerico = canjeData.valor_toma_usd || 0;

    canjeContext = { 
        docId, 
        modelo: canjeData.modelo_recibido,
        valorToma: valorTomaNumerico,
        // Pasamos toda la data para que el siguiente paso la use
        fullData: canjeData 
    };

    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin: auto;"><div class="prompt-box"><h3>Cargar IMEI para ${canjeData.modelo_recibido}</h3><p style="color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">¿Cómo deseas ingresar el IMEI del equipo de canje?</p><div class="prompt-buttons"><button id="btn-canje-scan" class="prompt-button confirm">Escanear IMEI</button><button id="btn-canje-manual" class="prompt-button confirm" style="background-color: #555;">Ingresar Manualmente</button></div><div class="prompt-buttons" style="margin-top: 1rem;"><button class="prompt-button cancel">Cancelar</button></div></div></div>`;
        
    document.getElementById('btn-canje-scan').onclick = () => {
        s.promptContainer.innerHTML = '';
        switchView('management', s.tabManagement);
        startScanner();
    };
    
    document.getElementById('btn-canje-manual').onclick = () => {
        s.promptContainer.innerHTML = '';
        switchView('management', s.tabManagement);
        promptForManualImeiInput();
    };

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
// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function onScanSuccess(imei) {
    s.feedbackMessage.classList.add('hidden');
    
    // ===================== INICIO DE LA CORRECCIÓN =====================
    // La lógica de 'batchLoadContext' ahora llama a showAddProductForm sin
    // el tercer argumento 'modelo', para que la función use el 'currentModel' del contexto.
    if (canjeContext) {
        showAddProductForm(null, imei, canjeContext.modelo, canjeContext.docId);
    } else if (batchLoadContext) {
        showAddProductForm(null, imei); // <-- LÍNEA CORREGIDA
    } else if (wholesaleSaleContext) {
    // ====================== FIN DE LA CORRECCIÓN =======================
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


function showAddProductForm(e, imei = '', modelo = '', canjeId = null, valorToma = null) {
    if(e) e.preventDefault();
    resetManagementView(batchLoadContext ? true : false); 
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

    // ===== LÓGICA CORREGIDA PARA PRE-RELLENAR SI EL CANJE ESTÁ DAÑADO =====
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA (VERSIÓN FINAL Y ROBUSTA)
async function promptToSell(imei, details) {
    if (!financialAccounts || financialAccounts.length === 0) {
        try {
            const accountsSnapshot = await db.collection('cuentas_financieras').orderBy('nombre').get();
            financialAccounts = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Lista de cuentas recargada al momento de la venta.");
        } catch (error) {
            console.error("Error al recargar cuentas para el modal de venta:", error);
            showGlobalFeedback("Error al cargar las cuentas. Intenta refrescar la página.", "error");
            return;
        }
    }

    const vendedoresOptions = vendedores.map(v => `<option value="${v}">${v}</option>`).join('');
    const modelosOptions = modelos.map(m => `<option value="${m}">${m}</option>`).join('');
    
    const accountsOptionsHtml = financialAccounts.length > 0 ? financialAccounts.map(acc => `<option value="${acc.id}|${acc.nombre}">${acc.nombre}</option>`).join('') : '<option value="" disabled>No hay cuentas creadas</option>';

    const accountSelectHtml = `
        <div class="form-group" style="margin-top: 1rem;">
            <label for="sell-cuenta-destino">Acreditar Transferencia en</label>
            <select id="sell-cuenta-destino" name="cuenta_destino">
                <option value="" disabled selected>Seleccione una cuenta...</option>
                ${accountsOptionsHtml}
            </select>
        </div>`;

    const metodosDePagoHtml = `
        <div class="form-group">
            <label>Método(s) de Pago</label>
            <div id="payment-methods-container">
                <div class="payment-option">
                    <label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Dólares"><span class="toggle-switch-label">Dólares</span><span class="toggle-switch-slider"></span></label>
                    <div class="payment-input-container hidden"><input type="number" id="sell-monto-dolares" name="monto_dolares" placeholder="Monto en USD" step="0.01"></div>
                </div>
                <div class="payment-option">
                    <label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Pesos (Efectivo)"><span class="toggle-switch-label">Pesos (Efectivo)</span><span class="toggle-switch-slider"></span></label>
                    <div class="payment-input-container hidden"><input type="number" id="sell-monto-efectivo" name="monto_efectivo" placeholder="Monto en ARS" step="0.01"></div>
                </div>
                <div class="payment-option">
                    <label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Pesos (Transferencia)"><span class="toggle-switch-label">Pesos (Transferencia)</span><span class="toggle-switch-slider"></span></label>
                    <div class="payment-input-container hidden">
                        <input type="number" id="sell-monto-transferencia" name="monto_transferencia" placeholder="Monto en ARS" step="0.01">
                        ${accountSelectHtml}
                        <textarea id="sell-obs-transferencia" name="observaciones_transferencia" rows="2" placeholder="Obs. de transferencia (opcional)" style="margin-top: 10px;"></textarea>
                    </div>
                </div>
            </div>
        </div>`;

    const canjeHtml = `
        <hr style="border-color:var(--border-dark);margin:1.5rem 0;">
        <label class="toggle-switch-group"><input type="checkbox" id="acepta-canje" name="acepta-canje"><span class="toggle-switch-label">Acepta Plan Canje</span><span class="toggle-switch-slider"></span></label>
        <div id="plan-canje-fields" class="hidden">
            <h4>Detalles del Equipo Recibido</h4>
            <div class="form-group"><label for="sell-canje-modelo">Modelo Recibido</label><select id="sell-canje-modelo" name="canje-modelo">${modelosOptions}</select></div>
            <div class="form-group"><label for="sell-canje-valor">Valor Toma (USD)</label><input type="number" id="sell-canje-valor" name="canje-valor"></div>
            <div class="form-group"><label for="sell-canje-observaciones">Observaciones</label><textarea id="sell-canje-observaciones" name="canje-observaciones" rows="2"></textarea></div>
            <label class="toggle-switch-group"><input type="checkbox" id="canje-para-reparar-check" name="canje-para-reparar"><span class="toggle-switch-label">Equipo de Canje Dañado (Enviar a Reparación)</span><span class="toggle-switch-slider"></span></label>
            <div id="canje-reparacion-fields" class="hidden" style="animation: fadeIn 0.4s;"><div class="form-group"><label for="canje-defecto-form">Defecto del Equipo Recibido</label><input type="text" id="canje-defecto-form" name="canje-defecto" placeholder="Ej: Pantalla rota, no enciende..."></div><div class="form-group"><label for="canje-repuesto-form">Repuesto Necesario</label><input type="text" id="canje-repuesto-form" name="canje-repuesto" placeholder="Ej: Módulo de pantalla iPhone 12 Pro..."></div></div>
        </div>`;

    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin:auto;"><div class="prompt-box"><h3>Registrar Venta</h3><form id="sell-form"><div class="details-box"><div class="detail-item"><span>Vendiendo:</span> <strong>${details.modelo || ''}</strong></div><div class="detail-item"><span>IMEI:</span> <strong>${imei}</strong></div></div><div class="form-group"><label for="sell-nombre-cliente">Nombre del Cliente (Opcional)</label><input type="text" id="sell-nombre-cliente" name="nombre_cliente"></div><div class="form-group"><label for="sell-precio-venta">Precio Venta TOTAL (USD)</label><input type="number" id="sell-precio-venta" name="precioVenta" required></div>${metodosDePagoHtml}<div class="form-group"><label for="sell-cotizacion-dolar">Cotización Dólar (si aplica)</label><input type="number" id="sell-cotizacion-dolar" name="cotizacion_dolar" placeholder="Ej: 1200"></div><div class="form-group"><label for="sell-vendedor">Vendedor</label><select id="sell-vendedor" name="vendedor" required><option value="">Seleccione...</option>${vendedoresOptions}</select></div><div id="comision-vendedor-field" class="form-group hidden"><label for="sell-comision-vendedor">Comisión Vendedor (USD)</label><input type="number" id="sell-comision-vendedor" name="comision_vendedor_usd"></div>${canjeHtml}<div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Registrar Venta</span><div class="spinner"></div></button><button type="button" class="prompt-button cancel">Cancelar</button></div></form></div></div>`;
    
    const form = document.getElementById('sell-form');
    
    // ===================== INICIO DE LA CORRECCIÓN =====================
    // Listener centralizado para TODOS los eventos 'change' dentro del formulario
    form.addEventListener('change', (e) => {
        const target = e.target; // El elemento que originó el cambio

        // Caso 1: Checkbox de método de pago
        if (target.matches('input[name="metodo_pago_check"]')) {
            const container = target.closest('.payment-option').querySelector('.payment-input-container');
            const isChecked = target.checked;
            container.classList.toggle('hidden', !isChecked);
            
            const montoTransferenciaInput = container.querySelector('#sell-monto-transferencia');
            const cuentaSelect = container.querySelector('#sell-cuenta-destino');

            if (montoTransferenciaInput && cuentaSelect) {
                montoTransferenciaInput.required = isChecked;
                cuentaSelect.required = isChecked;
            } else {
                const montoInput = container.querySelector('input[type="number"]');
                if (montoInput) montoInput.required = isChecked;
            }
        }

        // Caso 2: Selector de vendedor
        if (target.id === 'sell-vendedor') {
            form.querySelector('#comision-vendedor-field').classList.toggle('hidden', !target.value);
        }

        // Caso 3: Checkbox de Plan Canje
        if (target.id === 'acepta-canje') {
            document.getElementById('plan-canje-fields').classList.toggle('hidden', !target.checked);
        }

        // Caso 4: Checkbox de "Canje para Reparar"
        if (target.id === 'canje-para-reparar-check') {
            document.getElementById('canje-reparacion-fields').classList.toggle('hidden', !target.checked);
        }
    });
    // ====================== FIN DE LA CORRECCIÓN =======================
    
    form.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        registerSale(imei, details, e.target.querySelector('button[type="submit"]')); 
    });
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
    
    // --- LEEMOS EL VALOR DE LA CUENTA SELECCIONADA ---
    const cuentaDestinoValue = formData.get('cuenta_destino');

    if (montoDolares === 0 && montoEfectivo === 0 && montoTransferencia === 0) {
        showGlobalFeedback("Debes ingresar un monto para al menos un método de pago.", "error");
        toggleSpinner(btn, false);
        return;
    }
    
    // --- VALIDACIÓN: Si hay monto por transferencia, debe haber una cuenta seleccionada ---
    if (montoTransferencia > 0 && !cuentaDestinoValue) {
        showGlobalFeedback("Debes seleccionar una cuenta de destino para la transferencia.", "error");
        toggleSpinner(btn, false);
        return;
    }

    const pagosRecibidos = [];
    if (montoDolares > 0) pagosRecibidos.push('Dólares');
    if (montoEfectivo > 0) pagosRecibidos.push('Pesos (Efectivo)');
    if (montoTransferencia > 0) pagosRecibidos.push('Pesos (Transferencia)');

    const saleData = {
        imei_vendido: imei, 
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
        observaciones_transferencia: formData.get('observaciones_transferencia'),
        comision_pagada: false
    };
    
    // --- AÑADIMOS LOS DATOS DE LA CUENTA AL OBJETO DE VENTA ---
    if (montoTransferencia > 0 && cuentaDestinoValue) {
        const [id, nombre] = cuentaDestinoValue.split('|');
        saleData.cuenta_destino_id = id;
        saleData.cuenta_destino_nombre = nombre;
    }

    try {
        await db.runTransaction(async (t) => {
            const saleRef = db.collection("ventas").doc();
            t.update(db.collection("stock_individual").doc(imei), { estado: 'vendido' });

            // --- LÓGICA DE TRANSACCIÓN PARA ACTUALIZAR SALDO DE CUENTA ---
            if (saleData.monto_transferencia > 0 && saleData.cuenta_destino_id) {
                const cuentaRef = db.collection("cuentas_financieras").doc(saleData.cuenta_destino_id);
                t.update(cuentaRef, { 
                    saldo_actual_ars: firebase.firestore.FieldValue.increment(saleData.monto_transferencia) 
                });
            }

            if (saleData.hubo_canje) {
                const canjeParaReparar = formData.get('canje-para-reparar') === 'on';
                if (canjeParaReparar) {
                    const reparacionRef = db.collection("reparaciones").doc();
                    t.set(reparacionRef, {
                        estado_reparacion: 'pendiente_asignar_imei',
                        modelo: formData.get('canje-modelo'),
                        precio_costo_usd: saleData.valor_toma_canje_usd,
                        defecto: formData.get('canje-defecto'),
                        repuesto_necesario: formData.get('canje-repuesto'),
                        observaciones_canje: formData.get('canje-observaciones'),
                        venta_asociada_id: saleRef.id,
                        fechaDeCarga: saleData.fecha_venta,
                        proveedor: "Usado (Plan Canje)"
                    });
                    saleData.id_reparacion_pendiente = reparacionRef.id;
                    saleData.canje_a_reparacion = true;
                } else {
                    const canjeRef = db.collection("plan_canje_pendientes").doc();
                    t.set(canjeRef, { 
                        modelo_recibido: formData.get('canje-modelo'), 
                        valor_toma_usd: saleData.valor_toma_canje_usd, 
                        observaciones_canje: formData.get('canje-observaciones'), 
                        producto_vendido: `${productDetails.modelo} ${productDetails.color}`, 
                        venta_asociada_id: saleRef.id, 
                        fecha_canje: saleData.fecha_venta, 
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
            const unitData = {
                precio_costo_usd: parseFloat(formData.get('precio_costo_usd')) || 0,
                modelo: formData.get('modelo'),
                color: formData.get('color'),
                bateria: parseInt(formData.get('bateria')),
                almacenamiento: formData.get('almacenamiento'),
                detalles_esteticos: formData.get('detalles'),
                proveedor: formData.get('proveedor')
            };
            await db.collection("stock_individual").doc(imei).update(unitData);
            showGlobalFeedback("¡Producto actualizado con éxito!", "success");
            setTimeout(() => {
                resetManagementView();
                switchView('dashboard', s.tabDashboard);
                loadStock();
                updateReports();
            }, 1500);

        } else { // MODO CREAR
            const paraReparar = formData.get('para-reparar') === 'on';
            const costoIndividual = parseFloat(formData.get('precio_costo_usd')) || 0;
            const commonData = {
                imei,
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
                    t.update(canjeRef, { estado: 'cargado_en_stock', imei_asignado: imei });
                }
            });
            
            if (batchLoadContext && batchLoadContext.currentModel) {
                const modeloActual = batchLoadContext.currentModel;
                if (!batchLoadContext.modelosCargados[modeloActual]) {
                    batchLoadContext.modelosCargados[modeloActual] = [];
                }
                batchLoadContext.modelosCargados[modeloActual].push(imei);
                
                // Actualizamos el contexto del lote con los datos y el costo
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
                    if (form.dataset.canjeId) updateCanjeCount();
                }
                showFeedback(message, "success");

                setTimeout(() => {
                    resetManagementView();
                    switchView('dashboard', s.tabDashboard);
                    if (paraReparar) {
                        switchDashboardView('reparacion', s.btnShowReparacion);
                    } else {
                        loadStock();
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
function promptToFinalizeWholesaleSale() {
    if (!wholesaleSaleContext || wholesaleSaleContext.items.length === 0) {
        showGlobalFeedback("No has agregado ningún equipo a la venta.", "error");
        return;
    }

    const { clientName, totalSaleValue } = wholesaleSaleContext;

    const metodosDePagoHtml = `
        <div class="form-group">
            <label>Monto(s) que paga AHORA</label>
            <div id="payment-methods-container">
                <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Dólares"><span class="toggle-switch-label">Paga con Dólares</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="monto_dolares" placeholder="Monto en USD" step="0.01"></div></div>
                <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Pesos (Efectivo)"><span class="toggle-switch-label">Paga con Pesos (Efectivo)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="monto_efectivo" placeholder="Monto en ARS" step="0.01"></div></div>
                <div class="payment-option"><label class="toggle-switch-group"><input type="checkbox" name="metodo_pago_check" value="Pesos (Transferencia)"><span class="toggle-switch-label">Paga con Pesos (Transf.)</span><span class="toggle-switch-slider"></span></label><div class="payment-input-container hidden"><input type="number" name="monto_transferencia" placeholder="Monto en ARS" step="0.01"></div></div>
            </div>
        </div>
    `;

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
    form.querySelectorAll('input[name="metodo_pago_check"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const container = e.target.closest('.payment-option').querySelector('.payment-input-container');
            container.classList.toggle('hidden', !e.target.checked);
        });
    });

    // ===== LÍNEAS ELIMINADAS =====
    // Se ha quitado el siguiente bloque de código que causaba la duplicación:
    // form.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     finalizeWholesaleSale(e.target);
    // });
    // =============================
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
        const salesPromise = db.collection('ventas_mayoristas')
            .where('clienteId', '==', clientId)
            .get();
        const paymentsPromise = db.collection('pagos_mayoristas')
            .where('clienteId', '==', clientId)
            .get();

        const [salesSnapshot, paymentsSnapshot] = await Promise.all([salesPromise, paymentsPromise]);

        let transactions = [];
        salesSnapshot.forEach(doc => {
            const data = doc.data();
            transactions.push({ ...data, id: doc.id, type: 'venta', date: data.fecha_venta.toDate() });
        });
        paymentsSnapshot.forEach(doc => {
            const data = doc.data();
            transactions.push({ ...data, id: doc.id, type: 'pago', date: data.fecha.toDate() });
        });

        transactions.sort((a, b) => b.date - a.date); // Ordenar por fecha, más reciente primero

        if (transactions.length === 0) {
            contentDiv.innerHTML = '<p class="dashboard-loader">Este cliente no tiene movimientos registrados.</p>';
            return;
        }

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Detalle</th>
                        <th style="color: var(--error-bg);">Debe</th>
                        <th style="color: var(--success-bg);">Haber</th>
                        <th style="text-align:right;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactions.map(item => {
                        if (item.type === 'venta') {
                            const saleJSON = JSON.stringify(item).replace(/'/g, "\\'");
                            return `
                            <tr data-sale-id="${item.id}" data-sale-item='${saleJSON}'>
                                <td>${item.date.toLocaleString('es-AR')}</td>
                                <td>Venta</td>
                                <td>ID: ${item.venta_id_manual} (${item.cantidad_equipos} equipos)</td>
                                <td>${formatearUSD(item.total_venta_usd)}</td>
                                <td>${formatearUSD(item.pago_recibido.total_pagado_usd || 0)}</td>
                                <td class="actions-cell">
                                    <button class="control-btn btn-view-sale-detail" style="background-color: var(--info-bg);">Ver Detalle</button>
                                    <button class="control-btn btn-revert-sale">Revertir</button>
                                </td>
                            </tr>`;
                        } else { // type === 'pago'
                            return `
                            <tr class="payment-row">
                                <td>${item.date.toLocaleString('es-AR')}</td>
                                <td>Pago</td>
                                <td>${item.notas || 'Pago a cuenta'}</td>
                                <td></td>
                                <td style="color: var(--success-bg); font-weight: bold;">${formatearUSD(item.monto_total_usd)}</td>
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
        
        // ... (el resto de los listeners para Ver Detalle y Revertir quedan igual)
        contentDiv.querySelectorAll('.btn-view-sale-detail').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.currentTarget.closest('tr');
                const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'"));
                showWholesaleSaleDetail(row.dataset.saleId, saleItem);
            });
        });
        
        contentDiv.querySelectorAll('.btn-revert-sale').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.currentTarget.closest('tr');
                const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'"));
                revertWholesaleSale(row.dataset.saleId, saleItem, () => showWholesaleHistory(clientId, clientName));
            });
        });

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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function revertWholesaleSale(masterSaleId, masterSaleData, callback) {
    const message = `¿Estás seguro de que quieres revertir la venta <strong>${masterSaleData.venta_id_manual}</strong> por un total de <strong>${formatearUSD(masterSaleData.total_venta_usd)}</strong>?
    <br><br>
    <strong style="color:var(--error-bg);">¡ATENCIÓN!</strong> Esta acción es irreversible y hará lo siguiente:
    <ul>
        <li>Los <strong>${masterSaleData.cantidad_equipos} equipos</strong> de esta venta volverán al stock.</li>
        <li>Se eliminarán todos los registros de venta asociados.</li>
        <li>El total comprado del cliente <strong>${masterSaleData.clienteNombre}</strong> se reducirá (si el cliente aún existe).</li>
    </ul>`;

    showConfirmationModal('Confirmar Reversión de Venta Mayorista', message, async () => {
        try {
            showGlobalFeedback('Revirtiendo venta mayorista...', 'loading', 5000);

            // --- INICIO DE LA CORRECCIÓN CLAVE ---
            // 1. LEEMOS los registros de venta individuales ANTES de la transacción.
            const individualSalesQuery = db.collection('ventas').where('venta_mayorista_ref', '==', masterSaleId);
            const individualSalesSnapshot = await individualSalesQuery.get();
            // --- FIN DE LA CORRECCIÓN CLAVE ---

            await db.runTransaction(async t => {
                const masterSaleRef = db.collection('ventas_mayoristas').doc(masterSaleId);
                const clientRef = db.collection('clientes_mayoristas').doc(masterSaleData.clienteId);

                // Verificamos si la consulta anterior encontró algo.
                if (individualSalesSnapshot.empty) {
                    // Si no hay ventas individuales, puede ser una venta antigua o un error.
                    // Permitimos que la reversión continúe para limpiar el registro maestro.
                    console.warn(`No se encontraron registros de venta individuales para la venta maestra ${masterSaleId}. Se procederá a eliminar solo el registro maestro.`);
                } else {
                    // 2. Si se encontraron, ahora los procesamos DENTRO de la transacción.
                    for (const doc of individualSalesSnapshot.docs) {
                        const ventaIndividual = doc.data();
                        const imei = ventaIndividual.imei_vendido;
                        if (imei) {
                            const stockRef = db.collection('stock_individual').doc(imei);
                            t.update(stockRef, { estado: 'en_stock' });
                        }
                        t.delete(doc.ref);
                    }
                }

                // 3. Actualizamos el total del cliente si todavía existe.
                const clientDoc = await t.get(clientRef).catch(() => null);
                if (clientDoc && clientDoc.exists) {
                    t.update(clientRef, {
                        total_comprado_usd: firebase.firestore.FieldValue.increment(-masterSaleData.total_venta_usd)
                    });
                } else {
                     console.warn(`El cliente ${masterSaleData.clienteId} no fue encontrado. No se puede actualizar su total de compra.`);
                }
                
                // 4. Eliminamos la venta maestra.
                t.delete(masterSaleRef);
            });

            showGlobalFeedback(`Venta ${masterSaleData.venta_id_manual} revertida con éxito.`, 'success');
            
            // Si hay una función de callback (como refrescar la vista), la ejecutamos.
            if (callback && typeof callback === 'function') {
                callback();
            } else {
                // Comportamiento por defecto
                loadWholesaleClients();
                updateReports();
            }

        } catch (error) {
            console.error("Error al revertir la venta mayorista:", error);
            showGlobalFeedback(error.message || "Error crítico al revertir la venta. Revisa la consola.", "error", 6000);
        } finally {
            // Cerramos el prompt de confirmación si sigue abierto.
            const modal = document.getElementById('confirmation-modal-overlay');
            if(modal) modal.remove();
        }
    });
}
async function resyncWholesaleClientTotal(clientId, clientName) {
    const message = `Esto recalculará el "Total Comprado" para <strong>${clientName}</strong> basándose en su historial de ventas guardado.
    <br><br>
    Esta acción es útil si el total parece incorrecto. ¿Deseas continuar?`;
    
    showConfirmationModal('Recalcular Total del Cliente', message, async () => {
        try {
            showGlobalFeedback('Resincronizando... por favor espera.', 'info', 2000);

            const salesSnapshot = await db.collection('ventas_mayoristas')
                .where('clienteId', '==', clientId)
                .get();

            let newTotal = 0;
            salesSnapshot.forEach(doc => {
                newTotal += doc.data().total_venta_usd || 0;
            });

            await db.collection('clientes_mayoristas').doc(clientId).update({
                total_comprado_usd: newTotal
            });

            showGlobalFeedback(`¡Éxito! Total para "${clientName}" actualizado a ${formatearUSD(newTotal)}.`, 'success');
            loadWholesaleClients();

        } catch (error) {
            console.error("Error al resincronizar el total del cliente:", error);
            showGlobalFeedback("Error al resincronizar. Revisa la consola.", "error");
        }
    });
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function renderWholesaleClients(clients) {
    // Si no hay clientes, muestra un mensaje amigable
    if (!clients || clients.length === 0) {
        s.wholesaleClientsListContainer.innerHTML = `<p class="dashboard-loader">No hay clientes mayoristas. ¡Agrega el primero!</p>`;
        return;
    }

    // Usamos la nueva estructura 'provider-card-modern' para cada cliente
    s.wholesaleClientsListContainer.innerHTML = clients.map(client => {
        const totalComprado = client.total_comprado_usd || 0;
        const deuda = client.deuda_usd || 0;
        const ultimaCompra = client.fecha_ultima_compra ? new Date(client.fecha_ultima_compra.seconds * 1000).toLocaleDateString('es-AR') : 'Nunca';
        const deleteTitle = 'Eliminar Cliente (irreversible)';

        return `
        <div class="provider-card-modern" data-client-id="${client.id}">
            
            <div class="pcm-header">
                <div class="pcm-info">
                    <h3>${client.nombre}</h3>
                    <p>Última Compra: ${ultimaCompra}</p>
                </div>
                <button class="pcm-delete-btn btn-delete-wholesale-client" title="${deleteTitle}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>

            <div class="pcm-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Comprado</span>
                    <span class="stat-value" style="color: var(--brand-yellow);">${formatearUSD(totalComprado)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Saldo Deudor</span>
                    <span class="stat-value ${deuda === 0 ? 'zero' : 'debt'}">${formatearUSD(deuda)}</span>
                </div>
            </div>

            <button class="pcm-primary-action btn-new-wholesale-sale" style="margin-bottom: 1rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Registrar Venta</span>
            </button>

            <div class="pcm-actions">
                <button class="pcm-action-btn btn-register-ws-payment" title="Registrar Pago a Cuenta" ${deuda <= 0 ? 'disabled' : ''}>
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

// AÑADE ESTAS DOS NUEVAS FUNCIONES AL FINAL DE TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA
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
                <!-- ===== CAMPO PROVEEDOR (SOLO LECTURA) AÑADIDO AQUÍ ===== -->
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
        // Combinamos los datos originales con los nuevos del formulario
        const stockData = {
            ...originalData,
            imei: imei,
            bateria: parseInt(formData.get('bateria')),
            color: formData.get('color'),
            almacenamiento: formData.get('almacenamiento'),
            detalles_esteticos: formData.get('detalles'),
            estado: 'en_stock',
            fueReparado: true,
            fechaDeCarga: firebase.firestore.FieldValue.serverTimestamp()
        };
        // Eliminamos campos que no pertenecen al stock
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

// AÑADE ESTAS DOS NUEVAS FUNCIONES COMPLETAS A TU SCRIPT.JS

function promptToRegisterWholesalePayment(clientId, clientName, currentDebt) {
    // Guardamos el contexto del cliente para usarlo al guardar
    paymentContext = { id: clientId, name: clientName };

    s.promptContainer.innerHTML = `
        <div class="container container-sm">
            <div class="prompt-box">
                <h3>Registrar Pago de ${clientName}</h3>
                <p>Deuda actual: <strong>${formatearUSD(currentDebt)}</strong></p>
                <form id="wholesale-payment-form">
                    <div class="form-group">
                        <label for="payment-total">Monto del Pago (USD)</label>
                        <input type="number" id="payment-total" name="total" step="0.01" max="${currentDebt}" required>
                    </div>
                    <div class="form-group payment-details-group">
                        <label>Ingresa a Caja como</label>
                        <div class="checkbox-group" style="margin-bottom: 0.5rem;"><input type="checkbox" id="pay-usd" name="pay-usd" class="payment-method-cb"><label for="pay-usd">Dólares</label></div>
                        <div id="pay-usd-fields" class="hidden" style="padding-left: 25px;"><input type="number" name="dolares" placeholder="Monto USD"></div>
                        
                        <div class="checkbox-group" style="margin-bottom: 0.5rem;"><input type="checkbox" id="pay-ars-efectivo" name="pay-ars-efectivo" class="payment-method-cb"><label for="pay-ars-efectivo">Pesos (Efectivo)</label></div>
                        <div id="pay-ars-efectivo-fields" class="hidden" style="padding-left: 25px;"><input type="number" name="efectivo" placeholder="Monto ARS"></div>
                        
                        <div class="checkbox-group" style="margin-bottom: 0.5rem;"><input type="checkbox" id="pay-ars-transfer" name="pay-ars-transfer" class="payment-method-cb"><label for="pay-ars-transfer">Pesos (Transferencia)</label></div>
                        <div id="pay-ars-transfer-fields" class="hidden" style="padding-left: 25px;"><input type="number" name="transferencia" placeholder="Monto ARS"></div>
                    </div>
                    <div class="form-group">
                        <label for="payment-notes">Notas (Opcional)</label>
                        <textarea id="payment-notes" name="notas" rows="2" placeholder="Ej: Saldo de la VTA-050"></textarea>
                    </div>
                    <div class="prompt-buttons">
                        <button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Registrar Pago</span><div class="spinner"></div></button>
                        <button type="button" class="prompt-button cancel">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>`;
    
    const form = document.getElementById('wholesale-payment-form');
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

async function saveWholesalePayment(form) {
    const btn = form.querySelector('button[type="submit"]');
    toggleSpinner(btn, true);

    const clientId = paymentContext.id;
    const clientName = paymentContext.name;
    const formData = new FormData(form);
    const totalPaymentUSD = parseFloat(formData.get('total'));
    const notas = (formData.get('notas') || '').trim();

    if (isNaN(totalPaymentUSD) || totalPaymentUSD <= 0) {
        showGlobalFeedback("El monto del pago debe ser válido y mayor a cero.", "error");
        toggleSpinner(btn, false);
        return;
    }

    const usdAmount = parseFloat(formData.get('dolares')) || 0;
    const arsEfectivoAmount = parseFloat(formData.get('efectivo')) || 0;
    const arsTransferAmount = parseFloat(formData.get('transferencia')) || 0;

    if ((usdAmount + arsEfectivoAmount + arsTransferAmount) === 0) {
        showGlobalFeedback("Debes especificar cómo ingresa el pago a la caja.", "error");
        toggleSpinner(btn, false);
        return;
    }

    try {
        await db.runTransaction(async t => {
            const fecha = firebase.firestore.FieldValue.serverTimestamp();
            const clientRef = db.collection('clientes_mayoristas').doc(clientId);
            
            // 1. Actualizar la deuda del cliente
            t.update(clientRef, { deuda_usd: firebase.firestore.FieldValue.increment(-totalPaymentUSD) });

            // 2. Registrar el pago en un nuevo historial (buena práctica)
            const pagoRef = db.collection('pagos_mayoristas').doc();
            t.set(pagoRef, {
                clienteId: clientId,
                clienteNombre: clientName,
                monto_total_usd: totalPaymentUSD,
                fecha,
                notas
            });

            // 3. Registrar el ingreso en la caja
            const descripcionBase = `Cobranza de C/C a ${clientName}`;
            if (usdAmount > 0) {
                t.set(db.collection('ingresos_caja').doc(), { categoria: 'Cobranza Mayorista', descripcion: descripcionBase, monto: usdAmount, metodo: 'Dólares', fecha });
            }
            if (arsEfectivoAmount > 0) {
                t.set(db.collection('ingresos_caja').doc(), { categoria: 'Cobranza Mayorista', descripcion: descripcionBase, monto: arsEfectivoAmount, metodo: 'Pesos (Efectivo)', fecha });
            }
            if (arsTransferAmount > 0) {
                t.set(db.collection('ingresos_caja').doc(), { categoria: 'Cobranza Mayorista', descripcion: descripcionBase, monto: arsTransferAmount, metodo: 'Pesos (Transferencia)', fecha });
            }
        });

        showGlobalFeedback('Pago de cliente registrado con éxito.', 'success');
        s.promptContainer.innerHTML = '';
        loadWholesaleClients(); // Recargamos para ver la deuda actualizada
        updateReports(); // Actualizamos los KPIs de caja

    } catch (error) {
        console.error("Error al registrar el pago del cliente:", error);
        showGlobalFeedback('Error al registrar el pago.', 'error');
    } finally {
        toggleSpinner(btn, false);
        paymentContext = null;
    }
}

// =======================================================================
// =================== INICIO: FUNCIONES VISTA FINANCIERA ================
// =======================================================================

async function loadFinancialData() {
    if (!s.accountsListContainer) return;
    s.accountsListContainer.innerHTML = `<p class="dashboard-loader">Cargando cuentas...</p>`;
    s.financieraTotalBalance.textContent = '...';

    try {
        const snapshot = await db.collection('cuentas_financieras').orderBy('nombre').get();
        
        let totalBalance = 0;
        
        // --- LÍNEA CLAVE CORREGIDA ---
        // Aquí, en lugar de crear una variable local 'accounts', 
        // actualizamos directamente nuestra variable global 'financialAccounts'.
        financialAccounts = snapshot.docs.map(doc => {
            const data = doc.data();
            totalBalance += data.saldo_actual_ars || 0;
            return { id: doc.id, ...data };
        });
        // -----------------------------

        s.financieraTotalBalance.textContent = formatearARS(totalBalance);
        
        // Renderizamos usando la variable global que acabamos de actualizar.
        renderFinancialAccounts(financialAccounts);

    } catch (error) {
        handleDBError(error, s.accountsListContainer, "cuentas financieras");
        s.financieraTotalBalance.textContent = 'Error';
    }
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
function renderFinancialAccounts(accounts) {
    if (accounts.length === 0) {
        s.accountsListContainer.innerHTML = `<p class="dashboard-loader" style="grid-column: 1 / -1;">No has creado ninguna cuenta. ¡Crea la primera para empezar!</p>`;
        return;
    }

    s.accountsListContainer.innerHTML = accounts.map(account => `
        <div class="account-card" data-account-id="${account.id}" style="animation-delay: ${accounts.indexOf(account) * 100}ms;">
            <div class="account-card-header">
                <span class="account-name">${account.nombre}</span>
                ${account.alias ? `<span class="account-alias">${account.alias}</span>` : ''}
            </div>
            <div class="account-card-balance">
                <span class="balance-value">${formatearARS(account.saldo_actual_ars)}</span>
            </div>
            ${account.detalles ? `<p style="text-align:center; color: var(--text-muted); font-size: 0.9rem; margin-top: auto;">${account.detalles}</p>` : ''}
            <div class="account-card-actions">
                <!-- ================== INICIO DE LA MODIFICACIÓN ================== -->
                
                <!-- NUEVO BOTÓN PARA MOVER/COBRAR DINERO -->
                <button class="action-btn-icon btn-move-money" title="Mover / Cobrar Dinero de esta Cuenta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                </button>

                <!-- BOTÓN DE ELIMINAR (se mantiene) -->
                <button class="action-btn-icon btn-delete-account" title="Eliminar Cuenta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
                <!-- =================== FIN DE LA MODIFICACIÓN ==================== -->
            </div>
        </div>
        <!-- Contenedor para el detalle desplegable -->
        <div class="account-history-container" data-container-for="${account.id}"></div>
    `).join('');
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
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

// 4. FUNCIÓN PARA GUARDAR LA NUEVA CUENTA
async function saveFinancialAccount(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const accountData = {
        nombre: form.nombre.value.trim(),
        alias: form.alias.value.trim(),
        detalles: form.detalles.value.trim(),
        saldo_actual_ars: 0, // Siempre se crea con saldo 0
        fecha_creacion: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!accountData.nombre) {
        showGlobalFeedback("El nombre de la cuenta es obligatorio.", "error");
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS
async function toggleAccountHistory(accountCard, accountId) {
    const historyContainer = s.accountsListContainer.querySelector(`[data-container-for="${accountId}"]`);
    
    if (accountCard.classList.contains('active')) {
        accountCard.classList.remove('active');
        historyContainer.style.maxHeight = null;
        return;
    }

    s.accountsListContainer.querySelectorAll('.account-card.active').forEach(card => {
        card.classList.remove('active');
        card.nextElementSibling.style.maxHeight = null;
    });

    accountCard.classList.add('active');
    
    if (!historyContainer.innerHTML) {
        historyContainer.innerHTML = `<p class="dashboard-loader" style="padding: 1rem 0;">Buscando transacciones...</p>`;
        
        try {
            const salesPromise = db.collection('ventas').where('cuenta_destino_id', '==', accountId).get();
            const ingresosPromise = db.collection('ingresos_caja').where('cuenta_destino_id', '==', accountId).get();
            const transferInPromise = db.collection('movimientos_internos').where('cuenta_destino_id', '==', accountId).get();
            const transferOutPromise = db.collection('movimientos_internos').where('cuenta_origen_id', '==', accountId).get();
            const commissionPaymentsPromise = db.collection('gastos').where('cuenta_origen_id', '==', accountId).where('categoria', '==', 'Comisiones').get();
            
            const [
                salesSnapshot, ingresosSnapshot, transferInSnapshot, 
                transferOutSnapshot, commissionPaymentsSnapshot 
            ] = await Promise.all([
                salesPromise, ingresosPromise, transferInPromise, 
                transferOutPromise, commissionPaymentsPromise 
            ]);

            let transactions = [];
            salesSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ date: data.fecha_venta.toDate(), type: 'Ingreso', description: `Venta: ${data.producto.modelo}`, amount: data.monto_transferencia }); });
            ingresosSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ date: data.fecha.toDate(), type: 'Ingreso', description: `Ingreso: ${data.categoria}`, amount: data.monto }); });
            transferInSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ date: data.fecha.toDate(), type: 'Ingreso', description: `Recibido de: ${data.cuenta_origen_nombre}`, amount: data.monto_ars }); });
            commissionPaymentsSnapshot.forEach(doc => { const data = doc.data(); transactions.push({ date: data.fecha.toDate(), type: 'Egreso', description: `Comisión: ${data.vendedor || 'N/A'}`, amount: -data.monto }); });
            transferOutSnapshot.forEach(doc => {
                const data = doc.data(); let description = '';
                if (data.tipo === 'Transferencia entre Cuentas') { description = `Enviado a: ${data.cuenta_destino_nombre}`;
                } else if (data.tipo === 'Retiro a Caja') { description = `Retiro a Caja (Efectivo)`;
                } else if (data.tipo === 'Retiro a Caja (USD)') { description = `Retiro a Caja (Dólares)`; }
                transactions.push({ date: data.fecha.toDate(), type: 'Egreso', description: description, amount: -data.monto_ars });
            });

            transactions.sort((a, b) => b.date - a.date);

            if (transactions.length === 0) {
                historyContainer.innerHTML = `<div class="history-content-wrapper"><p class="dashboard-loader">No hay movimientos para esta cuenta.</p></div>`;
            } else {
                // ===================== INICIO DE LA MODIFICACIÓN =====================
                // Añadimos el atributo 'data-label' a cada celda (<td>)
                const tableHTML = `
                    <div class="history-content-wrapper">
                        <table>
                            <thead><tr><th>Fecha</th><th>Tipo</th><th>Concepto</th><th style="text-align:right;">Monto</th></tr></thead>
                            <tbody>
                                ${transactions.map(item => `
                                    <tr>
                                        <td data-label="Fecha">${item.date.toLocaleDateString('es-AR')}</td>
                                        <td data-label="Tipo"><span style="color: ${item.type === 'Ingreso' ? 'var(--success-bg)' : 'var(--error-bg)'}; font-weight: 500;">${item.type}</span></td>
                                        <td data-label="Concepto">${item.description}</td>
                                        <td data-label="Monto" style="font-weight: 600; color: ${item.amount > 0 ? 'inherit' : 'var(--error-bg)'};">
                                            ${formatearARS(item.amount)}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>`;
                // ====================== FIN DE LA MODIFICACIÓN =======================
                historyContainer.innerHTML = tableHTML;
            }
        } catch (error) {
            console.error("Error al cargar historial de cuenta:", error);
            historyContainer.innerHTML = `<div class="history-content-wrapper"><p class="dashboard-loader" style="color: var(--error-bg);">Error al cargar el historial.</p></div>`;
        }
    }
    
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

// AÑADE ESTAS TRES NUEVAS FUNCIONES AL FINAL DE TU SCRIPT

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

// Función que guarda el vendedor en la base de datos
async function saveVendedor(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const vendedorData = {
        nombre: form.nombre.value.trim(),
        comision_pendiente_usd: 0,
        fecha_creacion: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!vendedorData.nombre) {
        showGlobalFeedback("El nombre del vendedor es obligatorio.", "error");
        toggleSpinner(btn, false);
        return;
    }

    try {
        // Usamos el nombre como ID del documento para evitar duplicados
        await db.collection('vendedores').doc(vendedorData.nombre).set(vendedorData);
        showGlobalFeedback('Vendedor agregado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        await loadAndPopulateSelects(); // Recargamos los selects de toda la app
        loadCommissions(); // Recargamos la vista de comisiones
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