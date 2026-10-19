const productUpdateValidation = (
    req,
    res, 
    next
) => {
    const errors = [];

    const allowedFields = [
        "name",
        "price"
    ];

    // Reject unexpected fields
    for (const field of Object.keys(req.body)) {
        if (!allowedFields.includes(field)) {
            errors.push({
                field,
                message: "Unexpected field"
            });
        }
    }

    // At least one field must be provided
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required"
        });
    }

    // Name validation - only if provided
    if (req.body.name !== undefined) {
        const name = 
            typeof req.body.name === "string"
                ? req.body.name.trim()
                : "";

        if (!name) {
            errors.push({
                field: "name",
                message: 
                    "Product name cannot be empty"
            });
        } else if (name.length < 2) {
            errors.push({
                field: "name",
                message: 
                    "Product name must be at least 2 characters"
            });
        } else if (name.length > 100) {
            errors.push({
                field: "name",
                message: 
                    "Product name must not exceed 100 characters"
            });
        } else {
            req.body.name = name;
        }
    }

    // Price validation - only if provided
    if (req.body.price !== undefined) {
        const price = Number(req.body.price);

        if (!Number.isFinite(price)) {
            errors.push({
                field: "price",
                message:
                    "Price must be a valid number"
            });
        } else if (price < 0) {
            errors.push({
                field: "Price",
                message: 
                    "Price cannot be negative"
            });
        } else {
            req.body.price = price;
        }
    } 

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    next();

};

export default productUpdateValidation;

