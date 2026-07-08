import { IquizAttempts } from "@/types/quizAttempts.types";
import { Schema } from "mongoose";

const quizAttemptSchema = new Schema<IquizAttempts>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    date: { type: Date, default: Date.now },
    questions: [
        {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: String, required: true },
            explanation: { type: String }
        }
    ],
    answers: [
        {
            questionIndex: { type: Number, required: true },
            selectedAnswer: { type: String, required: true },
            isCorrect: { type: Boolean, required: true }
        }
    ],
    timeTaken: { type: Number, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    score: { type: Number, required: true },
}, );

export default quizAttemptSchema;