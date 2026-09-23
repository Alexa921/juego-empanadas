const formularioRegistro = document.getElementById("form-registro");
const mensajeRegistro = document.getElementById("mensaje-registro");
const botonLogin = document.getElementById("boton-login");

// ==============================
// REGISTRO DE USUARIO
// ==============================

formularioRegistro.addEventListener("submit", async (evento) => {

evento.preventDefault();

const username = document.getElementById("username").value.trim();
const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirm-password").value;


// Limpiar mensaje anterior
mensajeRegistro.textContent = "";
mensajeRegistro.style.color = "";


// ==============================
// VALIDAR CAMPOS
// ==============================

if (!username || !password || !confirmPassword) {

    mensajeRegistro.textContent =
        "Completa todos los campos.";

    mensajeRegistro.style.color = "#d9534f";

    return;
}


// ==============================
// VALIDAR USUARIO
// ==============================

if (username.length < 3) {

    mensajeRegistro.textContent =
        "El usuario debe tener mínimo 3 caracteres.";

    mensajeRegistro.style.color = "#d9534f";

    return;
}


// ==============================
// VALIDAR CONTRASEÑA
// ==============================

if (password.length < 6) {

    mensajeRegistro.textContent =
        "La contraseña debe tener mínimo 6 caracteres.";

    mensajeRegistro.style.color = "#d9534f";

    return;
}


// ==============================
// CONFIRMAR CONTRASEÑA
// ==============================

if (password !== confirmPassword) {

    mensajeRegistro.textContent =
        "Las contraseñas no coinciden.";

    mensajeRegistro.style.color = "#d9534f";

    return;
}


// ==============================
// ENVIAR AL BACKEND
// ==============================

try {

    const respuesta = await fetch(
        "http://localhost:3000/api/auth/registro",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                password: password
            })
        }
    );


    const datos = await respuesta.json();


    // ==============================
    // ERROR DEL BACKEND
    // ==============================

    if (!respuesta.ok) {

        mensajeRegistro.textContent =
            datos.mensaje || "No se pudo crear la cuenta.";

        mensajeRegistro.style.color = "#d9534f";

        return;
    }


    // ==============================
    // REGISTRO CORRECTO
    // ==============================

    mensajeRegistro.textContent =
        "¡Cuenta creada correctamente!";

    mensajeRegistro.style.color = "#4caf50";


    // Limpiar formulario
    formularioRegistro.reset();


    // Ir al login después de un momento
    setTimeout(() => {

        window.location.href = "login.html";

    }, 1000);


} catch (error) {

    console.error("Error al registrar usuario:", error);

    mensajeRegistro.textContent =
        "No se pudo conectar con el servidor.";

    mensajeRegistro.style.color = "#d9534f";
}

});

// ==============================
// IR AL LOGIN
// ==============================

botonLogin.addEventListener("click", () => {

window.location.href = "login.html";


});
