import { model } from "mongoose";
import quizAttemptSchema from "./quizAttempts.schema";

const quizAttemptsModel = model("QuizAttempt", quizAttemptSchema);
export default quizAttemptsModel;