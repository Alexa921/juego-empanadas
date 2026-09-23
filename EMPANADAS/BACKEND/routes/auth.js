const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/Usuario");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==============================
// REGISTRO
// ==============================
router.post("/registro", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificar que se hayan enviado los datos
        if (!username || !password) {
            return res.status(400).json({
                mensaje: "El usuario y la contraseña son obligatorios"
            });
        }

        // Limpiar espacios del usuario
        const usernameLimpio = username.trim();

        // Verificar longitud mínima
        if (usernameLimpio.length < 3) {
            return res.status(400).json({
                mensaje: "El usuario debe tener mínimo 3 caracteres"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener mínimo 6 caracteres"
            });
        }

        // Comprobar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({
            username: usernameLimpio
        });

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: "Ese usuario ya existe"
            });
        }

        // Encriptar la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario
        const nuevoUsuario = new Usuario({
            username: usernameLimpio,
            passwordHash: passwordHash,
            nivelDesbloqueado: 1
        });

        await nuevoUsuario.save();

        res.status(201).json({
            mensaje: "Usuario registrado correctamente"
        });

    } catch (error) {
        console.error("Error en registro:", error);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
});


// ==============================
// INICIO DE SESIÓN
// ==============================
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificar que se hayan enviado los datos
        if (!username || !password) {
            return res.status(400).json({
                mensaje: "El usuario y la contraseña son obligatorios"
            });
        }

        // Buscar usuario
        const usuario = await Usuario.findOne({
            username: username.trim()
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos"
            });
        }

        // Comparar contraseña
        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.passwordHash
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos"
            });
        }

        // Crear token
        const token = jwt.sign(
            {
                usuarioId: usuario._id,
                username: usuario.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            mensaje: "Inicio de sesión correcto",
            token: token,
            usuario: {
                id: usuario._id,
                username: usuario.username,
                nivelDesbloqueado: usuario.nivelDesbloqueado
            }
        });

    } catch (error) {
        console.error("Error en login:", error);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
});

// ========================================
// OBTENER USUARIO ACTUAL
// ========================================

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.usuarioId)
            .select("_id username nivelDesbloqueado");

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.json({
            usuario: {
                id: usuario._id,
                username: usuario.username,
                nivelDesbloqueado: usuario.nivelDesbloqueado
            }
        });

    } catch (error) {
        console.error("Error al obtener usuario:", error);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
});

module.exports = router;