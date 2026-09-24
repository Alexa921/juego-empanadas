const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const partidasRoutes = require("./routes/partidas");

const app = express();

// ==============================
// MIDDLEWARES DE CORS
// ==============================

// Lista de orígenes permitidos
const allowedOrigins = [
  "https://juego-empanadas.netlify.app",
  "http://juego-empanadas.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite solicitudes sin origin (como herramientas de prueba o llamadas directas)
    // o si el origen está explícitamente en la lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Si por alguna razón la URL en Netlify varía ligeramente, no bloquearás el backend
      callback(null, true);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true
};

// Habilitar peticiones preflight para todas las rutas
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

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