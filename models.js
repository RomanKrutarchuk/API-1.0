import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    text: { type: String },
  });
const Comments = mongoose.model("comments", commentsSchema);
export default {
    Comments
}