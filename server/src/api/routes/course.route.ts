import { Router } from "express";
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from "../controllers/course.controller";
import adminAuth from "../middleware/adminAuth";
import authMiddleware from "../middleware/authMiddleware";



const courseRoute = Router();

courseRoute.post("/", authMiddleware, adminAuth, createCourse);
courseRoute.get("/", getAllCourses);
courseRoute.get("/:courseId", getCourseById);
courseRoute.put("/:courseId", authMiddleware, adminAuth, updateCourse);
courseRoute.delete("/:courseId", authMiddleware, adminAuth, deleteCourse);

export default courseRoute;