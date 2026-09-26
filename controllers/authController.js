import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import env from "../config/env.js";



export const registerUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Check required fields
        if (
            !name ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });
        }


        // Check existing user
        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });


        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// LOGIN USER
export const loginUser = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 
                    "Email and password are required"
            });
        }

        // Find user
        const user = 
            await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = 
            await bcrypt.compare(
                password,
                user.password
            )

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Access token
        const accessToken = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },

            env.jwtSecret,

            {
                expiresIn: "15m"
            }
        );

        // Refresh token
        const refreshToken = jwt.sign(
            {
                userId: user._id.toString(),
                jti: randomUUID()
            },

            env.jwtSecret,

            {
                expiresIn: "7d"
            }
        );

        await RefreshToken.create({
            token: refreshToken,
            user: user._id,
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        });

        // Login successful
        res.json({
            success: true,
            message: "Login successful",

            accessToken,
            refreshToken,
            
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const refreshAccessToken = async (req, res) => {
    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token required"
            });
        }

        // Check token in database
        const storedToken = 
            await RefreshToken.findOne({
                token: refreshToken
            });

        if (!storedToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        // Check expiry
        if (storedToken.expiresAt < new Date()) {

            await RefreshToken.deleteOne({
                _id: storedToken._id
            });

            return res.status(401).json({
                success: false,
                message: "Refresh token expired"
            });
        }

        // Verify JWT
        const decoded = 
            jwt.verify(
                refreshToken,
                env.jwtSecret
            );

        // Find user
        const user = 
            await User.findById(
                decoded.userId
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate new access token
        const accessToken = 
            jwt.sign(
                {
                    userId: user._id.toString(),
                    role: user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "15m"
                }
            );

        // Generate new refresh token
        const newRefreshToken = 
            jwt.sign(
                {
                    userId: user._id.toString(),
                    jti: randomUUID()
                },

                env.jwtSecret,

                {
                    expiresIn: "7d"
                }
            );

        await RefreshToken.deleteOne({
            _id: storedToken._id
        });

        // Save new refresh token
        await RefreshToken.create({
            token: newRefreshToken,
            user: user._id,
            expiresAt: new Date(
                Date.now() + 
                7 * 24 * 60 * 60 * 1000
            )
        });



        res.json({
            success: true,
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {

        console.error(
            "REFRESH TOKEN ERROR:",
            error.name,
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid refresh token"
        });
    }
}


export const logoutUser = async (req, res) => {
    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token required"
            });
        }

        await RefreshToken.deleteOne({
            token: refreshToken
        });

        res.json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


