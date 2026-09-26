import express from "express";
import env from "./config/env.js"
import helmet from "helmet";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import rateLimitMiddleware from "./middleware/rateLimitMiddleware.js";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(helmet());

app.use(rateLimitMiddleware);

app.use(
    cors({
        origin: env.frontendUrl
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

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;