import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import app from "./app.js";
import env from "./config/env.js"


connectDB();
connectRedis();


app.listen(
    env.port,
    "0.0.0.0",
    () => {
        console.log(
            `Server is running on port ${env.port}`
        );
    }
);



