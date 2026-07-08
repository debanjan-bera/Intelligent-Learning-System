import { ICourse } from "@/types/course.types";
import { Iprogress } from "@/types/progress.types";
import { Schema } from "mongoose";

const courseSchema = new Schema<ICourse>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, required: true },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

courseSchema.virtual("topics", {
    ref: "Topic",
    localField: "_id",
    foreignField: "courseId",
});

export default courseSchema;