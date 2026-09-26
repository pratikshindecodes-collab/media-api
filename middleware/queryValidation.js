const queryValidation = (req, res, next) => {

    const {
        minPrice,
        maxPrice,
        page,
        limit,
        sort
    } = req.query;


    // Validation minPrice
    if (
        minPrice !== undefined &&
        (Number.isNaN(Number(minPrice)) || Number(minPrice) < 0)
    ) {
        return res.status(400).json({
            success: false,
            message: "minPrice must be a valid positive number"
        });
    }

    // Validate maxPrice
    if (
        maxPrice !== undefined &&
        (Number.isNaN(Number(maxPrice)) || 
            Number(maxPrice) < 0)
    ) {
        return res.status(400).json({
            success: false,
            message: "maxPrice must be a valid positive number"
        });
    }


    // Validate price range
    if (
        minPrice !== undefined &&
        maxPrice !== undefined &&
        Number(minPrice) > Number(maxPrice)
    ) {
        return res.status(400).json({
            success: false,
            message: "page must be a positive integer"
        });
    }

    // Validate limit
    if (
        limit !== undefined &&
        (!Number.isInteger(Number(limit)) ||
            Number(limit) < 1 ||
            Number(limit) > 100)
    ) {
        return res.status(400).json({
            success: false,
            message: "limit must be between 1 and 100"
        });
    }


    // Validate sort
    const allowedSorts = [
        "price_asc",
        "price_desc",
        "newest",
        "oldest"
    ];

    if (
        sort !== undefined &&
        !allowedSorts.includes(sort)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid sort option"
        });
    }

    next();
};

export default queryValidation;

