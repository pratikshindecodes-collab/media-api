import User from "../models/User.js";

export const getCurrentUser = async (req, res) => {
    try {

        const user = 
            await User.findById(
                req.user.userId
            ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

