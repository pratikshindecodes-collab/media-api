import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    getCurrentUser
} from "../controllers/userController.js";

const router = express.Router();

// Current logged-in user
router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);


// Admin-only route
router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin"
        });
    }
);


export default router;

