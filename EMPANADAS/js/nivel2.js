// ================================
// VARIABLES DEL JUEGO
// ================================

let puntos = 0;
let tiempo = 70;

let dinero = 0;
let pedidosCorrectos = 0;

let nivelTerminado = false;


// ================================
// ESTADO DE LA EMPANADA QUE SE ESTÁ PREPARANDO
// ================================

let rellenoSeleccionado = null;

let empanadaCerrada = false;


// ================================
// ESTADO DE LAS 2 PARRILLAS
// ================================

let parrilla1 = {
    ocupada: false,
    cocinando: false,
    lista: false,
    quemada: false,
    relleno: null
};

let parrilla2 = {
    ocupada: false,
    cocinando: false,
    lista: false,
    quemada: false,
    relleno: null
};


// ================================
// EMPANADAS LISTAS PARA ENTREGAR
// ================================

let empanadasParaEntregar = [];


// ================================
// TEMPORIZADORES
// ================================

let temporizador;

let temporizadorCoccion1 = null;
let temporizadorCoccion2 = null;

let temporizadorQuemado1 = null;
let temporizadorQuemado2 = null;


// ================================
// CONFIGURACIÓN DEL NIVEL
// ================================

const totalClientes = 8;

const clientesVisibles = 3;

const metaPedidos = 5;


// ================================
// RELLENOS DISPONIBLES
// ================================

const pedidosDisponibles = [
    "carne",
    "pollo",
    "queso"
];


// ================================
// CONFIGURACIÓN DE PACIENCIA
// ================================

const tiempoSerio = 10;

const tiempoEnojado = 20;

const tiempoMuyEnojado = 35;

const tiempoSeVa = 55;


// ================================
// TIEMPOS DE COCCIÓN
// ================================

const tiempoCoccion = 5000;

const tiempoParaQuemarse = 5000;


// ================================
// ELEMENTOS DEL HTML
// ================================

const puntosHTML =
    document.getElementById("puntos");

const tiempoHTML =
    document.getElementById("tiempo");

const mensajeHTML =
    document.getElementById("mensaje");

const masa =
    document.getElementById("masa");

const empanada1 =
    document.getElementById("empanada-1");

const empanada2 =
    document.getElementById("empanada-2");

const empanadaFinal =
    document.getElementById("empanada-final");


// ================================
// BOTONES DE RELLENO
// ================================

const btnCarne =
    document.getElementById("btn-carne");

const btnPollo =
    document.getElementById("btn-pollo");

const btnQueso =
    document.getElementById("btn-queso");


// ================================
// PREPARACIÓN
// ================================

const btnCerrar =
    document.getElementById("btn-cerrar");


// ================================
// PARRILLA 1
// ================================

const btnCocinar1 =
    document.getElementById("btn-cocinar-1");

const btnSacar1 =
    document.getElementById("btn-sacar-1");


// ================================
// PARRILLA 2
// ================================

const btnCocinar2 =
    document.getElementById("btn-cocinar-2");

const btnSacar2 =
    document.getElementById("btn-sacar-2");


// ================================
// ENTREGA
// ================================

const btnEntregar =
    document.getElementById("btn-entregar");


// ================================
// CLIENTES
// ================================

const clientesHTML =
    document.querySelectorAll(".cliente");


// ================================
// PEDIDOS DE LOS CLIENTES
// ================================

let pedidosClientes = [];


// ================================
// CLIENTES EN PANTALLA
// ================================

let clientesEnPantalla = [];


// ================================
// TIEMPO DE LLEGADA
// ================================

let tiempoLlegadaClientes = [];


// ================================
// CLIENTES QUE SE FUERON
// ================================

let clientesSeFueron = [];


// ================================
// DINERO DE CADA CLIENTE
// ================================

let dineroClientes = [];


// ================================
// PERSONAJE VISUAL
// ================================

let personajeAnterior = [];


// ================================
// GENERAR PEDIDO
// ================================

function generarPedido() {

    return pedidosDisponibles[
        Math.floor(
            Math.random() *
            pedidosDisponibles.length
        )
    ];
}


// ================================
// GENERAR LOS 8 PEDIDOS
// ================================

function generarPedidosIniciales() {

    pedidosClientes = [];

    for (
        let i = 0;
        i < totalClientes;
        i++
    ) {

        let nuevoPedido;

        do {

            nuevoPedido =
                generarPedido();

        } while (
            i > 0 &&
            nuevoPedido ===
            pedidosClientes[i - 1]
        );

        pedidosClientes.push(
            nuevoPedido
        );
    }
}


// ================================
// ACTUALIZAR PUNTOS
// ================================

function actualizarPuntos() {

    puntosHTML.textContent =
        puntos;
}


// ================================
// ACTUALIZAR TIEMPO
// ================================

function actualizarTiempo() {

    tiempoHTML.textContent =
        tiempo;
}


// ================================
// MOSTRAR MENSAJE
// ================================

function mostrarMensaje(texto) {

    mensajeHTML.textContent =
        texto;
}


// ================================
// OBTENER BURBUJA
// ================================

function obtenerBurbuja(cliente) {

    if (!cliente) {
        return null;
    }

    return (
        cliente.querySelector(".burbuja") ||
        cliente.querySelector(".burbuja-pedido") ||
        cliente.querySelector(".pedido")
    );
}


// ================================
// ACTUALIZAR EMOJI
// ================================

function actualizarEstadoCliente(
    posicionVisual,
    emoji
) {

    const cliente =
        clientesHTML[posicionVisual];

    if (!cliente) {
        return;
    }

    const burbuja =
        obtenerBurbuja(cliente);

    if (!burbuja) {
        return;
    }

    let emojiEstado =
        burbuja.querySelector(
            ".estado-cliente"
        );

    if (!emojiEstado) {

        emojiEstado =
            document.createElement(
                "span"
            );

        emojiEstado.classList.add(
            "estado-cliente"
        );

        emojiEstado.style.display =
            "inline-block";

        emojiEstado.style.marginLeft =
            "8px";

        emojiEstado.style.fontSize =
            "24px";

        burbuja.appendChild(
            emojiEstado
        );
    }

    emojiEstado.textContent =
        emoji;
}


// ================================
// REINICIAR ESTADO DEL CLIENTE
// ================================

function reiniciarEstadoCliente(
    posicionVisual
) {

    actualizarEstadoCliente(
        posicionVisual,
        "😊"
    );
}


// ================================
// ACTUALIZAR PEDIDO VISUAL
// ================================

function actualizarPedidoCliente(
    posicionVisual,
    numeroCliente
) {

    const cliente =
        clientesHTML[posicionVisual];

    if (!cliente) {
        return;
    }

    const pedido =
        pedidosClientes[numeroCliente];

    if (!pedido) {
        return;
    }

    const textoPedido =
        cliente.querySelector(
            ".pedido p"
        );

    const imagenPedido =
        cliente.querySelector(
            ".icono-pedido"
        );

    if (textoPedido) {

        textoPedido.textContent =
            "Una empanada de " +
            pedido;
    }

    if (imagenPedido) {

        imagenPedido.src =
            "img/rellenos/" +
            pedido +
            ".png";

        imagenPedido.alt =
            pedido;
    }

    reiniciarEstadoCliente(
        posicionVisual
    );
}


// ================================
// CAMBIAR PERSONAJE VISUAL
// ================================

function cambiarPersonajeVisual(
    posicionVisual
) {

    const cliente =
        clientesHTML[posicionVisual];

    if (!cliente) {
        return;
    }

    const imagen =
        cliente.querySelector(
            ".imagen-cliente"
        );

    if (!imagen) {
        return;
    }

    const personajes = [
        "cliente1-mex.png",
        "cliente2-mex.png",
        "cliente3-mex.png"
    ];

    let personajeNuevo;

    do {

        personajeNuevo =
            personajes[
                Math.floor(
                    Math.random() *
                    personajes.length
                )
            ];

    } while (
        personajes.length > 1 &&
        personajeNuevo ===
        personajeAnterior[posicionVisual]
    );

    personajeAnterior[posicionVisual] =
        personajeNuevo;

    imagen.src =
        "img/clientes/" +
        personajeNuevo;
}


// ================================
// PREPARAR CLIENTES
// ================================

function prepararClientes() {

    generarPedidosIniciales();

    clientesEnPantalla = [];

    tiempoLlegadaClientes = [];

    clientesSeFueron = [];

    dineroClientes = [];

    personajeAnterior = [];

    for (
        let i = 0;
        i < totalClientes;
        i++
    ) {

        clientesSeFueron[i] =
            false;

        dineroClientes[i] =
            false;

        personajeAnterior[i] =
            null;
    }


    // ================================
    // PRIMEROS 3 CLIENTES
    // ================================

    for (
        let i = 0;
        i < clientesVisibles;
        i++
    ) {

        clientesEnPantalla[i] =
            i;

        tiempoLlegadaClientes[i] =
            Date.now();

        actualizarPedidoCliente(
            i,
            i
        );

        const cliente =
            clientesHTML[i];

        if (!cliente) {
            continue;
        }

        cliente.style.opacity =
            "1";

        cliente.style.transform =
            "translateY(0)";

        cliente.classList.remove(
            "atendido"
        );

        const chulo =
            cliente.querySelector(
                ".chulo-cliente"
            );

        if (chulo) {
            chulo.remove();
        }
    }


    // ================================
    // OCULTAR SOBRANTES
    // ================================

    for (
        let i = clientesVisibles;
        i < clientesHTML.length;
        i++
    ) {

        clientesHTML[i].style.opacity =
            "0";
    }
}


// ================================
// ESTADO INICIAL
// ================================

masa.style.display =
    "flex";

empanada1.style.display =
    "none";

empanada2.style.display =
    "none";

empanadaFinal.style.display =
    "none";


// ================================
// ASEGURAR QUE LA MASA SEA EL FONDO
// ================================

masa.style.position =
    "relative";

masa.style.zIndex =
    "1";


// ================================
// BOTONES INICIALES
// ================================

btnCerrar.disabled =
    true;

btnCocinar1.disabled =
    true;

btnSacar1.disabled =
    true;

btnCocinar2.disabled =
    true;

btnSacar2.disabled =
    true;

btnEntregar.disabled =
    true;


actualizarPuntos();

actualizarTiempo();

prepararClientes();


mostrarMensaje(
    "¡Escoge el relleno de la empanada!"
);


// ================================
// MOSTRAR RELLENO SOBRE LA MASA
// ================================

function mostrarProteinaSobreMasa(
    relleno
) {

    const anterior =
        document.querySelector(
            ".proteina-sobre-masa"
        );

    if (anterior) {
        anterior.remove();
    }


    masa.style.display =
        "flex";

    masa.style.position =
        "relative";

    masa.style.zIndex =
        "1";


    const proteina =
        document.createElement(
            "img"
        );

    proteina.classList.add(
        "proteina-sobre-masa"
    );


    if (relleno === "carne") {

        proteina.src =
            "img/rellenos/carne-cocinada.png";

    } else if (relleno === "pollo") {

        proteina.src =
            "img/rellenos/pollo-cocinado.png";

    } else if (relleno === "queso") {

        proteina.src =
            "img/rellenos/queso-rallado.png";
    }


    proteina.alt =
        relleno;


    const contenedor =
        masa.parentElement;

    contenedor.style.position =
        "relative";


    proteina.style.position =
        "absolute";

    proteina.style.zIndex =
        "10";

    proteina.style.pointerEvents =
        "none";

    proteina.style.width =
        "55%";

    proteina.style.height =
        "auto";

    proteina.style.left =
        "50%";

    proteina.style.top =
        "50%";

    proteina.style.transform =
        "translate(-50%, -50%)";


    contenedor.appendChild(
        proteina
    );
}


// ================================
// ESCOGER RELLENO
// ================================

function seleccionarRelleno(
    relleno
) {

    if (nivelTerminado) {
        return;
    }


    if (empanadaCerrada) {

        mostrarMensaje(
            "Ya cerraste la empanada."
        );

        return;
    }


    rellenoSeleccionado =
        relleno;


    masa.style.display =
        "flex";


    mostrarProteinaSobreMasa(
        relleno
    );


    btnCerrar.disabled =
        false;


    mostrarMensaje(
        "Elegiste relleno de " +
        relleno +
        ". Ahora cierra la empanada."
    );
}


// ================================
// BOTONES DE RELLENO
// ================================

btnCarne.addEventListener(
    "click",
    function () {

        seleccionarRelleno(
            "carne"
        );
    }
);

btnPollo.addEventListener(
    "click",
    function () {

        seleccionarRelleno(
            "pollo"
        );
    }
);

btnQueso.addEventListener(
    "click",
    function () {

        seleccionarRelleno(
            "queso"
        );
    }
);


// ================================
// BUSCAR PARRILLA LIBRE
// ================================

function obtenerParrillaLibre() {

    if (!parrilla1.ocupada) {
        return 1;
    }

    if (!parrilla2.ocupada) {
        return 2;
    }

    return null;
}


// ================================
// CERRAR EMPANADA
// ================================

btnCerrar.addEventListener(
    "click",
    function () {

        if (nivelTerminado) {
            return;
        }


        if (!rellenoSeleccionado) {

            mostrarMensaje(
                "Primero debes escoger un relleno."
            );

            return;
        }


        // ================================
        // BUSCAR PARRILLA LIBRE
        // ================================

        const parrillaLibre =
            obtenerParrillaLibre();


        if (parrillaLibre === null) {

            mostrarMensaje(
                "🔥 Las dos parrillas están ocupadas. Espera a que una quede libre."
            );

            return;
        }


        // ================================
        // QUITAR RELLENO VISUAL
        // ================================

        const proteina =
            document.querySelector(
                ".proteina-sobre-masa"
            );

        if (proteina) {
            proteina.remove();
        }


        // ================================
        // CERRAR EMPANADA
        // ================================

        empanadaCerrada =
            true;


        masa.style.display =
            "none";


        btnCerrar.disabled =
            true;


        // ================================
        // COLOCAR INMEDIATAMENTE
        // EN LA PARRILLA LIBRE
        // ================================

        colocarEmpanadaEnParrilla(
            parrillaLibre
        );


        mostrarMensaje(
            "🥟 ¡Empanada cerrada! Está en la Parrilla " +
            parrillaLibre +
            ". Pulsa COCINAR cuando quieras."
        );
    }
);


// ================================
// COLOCAR EMPANADA EN PARRILLA
// ================================

function colocarEmpanadaEnParrilla(
    numeroParrilla
) {

    let parrilla;

    let imagenEmpanada;


    if (numeroParrilla === 1) {

        parrilla =
            parrilla1;

        imagenEmpanada =
            empanada1;

    } else {

        parrilla =
            parrilla2;

        imagenEmpanada =
            empanada2;
    }


    // ================================
    // COMPROBAR
    // ================================

    if (parrilla.ocupada) {

        mostrarMensaje(
            "Esta parrilla ya está ocupada."
        );

        return;
    }


    // ================================
    // GUARDAR EMPANADA
    // ================================

    parrilla.ocupada =
        true;

    parrilla.cocinando =
        false;

    parrilla.lista =
        false;

    parrilla.quemada =
        false;

    parrilla.relleno =
        rellenoSeleccionado;


    // ================================
    // MOSTRAR EMPANADA CERRADA
    // ================================

    imagenEmpanada.src =
        "img/empanada/empanada-cerrada.png";

    imagenEmpanada.style.display =
        "block";


    // ================================
    // YA NO ESTÁ EN PREPARACIÓN
    // ================================

    empanadaCerrada =
        false;

    rellenoSeleccionado =
        null;


    // ================================
    // ACTUALIZAR BOTONES
    // ================================

    actualizarParrillas();
}


// ================================
// COCINAR EN PARRILLA 1
// ================================

btnCocinar1.addEventListener(
    "click",
    function () {

        cocinarEnParrilla(1);
    }
);


// ================================
// COCINAR EN PARRILLA 2
// ================================

btnCocinar2.addEventListener(
    "click",
    function () {

        cocinarEnParrilla(2);
    }
);


// ================================
// FUNCIÓN COCINAR
// ================================

function cocinarEnParrilla(
    numeroParrilla
) {

    if (nivelTerminado) {
        return;
    }


    let parrilla;

    let imagenEmpanada;

    let botonCocinar;

    let botonSacar;


    if (numeroParrilla === 1) {

        parrilla =
            parrilla1;

        imagenEmpanada =
            empanada1;

        botonCocinar =
            btnCocinar1;

        botonSacar =
            btnSacar1;

    } else {

        parrilla =
            parrilla2;

        imagenEmpanada =
            empanada2;

        botonCocinar =
            btnCocinar2;

        botonSacar =
            btnSacar2;
    }


    // ================================
    // COMPROBAR SI ESTÁ OCUPADA
    // ================================

    if (!parrilla.ocupada) {

        mostrarMensaje(
            "No hay ninguna empanada en esta parrilla."
        );

        return;
    }


    if (parrilla.cocinando) {

        mostrarMensaje(
            "🔥 Esta empanada ya se está cocinando."
        );

        return;
    }


    if (parrilla.lista) {

        mostrarMensaje(
            "🥟 Esta empanada ya está lista."
        );

        return;
    }


    if (parrilla.quemada) {

        mostrarMensaje(
            "🔥 Esta empanada se quemó. Sácala de la parrilla."
        );

        return;
    }


    // ================================
    // COMENZAR COCCIÓN
    // ================================

    parrilla.cocinando =
        true;

    parrilla.lista =
        false;

    parrilla.quemada =
        false;


    botonCocinar.disabled =
        true;

    botonSacar.disabled =
        true;


    mostrarMensaje(
        "🍳 Cocinando en la Parrilla " +
        numeroParrilla +
        "..."
    );


    actualizarParrillas();


    // ================================
    // LIMPIAR TEMPORIZADORES ANTERIORES
    // ================================

    if (numeroParrilla === 1) {

        clearTimeout(
            temporizadorCoccion1
        );

        clearTimeout(
            temporizadorQuemado1
        );

    } else {

        clearTimeout(
            temporizadorCoccion2
        );

        clearTimeout(
            temporizadorQuemado2
        );
    }


    // ================================
    // TEMPORIZADOR PARA DEJARLA DORADA
    // ================================

    const temporizadorDorado =
        setTimeout(
            function () {

                if (nivelTerminado) {
                    return;
                }


                if (!parrilla.ocupada) {
                    return;
                }


                if (!parrilla.cocinando) {
                    return;
                }


                // ================================
                // PASAR A DORADA
                // ================================

                parrilla.cocinando =
                    false;

                parrilla.lista =
                    true;

                parrilla.quemada =
                    false;


                imagenEmpanada.src =
                    "img/empanada/empanada-dorada.png";


                imagenEmpanada.style.display =
                    "block";


                botonSacar.disabled =
                    false;


                mostrarMensaje(
                    "🥟 ¡La empanada de " +
                    parrilla.relleno +
                    " está lista en la Parrilla " +
                    numeroParrilla +
                    "! Sácala antes de que se queme."
                );


                actualizarParrillas();


                // ================================
                // TEMPORIZADOR PARA QUEMARSE
                // ================================

                const temporizadorQuemado =
                    setTimeout(
                        function () {

                            if (nivelTerminado) {
                                return;
                            }


                            if (!parrilla.ocupada) {
                                return;
                            }


                            if (!parrilla.lista) {
                                return;
                            }


                            // ================================
                            // EMPANADA QUEMADA
                            // ================================

                            parrilla.lista =
                                false;

                            parrilla.cocinando =
                                false;

                            parrilla.quemada =
                                true;


                            imagenEmpanada.src =
                                "img/empanada/empanada-quemada.png";


                            imagenEmpanada.style.display =
                                "block";


                            botonSacar.disabled =
                                false;


                            mostrarMensaje(
                                "🔥 ¡La empanada de " +
                                parrilla.relleno +
                                " se quemó! Sácala y prepara otra."
                            );


                            actualizarParrillas();

                        },
                        tiempoParaQuemarse
                    );


                if (numeroParrilla === 1) {

                    temporizadorQuemado1 =
                        temporizadorQuemado;

                } else {

                    temporizadorQuemado2 =
                        temporizadorQuemado;
                }

            },
            tiempoCoccion
        );


    if (numeroParrilla === 1) {

        temporizadorCoccion1 =
            temporizadorDorado;

    } else {

        temporizadorCoccion2 =
            temporizadorDorado;
    }
}


// ================================
// SACAR DE PARRILLA 1
// ================================

btnSacar1.addEventListener(
    "click",
    function () {

        sacarDeParrilla(1);
    }
);


// ================================
// SACAR DE PARRILLA 2
// ================================

btnSacar2.addEventListener(
    "click",
    function () {

        sacarDeParrilla(2);
    }
);


// ================================
// FUNCIÓN SACAR EMPANADA
// ================================

function sacarDeParrilla(
    numeroParrilla
) {

    if (nivelTerminado) {
        return;
    }


    let parrilla;

    let imagenEmpanada;

    let botonSacar;


    if (numeroParrilla === 1) {

        parrilla =
            parrilla1;

        imagenEmpanada =
            empanada1;

        botonSacar =
            btnSacar1;

    } else {

        parrilla =
            parrilla2;

        imagenEmpanada =
            empanada2;

        botonSacar =
            btnSacar2;
    }


    // ================================
    // COMPROBAR SI ESTÁ QUEMADA
    // ================================

    if (parrilla.quemada) {

        // ================================
        // CANCELAR TEMPORIZADORES
        // ================================

        if (numeroParrilla === 1) {

            clearTimeout(
                temporizadorCoccion1
            );

            clearTimeout(
                temporizadorQuemado1
            );

            temporizadorCoccion1 =
                null;

            temporizadorQuemado1 =
                null;

        } else {

            clearTimeout(
                temporizadorCoccion2
            );

            clearTimeout(
                temporizadorQuemado2
            );

            temporizadorCoccion2 =
                null;

            temporizadorQuemado2 =
                null;
        }


        // ================================
        // OCULTAR EMPANADA QUEMADA
        // ================================

        imagenEmpanada.style.display =
            "none";


        botonSacar.disabled =
            true;


        // ================================
        // LIBERAR PARRILLA
        // ================================

        parrilla.ocupada =
            false;

        parrilla.cocinando =
            false;

        parrilla.lista =
            false;

        parrilla.quemada =
            false;

        parrilla.relleno =
            null;


        actualizarParrillas();


        // ================================
        // VOLVER A PREPARACIÓN
        // ================================

        masa.style.display =
            "flex";

        btnCerrar.disabled =
            true;


        mostrarMensaje(
            "🔥 ¡Empanada quemada! La retiraste. Prepara una nueva."
        );


        return;
    }


    // ================================
    // COMPROBAR SI ESTÁ LISTA
    // ================================

    if (!parrilla.lista) {

        mostrarMensaje(
            "La empanada todavía no está lista."
        );

        return;
    }


    // ================================
    // CANCELAR TEMPORIZADORES
    // ================================

    if (numeroParrilla === 1) {

        clearTimeout(
            temporizadorCoccion1
        );

        clearTimeout(
            temporizadorQuemado1
        );

        temporizadorCoccion1 =
            null;

        temporizadorQuemado1 =
            null;

    } else {

        clearTimeout(
            temporizadorCoccion2
        );

        clearTimeout(
            temporizadorQuemado2
        );

        temporizadorCoccion2 =
            null;

        temporizadorQuemado2 =
            null;
    }


    // ================================
    // GUARDAR EN COLA DE ENTREGA
    // ================================

    empanadasParaEntregar.push({
        relleno: parrilla.relleno,
        parrilla: numeroParrilla
    });


    // ================================
    // OCULTAR EMPANADA DE PARRILLA
    // ================================

    imagenEmpanada.style.display =
        "none";

    botonSacar.disabled =
        true;


    // ================================
    // LIBERAR PARRILLA
    // ================================

    parrilla.ocupada =
        false;

    parrilla.cocinando =
        false;

    parrilla.lista =
        false;

    parrilla.quemada =
        false;

    parrilla.relleno =
        null;


    // ================================
    // ACTUALIZAR ENTREGA
    // ================================

    actualizarEntrega();


    // ================================
    // ACTUALIZAR PARRILLAS
    // ================================

    actualizarParrillas();


    mostrarMensaje(
        "🥟 ¡Empanada sacada de la Parrilla " +
        numeroParrilla +
        "! Ya puedes entregarla."
    );
}


// ================================
// ACTUALIZAR ENTREGA
// ================================

function actualizarEntrega() {

    if (
        empanadasParaEntregar.length === 0
    ) {

        empanadaFinal.style.display =
            "none";

        btnEntregar.disabled =
            true;

        return;
    }


    empanadaFinal.src =
        "img/empanada/empanada-dorada.png";

    empanadaFinal.style.display =
        "block";


    btnEntregar.disabled =
        false;
}


// ================================
// ACTUALIZAR PARRILLAS
// ================================

function actualizarParrillas() {

    if (nivelTerminado) {
        return;
    }


    // ================================
    // PARRILLA 1
    // ================================

    if (
        parrilla1.ocupada &&
        !parrilla1.cocinando &&
        !parrilla1.lista &&
        !parrilla1.quemada
    ) {

        btnCocinar1.disabled =
            false;

    } else {

        btnCocinar1.disabled =
            true;
    }


    // ================================
    // PARRILLA 2
    // ================================

    if (
        parrilla2.ocupada &&
        !parrilla2.cocinando &&
        !parrilla2.lista &&
        !parrilla2.quemada
    ) {

        btnCocinar2.disabled =
            false;

    } else {

        btnCocinar2.disabled =
            true;
    }


    // ================================
    // BOTONES SACAR
    // ================================

    btnSacar1.disabled =
        !parrilla1.lista &&
        !parrilla1.quemada;

    btnSacar2.disabled =
        !parrilla2.lista &&
        !parrilla2.quemada;
}


// ================================
// BUSCAR CLIENTE CORRECTO
// ================================

function buscarClientePorPedido(
    relleno
) {

    let mejorCliente =
        null;

    let mejorPosicion =
        -1;


    for (
        let posicion = 0;
        posicion < clientesVisibles;
        posicion++
    ) {

        const numeroCliente =
            clientesEnPantalla[
                posicion
            ];


        if (
            numeroCliente ===
            undefined
        ) {

            continue;
        }


        if (
            clientesSeFueron[
                numeroCliente
            ]
        ) {

            continue;
        }


        const cliente =
            clientesHTML[
                posicion
            ];


        if (!cliente) {
            continue;
        }


        if (
            cliente.classList.contains(
                "atendido"
            )
        ) {

            continue;
        }


        if (
            pedidosClientes[
                numeroCliente
            ] !== relleno
        ) {

            continue;
        }


        if (
            mejorCliente === null ||
            numeroCliente < mejorCliente
        ) {

            mejorCliente =
                numeroCliente;

            mejorPosicion =
                posicion;
        }
    }


    if (
        mejorCliente === null
    ) {

        return null;
    }


    return {

        numeroCliente:
            mejorCliente,

        posicionVisual:
            mejorPosicion
    };
}


// ================================
// ENTREGAR
// ================================

btnEntregar.addEventListener(
    "click",
    function () {

        if (nivelTerminado) {
            return;
        }


        if (
            empanadasParaEntregar.length === 0
        ) {

            mostrarMensaje(
                "No tienes una empanada lista."
            );

            return;
        }


        // ================================
        // TOMAR PRIMERA EMPANADA
        // ================================

        const empanada =
            empanadasParaEntregar[0];


        const relleno =
            empanada.relleno;


        // ================================
        // BUSCAR CLIENTE
        // ================================

        const clienteEncontrado =
            buscarClientePorPedido(
                relleno
            );


        if (!clienteEncontrado) {

            mostrarMensaje(
                "🤔 Ningún cliente está esperando una empanada de " +
                relleno +
                "."
            );

            return;
        }


        const numeroCliente =
            clienteEncontrado.numeroCliente;

        const posicionVisual =
            clienteEncontrado.posicionVisual;


        // ================================
        // PEDIDO CORRECTO
        // ================================

        puntos += 100;

        pedidosCorrectos++;


        actualizarPuntos();


        // ================================
        // CREAR DINERO
        // ================================

        crearDinero(
            posicionVisual,
            numeroCliente
        );


        // ================================
        // MARCAR CLIENTE
        // ================================

        marcarClienteAtendido(
            posicionVisual
        );


        mostrarMensaje(
            "🎉 ¡Pedido entregado! El cliente dejó $100."
        );


        // ================================
        // SACAR DE LA COLA
        // ================================

        empanadasParaEntregar.shift();


        // ================================
        // MOSTRAR SIGUIENTE
        // ================================

        actualizarEntrega();


        // ================================
        // REEMPLAZAR CLIENTE
        // ================================

        reemplazarClienteAtendido(
            posicionVisual,
            numeroCliente
        );


        // ================================
        // COMPROBAR FIN
        // ================================

        const clientesProcesados =
            pedidosCorrectos +
            clientesSeFueron.filter(
                estado => estado
            ).length;


        if (
            clientesProcesados >=
            totalClientes
        ) {

            comprobarFinDelNivel();
        }
    }
);


// ================================
// REINICIAR EMPANADA
// ================================

function reiniciarEmpanada() {

    rellenoSeleccionado =
        null;

    empanadaCerrada =
        false;


    const proteina =
        document.querySelector(
            ".proteina-sobre-masa"
        );

    if (proteina) {
        proteina.remove();
    }


    masa.style.display =
        "flex";


    btnCerrar.disabled =
        true;


    actualizarParrillas();
}


// ================================
// REEMPLAZAR CLIENTE ATENDIDO
// ================================

function reemplazarClienteAtendido(
    posicionVisual,
    numeroClienteAtendido
) {

    const cliente =
        clientesHTML[posicionVisual];

    if (!cliente) {
        return;
    }


    let siguiente =
        -1;


    for (
        let i = 0;
        i < totalClientes;
        i++
    ) {

        if (
            clientesEnPantalla.includes(i)
        ) {

            continue;
        }


        if (
            clientesSeFueron[i]
        ) {

            continue;
        }


        if (
            i ===
            numeroClienteAtendido
        ) {

            continue;
        }


        siguiente =
            i;

        break;
    }


    if (
        siguiente ===
        -1
    ) {

        cliente.style.opacity =
            "0";


        clientesEnPantalla[
            posicionVisual
        ] =
            undefined;


        comprobarFinDelNivel();

        return;
    }


    cliente.style.opacity =
        "0";


    cliente.style.transform =
        "translateY(-20px)";


    setTimeout(
        function () {

            if (nivelTerminado) {
                return;
            }


            clientesEnPantalla[
                posicionVisual
            ] =
                siguiente;


            tiempoLlegadaClientes[
                posicionVisual
            ] =
                Date.now();


            dineroClientes[
                siguiente
            ] =
                false;


            cambiarPersonajeVisual(
                posicionVisual
            );


            actualizarPedidoCliente(
                posicionVisual,
                siguiente
            );


            cliente.classList.remove(
                "atendido"
            );


            const chulo =
                cliente.querySelector(
                    ".chulo-cliente"
                );


            if (chulo) {
                chulo.remove();
            }


            cliente.style.transform =
                "translateY(0)";


            cliente.style.opacity =
                "1";


            mostrarMensaje(
                "👤 Llegó otro cliente: empanada de " +
                pedidosClientes[
                    siguiente
                ]
            );

        },
        300
    );
}


// ================================
// MARCAR CLIENTE ATENDIDO
// ================================

function marcarClienteAtendido(
    posicionVisual
) {

    const cliente =
        clientesHTML[posicionVisual];

    if (!cliente) {
        return;
    }


    cliente.classList.add(
        "atendido"
    );


    actualizarEstadoCliente(
        posicionVisual,
        "😄"
    );


    const chulo =
        document.createElement(
            "div"
        );


    chulo.classList.add(
        "chulo-cliente"
    );


    chulo.textContent =
        "✓";


    cliente.appendChild(
        chulo
    );
}


// ================================
// CREAR DINERO
// ================================

function crearDinero(
    posicionVisual,
    numeroCliente
) {

    const cliente =
        clientesHTML[
            posicionVisual
        ];

    const mostrador =
        document.querySelector(
            ".mostrador-cocina"
        );


    if (
        !cliente ||
        !mostrador
    ) {

        return;
    }


    if (
        dineroClientes[
            numeroCliente
        ] === true
    ) {

        return;
    }


    const dineroHTML =
        document.createElement(
            "div"
        );


    dineroHTML.classList.add(
        "dinero-mesa"
    );


    dineroHTML.textContent =
        "$100";


    dineroHTML.dataset.cliente =
        numeroCliente;


    dineroHTML.dataset.recogido =
        "false";


    dineroHTML.id =
        "dinero-cliente-" +
        numeroCliente;


    const rectCliente =
        cliente.getBoundingClientRect();


    const rectMesa =
        mostrador.getBoundingClientRect();


    let posicionX =
        rectCliente.left -
        rectMesa.left +
        (rectCliente.width / 2) -
        35;


    let posicionY =
        rectCliente.bottom -
        rectMesa.top -
        85;


    const anchoBillete =
        70;

    const altoBillete =
        35;

    const anchoMesa =
        mostrador.clientWidth;

    const altoMesa =
        mostrador.clientHeight;


    if (
        posicionX < 5
    ) {

        posicionX =
            5;
    }


    if (
        posicionX >
        anchoMesa -
        anchoBillete -
        5
    ) {

        posicionX =
            anchoMesa -
            anchoBillete -
            5;
    }


    if (
        posicionY < 5
    ) {

        posicionY =
            5;
    }


    if (
        posicionY >
        altoMesa -
        altoBillete -
        5
    ) {

        posicionY =
            altoMesa -
            altoBillete -
            5;
    }


    dineroHTML.style.left =
        posicionX +
        "px";


    dineroHTML.style.top =
        posicionY +
        "px";


    dineroHTML.style.position =
        "absolute";


    dineroHTML.style.zIndex =
        "9999";


    dineroHTML.style.cursor =
        "pointer";


    dineroHTML.style.pointerEvents =
        "auto";


    dineroHTML.addEventListener(
        "click",
        function () {

            if (
                dineroHTML.dataset.recogido ===
                "true"
            ) {

                return;
            }


            dineroHTML.dataset.recogido =
                "true";


            dinero +=
                100;


            dineroHTML.remove();


            mostrarMensaje(
                "💰 ¡Recogiste $100!"
            );


            actualizarFinPorDinero();
        }
    );


    mostrador.appendChild(
        dineroHTML
    );


    dineroClientes[
        numeroCliente
    ] =
        true;
}


// ================================
// COMPROBAR DINERO PENDIENTE
// ================================

function hayDineroPendiente() {

    const billetes =
        document.querySelectorAll(
            ".dinero-mesa"
        );


    return billetes.length > 0;
}


// ================================
// COMPROBAR FIN DEL NIVEL
// ================================

function comprobarFinDelNivel() {

    const clientesProcesados =
        pedidosCorrectos +
        clientesSeFueron.filter(
            estado => estado
        ).length;


    if (
        clientesProcesados <
        totalClientes
    ) {

        return;
    }


    if (
        hayDineroPendiente()
    ) {

        nivelTerminado =
            true;


        clearInterval(
            temporizador
        );


        clearInterval(
            temporizadorPaciencia
        );


        limpiarTemporizadoresCoccion();


        desactivarControles();


        mostrarMensaje(
            "💰 ¡Recoge todo el dinero que dejaron los clientes!"
        );


        return;
    }


    terminarNivel();
}


// ================================
// ACTUALIZAR FIN POR DINERO
// ================================

function actualizarFinPorDinero() {

    if (
        hayDineroPendiente()
    ) {

        return;
    }


    const clientesProcesados =
        pedidosCorrectos +
        clientesSeFueron.filter(
            estado => estado
        ).length;


    if (
        clientesProcesados >=
        totalClientes
    ) {

        terminarNivel();
    }
}


// ================================
// LIMPIAR TEMPORIZADORES DE COCCIÓN
// ================================

function limpiarTemporizadoresCoccion() {

    clearTimeout(
        temporizadorCoccion1
    );

    clearTimeout(
        temporizadorCoccion2
    );

    clearTimeout(
        temporizadorQuemado1
    );

    clearTimeout(
        temporizadorQuemado2
    );


    temporizadorCoccion1 =
        null;

    temporizadorCoccion2 =
        null;

    temporizadorQuemado1 =
        null;

    temporizadorQuemado2 =
        null;
}


// ================================
// DESACTIVAR CONTROLES
// ================================

function desactivarControles() {

    btnCarne.disabled =
        true;

    btnPollo.disabled =
        true;

    btnQueso.disabled =
        true;

    btnCerrar.disabled =
        true;

    btnCocinar1.disabled =
        true;

    btnSacar1.disabled =
        true;

    btnCocinar2.disabled =
        true;

    btnSacar2.disabled =
        true;

    btnEntregar.disabled =
        true;
}


// ================================
// TERMINAR NIVEL
// ================================

function terminarNivel() {

    if (
        document.querySelector(
            ".pantalla-final"
        )
    ) {

        return;
    }


    nivelTerminado =
        true;


    clearInterval(
        temporizador
    );


    clearInterval(
        temporizadorPaciencia
    );


    limpiarTemporizadoresCoccion();


    desactivarControles();


    mostrarMensaje(
        "🏆 ¡Nivel terminado!"
    );


    setTimeout(
        function () {

            mostrarPantallaFinal();

        },
        300
    );
}


// ================================
// SISTEMA DE PACIENCIA
// ================================

function actualizarPaciencia() {

    if (nivelTerminado) {
        return;
    }


    const ahora =
        Date.now();


    for (
        let posicion = 0;
        posicion < clientesVisibles;
        posicion++
    ) {

        const numeroCliente =
            clientesEnPantalla[
                posicion
            ];


        if (
            numeroCliente ===
            undefined
        ) {

            continue;
        }


        const cliente =
            clientesHTML[
                posicion
            ];


        if (!cliente) {
            continue;
        }


        if (
            cliente.classList.contains(
                "atendido"
            )
        ) {

            continue;
        }


        if (
            clientesSeFueron[
                numeroCliente
            ]
        ) {

            continue;
        }


        const tiempoLlegada =
            tiempoLlegadaClientes[
                posicion
            ];


        if (!tiempoLlegada) {
            continue;
        }


        const tiempoEsperando =
            Math.floor(
                (
                    ahora -
                    tiempoLlegada
                ) / 1000
            );


        if (
            tiempoEsperando <
            tiempoSerio
        ) {

            actualizarEstadoCliente(
                posicion,
                "😊"
            );

        } else if (
            tiempoEsperando <
            tiempoEnojado
        ) {

            actualizarEstadoCliente(
                posicion,
                "😐"
            );

        } else if (
            tiempoEsperando <
            tiempoMuyEnojado
        ) {

            actualizarEstadoCliente(
                posicion,
                "😠"
            );

        } else if (
            tiempoEsperando <
            tiempoSeVa
        ) {

            actualizarEstadoCliente(
                posicion,
                "😡"
            );

        } else {

            clienteSeVa(
                posicion
            );
        }
    }
}


// ================================
// CLIENTE SE VA
// ================================

function clienteSeVa(
    posicionVisual
) {

    if (nivelTerminado) {
        return;
    }


    const numeroCliente =
        clientesEnPantalla[
            posicionVisual
        ];


    if (
        numeroCliente ===
        undefined
    ) {

        return;
    }


    if (
        clientesSeFueron[
            numeroCliente
        ]
    ) {

        return;
    }


    clientesSeFueron[
        numeroCliente
    ] =
        true;


    const cliente =
        clientesHTML[
            posicionVisual
        ];


    if (!cliente) {
        return;
    }


    actualizarEstadoCliente(
        posicionVisual,
        "😡"
    );


    mostrarMensaje(
        "😡 ¡El cliente se cansó de esperar y se fue!"
    );


    let siguienteVisible =
        -1;


    for (
        let i = 0;
        i < totalClientes;
        i++
    ) {

        if (
            clientesEnPantalla.includes(i)
        ) {

            continue;
        }


        if (
            clientesSeFueron[i]
        ) {

            continue;
        }


        siguienteVisible =
            i;

        break;
    }


    if (
        siguienteVisible ===
        -1
    ) {

        cliente.style.opacity =
            "0";


        clientesEnPantalla[
            posicionVisual
        ] =
            undefined;


        comprobarFinDelNivel();

        return;
    }


    cliente.style.opacity =
        "0";


    cliente.style.transform =
        "translateY(-20px)";


    setTimeout(
        function () {

            if (nivelTerminado) {
                return;
            }


            clientesEnPantalla[
                posicionVisual
            ] =
                siguienteVisible;


            tiempoLlegadaClientes[
                posicionVisual
            ] =
                Date.now();


            dineroClientes[
                siguienteVisible
            ] =
                false;


            cambiarPersonajeVisual(
                posicionVisual
            );


            actualizarPedidoCliente(
                posicionVisual,
                siguienteVisible
            );


            cliente.classList.remove(
                "atendido"
            );


            const chulo =
                cliente.querySelector(
                    ".chulo-cliente"
                );


            if (chulo) {
                chulo.remove();
            }


            cliente.style.transform =
                "translateY(0)";


            cliente.style.opacity =
                "1";


            mostrarMensaje(
                "👤 Llegó otro cliente: empanada de " +
                pedidosClientes[
                    siguienteVisible
                ]
            );

        },
        300
    );
}


// ================================
// TEMPORIZADOR DE PACIENCIA
// ================================

const temporizadorPaciencia =
    setInterval(
        function () {

            if (!nivelTerminado) {

                actualizarPaciencia();

            }

        },
        1000
    );


// ================================
// TEMPORIZADOR DEL NIVEL
// ================================

temporizador =
    setInterval(
        function () {

            if (nivelTerminado) {
                return;
            }


            tiempo--;

            actualizarTiempo();


            if (
                tiempo <= 0
            ) {

                tiempo = 0;

                actualizarTiempo();


                clearInterval(
                    temporizador
                );


                limpiarTemporizadoresCoccion();


                desactivarControles();


                mostrarPantallaFinal();
            }

        },
        1000
    );


// ================================
// CALCULAR ESTRELLAS
// ================================

function calcularEstrellas() {

    if (
        pedidosCorrectos >= 8
    ) {

        return 3;
    }


    if (
        pedidosCorrectos >= 7
    ) {

        return 2;
    }


    if (
        pedidosCorrectos >= 5
    ) {

        return 1;
    }


    return 0;
}


// ================================
// PANTALLA FINAL
// ================================

function mostrarPantallaFinal() {

    if (
        document.querySelector(
            ".pantalla-final"
        )
    ) {

        return;
    }


    nivelTerminado =
        true;


    clearInterval(
        temporizador
    );


    clearInterval(
        temporizadorPaciencia
    );


    limpiarTemporizadoresCoccion();


    desactivarControles();


    const estrellas =
        calcularEstrellas();


    const nivelSuperado =
        pedidosCorrectos >=
        metaPedidos;


    // ================================
    // DESBLOQUEAR NIVEL 3
    // ================================

    if (nivelSuperado) {

        const nivelDesbloqueadoActual =
            parseInt(
                localStorage.getItem(
                    "nivelDesbloqueado"
                ),
                10
            ) || 1;


        if (
            nivelDesbloqueadoActual <
            3
        ) {

            localStorage.setItem(
                "nivelDesbloqueado",
                "3"
            );
        }
    }


    const pantalla =
        document.createElement(
            "div"
        );


    pantalla.classList.add(
        "pantalla-final"
    );


    pantalla.innerHTML = `

        <div class="panel-final">

            <h1>🏆 NIVEL 2</h1>

            <div class="estrellas">
                ${"⭐".repeat(estrellas)}
                ${"☆".repeat(3 - estrellas)}
            </div>

            <div class="estadistica-final">
                💰 Dinero recolectado:
                $${dinero}
            </div>

            <div class="estadistica-final">
                ⭐ Puntos:
                ${puntos}
            </div>

            <div class="estadistica-final">
                🥟 Pedidos correctos:
                ${pedidosCorrectos}/8
            </div>

            <div class="estadistica-final">
                🎯 Mínimo para pasar:
                ${metaPedidos}
            </div>

            <div class="resultado-final">
                ${
                    nivelSuperado
                        ? "🎉 ¡NIVEL SUPERADO!"
                        : "😢 ¡NIVEL NO SUPERADO!"
                }
            </div>

            <div class="botones-final">

                <button
                    class="boton-final"
                    id="btn-accion-final">
                </button>

                <button
                    class="boton-final"
                    id="btn-volver-niveles">
                    VOLVER AL MENÚ
                </button>

            </div>

        </div>

    `;


    // ================================
    // AGREGAR PANTALLA
    // ================================

    document.body.appendChild(
        pantalla
    );


    // ================================
    // BOTÓN PRINCIPAL
    // ================================

    const btnAccionFinal =
        document.getElementById(
            "btn-accion-final"
        );


    if (nivelSuperado) {

        btnAccionFinal.textContent =
            "SIGUIENTE NIVEL";


        btnAccionFinal.addEventListener(
            "click",
            function () {

                window.location.href =
                    "nivel3.html";

            }
        );

    } else {

        btnAccionFinal.textContent =
            "🔄 REINTENTAR";


        btnAccionFinal.addEventListener(
            "click",
            function () {

                window.location.reload();

            }
        );
    }


    // ================================
    // BOTÓN VOLVER AL MENÚ
    // ================================

    const btnVolverNiveles =
        document.getElementById(
            "btn-volver-niveles"
        );


    btnVolverNiveles.addEventListener(
        "click",
        function () {

            window.location.href =
                "niveles.html";

        }
    );
}