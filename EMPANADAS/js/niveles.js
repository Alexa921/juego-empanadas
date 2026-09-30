const nivel1 = document.getElementById("nivel-1");
const nivel2 = document.getElementById("nivel-2");
const nivel3 = document.getElementById("nivel-3");
const nivel4 = document.getElementById("nivel-4");
const nivel5 = document.getElementById("nivel-5");

const botonVolver = document.getElementById("btn-volver");


// ========================================
// PROGRESO DEL JUGADOR
// ========================================

let nivelDesbloqueado = 1;


// ========================================
// ESTRELLAS DEL JUGADOR
// ========================================

let estrellasPorNivel = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
};


// ========================================
// VERIFICAR SESIÓN Y CARGAR PROGRESO
// ========================================

async function cargarProgreso() {

    const token = localStorage.getItem("token");

    // Si no hay sesión iniciada
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        const respuesta = await fetch(
            "https://juego-empanadas-backend.onrender.com/api/auth/me",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const datos = await respuesta.json();

        // ========================================
        // TOKEN INVÁLIDO O EXPIRADO
        // ========================================

        if (!respuesta.ok) {

            localStorage.removeItem("token");
            localStorage.removeItem("usuario");

            window.location.href = "login.html";
            return;
        }


        // ========================================
        // OBTENER PROGRESO DESDE MONGODB
        // ========================================

        nivelDesbloqueado =
            datos.usuario.nivelDesbloqueado;


        // ========================================
        // ACTUALIZAR INFORMACIÓN LOCAL
        // ========================================

        localStorage.setItem(
            "usuario",
            JSON.stringify(datos.usuario)
        );


        // ========================================
        // CARGAR ESTRELLAS
        // ========================================

        await cargarEstrellas();


        // ========================================
        // ACTUALIZAR BOTONES
        // ========================================

        actualizarNiveles();

    } catch (error) {

        console.error(
            "Error al cargar el progreso:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );
    }
}


// ========================================
// CARGAR ESTRELLAS DESDE EL BACKEND
// ========================================

async function cargarEstrellas() {

    const token =
        localStorage.getItem("token");


    try {

        const respuesta =
            await fetch(
                "https://juego-empanadas-backend.onrender.com/api/partidas",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const datos =
            await respuesta.json();


        // ========================================
        // COMPROBAR RESPUESTA
        // ========================================

        if (!respuesta.ok) {

            console.error(
                "No se pudieron cargar las estrellas:",
                datos
            );

            return;
        }


        // ========================================
        // REINICIAR ESTRELLAS
        // ========================================

        estrellasPorNivel = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };


        // ========================================
        // RECORRER PARTIDAS
        // ========================================

        if (
            Array.isArray(datos.partidas)
        ) {

            datos.partidas.forEach(
                function (partida) {

                    const nivel =
                        Number(partida.nivel);

                    const estrellas =
                        Number(partida.estrellas);


                    // ========================================
                    // SOLO NIVELES DEL MENÚ
                    // ========================================

                    if (
                        nivel >= 1 &&
                        nivel <= 5
                    ) {

                        // ========================================
                        // GUARDAR EL MEJOR RESULTADO
                        // ========================================

                        if (
                            estrellas >
                            estrellasPorNivel[nivel]
                        ) {

                            estrellasPorNivel[nivel] =
                                estrellas;
                        }
                    }

                }
            );
        }


        // ========================================
        // MOSTRAR ESTRELLAS
        // ========================================

        actualizarEstrellas();


    } catch (error) {

        console.error(
            "Error al cargar las estrellas:",
            error
        );

    }
}


// ========================================
// ACTUALIZAR ESTRELLAS VISUALES
// ========================================

function actualizarEstrellas() {

    for (
        let nivel = 1;
        nivel <= 5;
        nivel++
    ) {

        const contenedor =
            document.getElementById(
                "estrellas-nivel-" + nivel
            );


        if (!contenedor) {
            continue;
        }


        const estrellas =
            contenedor.querySelectorAll(
                ".estrella"
            );


        const cantidad =
            estrellasPorNivel[nivel] || 0;


        estrellas.forEach(
            function (estrella, indice) {

                if (
                    indice < cantidad
                ) {

                    estrella.src =
                        "img/estrellas/estrella-activa.png";

                } else {

                    estrella.src =
                        "img/estrellas/estrella-apagada.png";
                }

            }
        );
    }
}


// ========================================
// ACTUALIZAR LOS NIVELES
// ========================================

function actualizarNiveles() {

    const niveles = [
        nivel1,
        nivel2,
        nivel3,
        nivel4,
        nivel5
    ];

    niveles.forEach(function (nivel, indice) {

        // Si por alguna razón el botón no existe,
        // simplemente no hacemos nada.
        if (!nivel) {
            return;
        }

        const numeroNivel = indice + 1;


        // ========================================
        // NIVEL DESBLOQUEADO
        // ========================================

        if (numeroNivel <= nivelDesbloqueado) {

            nivel.classList.remove("bloqueado");
            nivel.classList.add("desbloqueado");

            nivel.disabled = false;

        }


        // ========================================
        // NIVEL BLOQUEADO
        // ========================================

        else {

            nivel.classList.remove("desbloqueado");
            nivel.classList.add("bloqueado");

            nivel.disabled = true;
        }
    });


    // ========================================
    // ACTUALIZAR ESTRELLAS
    // ========================================

    actualizarEstrellas();
}


// ========================================
// NIVEL 1
// ========================================

nivel1.addEventListener("click", function () {

    if (nivelDesbloqueado >= 1) {
        window.location.href = "juego.html";
    }

});


// ========================================
// NIVEL 2
// ========================================

nivel2.addEventListener("click", function () {

    if (nivelDesbloqueado >= 2) {
        window.location.href = "nivel2.html";
    }

});


// ========================================
// NIVEL 3
// ========================================

nivel3.addEventListener("click", function () {

    if (nivelDesbloqueado >= 3) {
        window.location.href = "nivel3.html";
    }

});


// ========================================
// NIVEL 4
// ========================================

nivel4.addEventListener("click", function () {

    if (nivelDesbloqueado >= 4) {
        window.location.href = "nivel4.html";
    }

});


// ========================================
// NIVEL 5
// ========================================

nivel5.addEventListener("click", function () {

    if (nivelDesbloqueado >= 5) {
        window.location.href = "nivel5.html";
    }

});


// ========================================
// VOLVER
// ========================================

botonVolver.addEventListener("click", function () {

    window.location.href = "index.html";

});


// ========================================
// INICIAR
// ========================================

cargarProgreso();