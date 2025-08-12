// MISMA CONFIGURACIÓN DE FIREBASE QUE EN script.js
const firebaseConfig = {
    apiKey: "AIzaSyCIriK864klIIu-PfRrTn18NCysRaTwWJs",
    authDomain: "tienda-twins.firebaseapp.com",
    projectId: "tienda-twins",
    storageBucket: "tienda-twins.appspot.com",
    messagingSenderId: "331341386452",
    appId: "1:331341386452:web:1f0c5257beaaccfcf86141",
    measurementId: "G-QYLGN5ZWX6"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    const chartsContainer = document.getElementById('charts-main-container');
    const authMessage = document.getElementById('auth-message');

    auth.onAuthStateChanged(user => {
        if (user) {
            // Si el usuario está logueado, ocultamos el mensaje y mostramos los gráficos
            authMessage.classList.add('hidden');
            chartsContainer.classList.remove('hidden');
            loadChartData(); // La función principal que carga y dibuja todo
        } else {
            // Si no está logueado, mostramos un mensaje para que vaya a la app principal
            authMessage.innerHTML = `<p class="dashboard-loader">Por favor, <a href="./index.html" style="color: var(--brand-yellow);">inicia sesión</a> en el panel principal para ver los informes.</p>`;
        }
    });
});

async function loadChartData() {
    try {
        // --- 1. DATOS PARA EL GRÁFICO DE VENTAS MENSUALES (ÚLTIMOS 12 MESES) ---
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        oneYearAgo.setDate(1); // Empezamos desde el día 1 del mes de hace un año

        const salesSnapshot = await db.collection('ventas')
            .where('fecha_venta', '>=', oneYearAgo)
            .get();
        
        const monthlySales = {};
        
        salesSnapshot.forEach(doc => {
            const sale = doc.data();
            const saleDate = sale.fecha_venta.toDate();
            // Creamos una clave única para cada mes, ej: "2024-08"
            const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
            const saleValue = sale.precio_venta_usd || 0;

            monthlySales[monthKey] = (monthlySales[monthKey] || 0) + saleValue;
        });

        // Preparamos los datos para el gráfico
        const salesLabels = Object.keys(monthlySales).sort();
        const salesData = salesLabels.map(key => monthlySales[key]);

        renderSalesChart(salesLabels, salesData);


        // --- 2. DATOS PARA EL GRÁFICO DE TOP 5 MODELOS (MES ACTUAL) ---
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const topModelsSnapshot = await db.collection('ventas')
            .where('fecha_venta', '>=', startOfMonth)
            .get();
            
        const modelCounts = {};
        
        topModelsSnapshot.forEach(doc => {
            const sale = doc.data();
            const modelName = sale.producto.modelo || 'Sin Modelo';
            modelCounts[modelName] = (modelCounts[modelName] || 0) + 1;
        });
        
        // Convertimos el objeto a un array, lo ordenamos y tomamos los 5 primeros
        const sortedModels = Object.entries(modelCounts)
            .sort(([,a],[,b]) => b - a)
            .slice(0, 5);

        const topModelsLabels = sortedModels.map(item => item[0]);
        const topModelsData = sortedModels.map(item => item[1]);
        
        renderTopModelsChart(topModelsLabels, topModelsData);

    } catch (error) {
        console.error("Error al cargar los datos para los gráficos:", error);
        document.getElementById('sales-chart-container').innerHTML = `<p class="chart-loader" style="color: var(--error-bg);">Error al cargar los datos de ventas.</p>`;
        document.getElementById('top-models-chart-container').innerHTML = `<p class="chart-loader" style="color: var(--error-bg);">Error al cargar los datos de modelos.</p>`;
    }
}

// En tu archivo charts.js, REEMPLAZA esta función completa:

function renderSalesChart(labels, data) {
    const container = document.getElementById('sales-chart-container');
    container.innerHTML = '<canvas id="salesChart"></canvas>'; // Limpiamos el loader
    const ctx = document.getElementById('salesChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas Totales (USD)',
                data: data,
                backgroundColor: 'rgba(253, 209, 0, 0.6)', 
                borderColor: 'rgba(253, 209, 0, 1)',
                borderWidth: 2,
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    // ===== INICIO DE LA MODIFICACIÓN =====
                    ticks: { 
                        color: 'rgba(255, 255, 255, 0.7)' // Cambiado a blanco con transparencia
                    },
                    grid: { 
                        color: 'rgba(255, 255, 255, 0.1)' // Cambiado a blanco muy tenue
                    }
                    // ===== FIN DE LA MODIFICACIÓN =====
                },
                x: {
                    // ===== INICIO DE LA MODIFICACIÓN =====
                    ticks: { 
                        color: 'rgba(255, 255, 255, 0.7)' // Cambiado a blanco con transparencia
                    },
                    grid: { 
                        color: 'rgba(255, 255, 255, 0.1)' // Cambiado a blanco muy tenue
                    }
                    // ===== FIN DE LA MODIFICACIÓN =====
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#000',
                    titleColor: 'var(--brand-yellow)',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return 'Ventas: ' + context.parsed.y.toLocaleString('es-AR', { style: 'currency', currency: 'USD' });
                        }
                    }
                }
            }
        }
    });
}

// En tu archivo charts.js, REEMPLAZA esta función completa:

function renderTopModelsChart(labels, data) {
    const container = document.getElementById('top-models-chart-container');
    
    if (labels.length === 0) {
        container.innerHTML = `<p class="chart-loader">No hay ventas registradas este mes para mostrar.</p>`;
        return;
    }
    
    container.innerHTML = '<canvas id="topModelsChart"></canvas>';
    const ctx = document.getElementById('topModelsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Unidades Vendidas',
                data: data,
                backgroundColor: [
                    'rgba(253, 209, 0, 0.8)', // Amarillo
                    'rgba(255, 255, 255, 0.8)', // Blanco
                    'rgba(134, 134, 139, 0.8)', // Gris
                    'rgba(29, 106, 60, 0.8)',   // Verde
                    'rgba(12, 84, 96, 0.8)'    // Azul
                ],
                borderColor: 'var(--container-dark)',
                borderWidth: 4,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        // ===== INICIO DE LA MODIFICACIÓN =====
                        color: 'rgba(255, 255, 255, 0.85)', // Cambiado a blanco semi-transparente
                        // ===== FIN DE LA MODIFICACIÓN =====
                        padding: 20,
                        font: { size: 14 }
                    }
                }
            }
        }
    });
}