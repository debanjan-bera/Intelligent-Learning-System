import topicModel from "@/models/topics/topic.model";
import { ITopic } from "@/types/topic.types";

class topicService {

    static async createTopic({ name, description, courseId }: ITopic) {
        try {
            const newTopic = await topicModel.create({ name, description, courseId });
            return newTopic;
        } catch (error: any) {
            throw new Error(error.message || "Error creating topic");
        }
    }

    static async getTopicsByCourseId(courseId: string) {
        try {
            const topics = await topicModel.find({ courseId });
            return topics;
        } catch (error) {
            throw new Error("Error fetching topics");
        }
    }

    static async getTopicById(topicId: string) {
        try {
            const topic = await topicModel.findById(topicId);
            if (!topic) {
                throw new Error("Topic not found");
            }
            return topic;
        } catch (error) {
            throw new Error("Error fetching topic");
        }
    }

    static async updateTopic(topicId: string, { name, description }: ITopic) {
        try {
            const updatedTopic = await topicModel.findByIdAndUpdate(
                topicId,
                { name, description },
                { returnDocument: "after" }
            );
            return updatedTopic;
        } catch (error) {
            throw new Error("Error updating topic");
        }
    }

    static async deleteTopic(topicId: string) {
        try {
            const deletedTopic = await topicModel.findByIdAndDelete(topicId);
            if (!deletedTopic) {
                throw new Error("Topic not found");
            }
            return deletedTopic;
        } catch (error) {
            throw new Error("Error deleting topic");
        }
    
    }



}

export default topicService;