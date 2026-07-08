import { model } from "mongoose";
import topicSchema from "./topic.schema";

const topicModel = model("Topic", topicSchema);
export default topicModel;