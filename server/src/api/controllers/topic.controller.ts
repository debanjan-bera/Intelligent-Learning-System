import topicService from "@/service/topic.service";
import { Request, Response } from "express";
export const createTopic = async (req: Request, res: Response) => {
    try {
        console.log("Creating topic with data:", req.body);
        const { name, description, courseId } = req.body;
        const newTopic = await topicService.createTopic({ name, description, courseId } as any);
        res.status(201).json({
            message: "Topic created successfully",
            success: true,
            data: newTopic,
        });
    }
    catch (error: any) {
        console.error("Error creating topic:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Internal server error" 
        });
    }
};

export const getTopicsByCourseId = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const topics = await topicService.getTopicsByCourseId(courseId);
        res.status(200).json({
            message: "Topics fetched successfully",
            success: true,
            data: topics,
        });
    }
    catch (error: any) {       
        console.error("Error fetching topics:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Internal server error" 
        });
    }
};

export const getTopicById = async (req: Request, res: Response) => {
    try {
        const { topicId } = req.params as { topicId: string };
        const topic = await topicService.getTopicById(topicId);
        res.status(200).json({
            message: "Topic fetched successfully",
            success: true,
            data: topic,
        });
    }
    catch (error: any) {
        console.error("Error fetching topic:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Internal server error" 
        });
    }
};

export const updateTopic = async (req: Request, res: Response) => {
    try {
        const { topicId } = req.params as { topicId: string };
        const { name, description } = req.body;
        const updatedTopic = await topicService.updateTopic(topicId, { name, description } as any);
        res.status(200).json({
            message: "Topic updated successfully",
            success: true,
            data: updatedTopic,
        });
    }
    catch (error: any) {
        console.error("Error updating topic:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Internal server error" 
        });
    }
};

export const deleteTopic = async (req: Request, res: Response) => {
    try {
        const { topicId } = req.params as { topicId: string };
        const deletedTopic = await topicService.deleteTopic(topicId);
        res.status(200).json({
            message: "Topic deleted successfully",
             success: true
        });
    }
    catch (error: any) {
        console.error("Error deleting topic:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Internal server error" 
        });
    }
};