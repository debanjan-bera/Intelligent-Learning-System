import { Iprogress } from "@/types/progress.types";
import { Schema } from "mongoose";

const progressSchema = new Schema<Iprogress>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    accuracy: { type: Number, required: true },
    weakTopics: [{ type: String }],
    strongTopics: [{ type: String }],
    totalQuizzes: { type: Number, required: true },
    averageScore: { type: Number, required: true },
});

export default progressSchema;