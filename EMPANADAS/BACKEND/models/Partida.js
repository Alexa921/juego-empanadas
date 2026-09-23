const mongoose = require("mongoose");

const partidaSchema = new mongoose.Schema(
    {
        usuarioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },

        nivel: {
            type: Number,
            required: true,
            min: 1,
            max: 6
        },

        clientesAtendidos: {
            type: Number,
            required: true,
            min: 0
        },

        estrellas: {
            type: Number,
            required: true,
            min: 0,
            max: 3
        },

        puntuacion: {
            type: Number,
            required: true,
            min: 0
        },

        superado: {
            type: Boolean,
            required: true
        },

        fecha: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model("Partida", partidaSchema);