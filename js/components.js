// js/components.js
async function loadComponent(id, url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const html = await response.text();
            document.getElementById(id).innerHTML = html;
        }
    } catch (error) {
        console.error(`Error cargando el componente ${url}:`, error);
    }
}

// Cargar componentes al iniciar
document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("header-placeholder", "components/header.html");
    await loadComponent("controls-placeholder", "components/controls.html");
    if (typeof asignarEventos === 'function') { asignarEventos(); }
});