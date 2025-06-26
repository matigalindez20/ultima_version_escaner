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

const vendedores = ["Agustin", "Joaquín", "Vendedor C"];
const colores = ["Negro espacial", "Plata", "Dorado", "Púrpura oscuro", "Rojo (Product RED)", "Azul", "Verde", "Blanco estelar", "Medianoche", "Titanio Natural", "Titanio Azul", "Otro"];
const almacenamientos = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const detallesEsteticos = ["Como Nuevo (Sin detalles)", "Excelente (Mínimos detalles)", "Bueno (Detalles de uso visibles)", "Regular (Marcas o rayones notorios)"];
const modelos = [ "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max", "iPhone 12 Mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max", "iPhone 13 Mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",];
const metodosDePago = ["Dólares", "Pesos (Efectivo)", "Pesos (Transferencia)"];
const gastosCategorias = ["Comida", "Repuestos", "Alquiler", "Accesorios", "Otro"];
const accesoriosSubcategorias = ["Fundas", "Fuentes", "Cables", "Templados", "Otro"];
const categoriaColores = {
    "Comida": "#3498db",
    "Repuestos": "#e74c3c",
    "Alquiler": "#9b59b6",
    "Accesorios": "#f1c40f",
    "Otro": "#95a5a6"
};

const s = {};
let canjeContext = null;
let gastosChart = null;

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    Object.assign(s, {
        loginContainer: document.getElementById('login-container'),
        appContainer: document.getElementById('app-container'),
        logoutButton: document.getElementById('logout-button'),
        tabDashboard: document.getElementById('tab-dashboard'),
        tabManagement: document.getElementById('tab-management'),
        dashboardView: document.getElementById('dashboard-view'),
        managementView: document.getElementById('management-view'),
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
        filterStockColor: document.getElementById('filter-stock-color'),
        filterStockGb: document.getElementById('filter-stock-gb'),
        filterStockBatMin: document.getElementById('filter-stock-bat-min'),
        filterStockBatMax: document.getElementById('filter-stock-bat-max'),
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
    });
    
    populateAllSelects();
    addEventListeners();
    auth.onAuthStateChanged(handleAuthStateChange);
}

function populateAllSelects() {
    populateSelect(s.filterSalesVendedor, vendedores, "Todos");
    populateSelect(s.filterCommissionsVendedor, vendedores, "Todos");
    populateSelect(s.filterStockColor, colores, "Todos");
    populateSelect(s.filterStockGb, almacenamientos, "Todos");
    populateSelect(s.filterStockModel, modelos, "Todos");
    populateSelect(s.modeloFormSelect, modelos, "Selecciona...");
    populateSelect(s.colorFormSelect, colores, "Selecciona...");
    populateSelect(s.almacenamientoFormSelect, almacenamientos, "Selecciona...");
    populateSelect(s.detallesFormSelect, detallesEsteticos, "Selecciona...");
}

function addEventListeners() {
    s.logoutButton.addEventListener('click', () => auth.signOut());
    s.tabDashboard.addEventListener('click', () => switchTab(true));
    s.tabManagement.addEventListener('click', () => switchTab(false));
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
    s.btnAddGasto.addEventListener('click', promptToAddGasto);
    s.btnHacerCaja.addEventListener('click', generarCajaDiaria);
}

function handleAuthStateChange(user) {
    if (user) {
        s.loginContainer.innerHTML = ''; s.loginContainer.classList.add('hidden');
        s.appContainer.classList.remove('hidden');
        s.btnShowStock.click();
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

const formatearUSD = (monto) => monto.toLocaleString('es-AR', { style: 'currency', currency: 'USD' });
const formatearARS = (monto) => monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

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
        feedbackEl.textContent = "Error: " + error.message;
        feedbackEl.className = 'error';
        feedbackEl.classList.remove('hidden');
    } finally {
        toggleSpinner(btn, false);
    }
}

function switchTab(isDashboard) {
    s.dashboardView.classList.toggle('hidden', !isDashboard);
    s.managementView.classList.toggle('hidden', isDashboard);
    s.tabDashboard.classList.toggle('active', isDashboard);
    s.tabManagement.classList.toggle('active', !isDashboard);
}

function switchDashboardView(viewName) {
    ['stock', 'sales', 'canje', 'gastos', 'commissions'].forEach(v => {
        const section = document.getElementById(`${v}-section`);
        const button = document.getElementById(`btn-show-${v}`);
        if (section) section.classList.toggle('hidden', v !== viewName);
        if (button) button.classList.toggle('active', v === viewName);
    });
    updateCanjeCount();
    if (viewName === 'stock') loadStock();
    else if (viewName === 'sales') loadSales();
    else if (viewName === 'canje') loadCanjes();
    else if (viewName === 'gastos') loadGastos();
    else if (viewName === 'commissions') loadCommissions();
}

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
        
        let sales = querySnapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });

        const startDate = s.filterCommissionsStartDate.value;
        const endDate = s.filterCommissionsEndDate.value;

        if (startDate) {
            const start = new Date(startDate + 'T00:00:00');
            sales = sales.filter(sale => sale.fecha_venta && sale.fecha_venta.toDate() >= start);
        }
        if (endDate) {
            const end = new Date(endDate + 'T23:59:59');
            sales = sales.filter(sale => sale.fecha_venta && sale.fecha_venta.toDate() <= end);
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

        if (!acc[vendor]) {
            acc[vendor] = {
                total: 0,
                sales: []
            };
        }
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
        
        const salesListHtml = data.sales.map(sale => {
            const fechaObj = sale.fecha_venta ? new Date(sale.fecha_venta.seconds * 1000) : null;
            let fechaFormateada = 'Fecha no disponible';
            if (fechaObj) {
                fechaFormateada = fechaObj.toLocaleString('es-AR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }) + ' hs';
            }
            const productoInfo = `${sale.producto.modelo || 'Producto desc.'} ${sale.producto.color || ''}`;

            return `
                <div class="commission-sale-item">
                    <div class="commission-sale-main">
                        <span class="commission-sale-product">${productoInfo}</span>
                        <span class="commission-sale-amount">${formatearUSD(sale.comision_vendedor_usd)}</span>
                    </div>
                    <span class="commission-sale-date">${fechaFormateada}</span>
                </div>
            `;
        }).join('');

        html += `
            <div class="commission-vendor-card">
                <div class="vendor-card-header">
                    <h3>${vendorName}</h3>
                    <span class="vendor-total-commission">${formatearUSD(data.total)}</span>
                </div>
                <div class="commission-sales-list">
                    ${salesListHtml}
                </div>
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
            if (venta.hubo_canje) {
                totalCanjeUSD += venta.valor_toma_canje_usd || 0;
            }
            const costoDoc = costosDocs[index];
            if (costoDoc.exists && costoDoc.data().precio_costo_usd !== undefined) {
                totalCostoUSD += costoDoc.data().precio_costo_usd;
            } else {
                itemsConError.push(venta.imei_vendido);
            }
        });

        const gananciaNeta = totalVentasUSD - totalCostoUSD;
        mostrarReporteCaja(fechaSeleccionada, totalVentasUSD, totalCostoUSD, gananciaNeta, itemsConError, ventasDelDia.length, totalCanjeUSD);

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
            <div class="prompt-buttons" style="justify-content: center;"><button id="btn-cerrar-reporte" class="prompt-button cancel" style="max-width: 200px;">Cerrar</button></div>
        </div>`;
    document.getElementById('btn-cerrar-reporte').onclick = () => s.promptContainer.innerHTML = '';
}

async function loadGastos() {
    s.gastosList.innerHTML = `<p class="dashboard-loader">Cargando gastos...</p>`;
    if (gastosChart) gastosChart.destroy();
    toggleSpinner(s.btnApplyGastosFilter, true);

    let startDate = s.filterGastosStartDate.value;
    let endDate = s.filterGastosEndDate.value;
    
    // Si no se especifican fechas, no se carga nada por defecto
    if (!startDate && !endDate) {
        s.gastosList.innerHTML = `<p class="dashboard-loader">Seleccione un rango de fechas para ver los gastos.</p>`;
        renderGastosChart([], {});
        toggleSpinner(s.btnApplyGastosFilter, false);
        return;
    }

    // Si solo hay una fecha, se asume que el rango es de un solo día
    if (startDate && !endDate) endDate = startDate;
    if (!startDate && endDate) startDate = endDate;

    try {
        const inicioDelRango = new Date(startDate + 'T00:00:00');
        const finDelRango = new Date(endDate + 'T23:59:59.999');

        let query = db.collection('gastos').orderBy('fecha', 'desc');

        query = query.where('fecha', '>=', inicioDelRango).where('fecha', '<=', finDelRango);
        
        const snapshot = await query.get();
        const gastos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (gastos.length === 0) {
            s.gastosList.innerHTML = `<p class="dashboard-loader">No se registraron gastos en este período.</p>`;
            renderGastosChart([], {});
            return;
        }

        const gastosPorCategoria = gastos.reduce((acc, gasto) => {
            const categoria = gasto.categoria;
            const monto = gasto.monto || 0;
            acc[categoria] = (acc[categoria] || 0) + monto;
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
    if (gastosChart) {
        gastosChart.destroy();
    }
    const totalGastos = gastos.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
    const labels = Object.keys(gastosPorCategoria);
    const data = Object.values(gastosPorCategoria);
    const backgroundColors = labels.map(label => categoriaColores[label] || '#cccccc');

    const centerTextPlugin = {
        id: 'centerText',
        afterDraw: (chart) => {
            const ctx = chart.ctx;
            const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (chart.getDatasetMeta(0).data.length === 0) {
                ctx.font = '500 16px -apple-system, sans-serif';
                ctx.fillStyle = '#86868b';
                ctx.fillText('Total Gastado', centerX, centerY - 12);
                
                ctx.font = 'bold 24px -apple-system, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('$0,00', centerX, centerY + 12);
                
                ctx.restore();
                return;
            }

            const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
            const availableWidth = innerRadius * 2 * 0.85;

            const getFittingFontSize = (text, maxWidth, weight = '500') => {
                let fontSize = 30; 
                ctx.font = `${weight} ${fontSize}px -apple-system, sans-serif`;
                while (ctx.measureText(text).width > maxWidth && fontSize > 8) {
                    fontSize--;
                    ctx.font = `${weight} ${fontSize}px -apple-system, sans-serif`;
                }
                return fontSize;
            };

            const text1 = 'Total Gastado';
            ctx.fillStyle = '#86868b';
            let fontSize1 = Math.min(getFittingFontSize(text1, availableWidth, '500'), 18);
            ctx.font = `500 ${fontSize1}px -apple-system, sans-serif`;
            ctx.fillText(text1, centerX, centerY - (fontSize1 / 2) - 4);

            const text2 = formatearARS(totalGastos);
            ctx.fillStyle = '#ffffff';
            let fontSize2 = Math.min(getFittingFontSize(text2, availableWidth, 'bold'), 48);
            ctx.font = `bold ${fontSize2}px -apple-system, sans-serif`;
            ctx.fillText(text2, centerX, centerY + (fontSize2 / 2));
            
            ctx.restore();
        }
    };
    
    gastosChart = new Chart(s.gastosChartCanvas, {
        type: 'doughnut',
        data: {
            labels: labels.map(l => `${l} (${formatearARS(gastosPorCategoria[l] || 0)})`),
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: 'var(--container-dark)',
                borderWidth: 4,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
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
                tooltip: {
                    enabled: false
                }
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
    let html = '';
    gastos.forEach(gasto => {
        const fecha = gasto.fecha ? new Date(gasto.fecha.seconds * 1000).toLocaleDateString('es-AR') : 'N/A';
        let descripcionCompleta = gasto.descripcion || 'Sin detalles';
        if (gasto.categoria === 'Accesorios' && gasto.subcategoria) {
            descripcionCompleta = `${gasto.subcategoria}${gasto.detalle_otro ? `: ${gasto.detalle_otro}` : ''} - ${descripcionCompleta}`;
        }
        if (gasto.categoria === 'Otro' && gasto.detalle_otro) {
             descripcionCompleta = `${gasto.detalle_otro} - ${descripcionCompleta}`;
        }
        html += `
            <div class="gasto-item" style="border-color: ${categoriaColores[gasto.categoria] || '#cccccc'};">
                <div class="gasto-item-info">
                    <div class="gasto-item-cat">${gasto.categoria}</div>
                    <div class="gasto-item-desc">${descripcionCompleta}</div>
                </div>
                <div class="gasto-item-details">
                    <div class="gasto-item-amount">${formatearARS(gasto.monto || 0)}</div>
                    <div class="gasto-item-date">${fecha}</div>
                </div>
                <div class="gasto-item-actions">
                    <button class="delete-btn" title="Eliminar Gasto" onclick="deleteGasto('${gasto.id}', '${gasto.categoria}', ${gasto.monto})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>`;
    });
    s.gastosList.innerHTML = html;
}

function promptToAddGasto() {
    const categoriaOptions = gastosCategorias.map(c => `<option value="${c}">${c}</option>`).join('');
    const subCategoriaOptions = accesoriosSubcategorias.map(sc => `<option value="${sc}">${sc}</option>`).join('');
    s.promptContainer.innerHTML = `
        <div class="container container-sm">
            <div class="prompt-box">
                <h3>Registrar Nuevo Gasto</h3>
                <form id="gasto-form">
                    <div class="form-group"><label for="gasto-monto">Monto (ARS)</label><input type="number" id="gasto-monto" name="monto" required placeholder="Ej: 1500.50" step="0.01"></div>
                    <div class="form-group"><label for="gasto-categoria">Categoría</label><select id="gasto-categoria" name="categoria" required><option value="">Seleccione...</option>${categoriaOptions}</select></div>
                    <div id="accesorios-fields" class="form-group hidden"><label for="gasto-subcategoria">Tipo de Accesorio</label><select id="gasto-subcategoria" name="subcategoria"><option value="">Seleccione...</option>${subCategoriaOptions}</select></div>
                    <div id="otro-detalle-field" class="form-group hidden"><label for="gasto-detalle-otro">Especificar</label><input type="text" id="gasto-detalle-otro" name="detalle_otro" placeholder="Detalle aquí..."></div>
                    <div class="form-group"><label for="gasto-descripcion">Descripción (opcional)</label><textarea id="gasto-descripcion" name="descripcion" rows="2" placeholder="Detalles adicionales del gasto"></textarea></div>
                    <div class="prompt-buttons">
                        <button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Guardar Gasto</span><div class="spinner"></div></button>
                        <button type="button" id="btn-cancel-gasto" class="prompt-button cancel">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>`;
    const form = document.getElementById('gasto-form');
    const categoriaSelect = document.getElementById('gasto-categoria');
    const subcategoriaSelect = document.getElementById('gasto-subcategoria');
    const accesoriosFields = document.getElementById('accesorios-fields');
    const otroDetalleField = document.getElementById('otro-detalle-field');
    const toggleConditionalFields = () => {
        const cat = categoriaSelect.value;
        const subcat = subcategoriaSelect.value;
        accesoriosFields.classList.toggle('hidden', cat !== 'Accesorios');
        otroDetalleField.classList.toggle('hidden', cat !== 'Otro' && subcat !== 'Otro');
    };
    categoriaSelect.addEventListener('change', toggleConditionalFields);
    subcategoriaSelect.addEventListener('change', toggleConditionalFields);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveGasto(e.target.querySelector('button[type="submit"]'));
    });
    document.getElementById('btn-cancel-gasto').onclick = () => { s.promptContainer.innerHTML = ''; };
}

async function saveGasto(btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    const gastoData = {
        monto: parseFloat(formData.get('monto')),
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
        loadGastos();
    } catch (error) {
        console.error("Error al guardar el gasto:", error);
        showGlobalFeedback('Error al registrar el gasto', 'error');
    } finally {
        toggleSpinner(btn, false);
    }
}

function deleteGasto(id, categoria, monto) {
    const message = `Categoría: ${categoria}\nMonto: $${monto}\n\n¿Estás seguro de que quieres eliminar este gasto? Esta acción no se puede deshacer.`;
    showConfirmationModal('Confirmar Eliminación', message, async () => {
        try {
            await db.collection('gastos').doc(id).delete();
            showGlobalFeedback('Gasto eliminado correctamente.', 'success');
            loadGastos();
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
        if (s.filterStockColor.value) query = query.where('color', '==', s.filterStockColor.value);
        if (s.filterStockGb.value) query = query.where('almacenamiento', '==', s.filterStockGb.value);
        if (s.filterStockBatMin.value) query = query.where('bateria', '>=', parseInt(s.filterStockBatMin.value));
        if (s.filterStockBatMax.value) query = query.where('bateria', '<=', parseInt(s.filterStockBatMax.value));
        query = query.orderBy('modelo');
        const querySnapshot = await query.get();
        if (querySnapshot.empty) { s.stockTableContainer.innerHTML = `<p class="dashboard-loader">No se encontraron productos con esos filtros.</p>`; return; }
        let tableHTML = `<table><thead><tr><th>Fecha Carga</th><th>Modelo</th><th>Color</th><th>GB</th><th>Batería</th><th>Costo (USD)</th><th>Acciones</th></tr></thead><tbody>`;
        querySnapshot.forEach(doc => {
            const item = doc.data();
            const fechaObj = item.fechaDeCarga ? new Date(item.fechaDeCarga.seconds * 1000) : null;
            let fechaFormateada = 'N/A';
            if(fechaObj) {
                const pad = (num) => num.toString().padStart(2, '0');
                fechaFormateada = `${pad(fechaObj.getDate())}/${pad(fechaObj.getMonth() + 1)}/${fechaObj.getFullYear()}<br><small class="time-muted">${pad(fechaObj.getHours())}:${pad(fechaObj.getMinutes())} hs</small>`;
            }
            const itemJSON = JSON.stringify(item).replace(/'/g, "'");
            tableHTML += `<tr data-item='${itemJSON}'>
                <td>${fechaFormateada}</td><td>${item.modelo || ''}</td><td>${item.color || ''}</td><td>${item.almacenamiento || ''}</td>
                <td>${item.bateria || ''}%</td><td>$${item.precio_costo_usd || 0}</td>
                <td class="actions-cell">
                    <button class="edit-btn btn-edit-stock" title="Editar Producto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button class="delete-btn btn-delete-stock" title="Eliminar Producto"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                </td></tr>`;
        });
        s.stockTableContainer.innerHTML = tableHTML + `</tbody></table>`;
        document.querySelectorAll('.btn-edit-stock').forEach(button => button.addEventListener('click', e => {
            const item = JSON.parse(e.target.closest('tr').dataset.item.replace(/'/g, "'"));
            promptToEditStock(item);
        }));
        document.querySelectorAll('.btn-delete-stock').forEach(button => button.addEventListener('click', e => {
            const item = JSON.parse(e.target.closest('tr').dataset.item.replace(/'/g, "'"));
            const message = `Producto: ${item.modelo} ${item.color}\nIMEI: ${item.imei}\n\nEsta acción eliminará el producto del stock permanentemente.`;
            showConfirmationModal('¿Seguro que quieres eliminar este producto?', message, () => deleteStockItem(item.imei, item));
        }));
    } catch (error) { handleDBError(error, s.stockTableContainer, "stock"); }
    finally { toggleSpinner(s.btnApplyStockFilters, false); }
}

function promptToEditStock(item) {
    switchTab(false);
    s.scanOptions.classList.add('hidden');
    s.scannerContainer.classList.add('hidden');
    s.feedbackMessage.classList.add('hidden');
    s.managementTitle.textContent = "Editar Producto";
    s.productFormSubmitBtn.querySelector('.btn-text').textContent = "Actualizar Producto";
    s.productForm.reset();
    s.imeiInput.value = item.imei;
    s.imeiInput.readOnly = true;
    document.getElementById('precio-costo-form').value = item.precio_costo_usd || '';
    s.modeloFormSelect.value = item.modelo;
    document.getElementById('bateria').value = item.bateria;
    s.colorFormSelect.value = item.color;
    s.almacenamientoFormSelect.value = item.almacenamiento;
    s.detallesFormSelect.value = item.detalles_esteticos;
    s.productForm.dataset.mode = 'update';
    s.productForm.classList.remove('hidden');
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
    const btn = (type === 'stock') ? s.exportStockBtn : s.exportSalesBtn;
    toggleSpinner(btn, true);
    try {
        let dataToExport = [], fileName = '', sheetName = '';
        if (type === 'stock') {
            const querySnapshot = await db.collection("stock_individual").where("estado", "==", "en_stock").orderBy('modelo').get();
            if (querySnapshot.empty) { showGlobalFeedback("No hay stock para exportar.", "error"); return; }
            querySnapshot.forEach(doc => {
                const data = doc.data();
                dataToExport.push({
                    'Fecha de Carga': data.fechaDeCarga ? new Date(data.fechaDeCarga.seconds * 1000).toLocaleString('es-AR') : '','Modelo': data.modelo,'Color': data.color,'Almacenamiento': data.almacenamiento,
                    'Bateria (%)': data.bateria,'IMEI': data.imei,'Detalles Esteticos': data.detalles_esteticos,'Precio Costo (USD)': data.precio_costo_usd || 0,
                });
            });
            fileName = `Stock_iPhone_Twins_${new Date().toISOString().slice(0,10)}.xlsx`; sheetName = "Stock Actual";
        } else if (type === 'sales') {
            const querySnapshot = await db.collection("ventas").orderBy("fecha_venta", "desc").get();
            if (querySnapshot.empty) { showGlobalFeedback("No hay ventas para exportar.", "error"); return; }
            querySnapshot.forEach(doc => {
                const venta = doc.data();
                dataToExport.push({
                    'Fecha Venta': venta.fecha_venta ? new Date(venta.fecha_venta.seconds * 1000).toLocaleString('es-AR') : 'N/A',
                    'Producto Vendido': `${venta.producto.modelo || ''} ${venta.producto.color || ''}`,'IMEI Vendido': venta.imei_vendido,'Vendedor': venta.vendedor,
                    'Precio (USD)': venta.precio_venta_usd,'Método Pago': venta.metodo_pago,'Monto (ARS)': venta.metodo_pago === 'pesos' ? venta.monto_pesos : '','Cotización Dólar': venta.metodo_pago === 'pesos' ? venta.cotizacion_dolar : '',
                    'Hubo Canje': venta.hubo_canje ? 'Sí' : 'No','Valor Toma Canje (USD)': venta.hubo_canje ? venta.valor_toma_canje_usd : ''
                });
            });
            fileName = `Ventas_iPhone_Twins_${new Date().toISOString().slice(0,10)}.xlsx`; sheetName = "Ventas";
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
        if (s.filterSalesStartDate.value) {
            query = query.where('fecha_venta', '>=', new Date(s.filterSalesStartDate.value + 'T00:00:00'));
        }
        if (s.filterSalesEndDate.value) {
            query = query.where('fecha_venta', '<=', new Date(s.filterSalesEndDate.value + 'T23:59:59'));
        }
        if (s.filterSalesVendedor.value) {
            query = query.where('vendedor', '==', s.filterSalesVendedor.value);
        }
        const querySnapshot = await query.limit(100).get();
        if (querySnapshot.empty) { s.salesTableContainer.innerHTML = `<p class="dashboard-loader">No se encontraron ventas con esos filtros.</p>`; return; }
        let tableHTML = `<table><thead><tr><th>Fecha</th><th>Producto</th><th>Vendedor</th><th>Precio (USD)</th><th>Pago</th><th>Detalles Pago</th><th>Plan Canje</th><th>Acciones</th></tr></thead><tbody>`;
        querySnapshot.forEach(doc => {
            const venta = doc.data();
            const fechaObj = venta.fecha_venta ? new Date(venta.fecha_venta.seconds * 1000) : null;
            let fechaFormateada = 'N/A';
            if(fechaObj) {
                const pad = (num) => num.toString().padStart(2, '0');
                fechaFormateada = `${pad(fechaObj.getDate())}/${pad(fechaObj.getMonth() + 1)}/${fechaObj.getFullYear()}<br><small class="time-muted">${pad(fechaObj.getHours())}:${pad(fechaObj.getMinutes())} hs</small>`;
            }
            const productoInfo = `${venta.producto.modelo || ''} ${venta.producto.color || ''}`;
            let pagoDetalle = '-';
            if (venta.metodo_pago === 'Pesos (Efectivo)') pagoDetalle = `ARS ${venta.monto_efectivo || ''} (T/C ${venta.cotizacion_dolar || ''})`;
            else if (venta.metodo_pago === 'Pesos (Transferencia)') pagoDetalle = `ARS ${venta.monto_transferencia || ''} (T/C ${venta.cotizacion_dolar || ''})`;
            const canjeIcon = venta.hubo_canje ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
            const ventaJSON = JSON.stringify(venta).replace(/'/g, "'");
            tableHTML += `<tr data-sale-id="${doc.id}" data-sale-item='${ventaJSON}'>
                <td>${fechaFormateada}</td><td>${productoInfo}</td><td>${venta.vendedor}</td><td>$${venta.precio_venta_usd}</td>
                <td>${venta.metodo_pago}</td><td>${pagoDetalle}</td><td style="text-align: center;">${canjeIcon}</td>
                <td class="actions-cell">
                    <button class="edit-btn btn-edit-sale" title="Editar Venta"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button class="delete-btn btn-delete-sale" title="Eliminar Venta"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                </td></tr>`;
        });
        s.salesTableContainer.innerHTML = tableHTML + `</tbody></table>`;
        document.querySelectorAll('.btn-edit-sale').forEach(button => button.addEventListener('click', e => {
            const row = e.target.closest('tr');
            const saleItem = JSON.parse(row.dataset.saleItem.replace(/'/g, "'"));
            promptToEditSale(saleItem, row.dataset.saleId);
        }));
        document.querySelectorAll('.btn-delete-sale').forEach(button => button.addEventListener('click', e => {
            const row = e.target.closest('tr');
            const saleItem = JSON.parse(row.dataset.saleItem.replace(/'/g, "'"));
            const message = `Producto: ${saleItem.producto.modelo}\nIMEI: ${saleItem.imei_vendido}\n\nEsta acción NO devolverá el equipo al stock y la eliminará permanentemente.`;
            showConfirmationModal('¿Seguro que quieres eliminar esta venta?', message, () => deleteSale(row.dataset.saleId, saleItem.imei_vendido, saleItem.id_canje_pendiente));
        }));
    } catch (error) { handleDBError(error, s.salesTableContainer, "ventas"); }
    finally { toggleSpinner(s.btnApplySalesFilters, false); }
}

function promptToEditSale(sale, saleId) {
    const vendedoresOptions = vendedores.map(v => `<option value="${v}" ${sale.vendedor === v ? 'selected' : ''}>${v}</option>`).join('');
    const pagoOptions = metodosDePago.map(p => `<option value="${p}" ${sale.metodo_pago === p ? 'selected' : ''}>${p}</option>`).join('');
    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin:auto;"><div class="prompt-box"><h3>Editar Venta</h3><form id="edit-sale-form">
        <div class="details-box"><div class="detail-item"><span>Producto:</span> <strong>${sale.producto.modelo || ''}</strong></div><div class="detail-item"><span>IMEI:</span> <strong>${sale.imei_vendido}</strong></div></div>
        <div class="form-group"><label for="precioVenta">Precio (USD)</label><input type="number" name="precioVenta" required value="${sale.precio_venta_usd || ''}"></div>
        <div class="form-group"><label for="metodoPago">Método de Pago</label><select name="metodoPago" required>${pagoOptions}</select></div>
        <div id="pesos-efectivo-fields" class="payment-details-group hidden"><div class="form-group"><label>Monto Efectivo (ARS)</label><input type="number" name="monto_efectivo" value="${sale.monto_efectivo || ''}"></div></div>
        <div id="pesos-transferencia-fields" class="payment-details-group hidden"><div class="form-group"><label>Monto Transferido (ARS)</label><input type="number" name="monto_transferencia" value="${sale.monto_transferencia || ''}"></div><div class="form-group"><label>Obs. Transferencia</label><textarea name="observaciones_transferencia" rows="2">${sale.observaciones_transferencia || ''}</textarea></div></div>
        <div id="cotizacion-dolar-field" class="form-group hidden"><label for="cotizacion_dolar">Cotización Dólar</label><input type="number" name="cotizacion_dolar" value="${sale.cotizacion_dolar || ''}"></div>
        <div class="form-group"><label for="vendedor">Vendedor</label><select name="vendedor" required>${vendedoresOptions}</select></div>
        <div id="comision-vendedor-field" class="form-group hidden"><label for="comision_vendedor_usd">Comisión Vendedor (USD)</label><input type="number" name="comision_vendedor_usd" value="${sale.comision_vendedor_usd || ''}"></div>
        <div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Actualizar Venta</span><div class="spinner"></div></button><button type="button" id="btn-cancel-edit-sale" class="prompt-button cancel">Cancelar</button></div>
    </form></div></div>`;
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
    document.getElementById('btn-cancel-edit-sale').onclick = () => { s.promptContainer.innerHTML = ''; };
}

async function updateSale(saleId, btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    const metodoPago = formData.get('metodoPago');
    const saleUpdateData = {
        precio_venta_usd: parseFloat(formData.get('precioVenta')) || 0,
        metodo_pago: metodoPago,
        vendedor: formData.get('vendedor'),
        comision_vendedor_usd: parseFloat(formData.get('comision_vendedor_usd')) || 0,
    };
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
    } else {
        saleUpdateData.cotizacion_dolar = firebase.firestore.FieldValue.delete();
        saleUpdateData.monto_efectivo = firebase.firestore.FieldValue.delete();
        saleUpdateData.monto_transferencia = firebase.firestore.FieldValue.delete();
        saleUpdateData.observaciones_transferencia = firebase.firestore.FieldValue.delete();
    }
    try {
        await db.collection("ventas").doc(saleId).update(saleUpdateData);
        showGlobalFeedback("Venta actualizada con éxito", "success");
        s.promptContainer.innerHTML = '';
        loadSales();
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
            const ventaRef = db.collection("ventas").doc(saleId);
            const stockRef = db.collection("stock_individual").doc(imei);
            t.delete(ventaRef);
            t.update(stockRef, { estado: "eliminado_por_error" });
            if (canjeId) {
                t.delete(db.collection("plan_canje_pendientes").doc(canjeId));
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
        let tableHTML = `<table><thead><tr><th>Fecha Canje</th><th>Modelo Recibido</th><th>Info Venta Asociada</th><th>Valor Toma (USD)</th><th>Acción</th></tr></thead><tbody>`;
        querySnapshot.forEach(doc => {
            const item = doc.data();
            const fecha = item.fecha_canje ? new Date(item.fecha_canje.seconds * 1000).toLocaleDateString('es-AR') : 'N/A';
            let ventaInfo = item.observaciones_canje || '';
            if (item.producto_vendido) ventaInfo = `A cambio de ${item.producto_vendido}. ${ventaInfo}`;
            tableHTML += `<tr data-canje-id="${doc.id}" data-modelo="${item.modelo_recibido}"><td>${fecha}</td><td>${item.modelo_recibido}</td><td>${ventaInfo}</td><td>$${item.valor_toma_usd}</td><td><button class="control-btn btn-cargar-canje" style="background-color: var(--success-bg);">Cargar a Stock</button></td></tr>`;
        });
        s.canjeTableContainer.innerHTML = tableHTML + `</tbody></table>`;
        document.querySelectorAll('.btn-cargar-canje').forEach(button => button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            cargarCanje(row.dataset.canjeId, row.dataset.modelo);
        }));
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
    if (error.code === 'failed-precondition' || error.code === 'invalid-argument') {
        msg = `Error en la consulta de ${context}. Revisa los filtros y la consola (F12) para más detalles.`;
    }
    container.innerHTML = `<p class="dashboard-loader" style="color:var(--error-bg)">${msg}</p>`;
}

const html5QrCode = new Html5Qrcode("scanner-container");
function startScanner() {
    resetManagementView();
    showFeedback(canjeContext ? `Escanea el IMEI para el ${canjeContext.modelo} del plan canje...` : 'Escanea un IMEI para empezar', 'info');
    s.scanOptions.classList.add('hidden');
    s.scannerContainer.classList.remove('hidden');
    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 150 } },
        async (decodedText) => {
            try { await html5QrCode.stop(); } catch(err) {}
            onScanSuccess(decodedText);
        },
        (errorMessage) => {}
    ).catch((err) => { showFeedback("Error al iniciar cámara. Revisa los permisos.", "error"); });
}

function promptForManualImeiInput(e) {
    if(e) e.preventDefault();
    s.promptContainer.innerHTML = `
        <div class="container container-sm">
            <div class="prompt-box">
                <h3>Ingresar IMEI Manualmente</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">Escribe el IMEI para buscarlo o agregarlo.</p>
                <div class="form-group"><label for="manual-imei-input">IMEI</label><input type="text" id="manual-imei-input" placeholder="Ingresa el IMEI aquí..."></div>
                <div class="prompt-buttons">
                    <button id="btn-search-manual-imei" class="prompt-button confirm">Buscar / Continuar</button>
                    <button id="btn-cancel-manual-imei" class="prompt-button cancel">Cancelar</button>
                </div>
            </div>
        </div>`;
    const imeiInput = document.getElementById('manual-imei-input');
    imeiInput.focus();
    document.getElementById('btn-search-manual-imei').addEventListener('click', () => {
        const imei = imeiInput.value.trim();
        if (!imei) { showGlobalFeedback("Por favor, ingresa un IMEI.", "error"); return; }
        s.promptContainer.innerHTML = '';
        onScanSuccess(imei);
    });
    document.getElementById('btn-cancel-manual-imei').addEventListener('click', () => { s.promptContainer.innerHTML = ''; });
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
    s.scanOptions.classList.add('hidden');
    s.scannerContainer.classList.add('hidden');
    s.imeiInput.readOnly = !!imei;
    s.imeiInput.value = imei;
    if (modelo) s.modeloFormSelect.value = modelo;
    if (canjeId) s.productForm.dataset.canjeId = canjeId;
    s.productForm.classList.remove('hidden');
    if (!imei) s.imeiInput.focus();
    else document.getElementById('precio-costo-form').focus();
}

function promptToSell(imei, details) {
    const vendedoresOptions = vendedores.map(v => `<option value="${v}">${v}</option>`).join('');
    const pagoOptions = metodosDePago.map(p => `<option value="${p}">${p}</option>`).join('');
    const modelosOptions = modelos.map(m => `<option value="${m}">${m}</option>`).join('');
    s.promptContainer.innerHTML = `<div class="container container-sm" style="margin:auto;"><div class="prompt-box"><h3>Registrar Venta</h3><form id="sell-form">
        <div class="details-box"><div class="detail-item"><span>Vendiendo:</span> <strong>${details.modelo || ''}</strong></div><div class="detail-item"><span>IMEI:</span> <strong>${imei}</strong></div></div>
        <div class="form-group"><label>Precio Venta (USD)</label><input type="number" name="precioVenta" required></div>
        <div class="form-group"><label>Método de Pago</label><select name="metodoPago" required><option value="">Seleccione...</option>${pagoOptions}</select></div>
        <div id="pesos-efectivo-fields" class="payment-details-group hidden"><div class="form-group"><label>Monto Efectivo (ARS)</label><input type="number" name="monto_efectivo"></div></div>
        <div id="pesos-transferencia-fields" class="payment-details-group hidden"><div class="form-group"><label>Monto Transferido (ARS)</label><input type="number" name="monto_transferencia"></div><div class="form-group"><label>Obs. Transferencia</label><textarea name="observaciones_transferencia" rows="2"></textarea></div></div>
        <div id="cotizacion-dolar-field" class="form-group hidden"><label>Cotización Dólar</label><input type="number" name="cotizacion_dolar"></div>
        <div class="form-group"><label>Vendedor</label><select name="vendedor" required><option value="">Seleccione...</option>${vendedoresOptions}</select></div>
        <div id="comision-vendedor-field" class="form-group hidden"><label>Comisión Vendedor (USD)</label><input type="number" name="comision_vendedor_usd"></div>
        <hr style="border-color:var(--border-dark);margin:1rem 0;"><div class="checkbox-group"><input type="checkbox" id="acepta-canje" name="acepta-canje"><label for="acepta-canje">Acepta Plan Canje</label></div>
        <div id="plan-canje-fields" class="hidden"><h4>Detalles del Equipo Recibido</h4><div class="form-group"><label>Modelo Recibido</label><select name="canje-modelo">${modelosOptions}</select></div><div class="form-group"><label>Valor Toma (USD)</label><input type="number" name="canje-valor"></div><div class="form-group"><label>Observaciones</label><textarea name="canje-observaciones" rows="2"></textarea></div></div>
        <div class="prompt-buttons"><button type="submit" class="prompt-button confirm spinner-btn"><span class="btn-text">Registrar Venta</span><div class="spinner"></div></button><button type="button" id="btn-cancel-sell" class="prompt-button cancel">Cancelar</button></div>
    </form></div></div>`;
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
    document.getElementById('btn-cancel-sell').onclick = () => { s.managementView.classList.remove('hidden'); s.promptContainer.innerHTML = ''; };
}

async function registerSale(imei, productDetails, btn) {
    toggleSpinner(btn, true);
    const form = btn.form;
    const formData = new FormData(form);
    const metodoPago = formData.get('metodoPago');
    const saleData = {
        imei_vendido: imei,
        producto: productDetails,
        precio_venta_usd: parseFloat(formData.get('precioVenta')) || 0,
        metodo_pago: metodoPago,
        vendedor: formData.get('vendedor'),
        comision_vendedor_usd: parseFloat(formData.get('comision_vendedor_usd')) || 0,
        fecha_venta: firebase.firestore.FieldValue.serverTimestamp(),
        hubo_canje: formData.get('acepta-canje') === 'on'
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
                t.set(canjeRef, {
                    modelo_recibido: formData.get('canje-modelo'), valor_toma_usd: saleData.valor_toma_canje_usd,
                    observaciones_canje: formData.get('canje-observaciones'), producto_vendido: `${productDetails.modelo} ${productDetails.color}`,
                    venta_asociada_id: saleRef.id, fecha_canje: firebase.firestore.FieldValue.serverTimestamp(), estado: 'pendiente_de_carga'
                });
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
    const form = e.target;
    const mode = form.dataset.mode || 'create';
    toggleSpinner(btn, true);
    const formData = new FormData(form);
    const imei = formData.get('imei').trim();
    if (!imei) { showFeedback("El campo IMEI no puede estar vacío.", "error"); toggleSpinner(btn, false); return; }
    const unitData = {
        imei, estado: 'en_stock',
        precio_costo_usd: parseFloat(formData.get('precio_costo_usd')) || 0,
        modelo: formData.get('modelo'), color: formData.get('color'),
        bateria: parseInt(formData.get('bateria')), almacenamiento: formData.get('almacenamiento'),
        detalles_esteticos: formData.get('detalles'),
    };
    if (mode === 'create') unitData.fechaDeCarga = firebase.firestore.FieldValue.serverTimestamp();
    try {
        if (mode === 'create') {
            const canjeId = form.dataset.canjeId;
            const productId = `${(unitData.modelo || '').toLowerCase().replace(/\s+/g, '-')}-${(unitData.color || '').toLowerCase().replace(/\s+/g, '-')}`;
            await db.runTransaction(async (t) => {
                const individualStockRef = db.collection("stock_individual").doc(imei);
                const displayProductRef = db.collection("productos_display").doc(productId);
                const [existingImei, displayDoc] = await Promise.all([t.get(individualStockRef), t.get(displayProductRef)]);
                if (existingImei.exists && existingImei.data().estado === 'en_stock') throw new Error(`El IMEI ${imei} ya está en stock.`);
                t.set(individualStockRef, unitData);
                if (!displayDoc.exists) t.set(displayProductRef, { nombre: unitData.modelo, color: unitData.color, stock_total: 1, opciones_disponibles: [{ imei, gb: unitData.almacenamiento, bateria: unitData.bateria }] });
                else t.update(displayProductRef, { stock_total: firebase.firestore.FieldValue.increment(1), opciones_disponibles: firebase.firestore.FieldValue.arrayUnion({ imei, gb: unitData.almacenamiento, bateria: unitData.bateria }) });
                if (canjeId) t.update(db.collection("plan_canje_pendientes").doc(canjeId), { estado: 'cargado_en_stock', imei_asignado: imei });
            });
            showFeedback(`¡Éxito! ${unitData.modelo} añadido al stock.`, "success");
        } else {
            await db.collection("stock_individual").doc(imei).update(unitData);
            showGlobalFeedback("¡Producto actualizado con éxito!", "success");
        }
        setTimeout(() => { resetManagementView(); switchTab(true); loadStock(); }, 1500);
    } catch (error) {
        showFeedback(error.message || `Error al ${mode === 'create' ? 'guardar' : 'actualizar'}.`, "error");
    } finally {
        toggleSpinner(btn, false);
        delete form.dataset.mode;
        delete form.dataset.canjeId;
    }
}

function resetManagementView() {
     s.promptContainer.innerHTML = ''; 
     s.productForm.reset();
     s.productForm.classList.add('hidden');
     s.scanOptions.classList.remove('hidden');
     s.scannerContainer.classList.add('hidden');
     s.feedbackMessage.classList.add('hidden');
     s.managementTitle.textContent = "Gestión de IMEI";
     s.productFormSubmitBtn.querySelector('.btn-text').textContent = "Guardar Producto";
     delete s.productForm.dataset.mode;
     delete s.productForm.dataset.canjeId;
}

function showFeedback(message, type = 'info') {
    s.feedbackMessage.textContent = message;
    s.feedbackMessage.className = `feedback-message ${type}`;
    s.feedbackMessage.classList.remove('hidden');
}