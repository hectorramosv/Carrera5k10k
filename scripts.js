document.addEventListener("DOMContentLoaded", () => {
    const selectEdad = document.getElementById("edad");
    const formulario = document.getElementById("asistenciaForm");
    const btnEnviar = document.getElementById("btnEnviar");

    // ==========================================
    // 1. GENERACIÓN DINÁMICA DE EDADES (15 a 75)
    // ==========================================
    for (let edad = 15; edad <= 75; edad++) {
        const opcion = document.createElement("option");
        opcion.value = edad;
        opcion.textContent = `${edad} años`;
        selectEdad.appendChild(opcion);
    }

    // ==========================================
    // 2. ENVÍO DE DATOS A GOOGLE SHEETS
    // ==========================================
    formulario.addEventListener("submit", function(e) {
        e.preventDefault(); // Evita que la página se recargue por completo

        // Cambiar el estado del botón para dar feedback al usuario
        btnEnviar.disabled = true;
        btnEnviar.textContent = "Registrando asistencia...";

        // ⚠️ REEMPLAZA ESTA URL CON TU ENLACE DE GOOGLE APPS SCRIPT (El que termina en /exec)
        const URL_GOOGLE_SCRIPT = "https://script.google.com/macros/s/AKfycbzTp8QCaZx4asbrtSvU_vCwD9xuHeQdlZdqrPpn6RJ_XvS4jiaNFvnirwc3_UJJN_cS/exec";

        // Capturar los datos del formulario de forma limpia
        const datosFormulario = new URLSearchParams(new FormData(formulario));

        // Enviar los datos a la hoja de cálculo mediante Fetch API
        fetch(URL_GOOGLE_SCRIPT, {
            method: "POST",
            body: datosFormulario,
            mode: "no-cors" // Evita bloqueos por políticas CORS en GitHub Pages
        })
        .then(() => {
            // Acción en caso de éxito total
            alert("¡Registro de asistencia exitoso! Gracias por tu participación.");
            formulario.reset(); // Limpia todos los campos del formulario de inmediato
        })
        .catch(error => {
            console.error("Error al registrar:", error);
            alert("Hubo un inconveniente al guardar tu asistencia. Por favor, inténtalo de nuevo.");
        })
        .finally(() => {
            // Restablecer el botón a su estado original
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Registrar Asistencia";
        });
    });
});