import { Types } from "mongoose";

export interface ITopic {
    name: string;
    description: string;
    courseId: Types.ObjectId;
}