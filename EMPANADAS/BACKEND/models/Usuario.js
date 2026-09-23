const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3
        },

        passwordHash: {
            type: String,
            required: true
        },

        nivelDesbloqueado: {
            type: Number,
            default: 1,
            min: 1,
            max: 6
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Usuario", usuarioSchema);