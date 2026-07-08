import { IUser } from "@/types/user.types";
import { Schema } from "mongoose";

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["student", "admin"], 
    default: "student" },
}, { timestamps: true });

export default userSchema;