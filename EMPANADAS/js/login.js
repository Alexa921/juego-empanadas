// ==============================
// LOGIN
// ==============================

const formularioLogin = document.getElementById("form-login");
const mensajeLogin = document.getElementById("mensaje-login");
const botonRegistro = document.getElementById("boton-registro");


// ==============================
// INICIAR SESIÓN
// ==============================

formularioLogin.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;


    // Limpiar mensaje anterior
    mensajeLogin.textContent = "";
    mensajeLogin.style.color = "";


    // ==============================
    // VALIDACIONES
    // ==============================

    if (!username || !password) {
        mensajeLogin.textContent = "Completa todos los campos.";
        mensajeLogin.style.color = "#d9534f";
        return;
    }


    // ==============================
    // CONEXIÓN CON EL BACKEND
    // ==============================

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/auth/login",
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

            mensajeLogin.textContent =
                datos.mensaje || "No se pudo iniciar sesión.";

            mensajeLogin.style.color = "#d9534f";

            return;
        }


        // ==============================
        // LOGIN CORRECTO
        // ==============================

        localStorage.setItem("token", datos.token);

        localStorage.setItem(
            "usuario",
            JSON.stringify(datos.usuario)
        );


        mensajeLogin.textContent =
            "¡Inicio de sesión correcto!";

        mensajeLogin.style.color = "#4caf50";


        // Esperar un momento para que
        // el usuario vea el mensaje
        setTimeout(() => {

            window.location.href = "niveles.html";

        }, 500);


    } catch (error) {

        console.error("Error al iniciar sesión:", error);

        mensajeLogin.textContent =
            "No se pudo conectar con el servidor.";

        mensajeLogin.style.color = "#d9534f";
    }

});


// ==============================
// BOTÓN CREAR CUENTA
// ==============================

botonRegistro.addEventListener("click", () => {

    window.location.href = "registro.html";

});