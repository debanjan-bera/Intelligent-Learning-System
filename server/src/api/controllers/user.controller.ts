import type { Request, Response } from "express";
import UserService from "@/service/user.service";
import QuizHistoryService from "@/service/quizHistory.service";

export const getStudents = async (req: Request, res: Response) => {
    try {
        console.log("GET /api/users/students called");
        const students = await UserService.getAllStudents();
        console.log(`Successfully fetched ${students.length} students`);
        res.status(200).json({
            message: "Students fetched successfully",
            success: true,
            data: students
        });
    } catch (error: any) {
        console.error("Error fetching students:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const user = await UserService.getUserById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        res.status(200).json({
            message: "User fetched successfully",
            success: true,
            data: user
        });
    } catch (error: any) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
};

export const getStudentHistory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const history = await QuizHistoryService.getUserQuizHistory(id);
        res.status(200).json({
            message: "Student history fetched successfully",
            success: true,
            data: history
        });
    } catch (error: any) {
        console.error("Error fetching student history:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
};
