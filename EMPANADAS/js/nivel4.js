// ================================
// VARIABLES DEL JUEGO
// ================================

let puntos = 0;
let tiempo = 95;

let dinero = 0;
let pedidosCorrectos = 0;

let nivelTerminado = false;


// ================================
// ESTADO DEL GUARDADO
// ================================

let partidaGuardada = false;
let guardandoPartida = false;
let partidaSuperada = false;


// ================================
// ESTADO DE LA EMPANADA
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

let temporizadorPaciencia;

let temporizadorCoccion1 = null;
let temporizadorCoccion2 = null;

let temporizadorQuemado1 = null;
let temporizadorQuemado2 = null;


// ================================
// CONFIGURACIÓN DEL NIVEL 4
// ================================

const totalClientes = 13;

const clientesVisibles = 3;


// ========================================
// MÍNIMO REAL PARA SUPERAR EL NIVEL
// ========================================
//
// 9 clientes atendidos = SUPERADO
//
// 8 o menos = NO SUPERADO
//
// Esto NO limita la cantidad de clientes.
// El nivel puede continuar mostrando clientes
// hasta completar los 13 disponibles.
// ========================================

const metaPedidos = 9;


// ================================
// SIGUIENTE CLIENTE
// ================================
//
// Los clientes se muestran:
//
// 0 → 1 → 2 → 3 → 4 → ... → 12
//
// Llegar a 9 NO detiene el juego.
// ================================

let siguienteCliente = 0;


// ================================
// RELLENOS DISPONIBLES
// ================================

const pedidosDisponibles = [
    "carne",
    "pollo",
    "queso",
    "pina",
    "champinon"
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

const btnPina =
    document.getElementById("btn-pina");

const btnChampinon =
    document.getElementById("btn-champinon");


// ================================
// HACER MÁS GRANDE EL CHAMPIÑÓN
// ================================

if (btnChampinon) {

    const imagenChampinon =
        btnChampinon.querySelector("img");

    if (imagenChampinon) {

        imagenChampinon.style.transform =
            "scale(1.4)";

        imagenChampinon.style.transformOrigin =
            "center";

        imagenChampinon.style.position =
            "relative";

        imagenChampinon.style.zIndex =
            "2";
    }
}


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

const btnTirar =
    document.getElementById("btn-tirar");


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
// PEDIDOS PENDIENTES
// ================================

let pedidosPendientesClientes = [];


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
// GENERAR LOS 13 PEDIDOS
// ================================

function generarPedidosIniciales() {

    pedidosClientes = [];

    pedidosPendientesClientes = [];


    for (
        let i = 0;
        i < totalClientes;
        i++
    ) {

        let primerRelleno;


        // ========================================
        // EVITAR MISMO PRIMER RELLENO CONSECUTIVO
        // ========================================

        do {

            primerRelleno =
                generarPedido();

        } while (
            i > 0 &&
            pedidosClientes[i - 1][0] ===
            primerRelleno
        );


        // ========================================
        // DECIDIR SI PIDE 1 O 2 EMPANADAS
        // ========================================

        const pedidoDoble =
            Math.random() < 0.35;


        // ========================================
        // UNA EMPANADA
        // ========================================

        if (!pedidoDoble) {

            pedidosClientes.push([
                primerRelleno
            ]);

            continue;
        }


        // ========================================
        // DOS EMPANADAS
        // ========================================

        const mismoRelleno =
            Math.random() < 0.50;


        if (mismoRelleno) {

            pedidosClientes.push([
                primerRelleno,
                primerRelleno
            ]);

        } else {

            let segundoRelleno;


            do {

                segundoRelleno =
                    generarPedido();

            } while (
                segundoRelleno ===
                primerRelleno
            );


            pedidosClientes.push([
                primerRelleno,
                segundoRelleno
            ]);
        }
    }


    // ========================================
    // COPIA INDEPENDIENTE
    // ========================================

    pedidosPendientesClientes =
        pedidosClientes.map(
            pedido => [...pedido]
        );
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
// NOMBRE DEL RELLENO
// ================================

function obtenerNombreRelleno(
    relleno
) {

    if (relleno === "pina") {
        return "hawaiana";
    }

    if (relleno === "champinon") {
        return "champiñones";
    }

    return relleno;
}


// ================================
// OBTENER IMAGEN DEL RELLENO
// ================================

function obtenerImagenRelleno(
    relleno
) {

    if (relleno === "pina") {

        return {
            src: "img/rellenos/piña.png",
            alt: "Piña"
        };
    }


    if (relleno === "champinon") {

        return {
            src: "img/rellenos/champiñon.png",
            alt: "Champiñón"
        };
    }


    return {
        src:
            "img/rellenos/" +
            relleno +
            ".png",

        alt:
            obtenerNombreRelleno(
                relleno
            )
    };
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


    const pedidos =
        pedidosPendientesClientes[
            numeroCliente
        ];

    if (!pedidos) {
        return;
    }


    const burbuja =
        obtenerBurbuja(cliente);

    if (!burbuja) {
        return;
    }


    // ========================================
    // GUARDAR EMOJI ACTUAL
    // ========================================

    let emoji =
        "😊";


    const emojiExistente =
        burbuja.querySelector(
            ".estado-cliente"
        );


    if (emojiExistente) {

        emoji =
            emojiExistente.textContent;
    }


    // ========================================
    // LIMPIAR BURBUJA
    // ========================================

    burbuja.innerHTML = "";


    // ========================================
    // CONTENEDOR DE PEDIDOS
    // ========================================

    const contenedorPedidos =
        document.createElement(
            "div"
        );

    contenedorPedidos.classList.add(
        "contenedor-pedidos"
    );

    contenedorPedidos.style.display =
        "flex";

    contenedorPedidos.style.flexDirection =
        "column";

    contenedorPedidos.style.alignItems =
        "center";

    contenedorPedidos.style.gap =
        "3px";


    // ========================================
    // MOSTRAR PEDIDOS
    // ========================================

    pedidos.forEach(
        function (relleno) {

            const item =
                document.createElement(
                    "div"
                );

            item.classList.add(
                "pedido-item"
            );

            item.style.display =
                "flex";

            item.style.flexDirection =
                "column";

            item.style.alignItems =
                "center";


            const texto =
                document.createElement(
                    "p"
                );


            texto.textContent =
                "Una empanada de " +
                obtenerNombreRelleno(
                    relleno
                );


            const imagen =
                document.createElement(
                    "img"
                );


            const datosImagen =
                obtenerImagenRelleno(
                    relleno
                );


            imagen.src =
                datosImagen.src;

            imagen.alt =
                datosImagen.alt;


            imagen.classList.add(
                "icono-pedido"
            );


            imagen.style.width =
                "35px";

            imagen.style.height =
                "35px";

            imagen.style.objectFit =
                "contain";


            if (
                relleno ===
                "champinon"
            ) {

                imagen.style.width =
                    "45px";

                imagen.style.height =
                    "45px";

                imagen.style.transform =
                    "scale(1.35)";

                imagen.style.transformOrigin =
                    "center";
            }


            item.appendChild(
                texto
            );

            item.appendChild(
                imagen
            );


            contenedorPedidos.appendChild(
                item
            );
        }
    );


    burbuja.appendChild(
        contenedorPedidos
    );


    // ========================================
    // CREAR EMOJI
    // ========================================

    const nuevoEmoji =
        document.createElement(
            "span"
        );

    nuevoEmoji.classList.add(
        "estado-cliente"
    );

    nuevoEmoji.style.display =
        "inline-block";

    nuevoEmoji.style.marginLeft =
        "8px";

    nuevoEmoji.style.fontSize =
        "24px";

    nuevoEmoji.textContent =
        emoji;


    burbuja.appendChild(
        nuevoEmoji
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
        "cliente1-japon.png",
        "cliente2-japon.png",
        "cliente3-japon.png"
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
// OBTENER SIGUIENTE CLIENTE
// ================================
//
// Avanza siempre:
//
// 0 → 1 → 2 → 3 → ... → 12
//
// No se detiene al llegar a 9.
// ================================

function obtenerSiguienteCliente() {

    if (
        siguienteCliente >=
        totalClientes
    ) {

        return -1;
    }


    const cliente =
        siguienteCliente;


    siguienteCliente++;


    return cliente;
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


    siguienteCliente = 0;


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


    // ========================================
    // PRIMEROS 3 CLIENTES
    // ========================================

    for (
        let i = 0;
        i < clientesVisibles;
        i++
    ) {

        const numeroCliente =
            obtenerSiguienteCliente();


        if (
            numeroCliente ===
            -1
        ) {

            break;
        }


        clientesEnPantalla[i] =
            numeroCliente;


        tiempoLlegadaClientes[i] =
            Date.now();


        actualizarPedidoCliente(
            i,
            numeroCliente
        );


        reiniciarEstadoCliente(i);


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


    // ========================================
    // PERSONAJES DE JAPÓN
    // ========================================

    for (
        let i = 0;
        i < clientesVisibles;
        i++
    ) {

        const cliente =
            clientesHTML[i];


        if (!cliente) {
            continue;
        }


        const imagen =
            cliente.querySelector(
                ".imagen-cliente"
            );


        if (!imagen) {
            continue;
        }


        imagen.src =
            "img/clientes/" +
            [
                "cliente1-japon.png",
                "cliente2-japon.png",
                "cliente3-japon.png"
            ][i];
    }


    // ========================================
    // OCULTAR SOBRANTES
    // ========================================

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
// ASEGURAR MASA
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

btnTirar.disabled =
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

    } else if (relleno === "pina") {

        proteina.src =
            "img/rellenos/hawaiana.png";

    } else if (relleno === "champinon") {

        proteina.src =
            "img/rellenos/relleno-champiñon.png";
    }


    proteina.alt =
        obtenerNombreRelleno(
            relleno
        );


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
        obtenerNombreRelleno(relleno) +
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

btnPina.addEventListener(
    "click",
    function () {

        seleccionarRelleno(
            "pina"
        );
    }
);

btnChampinon.addEventListener(
    "click",
    function () {

        seleccionarRelleno(
            "champinon"
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


        const parrillaLibre =
            obtenerParrillaLibre();


        if (parrillaLibre === null) {

            mostrarMensaje(
                "🔥 Las dos parrillas están ocupadas. Espera a que una quede libre."
            );

            return;
        }


        const proteina =
            document.querySelector(
                ".proteina-sobre-masa"
            );


        if (proteina) {
            proteina.remove();
        }


        empanadaCerrada =
            true;


        masa.style.display =
            "none";


        btnCerrar.disabled =
            true;


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


    if (parrilla.ocupada) {

        mostrarMensaje(
            "Esta parrilla ya está ocupada."
        );

        return;
    }


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


    imagenEmpanada.src =
        "img/empanada/empanada-cerrada.png";

    imagenEmpanada.style.display =
        "block";


    empanadaCerrada =
        false;

    rellenoSeleccionado =
        null;


    actualizarParrillas();
}


// ================================
// COCINAR PARRILLA 1
// ================================

btnCocinar1.addEventListener(
    "click",
    function () {

        cocinarEnParrilla(1);
    }
);


// ================================
// COCINAR PARRILLA 2
// ================================

btnCocinar2.addEventListener(
    "click",
    function () {

        cocinarEnParrilla(2);
    }
);


// ================================
// COCINAR
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


    imagenEmpanada.src =
        "img/empanada/empanada-cerrada.png";

    imagenEmpanada.style.display =
        "block";


    mostrarMensaje(
        "🍳 Cocinando en la Parrilla " +
        numeroParrilla +
        "..."
    );


    actualizarParrillas();


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
                    obtenerNombreRelleno(
                        parrilla.relleno
                    ) +
                    " está lista en la Parrilla " +
                    numeroParrilla +
                    "! Sácala antes de que se queme."
                );


                actualizarParrillas();


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
                                obtenerNombreRelleno(
                                    parrilla.relleno
                                ) +
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
// SACAR PARRILLA 1
// ================================

btnSacar1.addEventListener(
    "click",
    function () {

        sacarDeParrilla(1);
    }
);


// ================================
// SACAR PARRILLA 2
// ================================

btnSacar2.addEventListener(
    "click",
    function () {

        sacarDeParrilla(2);
    }
);


// ================================
// SACAR EMPANADA
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


    // ========================================
    // EMPANADA QUEMADA
    // ========================================

    if (parrilla.quemada) {

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


        imagenEmpanada.style.display =
            "none";


        botonSacar.disabled =
            true;


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


        masa.style.display =
            "flex";


        btnCerrar.disabled =
            true;


        mostrarMensaje(
            "🔥 ¡Empanada quemada! Sácala y prepara otra."
        );


        return;
    }


    // ========================================
    // COMPROBAR SI ESTÁ LISTA
    // ========================================

    if (!parrilla.lista) {

        mostrarMensaje(
            "La empanada todavía no está lista."
        );

        return;
    }


    // ========================================
    // CANCELAR TEMPORIZADORES
    // ========================================

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


    // ========================================
    // GUARDAR EMPANADA PARA ENTREGA
    // ========================================

    empanadasParaEntregar.push({
        relleno: parrilla.relleno,
        parrilla: numeroParrilla
    });


    imagenEmpanada.style.display =
        "none";


    botonSacar.disabled =
        true;


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


    actualizarEntrega();

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

        btnTirar.disabled =
            true;

        return;
    }


    empanadaFinal.src =
        "img/empanada/empanada-dorada.png";


    empanadaFinal.style.display =
        "block";


    btnEntregar.disabled =
        false;

    btnTirar.disabled =
        false;
}


// ================================
// TIRAR EMPANADA
// ================================

btnTirar.addEventListener(
    "click",
    function () {

        if (nivelTerminado) {
            return;
        }


        if (
            empanadasParaEntregar.length === 0
        ) {

            mostrarMensaje(
                "No tienes una empanada para tirar."
            );

            return;
        }


        const empanadaTirada =
            empanadasParaEntregar.shift();


        actualizarEntrega();


        mostrarMensaje(
            "🗑️ Tiraste la empanada de " +
            obtenerNombreRelleno(
                empanadaTirada.relleno
            ) +
            ". Prepara otra."
        );
    }
);


// ================================
// ACTUALIZAR PARRILLAS
// ================================

function actualizarParrillas() {

    if (nivelTerminado) {
        return;
    }


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

    let mejorCliente = null;
    let mejorPosicion = -1;


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


        const pendientes =
            pedidosPendientesClientes[
                numeroCliente
            ];


        if (
            !pendientes ||
            pendientes.length === 0
        ) {

            continue;
        }


        if (
            !pendientes.includes(
                relleno
            )
        ) {

            continue;
        }


        if (
            mejorCliente === null ||
            tiempoLlegadaClientes[posicion] <
            tiempoLlegadaClientes[mejorPosicion]
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


        const empanada =
            empanadasParaEntregar[0];


        const relleno =
            empanada.relleno;


        const clienteEncontrado =
            buscarClientePorPedido(
                relleno
            );


        if (!clienteEncontrado) {

            mostrarMensaje(
                "🤔 Ningún cliente está esperando una empanada de " +
                obtenerNombreRelleno(relleno) +
                ". Puedes tirarla con el botón TIRAR."
            );

            return;
        }


        const numeroCliente =
            clienteEncontrado.numeroCliente;

        const posicionVisual =
            clienteEncontrado.posicionVisual;


        const pedidosPendientes =
            pedidosPendientesClientes[
                numeroCliente
            ];


        // ========================================
        // BUSCAR EL RELLENO
        // ========================================

        const indiceRelleno =
            pedidosPendientes.indexOf(
                relleno
            );


        if (
            indiceRelleno === -1
        ) {

            mostrarMensaje(
                "❌ Esa empanada no corresponde al pedido."
            );

            return;
        }


        // ========================================
        // QUITAR SOLO UNA EMPANADA
        // ========================================

        pedidosPendientes.splice(
            indiceRelleno,
            1
        );


        // ========================================
        // QUITAR DE LA COLA
        // ========================================

        empanadasParaEntregar.shift();


        actualizarEntrega();


        // ========================================
        // TODAVÍA FALTA UNA EMPANADA
        // ========================================

        if (
            pedidosPendientes.length > 0
        ) {

            actualizarPedidoCliente(
                posicionVisual,
                numeroCliente
            );


            const nombresPendientes =
                pedidosPendientes.map(
                    pedido =>
                        obtenerNombreRelleno(
                            pedido
                        )
                );


            mostrarMensaje(
                "🥟 ¡Bien! Todavía falta " +
                (
                    pedidosPendientes.length === 1
                        ? "1 empanada"
                        : pedidosPendientes.length +
                          " empanadas"
                ) +
                ": " +
                nombresPendientes.join(
                    " + "
                )
            );


            return;
        }


        // ========================================
        // PEDIDO COMPLETADO
        // ========================================

        const pedidoOriginal =
            pedidosClientes[
                numeroCliente
            ];


        const cantidadEmpanadas =
            pedidoOriginal.length;


        // ========================================
        // PAGO
        // ========================================
        //
        // 1 empanada = $100
        // 2 empanadas = $200
        //
        // PERO sigue contando como 1 CLIENTE.
        // ========================================

        const pagoCliente =
            cantidadEmpanadas * 100;


        // ========================================
        // PUNTOS
        // ========================================

        puntos +=
            pagoCliente;


        // ========================================
        // IMPORTANTE:
        // UN PEDIDO COMPLETO = UN CLIENTE
        // ========================================

        pedidosCorrectos++;


        actualizarPuntos();


        // ========================================
        // CREAR DINERO
        // ========================================

        crearDinero(
            posicionVisual,
            numeroCliente,
            pagoCliente
        );


        // ========================================
        // MARCAR ATENDIDO
        // ========================================

        marcarClienteAtendido(
            posicionVisual
        );


        mostrarMensaje(
            "🎉 ¡Pedido completo! El cliente dejó $" +
            pagoCliente +
            "."
        );


        // ========================================
        // REEMPLAZAR CLIENTE
        // ========================================

        reemplazarClienteAtendido(
            posicionVisual,
            numeroCliente
        );


        // ========================================
        // COMPROBAR FIN
        // ========================================

        comprobarFinDelNivel();
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


    const siguiente =
        obtenerSiguienteCliente();


    // ========================================
    // YA NO HAY MÁS CLIENTES
    // ========================================

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


    // ========================================
    // OCULTAR CLIENTE ACTUAL
    // ========================================

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


            reiniciarEstadoCliente(
                posicionVisual
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


            const nuevoPedido =
                pedidosPendientesClientes[
                    siguiente
                ];


            let textoNuevoPedido;


            if (
                nuevoPedido.length === 1
            ) {

                textoNuevoPedido =
                    "Una empanada de " +
                    obtenerNombreRelleno(
                        nuevoPedido[0]
                    );

            } else {

                textoNuevoPedido =
                    nuevoPedido
                        .map(
                            pedido =>
                                obtenerNombreRelleno(
                                    pedido
                                )
                        )
                        .join(
                            " + "
                        );
            }


            mostrarMensaje(
                "👤 Llegó otro cliente: " +
                textoNuevoPedido
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
    numeroCliente,
    pagoCliente
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
        "$" +
        pagoCliente;


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
        160;


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
                pagoCliente;


            dineroHTML.remove();


            mostrarMensaje(
                "💰 ¡Recogiste $" +
                pagoCliente +
                "!"
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
// CLIENTES PROCESADOS
// ================================
//
// Cliente atendido = 1
// Cliente que se fue = 1
//
// Un pedido doble = 1 cliente.
// ================================

function obtenerClientesProcesados() {

    return (
        pedidosCorrectos +
        clientesSeFueron.filter(
            estado => estado
        ).length
    );
}


// ================================
// COMPROBAR FIN DEL NIVEL
// ================================

function comprobarFinDelNivel() {

    const clientesProcesados =
        obtenerClientesProcesados();


    // ========================================
    // TODAVÍA FALTAN CLIENTES
    // ========================================

    if (
        clientesProcesados <
        totalClientes
    ) {

        return;
    }


    // ========================================
    // YA PASARON LOS 13 CLIENTES
    // ========================================

    if (
        hayDineroPendiente()
    ) {

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
        obtenerClientesProcesados();


    if (
        clientesProcesados >=
        totalClientes
    ) {

        terminarNivel();
    }
}


// ================================
// LIMPIAR TEMPORIZADORES
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

    btnPina.disabled =
        true;

    btnChampinon.disabled =
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

    btnTirar.disabled =
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


    // ========================================
    // SIGUIENTE CLIENTE
    // ========================================

    const siguienteVisible =
        obtenerSiguienteCliente();


    // ========================================
    // YA NO HAY MÁS CLIENTES
    // ========================================

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


    // ========================================
    // OCULTAR CLIENTE
    // ========================================

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


            reiniciarEstadoCliente(
                posicionVisual
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


            const nuevoPedido =
                pedidosPendientesClientes[
                    siguienteVisible
                ];


            let textoNuevoPedido;


            if (
                nuevoPedido.length === 1
            ) {

                textoNuevoPedido =
                    "Una empanada de " +
                    obtenerNombreRelleno(
                        nuevoPedido[0]
                    );

            } else {

                textoNuevoPedido =
                    nuevoPedido
                        .map(
                            pedido =>
                                obtenerNombreRelleno(
                                    pedido
                                )
                        )
                        .join(
                            " + "
                        );
            }


            mostrarMensaje(
                "👤 Llegó otro cliente: " +
                textoNuevoPedido
            );

        },
        300
    );


    comprobarFinDelNivel();
}


// ================================
// TEMPORIZADOR DE PACIENCIA
// ================================

temporizadorPaciencia =
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


            if (tiempo <= 0) {

                tiempo = 0;

                actualizarTiempo();


                clearInterval(
                    temporizador
                );


                clearInterval(
                    temporizadorPaciencia
                );


                limpiarTemporizadoresCoccion();


                nivelTerminado =
                    true;


                desactivarControles();


                mostrarPantallaFinal();
            }

        },
        1000
    );


// ================================
// CALCULAR ESTRELLAS
// ================================
//
// 12+ = ⭐⭐⭐
// 10-11 = ⭐⭐
// 9 = ⭐
// 0-8 = ☆☆☆
// ================================

function calcularEstrellas() {

    if (
        pedidosCorrectos >= 12
    ) {

        return 3;
    }


    if (
        pedidosCorrectos >= 10
    ) {

        return 2;
    }


    if (
        pedidosCorrectos >= 9
    ) {

        return 1;
    }


    return 0;
}


// ================================
// COMPROBAR SI SUPERÓ EL NIVEL
// ================================
//
// ESTA ES LA CONDICIÓN IMPORTANTE:
//
// 9 >= 9 → TRUE
//
// Por eso 9 clientes sí pasan.
// ================================

function comprobarSiSuperoElNivel() {

    return (
        pedidosCorrectos >=
        metaPedidos
    );
}


// ================================
// GUARDAR PARTIDA
// ================================

async function guardarPartida() {

    if (partidaGuardada) {
        return partidaSuperada;
    }


    if (guardandoPartida) {
        return partidaSuperada;
    }


    guardandoPartida =
        true;


    const token =
        localStorage.getItem("token");


    if (!token) {

        console.error(
            "❌ No se encontró el token de autenticación."
        );


        guardandoPartida =
            false;


        return null;
    }


    try {

        const respuesta =
            await fetch(
                "https://juego-empanadas-backend.onrender.com/api/partidas",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify({
                            nivel: 4,

                            clientesAtendidos:
                                pedidosCorrectos,

                            estrellas:
                                calcularEstrellas(),

                            puntuacion:
                                puntos
                        })
                }
            );


        const datos =
            await respuesta.json();


        console.log(
            "📦 Respuesta del servidor al guardar Nivel 4:",
            datos
        );


        if (!respuesta.ok) {

            throw new Error(
                datos.mensaje ||
                "Error al guardar la partida."
            );
        }


        // ========================================
        // CONDICIÓN CORRECTA
        // ========================================
        //
        // Si atendiste 9 clientes:
        //
        // 9 >= 9 → SUPERADO
        //
        // No dependemos únicamente de una
        // comparación incorrecta del servidor.
        // ========================================

        partidaSuperada =
            comprobarSiSuperoElNivel() ||
            (
                datos.partida &&
                datos.partida.superado === true
            );


        partidaGuardada =
            true;


        if (
            datos.usuario &&
            datos.usuario.nivelDesbloqueado
        ) {

            const usuarioGuardado =
                JSON.parse(
                    localStorage.getItem(
                        "usuario"
                    )
                );


            if (usuarioGuardado) {

                usuarioGuardado.nivelDesbloqueado =
                    datos.usuario.nivelDesbloqueado;


                localStorage.setItem(
                    "usuario",
                    JSON.stringify(
                        usuarioGuardado
                    )
                );
            }


            localStorage.setItem(
                "nivelDesbloqueado",
                String(
                    datos.usuario.nivelDesbloqueado
                )
            );
        }


        console.log(
            "✅ Nivel 4 guardado correctamente."
        );


        console.log(
            "🎯 Nivel 4 superado:",
            partidaSuperada
        );


        guardandoPartida =
            false;


        return partidaSuperada;


    } catch (error) {

        console.error(
            "❌ Error al guardar Nivel 4:",
            error
        );


        guardandoPartida =
            false;


        return null;
    }
}


// ================================
// PANTALLA FINAL
// ================================

async function mostrarPantallaFinal() {

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


    // ================================
    // GUARDAR PARTIDA
    // ================================

    mostrarMensaje(
        "💾 Guardando partida..."
    );


    const resultadoGuardado =
        await guardarPartida();


    // ================================
    // ERROR AL GUARDAR
    // ================================

    if (
        resultadoGuardado === null
    ) {

        mostrarMensaje(
            "⚠️ No se pudo guardar la partida."
        );


        const pantallaError =
            document.createElement(
                "div"
            );


        pantallaError.classList.add(
            "pantalla-final"
        );


        pantallaError.innerHTML = `

            <div class="panel-final">

                <h1>⚠️ ERROR AL GUARDAR</h1>

                <div class="resultado-final">
                    No pudimos guardar tu resultado.
                </div>

                <div class="estadistica-final">
                    🥟 Pedidos correctos:
                    ${pedidosCorrectos}/13
                </div>

                <div class="estadistica-final">
                    ⭐ Puntos:
                    ${puntos}
                </div>

                <div class="botones-final">

                    <button
                        class="boton-final"
                        id="btn-reintentar-guardado">
                        🔄 INTENTAR DE NUEVO
                    </button>

                    <button
                        class="boton-final"
                        id="btn-volver-niveles-error">
                        VOLVER AL MENÚ
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            pantallaError
        );


        document
            .getElementById(
                "btn-reintentar-guardado"
            )
            .addEventListener(
                "click",
                function () {

                    pantallaError.remove();

                    mostrarPantallaFinal();

                }
            );


        document
            .getElementById(
                "btn-volver-niveles-error"
            )
            .addEventListener(
                "click",
                function () {

                    window.location.href =
                        "niveles.html";

                }
            );


        return;
    }


    // ================================
    // DATOS FINALES
    // ================================

    const estrellas =
        calcularEstrellas();


    // ========================================
    // IMPORTANTE
    // ========================================
    //
    // El resultado final se determina por:
    //
    // pedidosCorrectos >= metaPedidos
    //
    // 9 >= 9 = SUPERADO
    // ========================================

    const nivelSuperado =
        pedidosCorrectos >= metaPedidos;


    // ================================
    // CREAR PANTALLA FINAL
    // ================================

    const pantalla =
        document.createElement(
            "div"
        );


    pantalla.classList.add(
        "pantalla-final"
    );


    pantalla.innerHTML = `

        <div class="panel-final">

            <h1>🏆 NIVEL 4</h1>

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
                ${pedidosCorrectos}/13
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
                    "nivel5.html";

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
    // VOLVER A NIVELES
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