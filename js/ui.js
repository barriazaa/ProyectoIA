// ==========================================
// js/ui.js - Interfaz y Visualización
// ==========================================

let regressionChart = null;
let mseChart = null;
let historialMSE = [];
let iteracionActual = 0;

document.addEventListener("DOMContentLoaded", () => {
    inicializarGraficas();
});

function asignarEventos() {
    // Botón "Añadir Punto"
    document.getElementById('btn-add').addEventListener('click', () => {
        let xVal = parseFloat(document.getElementById('input-x').value);
        let yVal = parseFloat(document.getElementById('input-y').value);

        if (!isNaN(xVal) && !isNaN(yVal)) {
            agregarPuntoAlModelo(xVal, yVal);
            document.getElementById('input-x').value = '';
            document.getElementById('input-y').value = '';
            actualizarTabla();
            actualizarGraficaRegresion();
        }
    });

    // Botón "Paso a Paso"
    document.getElementById('btn-step').addEventListener('click', () => {
        if (dataset.length < 2) return alert("Ingresa al menos 2 puntos.");
        ejecutarIteracion();
    });

    // Botón "Entrenamiento Completo"
    document.getElementById('btn-full').addEventListener('click', () => {
        if (dataset.length < 2) return alert("Ingresa al menos 2 puntos.");
        let iteracionesMax = parseInt(document.getElementById('input-iterations').value);
        for (let i = 0; i < iteracionesMax; i++) {
            ejecutarIteracion();
        }
    });
}

function ejecutarIteracion() {
    // Si es el primer paso, capturamos la configuración del usuario
    if (iteracionActual === 0) {
        m = parseFloat(document.getElementById('input-m-init').value);
        b = parseFloat(document.getElementById('input-b-init').value);
        alpha = parseFloat(document.getElementById('input-alpha').value);
    }
    
    iteracionActual++;
    
    // Lógica matemática
    calcularPredicciones();
    let mseActual = calcularErroresYModelo();

    // Mostrar el Error del Modelo en el pie de la tabla
    document.getElementById('data-table-foot').style.display = 'table-footer-group';
    document.getElementById('mse-table-display').innerText = mseActual.toFixed(4);

    let gradientes = calcularGradientes();
    actualizarParametros(gradientes);
    
    // Actualización visual
    historialMSE.push({ x: iteracionActual, y: mseActual });
    actualizarTabla();
    actualizarGraficaRegresion();
    actualizarGraficaMSE();
    
    // Panel Educativo
    document.querySelector('.step-info').innerHTML = `
        <strong>Iteración: ${iteracionActual} completada.</strong><br>
        • El Error Cuadrático Medio (MSE) es: <span style="color:#e74c3c; font-weight:bold;">${mseActual.toFixed(4)}</span><br>
        • Nueva Pendiente (m): ${m.toFixed(4)}<br>
        • Nuevo Intercepto (b): ${b.toFixed(4)}
    `;
}

function actualizarTabla() {
    let tbody = document.getElementById('data-table-body');
    tbody.innerHTML = ''; 
    
    dataset.forEach(dato => {
        let y_pred_format = dato.y_pred !== 0 ? dato.y_pred.toFixed(2) : '0.00';
        let error_format = dato.error !== 0 ? dato.error.toFixed(2) : '0.00';
        let error_sq_format = dato.error_sq !== 0 ? dato.error_sq.toFixed(2) : '0.00';

        tbody.innerHTML += `<tr>
            <td>${dato.n}</td>
            <td>${dato.x}</td>
            <td>${dato.y}</td>
            <td style="color: #002b5c; font-weight: 600;">${y_pred_format}</td>
            <td style="color: #e74c3c;">${error_format}</td>
            <td style="color: #27ae60;">${error_sq_format}</td>
        </tr>`;
    });
}

function inicializarGraficas() {
    const ctxReg = document.getElementById('chart-regression').getContext('2d');
    const ctxMse = document.getElementById('chart-mse').getContext('2d');

    regressionChart = new Chart(ctxReg, {
        type: 'scatter',
        data: {
            datasets: [
                { label: 'Datos', data: [], backgroundColor: '#002b5c', pointRadius: 6 },
                { label: 'Recta', data: [], type: 'line', borderColor: '#f2a900', fill: false, pointRadius: 0 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    mseChart = new Chart(ctxMse, {
        type: 'line',
        data: {
            datasets: [{ label: 'MSE', data: [], borderColor: '#27ae60', backgroundColor: 'rgba(39, 174, 96, 0.1)', fill: true }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function actualizarGraficaRegresion() {
    regressionChart.data.datasets[0].data = dataset.map(d => ({x: d.x, y: d.y}));
    if (dataset.length > 0) {
        let minX = Math.min(...dataset.map(d => d.x)) - 1;
        let maxX = Math.max(...dataset.map(d => d.x)) + 1;
        regressionChart.data.datasets[1].data = [
            { x: minX, y: (m * minX) + b },
            { x: maxX, y: (m * maxX) + b }
        ];
    }
    regressionChart.update();
}

function actualizarGraficaMSE() {
    mseChart.data.datasets[0].data = historialMSE;
    mseChart.update();
}