const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Obtener el token del encabezado Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                mensaje: "No estás autenticado"
            });
        }

        // El formato esperado es:
        // Authorization: Bearer TOKEN
        const partes = authHeader.split(" ");

        if (partes.length !== 2 || partes[0] !== "Bearer") {
            return res.status(401).json({
                mensaje: "Formato de token inválido"
            });
        }

        const token = partes[1];

        // Verificar el token
        const datosUsuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Guardar los datos del usuario en la petición
        req.usuario = datosUsuario;

        // Continuar con la ruta
        next();

    } catch (error) {
        console.error("Error de autenticación:", error.message);

        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });
    }
};

module.exports = authMiddleware;