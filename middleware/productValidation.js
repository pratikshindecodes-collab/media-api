const productValidation = (req, res, next) => {

    const { name, price } = req.body;

    // Name validation
    if (!name || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Product name is required"
        });
    }

    // Price validation
    if (price === undefined || price === "") {
        return res.status(400).json({
            success: false,
            message: "Product price is required"
        });
    }

    // Convert price to number
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
        return res.status(400).json({
            success: false,
            message: "Product price must be a number"
        });
    }

    // Positive price
    if (numericPrice <= 0) {
        return res.status(400).json({
            success: false,
            message: "Product price must be greater than 0"
        });
    }

    next();
}


export default productValidation;
