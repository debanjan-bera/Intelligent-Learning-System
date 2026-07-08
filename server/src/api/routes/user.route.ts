import { Router } from "express";
import { getStudents, getUserById, getStudentHistory } from "../controllers/user.controller";
import authMiddleware from "../middleware/authMiddleware";
import { checkRole } from "../middleware/roleMiddleware";

const userRoute = Router();

// Only admins can see student list or specific user details
userRoute.get("/students", authMiddleware, checkRole(["admin"]), getStudents);
userRoute.get("/:id", authMiddleware, checkRole(["admin"]), getUserById);
userRoute.get("/:id/history", authMiddleware, checkRole(["admin"]), getStudentHistory);

export default userRoute;
