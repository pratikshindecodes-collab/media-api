import env from "../config/env.js";

const errorMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = 
        Number.isInteger(err.statusCode) && 
        err.statusCode >= 400 &&
        err.statusCode <= 599 
            ? err.statusCode
            : 500;

    const message =
        statusCode === 500 && env.nodeEnv === "production"
            ? "Internal server error"
            : err.message || "Something went wrong";

    // Log the actual error on the server.
    console.error({
        message: err.message,
        statusCode,
        method: req.method,
        path: req.originalUrl
    });

    return res.status(statusCode).json({
        success: false,
        message
    });
};

export default errorMiddleware;

