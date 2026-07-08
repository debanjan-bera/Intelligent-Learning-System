import { Router } from "express";
import { createTopic, deleteTopic, getTopicById, getTopicsByCourseId, updateTopic } from "../controllers/topic.controller";
import authMiddleware from "../middleware/authMiddleware";
import { checkRole } from "../middleware/roleMiddleware";

const topicRoute = Router();

topicRoute.post("/", authMiddleware, checkRole(["admin"]), createTopic);
topicRoute.get("/course/:courseId", getTopicsByCourseId);
topicRoute.get("/:topicId", getTopicById);
topicRoute.put("/:topicId", authMiddleware, checkRole(["admin"]), updateTopic);
topicRoute.delete("/:topicId", authMiddleware, checkRole(["admin"]), deleteTopic);


export default topicRoute;