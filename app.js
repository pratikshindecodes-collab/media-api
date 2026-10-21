import express from "express";
import env from "./config/env.js"
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import rateLimitMiddleware from "./middleware/rateLimitMiddleware.js";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import redisClient from "./config/redis.js";


const app = express();
app.use("/webhooks", webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(helmet());

app.use(rateLimitMiddleware);

app.use(
    cors({
        origin: env.frontendUrl,
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

app.use(loggerMiddleware);




app.use(
    "/uploads",
    express.static("uploads")
);

app.use(
    "/api/v1/auth",
    authRoutes
);

app.use(
    "/api/v1/users",
    userRoutes
);

app.use(
    "/api/v1/products",
    productRoutes
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Media API is running"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy"
    });
});

app.get("/health/ready", (req, res) => {
    const mongoReady = 
        mongoose.connection.readyState === 1;

    const redisReady = 
        redisClient.isReady;

    const ready = mongoReady && redisReady;

    res.status(ready ? 200 : 503).json({
        success: ready,
        status: ready ? "ready" : "not ready",
        dependencies: {
            mongodb: mongoReady ? "connected" : "unavailable",
            redis: redisReady ? "connected" : "unavailable"
        }
    });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;