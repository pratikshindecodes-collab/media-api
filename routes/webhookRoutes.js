import express from "express";
import { receiveWebhook } from "../controllers/webhookController.js";
import verifyWebhookSignature from "../middleware/verifyWebhookSignature.js";


const router = express.Router();

router.post(
    "/",
    express.raw({
        type: "application/json",
        limit: "100kb"
    }),
    verifyWebhookSignature,
    receiveWebhook
);

export default router;

