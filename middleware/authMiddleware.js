import jwt from "jsonwebtoken";
import env from "../config/env.js";

const authMiddleware = (req, res, next) => {
    try {

        const authHeader = 
            req.headers.authorization;

        // Check Authrization header
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
        }

        // Check Bearer format
        const [scheme, token, ...extra] = authHeader.split(" ");

        if (
            scheme !== "Bearer" ||
            !token ||
            extra.length > 0
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        // Verify token
        const decoded = 
            jwt.verify(
                token,
                env.jwtSecret,
                {
                    algorithms: ["HS256"]
                }
            );

        // Attach user information
        req.user = decoded;

        // Continue request
        next();
    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;
