import ProgressService from "@/service/progress.service";
import { Request, Response } from "express";

export const getCourseWiseProgress = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const progress = await ProgressService.getCourseWiseProgress(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Course-wise progress fetched successfully",
      data: progress
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      success: false,
      message: "Failed to fetch course-wise progress",
      error: errorMessage
    });
  }
};

export const getProgressByCourse = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { courseId } = req.params as { courseId: string };

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required"
      });
    }

    const progress = await ProgressService.getProgress(req.user.userId, courseId);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress found for this course"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course progress fetched successfully",
      data: progress
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      success: false,
      message: "Failed to fetch course progress",
      error: errorMessage
    });
  }
};

export const getOverallUserProgress = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const overallProgress = await ProgressService.getUserOverallProgress(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Overall user progress fetched successfully",
      data: overallProgress
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      success: false,
      message: "Failed to fetch overall user progress",
      error: errorMessage
    });
  }
};

export const getWeeklyPerformance = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const weeklyPerformance = await ProgressService.getWeeklyPerformance(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Weekly performance fetched successfully",
      data: weeklyPerformance
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      success: false,
      message: "Failed to fetch weekly performance",
      error: errorMessage
    });
  }
};

export const getYearlyStreak = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const yearlyStreak = await ProgressService.getYearlyStreak(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Yearly streak fetched successfully",
      data: yearlyStreak
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      success: false,
      message: "Failed to fetch yearly streak",
      error: errorMessage
    });
  }
};

export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized or insufficient permissions"
      });
    }

    const stats = await ProgressService.getPlatformStats();

    res.status(200).json({
      success: true,
      message: "Platform statistics fetched successfully",
      data: stats
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      success: false,
      message: "Failed to fetch platform statistics",
      error: errorMessage
    });
  }
};

