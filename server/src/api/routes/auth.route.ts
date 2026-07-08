import { Router } from "express";
import { registerUser, loginUser, me } from "../controllers/auth.controller";
import authMiddleware from "../middleware/authMiddleware";

const authRoute = Router();

authRoute.get("/me", authMiddleware, me);
authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);

export default authRoute;