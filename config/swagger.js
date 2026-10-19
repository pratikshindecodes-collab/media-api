
import swaggerJsdoc from "swagger-jsdoc";
import env from "./env.js";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Media API",
            version: "1.0.0",
            description: "API documentation for the Media API project"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local development server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
