import dotenv from "dotenv";


dotenv.config();

const requiredEnvVariables = [
    "MONGO_URI",
    "JWT_SECRET",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "REDIS_URL"
];

for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
        throw new Error(
            `Missing required environment variable: ${variable}`
        );
    }
}

const env = {
    port: process.env.PORT || 3000,

    mongoUri: process.env.MONGO_URI,

    mongoTestUri: 
        process.env.MONGO_TEST_URI,

    jwtSecret:
        process.env.JWT_SECRET,

    nodeEnv:
        process.env.NODE_ENV || "development",

    frontendUrl:
        process.env.FRONTEND_URL,

    cloudinary: {
        cloudName:
            process.env.CLOUDINARY_CLOUD_NAME,

        apiKey:
            process.env.CLOUDINARY_API_KEY,
        
        apiSecret:
            process.env.CLOUDINARY_API_SECRET
    },

    redisUrl:
        process.env.REDIS_URL
}; 

export default env;

