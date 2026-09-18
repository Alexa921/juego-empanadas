// ================================
// VARIABLES DEL JUEGO
// ================================

let puntos = 0;
let tiempo = 60;

let dinero = 0;
let pedidosCorrectos = 0;

let nivelTerminado = false;

let rellenoSeleccionado = null;
let empanadaCerrada = false;
let empanadaCocinando = false;
let empanadaLista = false;
let empanadaQuemada = false;

let temporizador;
let temporizadorQuemado;


// ================================
// CONFIGURACIÓN DEL NIVEL
// ================================

const totalClientes = 6;

const clientesVisibles = 3;

const metaPedidos = 4;

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

const empanada =
    document.getElementById("empanada");

const empanadaFinal =
    document.getElementById("empanada-final");


const btnCarne =
    document.getElementById("btn-carne");

const btnPollo =
    document.getElementById("btn-pollo");

const btnQueso =
    document.getElementById("btn-queso");


const btnCerrar =
    document.getElementById("btn-cerrar");

const btnCocinar =
    document.getElementById("btn-cocinar");

const btnSacar =
    document.getElementById("btn-sacar");

const btnEntregar =
    document.getElementById("btn-entregar");


const clientesHTML =
    document.querySelectorAll(".cliente");


// ================================
// PEDIDOS DE LOS 6 CLIENTES
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
// PERSONAJE VISUAL DE CADA POSICIÓN
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
// GENERAR LOS 6 PEDIDOS
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
// REINICIAR ESTADO
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
            "img.cliente-img, img.personaje, img.avatar, img"
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

empanada.style.display =
    "none";

empanadaFinal.style.display =
    "none";


btnCerrar.disabled =
    true;

btnCocinar.disabled =
    true;

btnSacar.disabled =
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
// MOSTRAR PROTEÍNA SOBRE LA MASA
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

    const proteina =
        document.createElement(
            "img"
        );

    proteina.classList.add(
        "proteina-sobre-masa"
    );

    if (
        relleno === "carne"
    ) {

        proteina.src =
            "img/rellenos/carne-cocinada.png";

    }

    else if (
        relleno === "pollo"
    ) {

        proteina.src =
            "img/rellenos/pollo-cocinado.png";

    }

    else if (
        relleno === "queso"
    ) {

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
        "20";

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

        const proteina =
            document.querySelector(
                ".proteina-sobre-masa"
            );

        if (proteina) {
            proteina.remove();
        }

        empanadaCerrada =
            true;

        empanadaCocinando =
            false;

        empanadaLista =
            false;

        empanadaQuemada =
            false;

        masa.style.display =
            "none";

        empanada.src =
            "img/empanada/empanada-cerrada.png";

        empanada.style.display =
            "block";

        btnCerrar.disabled =
            true;

        btnCocinar.disabled =
            false;

        btnSacar.disabled =
            true;

        btnEntregar.disabled =
            true;

        mostrarMensaje(
            "¡Empanada cerrada! Ahora cocínala."
        );
    }
);


// ================================
// COCINAR
// ================================

btnCocinar.addEventListener(
    "click",
    function () {

        if (nivelTerminado) {
            return;
        }

        if (!empanadaCerrada) {

            mostrarMensaje(
                "Primero debes cerrar la empanada."
            );

            return;
        }

        if (empanadaCocinando) {

            mostrarMensaje(
                "La empanada ya se está cocinando..."
            );

            return;
        }

        if (empanadaLista) {

            mostrarMensaje(
                "La empanada ya está lista. ¡Sácala antes de que se queme!"
            );

            return;
        }

        if (empanadaQuemada) {

            mostrarMensaje(
                "🔥 Esta empanada está quemada. Sácala y prepara otra."
            );

            return;
        }


        empanadaCocinando =
            true;

        empanadaLista =
            false;

        empanadaQuemada =
            false;


        btnCocinar.disabled =
            true;

        btnSacar.disabled =
            true;

        btnEntregar.disabled =
            true;


        mostrarMensaje(
            "🍳 Cocinando empanada..."
        );


        empanada.src =
            "img/empanada/empanada-cerrada.png";


        // ================================
        // TERMINAR COCCIÓN
        // ================================

        setTimeout(
            function () {

                if (nivelTerminado) {
                    return;
                }

                if (!empanadaCerrada) {
                    return;
                }

                if (!empanadaCocinando) {
                    return;
                }


                empanada.src =
                    "img/empanada/empanada-dorada.png";

                empanadaCocinando =
                    false;

                empanadaLista =
                    true;

                empanadaQuemada =
                    false;


                btnCocinar.disabled =
                    true;

                btnSacar.disabled =
                    false;

                btnEntregar.disabled =
                    true;


                mostrarMensaje(
                    "🟡 ¡La empanada está lista! Sácala antes de que se queme."
                );


                // ================================
                // TIEMPO PARA QUE SE QUEME
                // ================================

                temporizadorQuemado =
                    setTimeout(
                        function () {

                            if (nivelTerminado) {
                                return;
                            }

                            if (!empanadaCerrada) {
                                return;
                            }

                            if (!empanadaLista) {
                                return;
                            }


                            empanada.src =
                                "img/empanada/empanada-quemada.png";


                            empanadaCocinando =
                                false;

                            empanadaLista =
                                false;

                            empanadaQuemada =
                                true;


                            btnCocinar.disabled =
                                true;

                            btnSacar.disabled =
                                false;

                            btnEntregar.disabled =
                                true;


                            mostrarMensaje(
                                "🔥 ¡Se quemó la empanada! Sácala y prepara otra."
                            );

                        },
                        4000
                    );

            },
            5000
        );
    }
);


// ================================
// SACAR EMPANADA
// ================================

btnSacar.addEventListener(
    "click",
    function () {

        if (nivelTerminado) {
            return;
        }


        // ================================
        // EMPANADA QUEMADA
        // ================================

        if (empanadaQuemada) {

            if (temporizadorQuemado) {

                clearTimeout(
                    temporizadorQuemado
                );

                temporizadorQuemado =
                    null;
            }


            empanada.style.display =
                "none";

            empanadaFinal.style.display =
                "none";


            empanadaCerrada =
                false;

            empanadaCocinando =
                false;

            empanadaLista =
                false;

            empanadaQuemada =
                false;

            rellenoSeleccionado =
                null;


            masa.style.display =
                "flex";


            btnCerrar.disabled =
                true;

            btnCocinar.disabled =
                true;

            btnSacar.disabled =
                true;

            btnEntregar.disabled =
                true;


            mostrarMensaje(
                "🔥 Empanada quemada retirada. Prepara una nueva."
            );

            return;
        }


        // ================================
        // EMPANADA TODAVÍA NO LISTA
        // ================================

        if (!empanadaLista) {

            mostrarMensaje(
                "La empanada todavía no está lista."
            );

            return;
        }


        // ================================
        // CANCELAR QUEMADO
        // ================================

        if (temporizadorQuemado) {

            clearTimeout(
                temporizadorQuemado
            );

            temporizadorQuemado =
                null;
        }


        empanada.style.display =
            "none";

        empanadaFinal.src =
            "img/empanada/empanada-dorada.png";

        empanadaFinal.style.display =
            "block";


        btnSacar.disabled =
            true;

        btnEntregar.disabled =
            false;


        mostrarMensaje(
            "¡Lista! El juego buscará automáticamente al cliente que pidió " +
            rellenoSeleccionado +
            "."
        );
    }
);


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
            clientesEnPantalla[posicion];

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
            clientesHTML[posicion];

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


        if (empanadaQuemada) {

            mostrarMensaje(
                "🔥 No puedes entregar una empanada quemada."
            );

            return;
        }


        if (!empanadaLista) {

            mostrarMensaje(
                "No tienes una empanada lista."
            );

            return;
        }


        const clienteEncontrado =
            buscarClientePorPedido(
                rellenoSeleccionado
            );

        if (!clienteEncontrado) {

            mostrarMensaje(
                "🤔 Ningún cliente está esperando una empanada de " +
                rellenoSeleccionado +
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
        // MARCAR CLIENTE ATENDIDO
        // ================================

        marcarClienteAtendido(
            posicionVisual
        );


        mostrarMensaje(
            "🎉 ¡Pedido entregado! El cliente dejó $100."
        );


        // ================================
        // REINICIAR EMPANADA
        // ================================

        reiniciarEmpanada();


        // ================================
        // REEMPLAZAR CLIENTE
        // ================================

        reemplazarClienteAtendido(
            posicionVisual,
            numeroCliente
        );


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
            i === numeroClienteAtendido
        ) {
            continue;
        }

        siguiente =
            i;

        break;
    }


    if (
        siguiente === -1
    ) {

        cliente.style.opacity =
            "0";

        clientesEnPantalla[
            posicionVisual
        ] = undefined;

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
            ] = false;


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

    if (!cliente || !mostrador) {
        return;
    }


    // ================================
    // EVITAR DUPLICAR DINERO
    // ================================

    if (
        dineroClientes[
            numeroCliente
        ] === true
    ) {

        return;
    }


    // ================================
    // CREAR EL BILLETE
    // ================================

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


    // ================================
    // POSICIÓN DEL BILLETE
    // ================================

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


    // ================================
    // LIMITES DEL MOSTRADOR
    // ================================

    const anchoBillete = 70;

    // ALTURA DEL BILLETE CORREGIDA
    const altoBillete = 50;


    const anchoMesa =
        mostrador.clientWidth;


    const altoMesa =
        mostrador.clientHeight;


    if (
        posicionX < 5
    ) {

        posicionX = 5;
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

        posicionY = 5;
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
        posicionX + "px";


    dineroHTML.style.top =
        posicionY + "px";


    dineroHTML.style.position =
        "absolute";


    dineroHTML.style.zIndex =
        "9999";


    dineroHTML.style.cursor =
        "pointer";


    dineroHTML.style.pointerEvents =
        "auto";


    // ================================
    // RECOGER DINERO
    // ================================

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


            dinero += 100;


            dineroHTML.remove();


            mostrarMensaje(
                "💰 ¡Recogiste $100!"
            );


            actualizarFinPorDinero();
        }
    );


    // ================================
    // AGREGAR DINERO
    // ================================

    mostrador.appendChild(
        dineroHTML
    );


    dineroClientes[
        numeroCliente
    ] = true;
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


    // ================================
    // TODAVÍA HAY DINERO
    // ================================

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


        clearTimeout(
            temporizadorQuemado
        );


        btnCarne.disabled =
            true;

        btnPollo.disabled =
            true;

        btnQueso.disabled =
            true;


        btnCerrar.disabled =
            true;

        btnCocinar.disabled =
            true;

        btnSacar.disabled =
            true;

        btnEntregar.disabled =
            true;


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
// REINICIAR EMPANADA
// ================================

function reiniciarEmpanada() {

    if (temporizadorQuemado) {

        clearTimeout(
            temporizadorQuemado
        );

        temporizadorQuemado =
            null;
    }


    rellenoSeleccionado =
        null;

    empanadaCerrada =
        false;

    empanadaCocinando =
        false;

    empanadaLista =
        false;

    empanadaQuemada =
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

    empanada.style.display =
        "none";

    empanadaFinal.style.display =
        "none";


    btnCerrar.disabled =
        true;

    btnCocinar.disabled =
        true;

    btnSacar.disabled =
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


    clearTimeout(
        temporizadorQuemado
    );


    btnCarne.disabled =
        true;

    btnPollo.disabled =
        true;

    btnQueso.disabled =
        true;


    btnCerrar.disabled =
        true;

    btnCocinar.disabled =
        true;

    btnSacar.disabled =
        true;

    btnEntregar.disabled =
        true;


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
            clientesEnPantalla[posicion];


        if (
            numeroCliente ===
            undefined
        ) {
            continue;
        }


        const cliente =
            clientesHTML[posicion];


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
        }

        else if (
            tiempoEsperando <
            tiempoEnojado
        ) {

            actualizarEstadoCliente(
                posicion,
                "😐"
            );
        }

        else if (
            tiempoEsperando <
            tiempoMuyEnojado
        ) {

            actualizarEstadoCliente(
                posicion,
                "😠"
            );
        }

        else if (
            tiempoEsperando <
            tiempoSeVa
        ) {

            actualizarEstadoCliente(
                posicion,
                "😡"
            );
        }

        else {

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
    ] = true;


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


    // ================================
    // NO QUEDAN CLIENTES
    // ================================

    if (
        siguienteVisible ===
        -1
    ) {

        cliente.style.opacity =
            "0";


        clientesEnPantalla[
            posicionVisual
        ] = undefined;


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
            ] = false;


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


            if (tiempo <= 0) {

                tiempo = 0;


                actualizarTiempo();


                clearInterval(
                    temporizador
                );


                clearTimeout(
                    temporizadorQuemado
                );


                btnCarne.disabled =
                    true;

                btnPollo.disabled =
                    true;

                btnQueso.disabled =
                    true;


                btnCerrar.disabled =
                    true;

                btnCocinar.disabled =
                    true;

                btnSacar.disabled =
                    true;

                btnEntregar.disabled =
                    true;


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
        pedidosCorrectos >= 6
    ) {

        return 3;
    }


    if (
        pedidosCorrectos >= 5
    ) {

        return 2;
    }


    if (
        pedidosCorrectos >= 4
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


    clearTimeout(
        temporizadorQuemado
    );


    const estrellas =
        calcularEstrellas();


    const nivelSuperado =
        pedidosCorrectos >=
        metaPedidos;


    // ================================
    // DESBLOQUEAR NIVEL 2
    // ================================

    if (nivelSuperado) {

        localStorage.setItem(
            "nivelDesbloqueado",
            "2"
        );

        localStorage.setItem(
            "nivel2Desbloqueado",
            "true"
        );
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

            <h1>🏆 NIVEL 1</h1>

            <div class="estrellas">

                ${"⭐".repeat(estrellas)}

                ${"☆".repeat(
                    3 - estrellas
                )}

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

                ${pedidosCorrectos}/6

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

                    ${
                        nivelSuperado
                            ? "SIGUIENTE NIVEL"
                            : "🔄 REINTENTAR"
                    }

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
    // BOTÓN DE ACCIÓN FINAL
    // ================================

    const btnAccionFinal =
        document.getElementById(
            "btn-accion-final"
        );


    btnAccionFinal.addEventListener(
        "click",
        function () {

            if (nivelSuperado) {

                window.location.href =
                    "nivel2.html";

            }

            else {

                window.location.reload();

            }

        }
    );


    // ================================
    // VOLVER AL MENÚ
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