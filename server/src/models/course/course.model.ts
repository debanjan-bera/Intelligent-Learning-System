import { model } from "mongoose";
import courseSchema from "./course.schema";

const courseModel = model("Course", courseSchema);
export default courseModel;