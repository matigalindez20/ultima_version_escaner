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

const vendedores = ["Vendedor C"];
const colores = ["Negro espacial", "Plata", "Dorado", "Púrpura oscuro", "Rojo (Product RED)", "Azul", "Verde", "Blanco estelar", "Medianoche", "Titanio Natural", "Titanio Azul", "Otro"];
const almacenamientos = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const detallesEsteticos = ["Como Nuevo (Sin detalles)", "Excelente (Mínimos detalles)", "Bueno (Detalles de uso visibles)", "Regular (Marcas o rayones notorios)"];
const modelos = [ "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max", "iPhone 12 Mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max", "iPhone 13 Mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",];
const metodosDePago = ["Dólares", "Pesos (Efectivo)", "Pesos (Transferencia)"];
const gastosCategorias = ["Comida", "Repuestos", "Alquiler", "Accesorios", "Otro", "Comisiones"];
let ingresosCategorias = []; 
const accesoriosSubcategorias = ["Fundas", "Fuentes", "Cables", "Templados", "Otro"];
let proveedoresStock = []; 
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

document.addEventListener('DOMContentLoaded', initApp);

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
    });
    
    addEventListeners();
    auth.onAuthStateChanged(handleAuthStateChange);
}

async function loadAndPopulateSelects() {
    try {
        const proveedoresPromise = db.collection('proveedores').orderBy('nombre').get();
        const ingresosCatPromise = db.collection('ingresos_categorias').orderBy('nombre').get();
        
        const [provSnapshot, ingCatSnapshot] = await Promise.all([proveedoresPromise, ingresosCatPromise]);
        
        proveedoresStock = provSnapshot.docs.map(doc => doc.data().nombre);
        ingresosCategorias = ingCatSnapshot.docs.map(doc => doc.data().nombre);

        populateAllSelects();
    } catch (error) {
        console.error("Error al cargar datos para los selects:", error);
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function addEventListeners() {
    s.logoutButton.addEventListener('click', () => auth.signOut());
    
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
    });

    s.btnCalculateCommissions.addEventListener('click', loadCommissions);
    s.btnApplyStockFilters.addEventListener('click', loadStock);
    s.btnApplySalesFilters.addEventListener('click', loadSales);
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

    s.providersView.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const card = button.closest('.provider-card');
        if (!card) return;
        const providerId = card.dataset.providerId;
        const providerName = card.querySelector('h3').textContent;
        if (button.classList.contains('btn-register-payment')) {
            const debtAmount = parseFloat(card.querySelector('.debt-amount').textContent.replace(/[^0-9,-]+/g,"").replace(',', '.'));
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
        const clientItem = button.closest('.wholesale-client-item');
        if (!clientItem) return;
        const clientId = clientItem.dataset.clientId;
        const clientName = clientItem.querySelector('h3').textContent;

        if (button.classList.contains('btn-new-wholesale-sale')) {
            promptToStartWholesaleSale(clientId, clientName);
        } else if (button.classList.contains('btn-view-wholesale-history')) {
            showWholesaleHistory(clientId, clientName);
        } else if (button.classList.contains('btn-resync-client')) {
            resyncWholesaleClientTotal(clientId, clientName);
        } else if (button.classList.contains('btn-delete-wholesale-client')) {
            deleteWholesaleClient(clientId, clientName);
        }
    });


    s.commissionsResultsContainer.addEventListener('click', (e) => {
        const payButton = e.target.closest('.btn-pay-commission');
        if (payButton) {
            const card = payButton.closest('.commission-vendor-card');
            const vendorName = card.dataset.vendorName;
            const pendingAmount = parseFloat(payButton.dataset.pendingAmount);
            promptToPayCommission(vendorName, pendingAmount);
        }
    });

    s.promptContainer.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        if (form.id === 'payment-form') {
            saveProviderPayment(form);
        } else if (form.id === 'provider-form') {
            saveProvider(form.querySelector('button[type="submit"]'));
        } else if (form.id === 'gasto-form') {
            saveGasto(form.querySelector('button[type="submit"]'));
        } else if (form.id === 'ingreso-form') {
            const mode = form.dataset.mode || 'create';
            if (mode === 'create') {
                saveIngreso(form.querySelector('button[type="submit"]'));
            } else {
                updateIngreso(form.dataset.ingresoId, form.querySelector('button[type="submit"]'));
            }
        } else if (form.id === 'commission-payment-form') {
            saveCommissionPayment(form);
        } else if (form.id === 'batch-load-form') {
            const model = form.modelo.value;
            const batchCost = parseFloat(form.costo.value);
            const batchNumber = form.batchNumber.value.trim();
            const providerId = form.dataset.providerId;
            const providerName = form.dataset.providerName;
            initiateBatchLoad(providerId, providerName, model, batchCost, batchNumber);
        } else if (form.id === 'wholesale-client-form') {
            saveWholesaleClient(form.querySelector('button[type="submit"]'));
        } else if (form.id === 'wholesale-sale-start-form') {
            initiateWholesaleSale(form);
        }
    });

    s.promptContainer.addEventListener('click', (e) => {
        if (e.target.matches('.prompt-button.cancel')) {
            s.promptContainer.innerHTML = '';
            paymentContext = null;
        }
    });

    // --- INICIO DE LA CORRECCIÓN ---
    // Usamos delegación de eventos en un contenedor padre que siempre existe.
    if (s.reportsView) {
        s.reportsView.addEventListener('click', (e) => {
            const kpiCard = e.target.closest('.kpi-card');
            if (!kpiCard) return;

            const kpiValueDiv = kpiCard.querySelector('.kpi-value');
            if (!kpiValueDiv) return;
            
            const id = kpiValueDiv.id;

            switch (id) {
                case 'kpi-dollars-day':
                    showKpiDetail('dolares', 'dia');
                    break;
                case 'kpi-cash-day':
                    showKpiDetail('efectivo_ars', 'dia');
                    break;
                case 'kpi-transfer-day':
                    showKpiDetail('transferencia_ars', 'dia');
                    break;
                case 'kpi-dollars-month':
                    showKpiDetail('dolares', 'mes');
                    break;
                case 'kpi-cash-month':
                    showKpiDetail('efectivo_ars', 'mes');
                    break;
                case 'kpi-transfer-month':
                    showKpiDetail('transferencia_ars', 'mes');
                    break;
                case 'kpi-profit-day':
                    showProfitDetail('dia');
                    break;
                case 'kpi-profit-month':
                    showProfitDetail('mes');
                    break;
            }
        });
    }
    // --- FIN DE LA CORRECCIÓN ---
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function updateReports() {
    const kpiElements = [
        s.kpiStockValue, s.kpiStockCount,
        s.kpiDollarsDay, s.kpiCashDay, s.kpiTransferDay,
        s.kpiProfitDay, s.kpiExpensesDayUsd, s.kpiExpensesDayCash, s.kpiExpensesDayTransfer,
        s.kpiDollarsMonth, s.kpiCashMonth, s.kpiTransferMonth,
        s.kpiProfitMonth, s.kpiExpensesMonthUsd, s.kpiExpensesMonthCash, s.kpiExpensesMonthTransfer,
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
            stockSnap,
            salesDaySnap, salesMonthSnap,
            expensesDaySnap, expensesMonthSnap,
            miscIncomesDaySnap, miscIncomesMonthSnap,
            wholesaleSalesDaySnap, wholesaleSalesMonthSnap,
        ] = await Promise.all([
            db.collection('stock_individual').where('estado', '==', 'en_stock').get(),
            fetchData('ventas', 'fecha_venta', startOfDay, endOfDay),
            fetchData('ventas', 'fecha_venta', startOfMonth, endOfMonth),
            fetchData('gastos', 'fecha', startOfDay, endOfDay),
            fetchData('gastos', 'fecha', startOfMonth, endOfMonth),
            fetchData('ingresos_caja', 'fecha', startOfDay, endOfDay),
            fetchData('ingresos_caja', 'fecha', startOfMonth, endOfMonth),
            fetchData('ventas_mayoristas', 'fecha_venta', startOfDay, endOfDay),
            fetchData('ventas_mayoristas', 'fecha_venta', startOfMonth, endOfMonth),
        ]);
        
        let totalStockValue = 0;
        stockSnap.forEach(doc => { totalStockValue += doc.data().precio_costo_usd || 0; });
        s.kpiStockValue.textContent = formatearUSD(totalStockValue);
        s.kpiStockCount.textContent = stockSnap.size;

        const processEntries = async (salesSnapshot, miscIncomesSnap, expensesSnap, wholesaleSalesSnapshot) => {
            let totalIncomes = { usd: 0, cash: 0, transfer: 0 };
            let totalExpenses = { usd: 0, cash: 0, transfer: 0 };
            let totalProfit = 0;
        
            if (!salesSnapshot.empty) {
                const costPromises = salesSnapshot.docs.map(saleDoc =>
                    db.collection("stock_individual").doc(saleDoc.data().imei_vendido).get()
                );
                const costDocs = await Promise.all(costPromises);
                const costMap = new Map(costDocs.map(doc => [doc.id, doc.data()?.precio_costo_usd || 0]));

                salesSnapshot.forEach(doc => {
                    const venta = doc.data();
                    const cost = costMap.get(venta.imei_vendido) || 0;
                    const commission = venta.comision_vendedor_usd || 0;
                    totalProfit += (venta.precio_venta_usd || 0) - cost - commission;

                    // --- INICIO DE LA LÓGICA CORREGIDA ---
                    const valorCanjeUSD = venta.hubo_canje ? (venta.valor_toma_canje_usd || 0) : 0;
                    const cotizacion = venta.cotizacion_dolar || 1;
                    
                    // Sumamos los montos pagados a cada caja
                    totalIncomes.usd += venta.monto_dolares || 0;
                    totalIncomes.cash += venta.monto_efectivo || 0;
                    totalIncomes.transfer += venta.monto_transferencia || 0;

                    // Si hubo canje, lo restamos de la caja correspondiente
                    if (valorCanjeUSD > 0) {
                        // Prioridad de descuento: Dólares > Efectivo > Transferencia
                        if ((venta.monto_dolares || 0) > 0) {
                            totalIncomes.usd -= valorCanjeUSD;
                        } else if ((venta.monto_efectivo || 0) > 0) {
                            totalIncomes.cash -= (valorCanjeUSD * cotizacion);
                        } else if ((venta.monto_transferencia || 0) > 0) {
                            totalIncomes.transfer -= (valorCanjeUSD * cotizacion);
                        }
                    }
                    // --- FIN DE LA LÓGICA CORREGIDA ---
                });
            }
            wholesaleSalesSnapshot.forEach(doc => {
                const sale = doc.data().pago_recibido || {};
                totalIncomes.usd += sale.usd || 0;
                totalIncomes.cash += sale.ars_efectivo || 0;
                totalIncomes.transfer += sale.ars_transferencia || 0;
            });
            miscIncomesSnap.forEach(doc => {
                const ingreso = doc.data();
                if (ingreso.metodo === 'Dólares') totalIncomes.usd += ingreso.monto || 0;
                if (ingreso.metodo === 'Pesos (Efectivo)') totalIncomes.cash += ingreso.monto;
                if (ingreso.metodo === 'Pesos (Transferencia)') totalIncomes.transfer += ingreso.monto;
            });
            
            expensesSnap.forEach(doc => {
                const gasto = doc.data();
                if (gasto.metodo_pago === 'Dólares') totalExpenses.usd += gasto.monto || 0;
                if (gasto.metodo_pago === 'Pesos (Efectivo)') totalExpenses.cash += gasto.monto || 0;
                if (gasto.metodo_pago === 'Pesos (Transferencia)') totalExpenses.transfer += gasto.monto || 0;
            });
            
            const netIncomes = {
                usd: totalIncomes.usd - totalExpenses.usd,
                cash: totalIncomes.cash - totalExpenses.cash,
                transfer: totalIncomes.transfer - totalExpenses.transfer,
            };
        
            return { netIncomes, expenses: totalExpenses, profit: totalProfit };
        };

        const daily = await processEntries(salesDaySnap, miscIncomesDaySnap, expensesDaySnap, wholesaleSalesDaySnap);
        s.kpiDollarsDay.textContent = formatearUSD(daily.netIncomes.usd);
        s.kpiCashDay.textContent = formatearARS(daily.netIncomes.cash);
        s.kpiTransferDay.textContent = formatearARS(daily.netIncomes.transfer);
        s.kpiProfitDay.textContent = formatearUSD(daily.profit);
        s.kpiExpensesDayUsd.textContent = formatearUSD(daily.expenses.usd);
        s.kpiExpensesDayCash.textContent = formatearARS(daily.expenses.cash);
        s.kpiExpensesDayTransfer.textContent = formatearARS(daily.expenses.transfer);

        const monthly = await processEntries(salesMonthSnap, miscIncomesMonthSnap, expensesMonthSnap, wholesaleSalesMonthSnap);
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
// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function showKpiDetail(kpiType, period) {
    const now = new Date();
    let startDate, endDate;
    let title = '';

    if (period === 'dia') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        title = `Detalle de Caja del Día - ${kpiType.replace(/_/g, ' ').toUpperCase()}`;
    } else {
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
        let kpiMoneda, kpiMetodo, kpiMontoField;

        if (kpiType === 'dolares') {
            kpiMoneda = 'USD';
            kpiMontoField = 'monto_dolares';
        } else if (kpiType === 'efectivo_ars') {
            kpiMoneda = 'ARS';
            kpiMontoField = 'monto_efectivo';
        } else if (kpiType === 'transferencia_ars') {
            kpiMoneda = 'ARS';
            kpiMontoField = 'monto_transferencia';
        }
        
        const salesSnapPromise = db.collection('ventas').where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).get();
        const miscIncomesSnapPromise = db.collection('ingresos_caja').where('fecha', '>=', startDate).where('fecha', '<=', endDate).get();
        const expensesSnapPromise = db.collection('gastos').where('fecha', '>=', startDate).where('fecha', '<=', endDate).get();
        const wholesaleSalesSnapPromise = db.collection('ventas_mayoristas').where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).get();

        const [salesSnap, miscIncomesSnap, expensesSnap, wholesaleSalesSnap] = await Promise.all([salesSnapPromise, miscIncomesSnapPromise, expensesSnapPromise, wholesaleSalesSnapPromise]);
        
        // --- INICIO DE LA LÓGICA CORREGIDA PARA EL DETALLE ---
        salesSnap.forEach(doc => {
            const venta = doc.data();
            let montoDeEstaCaja = venta[kpiMontoField] || 0;
            
            if (montoDeEstaCaja > 0) {
                const valorCanjeUSD = venta.hubo_canje ? (venta.valor_toma_canje_usd || 0) : 0;
                let montoNeto = montoDeEstaCaja;
                
                if (valorCanjeUSD > 0) {
                    if (kpiMoneda === 'USD') {
                        montoNeto -= valorCanjeUSD;
                    } else if (kpiMoneda === 'ARS') {
                        const cotizacion = venta.cotizacion_dolar || 1;
                        montoNeto -= (valorCanjeUSD * cotizacion);
                    }
                }

                if (montoNeto > 0) {
                    let conceptoVenta = `Venta: ${venta.producto.modelo}`;
                    if (valorCanjeUSD > 0) conceptoVenta += ` (Canje)`;

                    transactions.push({ 
                        id: doc.id, 
                        fecha: venta.fecha_venta.toDate(), 
                        tipo: 'Ingreso', 
                        concepto: conceptoVenta,
                        monto: montoNeto,
                        moneda: kpiMoneda, 
                        data: venta, 
                        collection: 'ventas',
                    });
                }
            }
        });

        miscIncomesSnap.forEach(doc => {
            const ingreso = doc.data();
            if (ingreso.metodo.toLowerCase().includes(kpiType.split('_')[0])) {
                 transactions.push({ id: doc.id, fecha: ingreso.fecha.toDate(), tipo: 'Ingreso', concepto: `Ingreso: ${ingreso.categoria}`, monto: ingreso.monto, moneda: kpiMoneda, data: ingreso, collection: 'ingresos_caja' });
            }
        });
        
        expensesSnap.forEach(doc => {
            const gasto = doc.data();
             if (gasto.metodo_pago.toLowerCase().includes(kpiType.split('_')[0])) {
                transactions.push({ id: doc.id, fecha: gasto.fecha.toDate(), tipo: 'Egreso', concepto: `Gasto: ${gasto.descripcion || gasto.categoria}`, monto: gasto.monto, moneda: kpiMoneda, data: gasto, collection: 'gastos' });
            }
        });
        
        wholesaleSalesSnap.forEach(doc => {
            const sale = doc.data();
            const payment = sale.pago_recibido || {};
            let monto = 0;
            const concepto = `Venta Mayorista: ${sale.venta_id_manual} a ${sale.clienteNombre}`;

            if (kpiType === 'dolares' && payment.usd > 0) monto = payment.usd;
            else if (kpiType === 'efectivo_ars' && payment.ars_efectivo > 0) monto = payment.ars_efectivo;
            else if (kpiType === 'transferencia_ars' && payment.ars_transferencia > 0) monto = payment.ars_transferencia;

            if (monto > 0) {
                transactions.push({ id: doc.id, fecha: sale.fecha_venta.toDate(), tipo: 'Ingreso', concepto: concepto, monto: monto, moneda: kpiMoneda, data: sale, collection: 'ventas_mayoristas' });
            }
        });
        // --- FIN DE LA LÓGICA CORREGIDA ---
        
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
                            const deleteButtonHtml = `
                                <button class="delete-btn btn-delete-kpi-item" title="Eliminar/Revertir">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            `;

                            return `
                                <tr data-id="${t.id}" data-type="${t.tipo}" data-collection="${t.collection}" data-item='${JSON.stringify(t.data).replace(/'/g, "\\'")}'>
                                    <td>${t.fecha.toLocaleString('es-AR')}</td>
                                    <td>${t.tipo}</td>
                                    <td>${t.concepto}</td>
                                    <td class="${t.tipo === 'Ingreso' ? 'income' : 'outcome'}">
                                        ${t.tipo === 'Egreso' ? '-' : ''}${t.moneda === 'USD' ? formatearUSD(t.monto) : formatearARS(t.monto)}
                                    </td>
                                    <td class="actions-cell">${deleteButtonHtml}</td>
                                </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>`;
        detailContent.innerHTML = tableHTML;

        detailContent.querySelectorAll('.btn-delete-kpi-item').forEach(btn => btn.addEventListener('click', (e) => {
            const row = e.currentTarget.closest('tr');
            const id = row.dataset.id;
            const collection = row.dataset.collection;
            const data = JSON.parse(row.dataset.item.replace(/\\'/g, "'"));
            
            if (collection === 'ventas') {
                const message = `¿Seguro que quieres revertir esta venta?\n\n- La venta se eliminará.\n- El equipo (IMEI: ${data.imei_vendido}) volverá al stock.`;
                showConfirmationModal('Revertir Venta', message, () => reverseSaleTransaction(id, data, kpiType, period));
            } else if (collection === 'ingresos_caja') {
                 showConfirmationModal('Eliminar Ingreso Vario', `¿Seguro que quieres eliminar este ingreso?`, () => deleteSimpleTransaction(id, 'ingresos_caja', kpiType, period));
            } else if (collection === 'gastos') {
                if (data.categoria === 'Pago a Proveedor') {
                    showConfirmationModal('Revertir Pago a Proveedor', `Esto devolverá la deuda al proveedor y eliminará el gasto. ¿Continuar?`, () => revertProviderPayment(id, data.pagoId, kpiType, period));
                } else {
                    showConfirmationModal('Eliminar Gasto', `¿Seguro que quieres eliminar este gasto?`, () => deleteSimpleTransaction(id, 'gastos', kpiType, period));
                }
            } else if (collection === 'ventas_mayoristas') {
                revertWholesaleSale(id, data, () => { 
                    showKpiDetail(kpiType, period); 
                });
            }
        }));

    } catch (error) {
        handleDBError(error, detailContent, `el detalle de ${kpiType}`);
    }
}
async function handleAuthStateChange(user) {
    if (user) {
        s.loginContainer.innerHTML = ''; 
        s.loginContainer.classList.add('hidden');
        s.appContainer.classList.remove('hidden');
        await loadAndPopulateSelects();
        switchView('dashboard', s.tabDashboard);
        updateCanjeCount();
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
                        <!-- === LA ETIQUETA AHORA ESTÁ AQUÍ ADENTRO === -->
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
const formatearARS = (monto) => (monto || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 });


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

function switchView(view, tabElement) {
    const views = ['dashboard', 'providers', 'wholesale', 'reports', 'management'];
    
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
    } else if (view === 'management') {
        if (!batchLoadContext && !canjeContext && !wholesaleSaleContext) {
            resetManagementView();
        }
    }
}


function switchDashboardView(viewName, button) {
    const sections = ['stock', 'sales', 'canje', 'gastos', 'commissions', 'ingresos'];
    
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
    else if (viewName === 'gastos') loadGastos();
    else if (viewName === 'commissions') loadCommissions();
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

async function saveWholesaleClient(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const clientData = {
        nombre: form.nombre.value.trim(),
        notas: form.notas.value.trim(),
        total_comprado_usd: 0,
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
    s.promptContainer.innerHTML = `
        <div class="ingreso-modal-box">
            <h3>Registrar Venta a ${clientName}</h3>
            <form id="wholesale-sale-start-form" data-client-id="${clientId}" data-client-name="${clientName}" novalidate>
                <div class="form-group">
                    <input type="text" id="ws-sale-id" name="sale_id" required placeholder=" ">
                    <label for="ws-sale-id">ID de la Venta (Ej: VTA-050)</label>
                </div>
                <p style="color:var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Ingresa los montos que recibirás. El total se calculará solo.</p>
                <div class="form-group">
                    <input type="number" id="ws-sale-usd" name="monto_usd" placeholder=" " step="0.01">
                    <label for="ws-sale-usd">Monto Recibido (USD)</label>
                </div>
                <div class="form-group">
                    <input type="number" id="ws-sale-ars-efectivo" name="monto_ars_efectivo" placeholder=" " step="0.01">
                    <label for="ws-sale-ars-efectivo">Monto Recibido (ARS Efectivo)</label>
                </div>
                <div class="form-group">
                    <input type="number" id="ws-sale-ars-transf" name="monto_ars_transferencia" placeholder=" " step="0.01">
                    <label for="ws-sale-ars-transf">Monto Recibido (ARS Transferencia)</label>
                </div>
                <div class="prompt-buttons">
                    <button type="submit" class="prompt-button confirm">Iniciar Carga de Equipos</button>
                    <button type="button" class="prompt-button cancel">Cancelar</button>
                </div>
            </form>
        </div>`;
}

async function initiateWholesaleSale(form) {
    const formData = new FormData(form);
    const saleId = formData.get('sale_id').trim();
    const montoUsd = parseFloat(formData.get('monto_usd')) || 0;
    const montoArsEfectivo = parseFloat(formData.get('monto_ars_efectivo')) || 0;
    const montoArsTransferencia = parseFloat(formData.get('monto_ars_transferencia')) || 0;

    if (!saleId) {
        showGlobalFeedback("El ID de la venta es obligatorio.", "error");
        return;
    }
    if (montoUsd === 0 && montoArsEfectivo === 0 && montoArsTransferencia === 0) {
        showGlobalFeedback("Debes ingresar al menos un monto.", "error");
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
        items: [],
        totalSaleValue: 0
    };

    s.promptContainer.innerHTML = '';
    showGlobalFeedback(`Venta ${saleId} iniciada. Comienza a escanear los equipos a vender.`, 'info', 4000);
    
    resetManagementView(false, false, true);
    switchView('management', s.tabManagement);
}

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
            showFeedback(`${itemDetails.modelo} agregado. Escanea el siguiente.`, "success");
            
            resetManagementView(false, false, true);
            setTimeout(() => startScanner(), 500);
        });
        
    } catch (error) {
        showFeedback(error.message, "error");
        console.error(error);
        resetManagementView(false, false, true);
        setTimeout(() => startScanner(), 2000);
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

// =======================================================
// ============= INICIO CÓDIGO ACTUALIZADO ===============
// =======================================================

async function finalizeWholesaleSale() {
    // 1. Verificación inicial de seguridad
    if (!wholesaleSaleContext) {
        showGlobalFeedback("Error: El contexto de venta mayorista se perdió. Por favor, inicia nuevamente la venta.", "error", 6000);
        console.error("[Venta Mayorista] wholesaleSaleContext es null al finalizar la venta");
        resetManagementView();
        switchView('wholesale', s.tabWholesale);
        return;
    }
    if (!Array.isArray(wholesaleSaleContext.items) || wholesaleSaleContext.items.length === 0) {
        showGlobalFeedback("No hay equipos agregados a la venta. Debes escanear al menos un equipo antes de finalizar.", "warning", 6000);
        console.warn("[Venta Mayorista] Se intentó finalizar sin equipos agregados", wholesaleSaleContext);
        resetManagementView(false, false, true); // Mantener el modo mayorista para poder agregar equipos
        return;
    }

    // Muestra un feedback al usuario de que el proceso ha comenzado
    showGlobalFeedback("Registrando venta mayorista, por favor espera...", "loading", 10000);
    
    try {
        // Desestructuramos el contexto para un código más limpio
        const { clientId, clientName, saleId, payment, items, totalSaleValue } = wholesaleSaleContext;

        // 2. Ejecutar toda la lógica dentro de una transacción de Firestore
        await db.runTransaction(async (t) => {
            const saleDate = firebase.firestore.FieldValue.serverTimestamp(); // Usar la misma marca de tiempo para todos los documentos

            // 3. Crear el registro maestro de la venta mayorista
            const wholesaleSaleRef = db.collection('ventas_mayoristas').doc();
            t.set(wholesaleSaleRef, {
                clienteId: clientId,
                clienteNombre: clientName,
                venta_id_manual: saleId,
                fecha_venta: saleDate,
                pago_recibido: payment,
                total_venta_usd: totalSaleValue,
                cantidad_equipos: items.length
            });

            // 4. Recorrer cada equipo para procesarlo
            for (const item of items) {
                // 4a. Crear un registro de venta individual para contabilidad detallada
                const ventaIndividualRef = db.collection('ventas').doc();
                const ventaData = {
                    imei_vendido: item.imei,
                    producto: item.details, // Guardamos todos los detalles del producto
                    precio_venta_usd: item.precio_venta_usd,
                    metodo_pago: 'Venta Mayorista', // Método de pago específico
                    vendedor: `Mayorista: ${clientName}`, // Vendedor específico
                    fecha_venta: saleDate,
                    venta_mayorista_ref: wholesaleSaleRef.id, // Referencia al registro maestro
                    id_venta_mayorista_manual: saleId,
                    comision_vendedor_usd: 0, // Las ventas mayoristas no generan comisión
                    hubo_canje: false // No se maneja canje en este flujo
                };
                t.set(ventaIndividualRef, ventaData);

                // 4b. Actualizar el estado de cada equipo en el stock
                const stockRef = db.collection('stock_individual').doc(item.imei);
                t.update(stockRef, { estado: 'vendido' });
            }

            // 5. Actualizar las estadísticas del cliente mayorista
            const clientRef = db.collection('clientes_mayoristas').doc(clientId);
            // Usamos FieldValue.increment para evitar problemas de concurrencia
            t.update(clientRef, {
                total_comprado_usd: firebase.firestore.FieldValue.increment(totalSaleValue),
                fecha_ultima_compra: saleDate
            });
        });

        // 6. Si la transacción fue exitosa, mostrar feedback positivo
        showGlobalFeedback(`¡Venta mayorista ${saleId} registrada con éxito!`, 'success', 5000);
        console.log("[Venta Mayorista] Venta registrada correctamente", wholesaleSaleContext);

    } catch (error) {
        // 7. Si la transacción falla, notificar al usuario
        console.error("Error al finalizar la venta mayorista:", error, wholesaleSaleContext);
        showGlobalFeedback("Error crítico al registrar la venta. Los cambios no se guardaron. Revisa la consola.", "error", 8000);
    } finally {
        // 8. Limpiar el estado y volver a la vista principal, sin importar si hubo éxito o error
        wholesaleSaleContext = null;
        resetManagementView();
        switchView('wholesale', s.tabWholesale);
        updateReports(); // Actualizar los KPIs
    }
}

// =======================================================
// ============= FIN CÓDIGO ACTUALIZADO ==================
// =======================================================


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
        
        renderIngresosList(ingresos);

    } catch (error) {
        handleDBError(error, s.ingresosList, "ingresos");
        s.ingresosPeriodTotalArsEfectivo.textContent = 'Error';
        s.ingresosPeriodTotalArsTransferencia.textContent = 'Error';
        s.ingresosPeriodTotalUsd.textContent = 'Error';
    } finally {
        toggleSpinner(s.btnApplyIngresosFilter, false);
    }
}

function renderIngresosList(ingresos) {
    if (ingresos.length === 0) {
        s.ingresosList.innerHTML = `<p class="dashboard-loader" style="grid-column: 1 / -1;">No hay ingresos para mostrar en este período.</p>`;
        return;
    }

    s.ingresosList.innerHTML = ingresos.map(ingreso => {
        const montoFormateado = ingreso.metodo === 'Dólares' 
            ? formatearUSD(ingreso.monto) 
            : formatearARS(ingreso.monto);
        
        const ingresoJSON = JSON.stringify(ingreso).replace(/'/g, "\\'");

        return `
        <div class="ingreso-card" data-ingreso-id="${ingreso.id}" data-ingreso-item='${ingresoJSON}'>
            <div class="ingreso-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
            </div>
            <div class="ingreso-card-content">
                <div class="ingreso-card-header">
                    <span class="ingreso-card-category">${ingreso.categoria}</span>
                    <span class="ingreso-card-amount">${montoFormateado}</span>
                </div>
                <p class="ingreso-card-description">${ingreso.descripcion || 'Sin detalles adicionales.'}</p>
                <div class="ingreso-card-footer">
                    <span>${new Date((ingreso.fecha?.seconds || 0) * 1000).toLocaleString('es-AR')}</span>
                    <div class="actions-cell">
                        <button class="edit-btn btn-edit-ingreso" title="Editar Ingreso">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="delete-btn" title="Eliminar Ingreso" onclick="deleteIngreso('${ingreso.id}', '${ingreso.categoria}', ${ingreso.monto}, '${ingreso.metodo}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');

    document.querySelectorAll('.btn-edit-ingreso').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.currentTarget.closest('.ingreso-card');
            const ingresoItem = JSON.parse(card.dataset.ingresoItem.replace(/\\'/g, "'"));
            promptToEditIngreso(ingresoItem, card.dataset.ingresoId);
        });
    });
}


// REEMPLAZA ESTA FUNCIÓN

async function promptToAddIngreso() {
    await loadAndPopulateSelects(); 

    // Generamos las opciones de categoría con el botón de eliminar
    const categoriaOptions = ingresosCategorias.map(c => `
        <option value="${c}">
            ${c}
        </option>
    `).join('');

    const metodoOptions = metodosDePago.map(m => `<option value="${m}">${m}</option>`).join('');

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
            <div class="form-group">
                <select id="ingreso-categoria-select" name="categoria_existente" required>
                    <option value="" disabled selected></option>
                    ${categoriaOptions}
                    <option value="--nueva--">** Crear Nueva Categoría **</option>
                </select>
                <label for="ingreso-categoria-select">Categoría</label>
                <!-- Botón para eliminar la categoría seleccionada -->
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

    categoriaSelect.addEventListener('change', () => {
        const selectedValue = categoriaSelect.value;
        const isNew = selectedValue === '--nueva--';
        nuevaCategoriaGroup.classList.toggle('hidden', !isNew);
        document.getElementById('ingreso-categoria-nueva').required = isNew;

        // Muestra u oculta el botón de eliminar
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

// AÑADE ESTA NUEVA FUNCIÓN A TU SCRIPT.JS

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


// REEMPLAZA ESTA FUNCIÓN
async function saveIngreso(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    
    let categoria = formData.get('categoria_existente');
    if (categoria === '--nueva--') {
        categoria = formData.get('categoria_nueva').trim();
        if (categoria) {
            // Guardamos la nueva categoría en su colección
            await db.collection('ingresos_categorias').add({ nombre: categoria });
            // La añadimos a la lista local para no tener que recargar todo
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
    
    try {
        await db.collection('ingresos_caja').add(ingresoData);
        showGlobalFeedback('Ingreso registrado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        if(s.ingresosSection && !s.ingresosSection.classList.contains('hidden')) {
            loadIngresos();
        }
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

// REEMPLAZA ESTA FUNCIÓN EN TU SCRIPT.JS

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
                <!-- === ESTE ES EL BOTÓN CORREGIDO === -->
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
        switchView('management', s.tabManagement);

    } catch (error) {
        console.error("Error al iniciar la carga de lote:", error);
        showGlobalFeedback('Error al iniciar la carga de lote', 'error');
    }
}

async function promptToRegisterPayment(providerName, currentDebt) {
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

// REEMPLAZA ESTA FUNCIÓN
// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA

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


// REEMPLAZA ESTA FUNCIÓN COMPLETA

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
        const snapshot = await db.collection('lotes')
            .where('proveedorId', '==', providerId)
            .orderBy('fecha_carga', 'desc')
            .get();
        
        if (snapshot.empty) {
            batchListContainer.innerHTML = '<p class="dashboard-loader">Este proveedor no tiene lotes registrados.</p>';
            return;
        }

        const lotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        batchListContainer.innerHTML = lotes.map(lote => `
            <div class="batch-list-item" data-batch-id="${lote.id}">
                <div class="list-item-content" style="flex-grow: 1; display: flex; justify-content: space-between; align-items: center;">
                    <div class="batch-info">Lote #${lote.numero_lote} <span>(${new Date(lote.fecha_carga.seconds * 1000).toLocaleDateString('es-AR')})</span></div>
                    <div class="batch-cost">${formatearUSD(lote.costo_total_usd)}</div>
                </div>
                <button class="delete-icon-btn btn-delete-batch" title="Eliminar Lote">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `).join('');

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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function showKpiDetail(kpiType, period) {
    const now = new Date();
    let startDate, endDate;
    let title = '';

    if (period === 'dia') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        title = `Detalle de Caja del Día - ${kpiType.replace(/_/g, ' ').toUpperCase()}`;
    } else {
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
        let kpiMoneda;

        if (kpiType === 'dolares') kpiMoneda = 'USD';
        else if (kpiType === 'efectivo_ars') kpiMoneda = 'ARS';
        else if (kpiType === 'transferencia_ars') kpiMoneda = 'ARS';
        
        const salesSnapPromise = db.collection('ventas').where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).get();
        const miscIncomesSnapPromise = db.collection('ingresos_caja').where('fecha', '>=', startDate).where('fecha', '<=', endDate).get();
        const expensesSnapPromise = db.collection('gastos').where('fecha', '>=', startDate).where('fecha', '<=', endDate).get();
        const wholesaleSalesSnapPromise = db.collection('ventas_mayoristas').where('fecha_venta', '>=', startDate).where('fecha_venta', '<=', endDate).get();

        const [salesSnap, miscIncomesSnap, expensesSnap, wholesaleSalesSnap] = await Promise.all([salesSnapPromise, miscIncomesSnapPromise, expensesSnapPromise, wholesaleSalesSnapPromise]);
        
        // --- INICIO DE LA LÓGICA CORREGIDA PARA EL DETALLE ---
        salesSnap.forEach(doc => {
            const venta = doc.data();
            let montoDeEstaCaja = 0;
            
            // Verificamos qué monto corresponde a la caja actual
            if (kpiType === 'dolares') montoDeEstaCaja = venta.monto_dolares || 0;
            if (kpiType === 'efectivo_ars') montoDeEstaCaja = venta.monto_efectivo || 0;
            if (kpiType === 'transferencia_ars') montoDeEstaCaja = venta.monto_transferencia || 0;
            
            if (montoDeEstaCaja > 0) {
                const valorCanjeUSD = venta.hubo_canje ? (venta.valor_toma_canje_usd || 0) : 0;
                let montoNeto = montoDeEstaCaja;
                
                // Aplicamos el descuento del canje solo si esta caja fue la que lo "absorbió"
                if (valorCanjeUSD > 0) {
                    if (kpiType === 'dolares' && (venta.monto_dolares || 0) > 0) {
                        montoNeto -= valorCanjeUSD;
                    } else if (kpiType === 'efectivo_ars' && (venta.monto_efectivo || 0) > 0) {
                        montoNeto -= (valorCanjeUSD * (venta.cotizacion_dolar || 1));
                    } else if (kpiType === 'transferencia_ars' && (venta.monto_transferencia || 0) > 0) {
                         montoNeto -= (valorCanjeUSD * (venta.cotizacion_dolar || 1));
                    }
                }

                if (montoNeto > 0) {
                    let conceptoVenta = `Venta: ${venta.producto.modelo}`;
                    if (valorCanjeUSD > 0) conceptoVenta += ` (Canje)`;

                    transactions.push({ 
                        id: doc.id, 
                        fecha: venta.fecha_venta.toDate(), 
                        tipo: 'Ingreso', 
                        concepto: conceptoVenta,
                        monto: montoNeto,
                        moneda: kpiMoneda, 
                        data: venta, 
                        collection: 'ventas',
                    });
                }
            }
        });

        miscIncomesSnap.forEach(doc => {
            const ingreso = doc.data();
            if ((kpiType === 'dolares' && ingreso.metodo === 'Dólares') ||
                (kpiType === 'efectivo_ars' && ingreso.metodo === 'Pesos (Efectivo)') ||
                (kpiType === 'transferencia_ars' && ingreso.metodo === 'Pesos (Transferencia)')) {
                 transactions.push({ id: doc.id, fecha: ingreso.fecha.toDate(), tipo: 'Ingreso', concepto: `Ingreso: ${ingreso.categoria}`, monto: ingreso.monto, moneda: kpiMoneda, data: ingreso, collection: 'ingresos_caja' });
            }
        });
        
        expensesSnap.forEach(doc => {
            const gasto = doc.data();
             if ((kpiType === 'dolares' && gasto.metodo_pago === 'Dólares') ||
                 (kpiType === 'efectivo_ars' && gasto.metodo_pago === 'Pesos (Efectivo)') ||
                 (kpiType === 'transferencia_ars' && gasto.metodo_pago === 'Pesos (Transferencia)')) {
                transactions.push({ id: doc.id, fecha: gasto.fecha.toDate(), tipo: 'Egreso', concepto: `Gasto: ${gasto.descripcion || gasto.categoria}`, monto: gasto.monto, moneda: kpiMoneda, data: gasto, collection: 'gastos' });
            }
        });
        
        wholesaleSalesSnap.forEach(doc => {
            const sale = doc.data();
            const payment = sale.pago_recibido || {};
            let monto = 0;
            const concepto = `Venta Mayorista: ${sale.venta_id_manual} a ${sale.clienteNombre}`;

            if (kpiType === 'dolares' && payment.usd > 0) monto = payment.usd;
            else if (kpiType === 'efectivo_ars' && payment.ars_efectivo > 0) monto = payment.ars_efectivo;
            else if (kpiType === 'transferencia_ars' && payment.ars_transferencia > 0) monto = payment.ars_transferencia;

            if (monto > 0) {
                transactions.push({ id: doc.id, fecha: sale.fecha_venta.toDate(), tipo: 'Ingreso', concepto: concepto, monto: monto, moneda: kpiMoneda, data: sale, collection: 'ventas_mayoristas' });
            }
        });
        // --- FIN DE LA LÓGICA CORREGIDA ---
        
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
                            const deleteButtonHtml = `
                                <button class="delete-btn btn-delete-kpi-item" title="Eliminar/Revertir">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            `;

                            return `
                                <tr data-id="${t.id}" data-type="${t.tipo}" data-collection="${t.collection}" data-item='${JSON.stringify(t.data).replace(/'/g, "\\'")}'>
                                    <td>${t.fecha.toLocaleString('es-AR')}</td>
                                    <td>${t.tipo}</td>
                                    <td>${t.concepto}</td>
                                    <td class="${t.tipo === 'Ingreso' ? 'income' : 'outcome'}">
                                        ${t.tipo === 'Egreso' ? '-' : ''}${t.moneda === 'USD' ? formatearUSD(t.monto) : formatearARS(t.monto)}
                                    </td>
                                    <td class="actions-cell">${deleteButtonHtml}</td>
                                </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>`;
        detailContent.innerHTML = tableHTML;

        detailContent.querySelectorAll('.btn-delete-kpi-item').forEach(btn => btn.addEventListener('click', (e) => {
            const row = e.currentTarget.closest('tr');
            const id = row.dataset.id;
            const collection = row.dataset.collection;
            const data = JSON.parse(row.dataset.item.replace(/\\'/g, "'"));
            
            if (collection === 'ventas') {
                const message = `¿Seguro que quieres revertir esta venta?\n\n- La venta se eliminará.\n- El equipo (IMEI: ${data.imei_vendido}) volverá al stock.`;
                showConfirmationModal('Revertir Venta', message, () => reverseSaleTransaction(id, data, kpiType, period));
            } else if (collection === 'ingresos_caja') {
                 showConfirmationModal('Eliminar Ingreso Vario', `¿Seguro que quieres eliminar este ingreso?`, () => deleteSimpleTransaction(id, 'ingresos_caja', kpiType, period));
            } else if (collection === 'gastos') {
                if (data.categoria === 'Pago a Proveedor') {
                    showConfirmationModal('Revertir Pago a Proveedor', `Esto devolverá la deuda al proveedor y eliminará el gasto. ¿Continuar?`, () => revertProviderPayment(id, data.pagoId, kpiType, period));
                } else {
                    showConfirmationModal('Eliminar Gasto', `¿Seguro que quieres eliminar este gasto?`, () => deleteSimpleTransaction(id, 'gastos', kpiType, period));
                }
            } else if (collection === 'ventas_mayoristas') {
                revertWholesaleSale(id, data, () => { 
                    showKpiDetail(kpiType, period); 
                });
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


async function loadCommissions() {
    s.commissionsResultsContainer.innerHTML = `<p class="dashboard-loader">Calculando comisiones...</p>`;
    toggleSpinner(s.btnCalculateCommissions, true);
    
    try {
        const vendorNameFilter = s.filterCommissionsVendedor.value;
        const vendorsToQuery = vendorNameFilter ? [vendorNameFilter] : vendedores;

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

        let salesQuery = db.collection("ventas").where("comision_vendedor_usd", ">", 0);
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
        const salesByVendor = salesSnapshot.docs.reduce((acc, doc) => {
            const sale = doc.data();
            const vendorName = sale.vendedor;
            if (!acc[vendorName]) {
                acc[vendorName] = [];
            }
            acc[vendorName].push(sale);
            return acc;
        }, {});
        
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
        s.commissionsResultsContainer.innerHTML = `<p class="dashboard-loader">No hay datos de comisiones para mostrar.</p>`;
        return;
    }

    let html = '';
    for (const vendorName in vendorData) {
        const vendor = vendorData[vendorName];
        const sales = salesByVendor[vendorName] || [];

        // --- LÓGICA CORREGIDA PARA EL TOTAL ---
        // 1. Sumamos las comisiones del período actual
        const currentPeriodCommission = sales.reduce((sum, sale) => sum + (sale.comision_vendedor_usd || 0), 0);
        
        // 2. Sumamos la deuda histórica con las nuevas comisiones
        const totalPendingAmount = (vendor.comision_pendiente_usd || 0) + currentPeriodCommission;
        // --- FIN DE LA LÓGICA CORREGIDA ---

        const salesListHtml = sales.map(sale => `
            <div class="commission-sale-item">
                <div class="commission-sale-main">
                    <span class="commission-sale-product">${sale.producto.modelo || 'Producto desc.'} ${sale.producto.color || ''}</span>
                    <span class="commission-sale-amount">${formatearUSD(sale.comision_vendedor_usd)}</span>
                </div>
                <span class="commission-sale-date">${new Date((sale.fecha_venta?.seconds || 0) * 1000).toLocaleString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})} hs</span>
            </div>
        `).join('');

        html += `
            <div class="commission-vendor-card" data-vendor-name="${vendorName}">
                <div class="vendor-card-header">
                    <h3>${vendorName}</h3>
                    <div class="vendor-commission-details">
                         <!-- Ahora usamos el nuevo total calculado -->
                         <span class="vendor-total-commission" title="Comisión PENDIENTE de pago">${formatearUSD(totalPendingAmount)}</span>
                         <button class="btn-pay-commission" data-pending-amount="${totalPendingAmount}" title="Registrar un pago de comisión a este vendedor" ${totalPendingAmount <= 0 ? 'disabled' : ''}>Pagar Comisión</button>
                    </div>
                </div>
                ${salesListHtml ? `<div class="commission-sales-list">${salesListHtml}</div>` : '<p class="dashboard-loader" style="font-size:0.9rem; padding: 1rem 0;">No hay nuevas comisiones en este período.</p>'}
                <div class="commission-payment-history" id="history-${vendorName.replace(/\s+/g, '')}"></div>
            </div>
        `;
    }
    s.commissionsResultsContainer.innerHTML = html;

    Object.keys(vendorData).forEach(vendorName => {
        showCommissionPaymentHistory(vendorName);
    });
}

// REEMPLAZA ESTA FUNCIÓN EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN

async function promptToPayCommission(vendorName, pendingAmount) {
    const metodoOptions = metodosDePago.map(m => `<option value="${m}">${m}</option>`).join('');

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

           <!-- ESTE DIV AHORA APARECERÁ SOLO CUANDO SE PAGUE EN PESOS -->
           <div id="ars-payment-fields" class="payment-details-group hidden">
               <div class="form-group">
                   <input type="number" id="payment-cotizacion" name="cotizacion_dolar" placeholder=" ">
                   <label for="payment-cotizacion">Cotización del Dólar</label>
               </div>
               <div class="form-group">
                   <input type="number" id="payment-monto-ars" name="monto_ars" placeholder=" " readonly>
                   <label for="payment-monto-ars">Monto Equivalente (ARS)</label>
               </div>
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

   const toggleArsFields = () => {
       // --- LÓGICA CORREGIDA ---
       const show = metodoSelect.value.startsWith('Pesos');
       arsFields.classList.toggle('hidden', !show);
       
       cotizacionInput.required = show; // Solo es requerido si se muestran los campos
       montoArsInput.required = show;
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

// REEMPLAZA ESTA FUNCIÓN TAMBIÉN

// REEMPLAZA ESTA FUNCIÓN

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

    // --- LÓGICA CORREGIDA ---
    if (metodoPago.startsWith('Pesos')) {
        const cotizacion = parseFloat(formData.get('cotizacion_dolar'));
        if (isNaN(cotizacion) || cotizacion <= 0) {
            showGlobalFeedback("La cotización del dólar es requerida para pagos en pesos.", "error");
            toggleSpinner(btn, false);
            return;
        }
        const montoArs = parseFloat(formData.get('monto_ars'));
        if (isNaN(montoArs) || montoArs <= 0) {
            showGlobalFeedback("El monto en ARS es inválido.", "error");
            toggleSpinner(btn, false);
            return;
        }
        gastoData.cotizacion_dolar = cotizacion;
        gastoData.monto = montoArs;
        gastoData.metodo_pago = metodoPago;
    } else { // Pago en Dólares
        gastoData.monto = montoUsd;
        gastoData.metodo_pago = 'Dólares';
        // No se guarda cotización si se paga en dólares
    }

    const vendorRef = db.collection('vendedores').doc(vendorName);

    try {
        await db.runTransaction(async (t) => {
            const vendorDoc = await t.get(vendorRef);
            if (!vendorDoc.exists) {
                t.set(vendorRef, { 
                    nombre: vendorName, 
                    comision_pendiente_usd: -montoUsd 
                });
            } else {
                t.update(vendorRef, {
                    comision_pendiente_usd: firebase.firestore.FieldValue.increment(-montoUsd)
                });
            }

            const gastoRef = db.collection('gastos').doc();
            t.set(gastoRef, gastoData);

            const pagoComisionRef = db.collection('pagos_comisiones').doc();
            t.set(pagoComisionRef, {
                monto_usd: montoUsd,
                metodo_pago: metodoPago,
                vendedor: vendorName,
                fecha: gastoData.fecha,
                descripcion,
                gastoAsociadoId: gastoRef.id
            });
        });

        showGlobalFeedback('Pago de comisión registrado con éxito.', 'success');
        s.promptContainer.innerHTML = '';
        loadCommissions();
        updateReports();

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
    const categoriaOptions = gastosCategorias.map(c => `<option value="${c}">${c}</option>`).join('');
    const metodoOptions = metodosDePago.map(m => `<option value="${m}">${m}</option>`).join('');
    const accesoriosOptions = accesoriosSubcategorias.map(s => `<option value="${s}">${s}</option>`).join('');

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

    categoriaSelect.addEventListener('change', () => {
        const selectedCategory = categoriaSelect.value;
        accesoriosGroup.classList.toggle('hidden', selectedCategory !== 'Accesorios');
        otroGroup.classList.toggle('hidden', selectedCategory !== 'Otro' && selectedCategory !== 'Repuestos');
    });

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

    try {
        await db.collection('gastos').add(gastoData);
        showGlobalFeedback('Gasto registrado con éxito', 'success');
        s.promptContainer.innerHTML = '';
        if(s.gastosSection && !s.gastosSection.classList.contains('hidden')) {
            loadGastos();
        }
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

function renderGastosList(gastos) {
    if (gastos.length === 0) {
        s.gastosList.innerHTML = `<p class="dashboard-loader">No hay gastos para mostrar en este período.</p>`;
        return;
    }
    s.gastosList.innerHTML = gastos.map(gasto => {
        let desc = gasto.descripcion || 'Sin detalles';
        let montoFormateado;
        let deleteButton;

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

        return `<div class="gasto-item" style="border-color: ${categoriaColores[gasto.categoria] || '#cccccc'};">
            <div class="gasto-item-info"><div class="gasto-item-cat">${gasto.categoria}</div><div class="gasto-item-desc">${desc}</div></div>
            <div class="gasto-item-details"><div class="gasto-item-amount">${montoFormateado}</div><div class="gasto-item-date">${new Date((gasto.fecha?.seconds || 0) * 1000).toLocaleDateString('es-AR')}</div></div>
            <div class="gasto-item-actions">${deleteButton}</div>
        </div>`;
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

// REEMPLAZA ESTA FUNCIÓN
// REEMPLAZA ESTA FUNCIÓN COMPLETA

// REEMPLAZA ESTA FUNCIÓN EN TU SCRIPT.JS

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
        
        let tableHTML = `<table><thead><tr><th>Fecha</th><th>Producto</th><th>Cliente</th><th>Vendedor</th><th>Precio (USD)</th><th>Pago</th><th>Garantía</th><th>Acciones</th></tr></thead><tbody>`;
        
        querySnapshot.forEach(doc => {
            const venta = doc.data();
            const fechaObj = venta.fecha_venta ? venta.fecha_venta.toDate() : new Date();
            let fechaFormateada = `${String(fechaObj.getDate()).padStart(2, '0')}/${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}<br><small class="time-muted">${String(fechaObj.getHours()).padStart(2, '0')}:${String(fechaObj.getMinutes()).padStart(2, '0')} hs</small>`;
            
            const hoy = new Date();
            const fechaVenta = fechaObj;
            const diffTiempo = hoy.getTime() - fechaVenta.getTime();
            const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));
            const diasRestantes = 30 - diffDias;

            let garantiaHtml = '';
            let tooltipText = '';

            if (diasRestantes > 0) {
                tooltipText = `Quedan ${diasRestantes} día${diasRestantes > 1 ? 's' : ''} de garantía`;
                garantiaHtml = `
                    <div class="garantia-icon" data-tooltip="${tooltipText}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            <polyline points="9 12 12 15 15 9"></polyline>
                        </svg>
                    </div>`;
            } else {
                tooltipText = `Garantía vencida`;
                garantiaHtml = `
                    <div class="garantia-icon" data-tooltip="${tooltipText}">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    </div>`;
            }

            const ventaJSON = JSON.stringify(venta).replace(/'/g, "\\'");
            tableHTML += `<tr data-sale-id="${doc.id}" data-sale-item='${ventaJSON}'>
                <td>${fechaFormateada}</td>
                <td>${venta.producto.modelo || ''} ${venta.producto.color || ''}</td>
                <td>${venta.nombre_cliente || '-'}</td>
                <td>${venta.vendedor}</td>
                <td>${formatearUSD(venta.precio_venta_usd)}</td>
                <td>${venta.metodo_pago}</td>
                <td class="garantia-cell">${garantiaHtml}</td>
                <td class="actions-cell"><button class="edit-btn btn-edit-sale" title="Editar Venta"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button><button class="delete-btn btn-delete-sale" title="Eliminar Venta"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></td>
            </tr>`;
        });
        s.salesTableContainer.innerHTML = tableHTML + `</tbody></table>`;

        document.querySelectorAll('.garantia-icon').forEach(icon => {
            let tooltip = null;
            icon.addEventListener('mouseenter', (e) => {
                const text = e.currentTarget.dataset.tooltip;
                tooltip = document.createElement('div');
                tooltip.className = 'garantia-tooltip';
                tooltip.textContent = text;
                e.currentTarget.appendChild(tooltip);
                
                setTimeout(() => {
                    tooltip.classList.add('visible');
                }, 10);
            });

            icon.addEventListener('mouseleave', () => {
                if (tooltip) {
                    tooltip.classList.remove('visible');
                    tooltip.addEventListener('transitionend', () => tooltip.remove());
                }
            });
        });

        document.querySelectorAll('.btn-edit-sale').forEach(button => button.addEventListener('click', e => { const row = e.currentTarget.closest('tr'); const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'")); promptToEditSale(saleItem, row.dataset.saleId); }));
        document.querySelectorAll('.btn-delete-sale').forEach(button => button.addEventListener('click', e => { const row = e.currentTarget.closest('tr'); const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'")); const message = `Producto: ${saleItem.producto.modelo}\nIMEI: ${saleItem.imei_vendido}\n\nEsta acción NO devolverá el equipo al stock y la eliminará permanentemente.`; showConfirmationModal('¿Seguro que quieres eliminar esta venta?', message, () => deleteSale(row.dataset.saleId, saleItem.imei_vendido, saleItem.id_canje_pendiente)); }));
    
    } catch (error) { 
        handleDBError(error, s.salesTableContainer, "ventas"); 
    } finally { 
        toggleSpinner(s.btnApplySalesFilters, false); 
    }
}

function promptToEditSale(sale, saleId) {
    const vendedoresOptions = vendedores.map(v => `<option value="${v}" ${sale.vendedor === v ? 'selected' : ''}>${v}</option>`).join('');
    const pagoOptions = metodosDePago.map(p => `<option value="${p}" ${sale.metodo_pago === p ? 'selected' : ''}>${p}</option>`).join('');
    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin:auto;"><div class="prompt-box"><h3>Editar Venta</h3><form id="edit-sale-form"><div class="details-box"><div class="detail-item"><span>Producto:</span> <strong>${sale.producto.modelo || ''}</strong></div><div class="detail-item"><span>IMEI:</span> <strong>${sale.imei_vendido}</strong></div></div><div class="form-group"><label for="precioVenta">Precio (USD)</label><input type="number" name="precioVenta" required value="${sale.precio_venta_usd || ''}"></div><div class="form-group"><label for="metodoPago">Método de Pago</label><select name="metodoPago" required>${pagoOptions}</select></div><div id="pesos-efectivo-fields" class="payment-details-group hidden"><div class="form-group"><label>Monto Efectivo (ARS)</label><input type="number" name="monto_efectivo" value="${sale.monto_efectivo || ''}"></div></div><div id="pesos-transferencia-fields" class="payment-details-group hidden"><div class="form-group"><label>Monto Transferido (ARS)</label><input type="number" name="monto_transferencia" value="${sale.monto_transferencia || ''}"></div><div class="form-group"><label>Obs. Transferencia</label><textarea name="observaciones_transferencia" rows="2">${sale.observaciones_transferencia || ''}</textarea></div></div><div id="cotizacion-dolar-field" class="form-group hidden"><label for="cotizacion_dolar">Cotización Dólar</label><input type="number" name="cotizacion_dolar" value="${sale.cotizacion_dolar || ''}"></div><div class="form-group"><label for="vendedor">Vendedor</label><select name="vendedor" required>${vendedoresOptions}</select></div><div id="comision-vendedor-field" class="form-group hidden"><label>Comisión Vendedor (USD)</label><input type="number" name="comision_vendedor_usd" value="${sale.comision_vendedor_usd || ''}"></div><div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Actualizar Venta</span><div class="spinner"></div></button><button type="button" class="prompt-button cancel">Cancelar</button></div></form></div></div>`;
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function cargarCanje(docId, modelo) {
    const canjeItemRow = document.querySelector(`#canje-table-container tr[data-canje-id="${docId}"]`);
    const valorTomaTexto = canjeItemRow.querySelector('td:nth-child(4)').textContent;
    const valorTomaNumerico = parseFloat(valorTomaTexto.replace(/[^0-9,.-]+/g,"").replace(",", "."));

    // Establecemos el contexto global con TODOS los datos necesarios.
    canjeContext = { 
        docId, 
        modelo,
        valorToma: valorTomaNumerico 
    };

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
        canjeContext = null; // Limpiamos el contexto si el usuario cancela
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

function promptForManualImeiInput(e, context = null) {
    if(e) e.preventDefault();
    let promptTitle = 'Ingresar IMEI Manualmente';
    if (context && context.modelo) promptTitle = `Ingresar IMEI para ${context.modelo}`;
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
        onScanSuccess(imei, context); 
    });
    
    imeiInput.addEventListener('keypress', (event) => { 
        if (event.key === 'Enter') { 
            event.preventDefault(); 
            document.getElementById('btn-search-manual-imei').click(); 
        } 
    });
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function onScanSuccess(imei) {
    s.feedbackMessage.classList.add('hidden');
    
    // Verificamos si existe el contexto de canje
    if (canjeContext) {
        // Le pasamos todos los datos del contexto a la siguiente función
        showAddProductForm(null, imei, canjeContext.modelo, canjeContext.docId, canjeContext.valorToma);
    } else if (batchLoadContext) {
        showAddProductForm(null, imei, batchLoadContext.model);
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function onScanSuccess(imei) {
    s.feedbackMessage.classList.add('hidden');
    
    if (canjeContext) {
        // --- INICIO DE LA CORRECCIÓN CLAVE ---
        // Ahora pasamos el canjeId correctamente.
        showAddProductForm(null, imei, canjeContext.modelo, canjeContext.docId);
        // --- FIN DE LA CORRECCIÓN CLAVE ---
    } else if (batchLoadContext) {
        showAddProductForm(null, imei, batchLoadContext.model);
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

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function showAddProductForm(e, imei = '', modelo = '', canjeId = null, valorToma = null) {
    if(e) e.preventDefault();
    resetManagementView(batchLoadContext ? true : false); 
    s.scanOptions.classList.add('hidden');
    s.scannerContainer.classList.add('hidden');
    s.imeiInput.readOnly = !!imei;
    s.imeiInput.value = imei;

    // Reemplazamos el <select> original por la nueva estructura
    const modeloSelectContainer = s.modeloFormSelect.parentElement;
    modeloSelectContainer.innerHTML = `
        <label for="modelo-form">Modelo</label>
        <div class="custom-select-wrapper">
            <input type="hidden" id="modelo-form" name="modelo">
            <div class="custom-select-trigger">
                <span class="selected-value">Selecciona...</span>
                <div class="arrow"></div>
            </div>
            <div class="custom-options">
                ${modelos.map(opt => `<div class="custom-option" data-value="${opt}">${opt}</div>`).join('')}
            </div>
        </div>
    `;

    if (valorToma !== null) {
        // Asignamos el valor al nuevo desplegable personalizado
        const wrapper = modeloSelectContainer.querySelector('.custom-select-wrapper');
        const trigger = wrapper.querySelector('.selected-value');
        const hiddenInput = wrapper.querySelector('#modelo-form');
        trigger.textContent = modelo;
        hiddenInput.value = modelo;
        wrapper.querySelector(`.custom-option[data-value="${modelo}"]`)?.classList.add('selected');

        document.getElementById('precio-costo-form').value = valorToma;
        s.proveedorFormSelect.value = "Usado (Plan Canje)";
        s.productForm.dataset.canjeId = canjeId;
    } 
    else if (batchLoadContext) {
        const wrapper = modeloSelectContainer.querySelector('.custom-select-wrapper');
        const trigger = wrapper.querySelector('.selected-value');
        const hiddenInput = wrapper.querySelector('#modelo-form');
        trigger.textContent = batchLoadContext.model;
        hiddenInput.value = batchLoadContext.model;
        wrapper.querySelector(`.custom-option[data-value="${batchLoadContext.model}"]`)?.classList.add('selected');

        s.proveedorFormSelect.value = batchLoadContext.providerName;
        s.managementTitle.textContent = `Cargando Lote: ${batchLoadContext.model} (${batchLoadContext.count} cargados)`;
    }

    // Añadimos la funcionalidad al nuevo desplegable
    const customSelectWrapper = modeloSelectContainer.querySelector('.custom-select-wrapper');
    const trigger = customSelectWrapper.querySelector('.custom-select-trigger');
    const hiddenInput = customSelectWrapper.querySelector('#modelo-form');

    trigger.addEventListener('click', () => {
        customSelectWrapper.classList.toggle('open');
    });

    customSelectWrapper.querySelectorAll('.custom-option').forEach(option => {
        option.addEventListener('click', () => {
            // Quitamos la selección anterior
            customSelectWrapper.querySelector('.custom-option.selected')?.classList.remove('selected');
            // Añadimos la nueva
            option.classList.add('selected');
            // Actualizamos el valor visible y el oculto
            trigger.querySelector('.selected-value').textContent = option.textContent;
            hiddenInput.value = option.dataset.value;
            // Cerramos el desplegable
            customSelectWrapper.classList.remove('open');
        });
    });

    // Cerramos el desplegable si se hace clic fuera de él
    document.addEventListener('click', (event) => {
        if (!customSelectWrapper.contains(event.target)) {
            customSelectWrapper.classList.remove('open');
        }
    });

    s.productForm.classList.remove('hidden');
    
    if (!imei) {
        s.imeiInput.focus();
    } else if (!document.getElementById('precio-costo-form').value) {
        document.getElementById('precio-costo-form').focus();
    } else {
        document.getElementById('bateria').focus();
    }
}
// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

function promptToSell(imei, details) {
    const vendedoresOptions = vendedores.map(v => `<option value="${v}">${v}</option>`).join('');
    const modelosOptions = modelos.map(m => `<option value="${m}">${m}</option>`).join('');

    // Nueva estructura para los métodos de pago
    const metodosDePagoHtml = `
        <div class="form-group">
            <label>Método(s) de Pago</label>
            <div id="payment-methods-container">
                <!-- Dólares -->
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
                <!-- Pesos (Efectivo) -->
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
                <!-- Pesos (Transferencia) -->
                <div class="payment-option">
                    <label class="toggle-switch-group">
                        <input type="checkbox" name="metodo_pago_check" value="Pesos (Transferencia)">
                        <span class="toggle-switch-label">Pesos (Transferencia)</span>
                        <span class="toggle-switch-slider"></span>
                    </label>
                    <div class="payment-input-container hidden">
                        <input type="number" name="monto_transferencia" placeholder="Monto en ARS" step="0.01">
                        <textarea name="observaciones_transferencia" rows="2" placeholder="Obs. de transferencia (opcional)" style="margin-top: 10px;"></textarea>
                    </div>
                </div>
            </div>
        </div>
    `;

    const canjeHtml = `
        <hr style="border-color:var(--border-dark);margin:1.5rem 0;">
        <label class="toggle-switch-group">
            <input type="checkbox" id="acepta-canje" name="acepta-canje">
            <span class="toggle-switch-label">Acepta Plan Canje</span>
            <span class="toggle-switch-slider"></span>
        </label>
    `;

    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin:auto;"><div class="prompt-box"><h3>Registrar Venta</h3><form id="sell-form"><div class="details-box"><div class="detail-item"><span>Vendiendo:</span> <strong>${details.modelo || ''}</strong></div><div class="detail-item"><span>IMEI:</span> <strong>${imei}</strong></div></div><div class="form-group"><label>Nombre del Cliente (Opcional)</label><input type="text" name="nombre_cliente"></div><div class="form-group"><label>Precio Venta TOTAL (USD)</label><input type="number" name="precioVenta" required></div>${metodosDePagoHtml}<div class="form-group"><label for="cotizacion_dolar">Cotización Dólar (si aplica)</label><input type="number" name="cotizacion_dolar" placeholder="Ej: 1200"></div><div class="form-group"><label>Vendedor</label><select name="vendedor" required><option value="">Seleccione...</option>${vendedoresOptions}</select></div><div id="comision-vendedor-field" class="form-group hidden"><label>Comisión Vendedor (USD)</label><input type="number" name="comision_vendedor_usd"></div>${canjeHtml}<div id="plan-canje-fields" class="hidden"><h4>Detalles del Equipo Recibido</h4><div class="form-group"><label>Modelo Recibido</label><select name="canje-modelo">${modelosOptions}</select></div><div class="form-group"><label>Valor Toma (USD)</label><input type="number" name="canje-valor"></div><div class="form-group"><label>Observaciones</label><textarea name="canje-observaciones" rows="2"></textarea></div></div><div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Registrar Venta</span><div class="spinner"></div></button><button type="button" class="prompt-button cancel">Cancelar</button></div></form></div></div>`;
    
    const form = document.getElementById('sell-form');
    const vendedorSelect = form.querySelector('[name="vendedor"]');
    
    // Funcionalidad para mostrar/ocultar campos de monto
    form.querySelectorAll('input[name="metodo_pago_check"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const container = e.target.closest('.payment-option').querySelector('.payment-input-container');
            container.classList.toggle('hidden', !e.target.checked);
        });
    });
    
    vendedorSelect.addEventListener('change', () => {
        form.querySelector('#comision-vendedor-field').classList.toggle('hidden', !vendedorSelect.value);
    });
    
    document.getElementById('acepta-canje').addEventListener('change', (e) => { 
        document.getElementById('plan-canje-fields').classList.toggle('hidden', !e.target.checked); 
    });
    
    form.addEventListener('submit', (e) => { e.preventDefault(); registerSale(imei, details, e.target.querySelector('button[type="submit"]')); });
}
// REEMPLAZA ESTA FUNCIÓN

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

async function registerSale(imei, productDetails, btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);

    const ventaTotalUSD = parseFloat(formData.get('precioVenta')) || 0;
    const valorCanjeUSD = formData.get('acepta-canje') === 'on' ? (parseFloat(formData.get('canje-valor')) || 0) : 0;
    const cotizacion = parseFloat(formData.get('cotizacion_dolar')) || 1;

    // Recopilamos los pagos
    const montoDolares = parseFloat(formData.get('monto_dolares')) || 0;
    const montoEfectivo = parseFloat(formData.get('monto_efectivo')) || 0;
    const montoTransferencia = parseFloat(formData.get('monto_transferencia')) || 0;

    if (montoDolares === 0 && montoEfectivo === 0 && montoTransferencia === 0) {
        showGlobalFeedback("Debes ingresar un monto para al menos un método de pago.", "error");
        toggleSpinner(btn, false);
        return;
    }

    const pagosRecibidos = [];
    if (montoDolares > 0) pagosRecibidos.push('Dólares');
    if (montoEfectivo > 0) pagosRecibidos.push('Pesos (Efectivo)');
    if (montoTransferencia > 0) pagosRecibidos.push('Pesos (Transferencia)');

    // Creamos el objeto de la venta principal
    const saleData = {
        imei_vendido: imei, 
        producto: productDetails, 
        precio_venta_usd: ventaTotalUSD,
        nombre_cliente: formData.get('nombre_cliente').trim() || null,
        metodo_pago: pagosRecibidos.join(' + '), // Ej: "Dólares + Pesos (Efectivo)"
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

    try {
        await db.runTransaction(async (t) => {
            const saleRef = db.collection("ventas").doc();
            t.update(db.collection("stock_individual").doc(imei), { estado: 'vendido' });

            if (saleData.hubo_canje) {
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
            // Guardamos la venta maestra
            t.set(saleRef, saleData);
        });

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
    if (!imei) { showFeedback("El campo IMEI no puede estar vacío.", "error"); toggleSpinner(btn, false); return; }
    
    const unitData = {
        imei, 
        estado: 'en_stock', 
        precio_costo_usd: parseFloat(formData.get('precio_costo_usd')) || 0,
        modelo: formData.get('modelo'), 
        color: formData.get('color'), 
        bateria: parseInt(formData.get('bateria')),
        almacenamiento: formData.get('almacenamiento'), 
        detalles_esteticos: formData.get('detalles'),
        proveedor: formData.get('proveedor')
    };
    
    if (mode === 'create') {
        unitData.fechaDeCarga = firebase.firestore.FieldValue.serverTimestamp();
    }
    
    // Se obtiene el ID del canje directamente del formulario.
    const canjeId = form.dataset.canjeId; 

    try {
        if (mode === 'create') {
            await db.runTransaction(async (t) => {
                const individualStockRef = db.collection("stock_individual").doc(imei);
                
                const existingImei = await t.get(individualStockRef);
                if (existingImei.exists && existingImei.data().estado === 'en_stock') {
                    throw new Error(`El IMEI ${imei} ya está en stock.`);
                }

                t.set(individualStockRef, unitData);
                
                // Si hay un canjeId, se actualiza el documento de pendientes.
                if (canjeId) {
                    const canjeRef = db.collection("plan_canje_pendientes").doc(canjeId);
                    t.update(canjeRef, { 
                        estado: 'cargado_en_stock', 
                        imei_asignado: imei 
                    });
                }
                
                if (batchLoadContext) {
                    const loteRef = db.collection('lotes').doc(batchLoadContext.batchId);
                    t.update(loteRef, {
                        imeis: firebase.firestore.FieldValue.arrayUnion(imei)
                    });
                }
            });
            
            // Limpiamos el contexto DESPUÉS de que la operación fue exitosa.
            if (canjeId) {
                canjeContext = null;
            }

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
                    switchView('dashboard', s.tabDashboard);
                    loadStock();
                    updateReports();
                    loadCanjes();
                    updateCanjeCount();
                }, 1500);
            }
        } else { // modo 'update'
            await db.collection("stock_individual").doc(imei).update(unitData);
            showGlobalFeedback("¡Producto actualizado con éxito!", "success");
            setTimeout(() => { 
                resetManagementView(); 
                switchView('dashboard', s.tabDashboard);
                loadStock();
                updateReports();
            }, 1500);
        }
    } catch (error) {
        showFeedback(error.message || `Error al ${mode === 'create' ? 'guardar' : 'actualizar'}.`, "error");
        console.error("Error en handleProductFormSubmit:", error);
    } finally {
        toggleSpinner(btn, false);
        if (form.dataset.canjeId) {
             delete form.dataset.canjeId;
        }
        if (!batchLoadContext) {
            delete form.dataset.mode;
        }
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
        
        // --- INICIO DE LA MODIFICACIÓN ---
        const cancelButtonHtml = '<button type="button" id="btn-cancel-product-form" class="prompt-button cancel" style="margin-top: 1rem; background-color: var(--error-bg);">Cancelar</button>';
        const existingCancelBtn = s.productForm.querySelector('#btn-cancel-product-form');
        if (!existingCancelBtn) {
            s.productFormSubmitBtn.insertAdjacentHTML('afterend', cancelButtonHtml);
        }
        // --- FIN DE LA MODIFICACIÓN ---
    }

    const existingEndBtn = s.managementView.querySelector('#btn-end-process');
    if (existingEndBtn) existingEndBtn.remove();

    const existingTitleBtn = s.managementTitle.nextElementSibling;
    if (existingTitleBtn && existingTitleBtn.id === 'btn-end-process') {
        existingTitleBtn.remove();
    }
    
    if (!isBatchLoad) batchLoadContext = null;
    if (!isCanje) canjeContext = null; // Se limpia el contexto de canje aquí
    if (!isWholesaleSale) wholesaleSaleContext = null;

    let endBtn;
    if (isBatchLoad && batchLoadContext) {
        s.managementTitle.textContent = `Cargando lote: ${batchLoadContext.model} (${batchLoadContext.count} cargados)`;
        endBtn = document.createElement('button');
        endBtn.id = 'btn-end-process';
        endBtn.className = 'control-btn';
        endBtn.style.backgroundColor = 'var(--error-bg)';
        endBtn.textContent = 'Finalizar Carga de Lote';
        endBtn.onclick = () => {
            showGlobalFeedback(`Carga de lote finalizada. Se cargaron ${batchLoadContext.count} equipos.`, 'success', 4000);
            batchLoadContext = null;
            resetManagementView();
            switchView('providers', s.tabProviders);
        };
        s.scanOptions.appendChild(endBtn);
    } else if (isWholesaleSale && wholesaleSaleContext) {
        renderWholesaleLoader();
        s.scanOptions.classList.remove('hidden');
        endBtn = document.createElement('button');
        endBtn.id = 'btn-end-process';
        endBtn.className = 'control-btn';
        endBtn.style.backgroundColor = 'var(--success-bg)';
        endBtn.textContent = 'Finalizar y Registrar Venta';
        endBtn.onclick = () => finalizeWholesaleSale();
        s.managementTitle.insertAdjacentElement('afterend', endBtn);
    }
    
    delete s.productForm.dataset.mode;
    delete s.productForm.dataset.canjeId;
}


function showFeedback(message, type = 'info') {
    s.feedbackMessage.textContent = message;
    s.feedbackMessage.className = `feedback-message ${type}`;
    s.feedbackMessage.classList.remove('hidden');
}

async function showWholesaleHistory(clientId, clientName) {
    s.promptContainer.innerHTML = `
    <div class="container wholesale-history-modal">
        <h3>Historial de Compras</h3>
        <p class="client-name-subtitle">${clientName}</p>
        <div id="wholesale-history-content" class="table-container">
            <p class="dashboard-loader">Cargando historial de compras...</p>
        </div>
        <div class="prompt-buttons" style="justify-content: center; margin-top: 1.5rem;">
            <button class="prompt-button cancel">Cerrar</button>
        </div>
    </div>`;

    const contentDiv = document.getElementById('wholesale-history-content');
    try {
        const snapshot = await db.collection('ventas_mayoristas')
            .where('clienteId', '==', clientId)
            .orderBy('fecha_venta', 'desc')
            .get();

        if (snapshot.empty) {
            contentDiv.innerHTML = '<p class="dashboard-loader">Este cliente no tiene compras registradas.</p>';
            return;
        }

        const sales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>ID Venta</th>
                        <th>Equipos</th>
                        <th>Total Venta</th>
                        <th style="text-align:right;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${sales.map(sale => {
                        const saleJSON = JSON.stringify(sale).replace(/'/g, "\\'");
                        return `
                        <tr data-sale-id="${sale.id}" data-sale-item='${saleJSON}'>
                            <td>${sale.fecha_venta.toDate().toLocaleString('es-AR')}</td>
                            <td>${sale.venta_id_manual}</td>
                            <td>${sale.cantidad_equipos}</td>
                            <td>${formatearUSD(sale.total_venta_usd)}</td>
                            <td class="actions-cell">
                                <button class="control-btn btn-secondary" disabled title="Próximamente">Ver Detalle</button>
                                <button class="control-btn btn-revert-sale">Revertir</button>
                            </td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>`;
        contentDiv.innerHTML = tableHTML;
        
        contentDiv.querySelectorAll('.btn-revert-sale').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.currentTarget.closest('tr');
                const saleItem = JSON.parse(row.dataset.saleItem.replace(/\\'/g, "'"));
                revertWholesaleSale(row.dataset.saleId, saleItem);
            });
        });

    } catch (error) {
        handleDBError(error, contentDiv, 'historial de compras');
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

// REEMPLAZA ESTA FUNCIÓN EN TU SCRIPT.JS

function renderWholesaleClients(clients) {
    s.wholesaleClientsListContainer.innerHTML = clients.map(client => {
        const totalComprado = client.total_comprado_usd || 0;
        const ultimaCompra = client.fecha_ultima_compra ? new Date(client.fecha_ultima_compra.seconds * 1000).toLocaleDateString('es-AR') : 'Nunca';
        
        // === CAMBIO 1: El título ahora siempre es el mismo. Ya no hay condición. ===
        const deleteTitle = 'Eliminar Cliente';

        return `
        <div class="wholesale-client-item" data-client-id="${client.id}">
            <div class="client-item-main">
                <div class="client-item-info">
                    <h3>${client.nombre}</h3>
                    <div class="client-item-stats">
                        <span>Total Comprado: <strong>${formatearUSD(totalComprado)}</strong></span>
                        <span>Última Compra: <strong>${ultimaCompra}</strong></span>
                    </div>
                </div>
                <div class="client-item-actions">
                    <button class="control-btn btn-new-wholesale-sale">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14m-7-7h14" /></svg>
                        Registrar Venta
                    </button>
                    <button class="control-btn btn-secondary btn-view-wholesale-history">
                        Historial
                    </button>
                    
                    <button class="icon-btn btn-resync-client" title="Recalcular Total Comprado" style="background-color: #3498db;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    </button>
                    
                    <!-- === CAMBIO 2: Quité la lógica del 'disabled' del botón. Ahora siempre está activo. === -->
                    <button class="delete-icon-btn btn-delete-wholesale-client" title="${deleteTitle}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

// REEMPLAZA ESTA FUNCIÓN COMPLETA EN TU SCRIPT.JS

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