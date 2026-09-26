import { expect } from "vitest";
import errorMiddleware from "../middleware/errorMiddleware.js";
import AppError from "../utils/AppError.js"

test("should use custom error status code", () => {

    const error = 
        new AppError(
            "Product not found",
            404
        );

    const req = {};

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
    };

    const next = vi.fn();

    errorMiddleware(
        error,
        req,
        res,
        next
    );

    expect(res.status)
        .toHaveBeenCalledWith({
            success: false,
            message: "Product not found"
        });
});


