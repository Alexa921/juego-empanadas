const express = require("express");

const Partida = require("../models/Partida");
const Usuario = require("../models/Usuario");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// METAS DE CLIENTES POR NIVEL
// ========================================

const metasPorNivel = {
    1: 4,
    2: 6,
    3: 7,
    4: 10,
    5: 12,
    6: 0
};


// ========================================
// GUARDAR PARTIDA
// ========================================

router.post("/", authMiddleware, async (req, res) => {

    try {

        let {
            nivel,
            clientesAtendidos,
            estrellas,
            puntuacion
        } = req.body;


        // ========================================
        // VERIFICAR DATOS
        // ========================================

        if (
            nivel === undefined ||
            clientesAtendidos === undefined ||
            estrellas === undefined ||
            puntuacion === undefined
        ) {

            return res.status(400).json({
                mensaje: "Faltan datos de la partida"
            });

        }


        // ========================================
        // CONVERTIR A NÚMEROS
        // ========================================

        nivel = Number(nivel);
        clientesAtendidos = Number(clientesAtendidos);
        estrellas = Number(estrellas);
        puntuacion = Number(puntuacion);


        // ========================================
        // VALIDAR NIVEL
        // ========================================

        if (
            !Number.isInteger(nivel) ||
            nivel < 1 ||
            nivel > 6
        ) {

            return res.status(400).json({
                mensaje: "El nivel no es válido (debe ser entre 1 y 6)"
            });

        }


        // ========================================
        // VALIDAR CLIENTES
        // ========================================

        if (
            !Number.isInteger(clientesAtendidos) ||
            clientesAtendidos < 0
        ) {

            return res.status(400).json({
                mensaje: "La cantidad de clientes no es válida"
            });

        }


        // ========================================
        // VALIDAR ESTRELLAS
        // ========================================

        if (
            !Number.isInteger(estrellas) ||
            estrellas < 0 ||
            estrellas > 3
        ) {

            return res.status(400).json({
                mensaje: "La cantidad de estrellas no es válida"
            });

        }


        // ========================================
        // VALIDAR PUNTUACIÓN
        // ========================================

        if (
            typeof puntuacion !== "number" ||
            !Number.isFinite(puntuacion) ||
            puntuacion < 0
        ) {

            return res.status(400).json({
                mensaje: "La puntuación no es válida"
            });

        }


        // ========================================
        // BUSCAR USUARIO
        // ========================================

        const usuario = await Usuario.findById(
            req.usuario.usuarioId
        );


        if (!usuario) {

            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });

        }


        // ========================================
        // DETERMINAR SI SUPERÓ EL NIVEL
        // ========================================

        let superado = false;


        if (metasPorNivel[nivel] !== undefined) {

            // Nivel 6 todavía no tiene una meta
            // definida en este backend.

            if (nivel === 6) {

                superado = estrellas > 0;

            } else {

                superado =
                    clientesAtendidos >= metasPorNivel[nivel];

            }

        }


        // ========================================
        // CREAR PARTIDA
        // ========================================

        const nuevaPartida = new Partida({

            usuarioId: usuario._id,

            nivel: nivel,

            clientesAtendidos:
                clientesAtendidos,

            estrellas:
                estrellas,

            puntuacion:
                puntuacion,

            superado:
                superado

        });


        await nuevaPartida.save();


        // ========================================
        // DESBLOQUEAR SIGUIENTE NIVEL
        // ========================================

        if (
            superado === true &&
            nivel < 6 &&
            nivel >= usuario.nivelDesbloqueado
        ) {

            usuario.nivelDesbloqueado =
                nivel + 1;

            await usuario.save();

        }


        // ========================================
        // RESPUESTA
        // ========================================

        res.status(201).json({

            mensaje:
                "Partida guardada correctamente",

            partida: {

                id:
                    nuevaPartida._id,

                nivel:
                    nuevaPartida.nivel,

                clientesAtendidos:
                    nuevaPartida.clientesAtendidos,

                estrellas:
                    nuevaPartida.estrellas,

                puntuacion:
                    nuevaPartida.puntuacion,

                superado:
                    nuevaPartida.superado,

                fecha:
                    nuevaPartida.fecha

            },

            usuario: {

                username:
                    usuario.username,

                nivelDesbloqueado:
                    usuario.nivelDesbloqueado

            }

        });


    } catch (error) {

        console.error(
            "Error al guardar partida:",
            error
        );

        res.status(500).json({

            mensaje:
                "Error interno del servidor"

        });

    }

});


module.exports = router;