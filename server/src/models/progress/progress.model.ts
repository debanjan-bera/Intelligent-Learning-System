import { model } from "mongoose";
import progressSchema from "./progress.schema";

const progressModel = model("Progress", progressSchema);
export default progressModel;