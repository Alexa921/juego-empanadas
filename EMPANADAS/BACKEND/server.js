const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const partidasRoutes = require("./routes/partidas");

const app = express();

// ==============================
// MIDDLEWARES
// ==============================

app.use(cors());
app.use(express.json());


// ==============================
// RUTAS
// ==============================

app.use("/api/auth", authRoutes);
app.use("/api/partidas", partidasRoutes);

// ==============================
// RUTA DE PRUEBA
// ==============================

app.get("/", (req, res) => {
    res.json({
        mensaje: "Servidor del juego de empanadas funcionando"
    });
});


// ==============================
// CONEXIÓN A MONGODB
// ==============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB conectado correctamente");

        app.listen(process.env.PORT, () => {
            console.log(
                `🚀 Servidor funcionando en http://localhost:${process.env.PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("❌ Error al conectar con MongoDB:");
        console.error(error.message);
    });