const loggerMiddleware = (req, res, next) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const end = process.hrtime.bigint();

        const durationMs = 
            Number(end - start) /1_000_000;

        console.log(JSON.stringify({
            event: "http_request",
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            durationMs: Number(durationMs.toFixed(2))
        })
            
        );
    });

    next();
};

export default loggerMiddleware;

