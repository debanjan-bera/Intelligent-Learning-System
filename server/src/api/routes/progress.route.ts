import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getCourseWiseProgress, getOverallUserProgress, getProgressByCourse, getWeeklyPerformance, getYearlyStreak, getPlatformStats } from "../controllers/progress.controller";

import { checkRole } from "../middleware/roleMiddleware";

const progressRoute = Router();

progressRoute.get("/courses", authMiddleware, getCourseWiseProgress);
progressRoute.get("/course/:courseId", authMiddleware, getProgressByCourse);
progressRoute.get("/overall", authMiddleware, getOverallUserProgress);
progressRoute.get("/weekly", authMiddleware, getWeeklyPerformance);
progressRoute.get("/yearly-streak", authMiddleware, getYearlyStreak);
progressRoute.get("/admin/stats", authMiddleware, checkRole(["admin"]), getPlatformStats);

export default progressRoute;