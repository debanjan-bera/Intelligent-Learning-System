import { ITopic } from "@/types/topic.types";
import { Schema } from "mongoose";

const topicSchema = new Schema<ITopic>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },

});

export default topicSchema;