
import ProcessedWebhookEvent from "../models/ProcessedWebhookEvent.js";
import webhookQueue from "../jobs/queues/webhookQueue.js";

export const receiveWebhook = async (req, res) => {
    if (!Buffer.isBuffer(req.body)) {
        return res.status(400).json({
            success: false,
            message: "Expected raw request body"
        });
    }

    let event;

    try {
        event = JSON.parse(req.body.toString("utf8"));
    } catch {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON payload"
        });
    }

    if (
        typeof event.id !== "string" ||
        !event.id ||
        typeof event.type !== "string" ||
        !event.type
    ) {
        return res.status(400).json({
            success: false,
            message: "Valid event id and type are required"
        });
    }

    let eventRecord;

    try {
        eventRecord = await ProcessedWebhookEvent.create({
            eventId: event.id,
            eventType: event.type
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({
                success: true,
                message: "Duplicate event ignored",
                eventId: event.id
            });
        }

        console.error("Could not save webhook event:", error.message);

        return res.status(500).json({
            success: false,
            message: "Could not save webhook event"
        });
    }

    try {
        await webhookQueue.add(
            "process-webhook",
            {
                eventId: event.id,
                eventType: event.type,
                data: event.data ?? {}
            },
            {
                jobId: `webhook-${event.id}`
            }
        );

        console.log("Webhook job queued:", event.id);

        return res.status(200).json({
            success: true,
            message: "Webhook queued successfully",
            eventId: event.id
        });
    } catch (error) {
        console.error("Could not enqueue webhook:", error.message);

        // Remove the claim so the provider can retry this event.
        try {
            await ProcessedWebhookEvent.deleteOne({
                _id: eventRecord._id
            });
        } catch (cleanupError) {
            console.error(
                "Could not release webhook event claim:",
                cleanupError.message
            );
        }

        return res.status(500).json({
            success: false,
            message: "Could not queue webhook for processing"
        });
    }
};
