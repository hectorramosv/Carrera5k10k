// 1. TU URL DE GOOGLE APPS SCRIPT ACTUALIZADA
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwLl0Ap4eHGQL1qf7Ve7lGgWBjh7eRb3knngkcYkn3qzRTQhjLiTg_CyyKKTWtxvmWE/exec";

const container = document.getElementById('membersContainer');
const botonEnviar = document.getElementById('btnEnviar');
const cuposContador = document.getElementById('cuposContador');

// 2. Generar el formulario para exactamente 4 personas
for (let i = 1; i <= 4; i++) {
    container.innerHTML += `
        <div class="member-row">
            <div class="member-number">${i}</div>
            <div class="member-inputs">
                <input type="text" placeholder="Nombre Completo del Integrante" required id="p_name_${i}">
                <select id="p_age_${i}" required>
                    <option value="" disabled selected>Edad</option>
                    ${generateAgeOptions()}
                </select>
                <input type="text" placeholder="Cédula de Identidad (DNI)" required id="p_dni_${i}">
            </div>
        </div>
    `;
}

function generateAgeOptions() {
    let options = '';
    for (let age = 15; age <= 65; age++) {
        options += `<option value="${age}">${age}</option>`;
    }
    return options;
}

// 3. VALIDACIÓN EN TIEMPO REAL: Verificar cupos al cargar la página web
function verificarCuposDisponibles() {
    fetch(URL_APPS_SCRIPT)
        .then(response => response.json())
        .then(data => {
            const registrados = data.total;
            const cuposMaximos = 4;
            const disponibles = cuposMaximos - registrados;

            if (disponibles <= 0) {
                cuposContador.innerHTML = "❌ ¡SOLO 4 EQUIPOS DISPONIBLES! (0 CUPOS DISPONIBLES)";
                cuposContador.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
                cuposContador.style.borderColor = "#ef4444";
                botonEnviar.innerText = "INSCRIPCIONES CERRADAS (CUPOS LLENOS)";
                botonEnviar.disabled = true;
            } else {
                cuposContador.innerHTML = `🔥 ¡SOLO 4 EQUIPOS DISPONIBLES! (${disponibles} CUPOS DISPONIBLES)`;
                botonEnviar.innerText = "Enviar Inscripción";
                botonEnviar.disabled = false;
            }
        })
        .catch(error => {
            console.error("Error al leer los cupos:", error);
            cuposContador.innerHTML = "⚠️ Error al verificar cupos de inscripción";
            botonEnviar.innerText = "Enviar Inscripción";
            botonEnviar.disabled = false;
        });
}

// Ejecutar la verificación inmediatamente al abrir el archivo
verificarCuposDisponibles();

// 4. ENVÍO DE DATOS CON EXACTAMENTE 4 INTEGRANTES RECOLECTADOS
document.getElementById('ecuavoleyForm').addEventListener('submit', function(e) {
    e.preventDefault();

    botonEnviar.innerText = "PROCESANDO INSCRIPCIÓN...";
    botonEnviar.disabled = true;

    // Paquete ordenado con los datos de las 4 personas requisadas
    const payload = {
        nombre_equipo: document.getElementById('teamName').value,
        correo_contacto: document.getElementById('contactEmail').value,
        
        j1_nombre: document.getElementById('p_name_1').value,
        j1_edad: document.getElementById('p_age_1').value,
        j1_cedula: document.getElementById('p_dni_1').value,
        
        j2_nombre: document.getElementById('p_name_2').value,
        j2_edad: document.getElementById('p_age_2').value,
        j2_cedula: document.getElementById('p_dni_2').value,
        
        j3_nombre: document.getElementById('p_name_3').value,
        j3_edad: document.getElementById('p_age_3').value,
        j3_cedula: document.getElementById('p_dni_3').value,
        
        j4_nombre: document.getElementById('p_name_4').value,
        j4_edad: document.getElementById('p_age_4').value,
        j4_cedula: document.getElementById('p_dni_4').value
    };

    fetch(URL_APPS_SCRIPT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert('¡Inscripción exitosa! Tu equipo ha sido registrado.');
        document.getElementById('ecuavoleyForm').reset();
        verificarCuposDisponibles();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al guardar tu inscripción.');
        botonEnviar.disabled = false;
        botonEnviar.innerText = "Enviar Inscripción";
    });
});