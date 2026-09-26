const notFoundMiddleware = (req, res) => {
    const requestUrl = 
        req.orginalUrl || req.url;

    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${requestUrl}`
    });
};

export default notFoundMiddleware;