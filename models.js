import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
  author: { type: String, require: true },
  authorEmail: { type: String, require: true },
  text: { type: String, require: true },
});
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const Comments = mongoose.model("comments", commentsSchema);
const Users = mongoose.model("users", usersSchema);

export default {
  Comments,
  Users,
};
