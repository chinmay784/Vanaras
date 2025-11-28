
const jwt = require("jsonwebtoken");

exports.authMiddelWere = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader ) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: No or invalid token provided",
            });
        }

        const token = authHeader
        const verified = jwt.verify(token.replace("Bearer ", ""), "Vanaras");

        req.user = verified; // attach decoded user info
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
