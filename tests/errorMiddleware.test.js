import {
    describe,
    test,
    expect,
    vi
} from "vitest";

import errorMiddleware from "../middleware/errorMiddleware.js";

describe("Error Middleware", () => {

    test("should return 500 for unexpected error", () => {

        const error = new Error(
            "Something went wrong"
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
            .toHaveBeenCalledWith(500);

        expect(res.json)
            .toHaveBeenCalledWith({
                success: false,
                message: "Something went wrong"
            });
    });
});