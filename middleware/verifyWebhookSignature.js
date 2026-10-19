
import { createHmac, timingSafeEqual } from "node:crypto";

const verifyWebhookSignature = (req, res, next) => {
    const secret = process.env.WEBHOOK_SECRET;
    const signature = req.headers["x-webhook-signature"];

    if (!secret) {
        console.error("WEBHOOK_SECRET is not configured");
        return res.status(500).json({
            success: false,
            message: "Webhook configuration error"
        });
    }

    if (!Buffer.isBuffer(req.body)) {
        console.error("Webhook body is not a Buffer");
        return res.status(400).json({
            success: false,
            message: "Expected raw request body"
        });
    }

    if (typeof signature !== "string") {
        return res.status(401).json({
            success: false,
            message: "Webhook signature missing"
        });
    }

    const match = /^sha256=([a-f0-9]{64})$/i.exec(signature);

    if (!match) {
        return res.status(401).json({
            success: false,
            message: "Invalid webhook signature"
        });
    }

    const expectedSignature = createHmac("sha256", secret)
        .update(req.body)
        .digest();

    const receivedSignature = Buffer.from(match[1], "hex");

    if (!timingSafeEqual(expectedSignature, receivedSignature)) {
        console.error("Webhook signature mismatch");
        return res.status(401).json({
            success: false,
            message: "Invalid webhook signature"
        });
    }

    console.log("Webhook signature verified");
    next();
};

export default verifyWebhookSignature;
