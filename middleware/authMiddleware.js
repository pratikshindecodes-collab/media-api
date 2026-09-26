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
        if (!authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        // Extract token
        const token = 
            authHeader.split(" ")[1];

        // Verify token
        const decoded = 
            jwt.verify(
                token,
                env.jwtSecret
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
