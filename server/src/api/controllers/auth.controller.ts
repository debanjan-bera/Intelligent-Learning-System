import AuthService from "@/service/auth.service";
import type { Request, Response } from "express";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const me = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        res.status(200).json({
            message: "User details retrieved successfully",
            success: true,
            user: user
        });
    } catch (error) {
        console.error("Error retrieving user details:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
};



export const registerUser = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const { user, accessToken } = await AuthService.register({ email, name, password, role: "student" });
        res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            auth: {
                access_token: accessToken,
            }
        });
    }
    catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }
    try {
        const { user, accessToken } = await AuthService.login({ email, password });
        res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            auth: {
                access_token: accessToken,
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json({
            message: error?.message || "Internal server error",
            success: false,
        });
    }
};