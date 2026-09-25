// ==============================
// CONFIGURACIÓN DE LA API
// ==============================
const API_URL =
    "https://juego-empanadas-backend.onrender.com";


// ==============================
// ELEMENTOS DEL DOM
// ==============================
const formularioLogin =
    document.getElementById("form-login");

const mensajeLogin =
    document.getElementById("mensaje-login");

const botonRegistro =
    document.getElementById("boton-registro");

const botonEntrar =
    formularioLogin.querySelector(
        'button[type="submit"]'
    );


// ==============================
// ESTADO DEL LOGIN
// ==============================
let iniciandoSesion = false;


// ==============================
// INICIAR SESIÓN
// ==============================
formularioLogin.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        // ==================================
        // EVITAR VARIOS CLICS
        // ==================================
        if (iniciandoSesion) {
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


        // ==================================
        // LIMPIAR MENSAJE ANTERIOR
        // ==================================
        mensajeLogin.textContent = "";
        mensajeLogin.style.color = "";


        // ==================================
        // VALIDACIONES
        // ==================================
        if (!username || !password) {

            mensajeLogin.textContent =
                "Completa todos los campos.";

            mensajeLogin.style.color =
                "#d9534f";

            return;
        }


        // ==================================
        // ACTIVAR ESTADO DE LOGIN
        // ==================================
        iniciandoSesion = true;


        // Desactivar botón
        if (botonEntrar) {

            botonEntrar.disabled =
                true;

            botonEntrar.dataset.textoOriginal =
                botonEntrar.textContent;

            botonEntrar.textContent =
                "ENTRANDO...";
        }


        mensajeLogin.textContent =
            "Iniciando sesión...";

        mensajeLogin.style.color =
            "#555";


        // ==================================
        // CONEXIÓN CON EL BACKEND
        // ==================================
        try {

            const respuesta =
                await fetch(
                    `${API_URL}/api/auth/login`,
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
                "📦 Respuesta del login:",
                datos
            );


            // ==================================
            // ERROR DEL BACKEND
            // ==================================
            if (!respuesta.ok) {

                mensajeLogin.textContent =
                    datos.mensaje ||
                    "No se pudo iniciar sesión.";

                mensajeLogin.style.color =
                    "#d9534f";


                iniciandoSesion =
                    false;


                if (botonEntrar) {

                    botonEntrar.disabled =
                        false;

                    botonEntrar.textContent =
                        botonEntrar.dataset
                            .textoOriginal ||
                        "ENTRAR";
                }


                return;
            }


            // ==================================
            // COMPROBAR TOKEN
            // ==================================
            if (!datos.token) {

                console.error(
                    "❌ El servidor no devolvió un token."
                );


                mensajeLogin.textContent =
                    "El servidor no devolvió un token de acceso.";

                mensajeLogin.style.color =
                    "#d9534f";


                iniciandoSesion =
                    false;


                if (botonEntrar) {

                    botonEntrar.disabled =
                        false;

                    botonEntrar.textContent =
                        botonEntrar.dataset
                            .textoOriginal ||
                        "ENTRAR";
                }


                return;
            }


            // ==================================
            // GUARDAR TOKEN
            // ==================================
            localStorage.setItem(
                "token",
                datos.token
            );


            // ==================================
            // GUARDAR INFORMACIÓN DEL USUARIO
            // ==================================
            if (datos.usuario) {

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(
                        datos.usuario
                    )
                );


                // Guardar también el nivel
                // desbloqueado para niveles.html
                if (
                    datos.usuario
                        .nivelDesbloqueado !==
                    undefined
                ) {

                    localStorage.setItem(
                        "nivelDesbloqueado",
                        String(
                            datos.usuario
                                .nivelDesbloqueado
                        )
                    );
                }
            }


            // ==================================
            // LOGIN CORRECTO
            // ==================================
            mensajeLogin.textContent =
                "¡Inicio de sesión correcto!";

            mensajeLogin.style.color =
                "#4caf50";


            console.log(
                "✅ Inicio de sesión correcto."
            );


            // ==================================
            // REDIRECCIÓN
            // ==================================
            setTimeout(
                () => {

                    window.location.href =
                        "niveles.html";

                },
                300
            );

        } catch (error) {

            console.error(
                "❌ Error al iniciar sesión:",
                error
            );


            mensajeLogin.textContent =
                "No se pudo conectar con el servidor.";

            mensajeLogin.style.color =
                "#d9534f";


            // ==================================
            // PERMITIR INTENTAR DE NUEVO
            // ==================================
            iniciandoSesion =
                false;


            if (botonEntrar) {

                botonEntrar.disabled =
                    false;

                botonEntrar.textContent =
                    botonEntrar.dataset
                        .textoOriginal ||
                    "ENTRAR";
            }
        }

    }
);


// ==============================
// BOTÓN CREAR CUENTA
// ==============================
if (botonRegistro) {

    botonRegistro.addEventListener(
        "click",
        () => {

            window.location.href =
                "registro.html";

        }
    );
}