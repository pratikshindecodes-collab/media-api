const productValidation = (req, res, next) => {
    const name =
        typeof req.body.name === "string"
            ? req.body.name.trim()
            : "";

    const price =
        req.body.price !== undefined
            ? Number(req.body.price)
            : NaN;

    // Name validation
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Product name is required"
        });
    }
    if (name.length < 2) {
        return res.status(400).json({
            success: false,
            message: "Product name must be at least 2 characters"
        });        
    } 

    if (name.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Product name must not exceed 100 characters"
        });
    }

    // Price validation
    if (req.body.price === undefined) {
        return res.status(400).json({
            success: false,
            message: "Product price is required"
        });
    } 

    if (!Number.isFinite(price)) {
        return res.status(400).json({
            success: false,
            message: "Product price must be a number"
        })
    }

    if (price <= 0) {
        return res.status(400).json({
            success: false,
            message: "Product price must be greater than 0"
        });
    }

    // Reject unexpected fields
    const allowedFields = [
        "name",
        "price"
    ];

    for (const field of Object.keys(req.body)) {
        if (!allowedFields.includes(field)) {
            return res.status(400).json({
                success: false,
                message: "Unexpected field"
            });
        }
    }

    // Use sanitized values from this point onward
    req.body.name = name;
    req.body.price = price;

    next();
};

export default productValidation;