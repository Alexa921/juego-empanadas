// ==============================
// ELEMENTOS DEL DOM
// ==============================

const formularioRegistro =
    document.getElementById("form-registro");

const mensajeRegistro =
    document.getElementById("mensaje-registro");

const botonLogin =
    document.getElementById("boton-login");

const botonRegistrar =
    formularioRegistro.querySelector(
        'button[type="submit"]'
    );


// ==============================
// CONFIGURACIÓN DE LA API
// ==============================

const API_URL =
    "https://juego-empanadas-backend.onrender.com";


// ==============================
// ESTADO DEL REGISTRO
// ==============================

let registrandoUsuario = false;


// ==============================
// REGISTRO DE USUARIO
// ==============================

formularioRegistro.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        // ==================================
        // EVITAR VARIOS CLICS
        // ==================================

        if (registrandoUsuario) {
            return;
        }


        const username =
            document
                .getElementById("username")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        const confirmPassword =
            document
                .getElementById("confirm-password")
                .value;


        // ==================================
        // LIMPIAR MENSAJE ANTERIOR
        // ==================================

        mensajeRegistro.textContent = "";
        mensajeRegistro.style.color = "";


        // ==================================
        // VALIDAR CAMPOS
        // ==================================

        if (
            !username ||
            !password ||
            !confirmPassword
        ) {

            mensajeRegistro.textContent =
                "Completa todos los campos.";

            mensajeRegistro.style.color =
                "#d9534f";

            return;
        }


        // ==================================
        // VALIDAR USUARIO
        // ==================================

        if (username.length < 3) {

            mensajeRegistro.textContent =
                "El usuario debe tener mínimo 3 caracteres.";

            mensajeRegistro.style.color =
                "#d9534f";

            return;
        }


        // ==================================
        // VALIDAR CONTRASEÑA
        // ==================================

        if (password.length < 6) {

            mensajeRegistro.textContent =
                "La contraseña debe tener mínimo 6 caracteres.";

            mensajeRegistro.style.color =
                "#d9534f";

            return;
        }


        // ==================================
        // CONFIRMAR CONTRASEÑA
        // ==================================

        if (password !== confirmPassword) {

            mensajeRegistro.textContent =
                "Las contraseñas no coinciden.";

            mensajeRegistro.style.color =
                "#d9534f";

            return;
        }


        // ==================================
        // ACTIVAR ESTADO DE REGISTRO
        // ==================================

        registrandoUsuario = true;


        // Desactivar botón
        if (botonRegistrar) {

            botonRegistrar.disabled =
                true;

            botonRegistrar.dataset.textoOriginal =
                botonRegistrar.textContent;

            botonRegistrar.textContent =
                "CREANDO...";
        }


        mensajeRegistro.textContent =
            "Creando cuenta...";

        mensajeRegistro.style.color =
            "#555";


        // ==================================
        // ENVIAR AL BACKEND
        // ==================================

        try {

            const respuesta =
                await fetch(
                    `${API_URL}/api/auth/registro`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                username:
                                    username,

                                password:
                                    password
                            })
                    }
                );


            // ==================================
            // LEER RESPUESTA
            // ==================================

            const datos =
                await respuesta.json();


            console.log(
                "📦 Respuesta del registro:",
                datos
            );


            // ==================================
            // ERROR DEL BACKEND
            // ==================================

            if (!respuesta.ok) {

                mensajeRegistro.textContent =
                    datos.mensaje ||
                    "No se pudo crear la cuenta.";

                mensajeRegistro.style.color =
                    "#d9534f";


                registrandoUsuario =
                    false;


                // Volver a activar botón
                if (botonRegistrar) {

                    botonRegistrar.disabled =
                        false;

                    botonRegistrar.textContent =
                        botonRegistrar.dataset
                            .textoOriginal ||
                        "REGISTRAR";
                }


                return;
            }


            // ==================================
            // REGISTRO CORRECTO
            // ==================================

            mensajeRegistro.textContent =
                "¡Cuenta creada correctamente!";

            mensajeRegistro.style.color =
                "#4caf50";


            console.log(
                "✅ Usuario registrado correctamente."
            );


            // ==================================
            // LIMPIAR FORMULARIO
            // ==================================

            formularioRegistro.reset();


            // ==================================
            // IR AL LOGIN
            // ==================================

            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1000
            );

        } catch (error) {

            console.error(
                "❌ Error al registrar usuario:",
                error
            );


            mensajeRegistro.textContent =
                "No se pudo conectar con el servidor.";

            mensajeRegistro.style.color =
                "#d9534f";


            // ==================================
            // PERMITIR INTENTAR DE NUEVO
            // ==================================

            registrandoUsuario =
                false;


            if (botonRegistrar) {

                botonRegistrar.disabled =
                    false;

                botonRegistrar.textContent =
                    botonRegistrar.dataset
                        .textoOriginal ||
                    "REGISTRAR";
            }
        }

    }
);


// ==============================
// IR AL LOGIN
// ==============================

if (botonLogin) {

    botonLogin.addEventListener(
        "click",
        () => {

            window.location.href =
                "login.html";

        }
    );
}

