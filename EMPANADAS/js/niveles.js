const nivel1 = document.getElementById("nivel-1");
const nivel2 = document.getElementById("nivel-2");
const nivel3 = document.getElementById("nivel-3");
const nivel4 = document.getElementById("nivel-4");
const nivel5 = document.getElementById("nivel-5");

const botonVolver = document.getElementById("btn-volver");


// ========================================
// PROGRESO DE NIVELES
// ========================================

// Si no existe ningún progreso guardado,
// el Nivel 1 comienza desbloqueado.
let nivelDesbloqueado = parseInt(
    localStorage.getItem("nivelDesbloqueado")
);

if (!nivelDesbloqueado || nivelDesbloqueado < 1) {
    nivelDesbloqueado = 1;
    localStorage.setItem("nivelDesbloqueado", "1");
}


// ========================================
// FUNCIÓN PARA ACTUALIZAR LOS NIVELES
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

        const numeroNivel = indice + 1;

        if (numeroNivel <= nivelDesbloqueado) {

            // NIVEL DESBLOQUEADO
            nivel.classList.remove("bloqueado");
            nivel.classList.add("desbloqueado");

            // Mostrar el número
            nivel.textContent = numeroNivel;

            // Permitir hacer clic
            nivel.disabled = false;

        } else {

            // NIVEL BLOQUEADO
            nivel.classList.remove("desbloqueado");
            nivel.classList.add("bloqueado");

            // Mostrar candado
            nivel.textContent = "🔒";

            // Bloquear botón
            nivel.disabled = true;
        }
    });
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
// ACTUALIZAR VISUALMENTE
// ========================================

actualizarNiveles();