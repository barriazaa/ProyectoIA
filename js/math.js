// ==========================================
// js/math.js - Motor Matemático
// ==========================================

// 1. Estructura de Datos Dinámica
let dataset = [];

// 2. Parámetros del Modelo (Inician vacíos, se llenan desde la UI)
let m = 0;            
let b = 0;            
let alpha = 0;     

// ------------------------------------------
// Función para registrar nuevos puntos
// ------------------------------------------
function agregarPuntoAlModelo(valorX, valorY) {
    let nuevaFila = {
        n: dataset.length + 1,
        x: valorX,
        y: valorY,
        y_pred: 0,
        error: 0,
        error_sq: 0
    };
    dataset.push(nuevaFila); 
}

// ------------------------------------------
// Paso 2 - Cálculo de Predicciones (Y^)
// ------------------------------------------
function calcularPredicciones() {
    for (let i = 0; i < dataset.length; i++) {
        dataset[i].y_pred = (m * dataset[i].x) + b;
    }
}

// ------------------------------------------
// Paso 3 y 4 - Cálculo de Errores y MSE
// ------------------------------------------
function calcularErroresYModelo() {
    let sumaErroresCuadrados = 0;
    let n = dataset.length;

    for (let i = 0; i < n; i++) {
        let errorActual = dataset[i].y_pred - dataset[i].y;
        dataset[i].error = errorActual;

        let errorCuadradoActual = Math.pow(errorActual, 2);
        dataset[i].error_sq = errorCuadradoActual;

        sumaErroresCuadrados += errorCuadradoActual;
    }

    return sumaErroresCuadrados / n; // Retorna el MSE
}

// ------------------------------------------
// Paso 5 - Cálculo de Gradientes
// ------------------------------------------
function calcularGradientes() {
    let sumaGradienteB = 0;
    let sumaGradienteM = 0;
    let n = dataset.length;

    for (let i = 0; i < n; i++) {
        let errorActual = dataset[i].error;
        let xActual = dataset[i].x;

        sumaGradienteB += (1 * errorActual);
        sumaGradienteM += (xActual * errorActual);
    }

    let gradienteB = (sumaGradienteB * 2) / n;
    let gradienteM = (sumaGradienteM * 2) / n;

    return { gradienteB, gradienteM };
}

// ------------------------------------------
// Paso 6 - Actualización de Parámetros
// ------------------------------------------
function actualizarParametros(gradientes) {
    m = m - (alpha * gradientes.gradienteM);
    b = b - (alpha * gradientes.gradienteB);
}