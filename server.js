import connectDB from "./config/db.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import app from "./app.js";
import env from "./config/env.js";
import mongoose from "mongoose";

let server;
let isShuttingDown = false;

const startServer = async () => {
    try {
        await connectDB();
        await connectRedis();

        server = app.listen(
            env.port,
            "0.0.0.0",
            () => {
                console.log(
                    `Server is running on port ${env.port}`
                );
            }
        );
    } catch (error) {
        console.error("Server startup failed:", error.message);
        await cleanup();
        process.exitCode = 1;
    }
};


const cleanup = async () => {
    const results = await Promise.allSettled([
        disconnectRedis(),
        mongoose.disconnect()
    ]);

    for (const result of results) {
        if (result.status === "rejected") {
            console.error(
                "Cleanup failed:", 
                result.reason?.message
            );
        }
    }
};


const shutdown = (signal) => {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;

    console.log(`${signal} received. Starting graceful shutdown...`);

    const forceExitTimer = setTimeout(() => {
        console.error("Graceful shutdown timed out.");
        process.exit(1);
    }, 10000);

    forceExitTimer.unref();

    const closeServer = server 
        ? new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        })
        : Promise.resolve();

    closeServer
        .then(cleanup)
        .then(() => {
            console.log("Graceful shutdown complete.");
            process.exitCode = 0;
        })
        .catch(async (error) => {
            console.error("Shutdown failed:", error.message);
            process.exitCode = 1;
            await cleanup();
        })
        .finally(() => {
            clearTimeout(forceExitTimer);
        });
};


process.on("SIGINT", () => shutdown("SIGNIT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

await startServer();
