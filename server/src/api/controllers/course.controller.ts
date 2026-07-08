import courseService from "@/service/course.service";
import type { Request, Response } from "express";

export const createCourse = async (req: Request, res: Response) => {
    try {
        const { title, description, difficulty } = req.body;
        const newCourse = await courseService.createCourse({ title, description, difficulty });

        res.status(201).json({
            message: "Course created successfully",
            success: true,
            data: newCourse,
        });
    } catch (error) {
        console.error("Error creating course:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
}

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const courses = await courseService.getAllCourses();
        res.status(200).json({
            message: "Courses fetched successfully",
            success: true,
            data: courses,
        });
    } catch (error) {
        console.error("Error fetching courses:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
}

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const course = await courseService.getCourseById(courseId);
        res.status(200).json({
            message: "Course fetched successfully",
            success: true,
            data: course,
        });
    } catch (error) {
        console.error("Error fetching course:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
}

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const { title, description, difficulty } = req.body;
        const updatedCourse = await courseService.updateCourse(courseId, { title, description, difficulty });
        res.status(200).json({
            message: "Course updated successfully",
            success: true,
            data: updatedCourse,
        });
    }
    catch (error) {
        console.error("Error updating course:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
}

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const deletedCourse = await courseService.deleteCourse(courseId);
        res.status(200).json({
            message: "Course deleted successfully",
            success: true,
            data: deletedCourse,
        });
    }
    catch (error) {
        console.error("Error deleting course:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }

}