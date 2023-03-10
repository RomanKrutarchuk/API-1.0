import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  text: { type: String },
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
