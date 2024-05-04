import mongoose from "mongoose";
const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  picture: {
    type: String,
    require: true,
  },
  doc: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () {
      return new mongoose.Types.ObjectId();
    },
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () {
      return new mongoose.Types.ObjectId();
    },
  },
});

const Users = mongoose.model("users", usersSchema);

export default {
  Users,
};
