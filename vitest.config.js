import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        fileParallelism: false,

        coverage: {
            provider: "v8",
            reporter: [
                "text",
                "html"
            ],
            exclude: [
                "node_modules/",
                "tests/",
                "uploads/",
                "server.js",
                "vitest.config.js"
            ]
        }
    }
});

