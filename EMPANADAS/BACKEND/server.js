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

// Configuración explicita de CORS para permitir peticiones desde Netlify y desarrollo local
const allowedOrigins = [
  "https://juego-empanadas.netlify.app", 
  "http://localhost:5173",          // Para desarrollo local con Vite
  "http://localhost:3000"           // Para desarrollo local con Node/React
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite solicitudes sin 'origin' (como Postman o peticiones del mismo servidor)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Bloqueado por política de CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

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

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(
                `🚀 Servidor funcionando en el puerto ${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("❌ Error al conectar con MongoDB:");
        console.error(error.message);
    });