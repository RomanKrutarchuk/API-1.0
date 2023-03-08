import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;
const DBURL =
  "mongodb+srv://ApiAdmin01:1q2w3e@clusterapi01.z8zrsfh.mongodb.net/sample_mflix?retryWrites=true&w=majority";
app.listen(PORT, () => {
  console.log(`Server has been startted on ${PORT}...`);
});

mongoose
  .connect(DBURL)
  .then((res) => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log("connection to db error-", error);
  });
const commentsSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  text: { type: String },
});
const Comments = mongoose.model("comments", commentsSchema);
app.get("/comments", (req, res) => {
  //Comments.create({name email text}) for create a new comments in db
  Comments.find()
    .then((comments) => {
      res.send(comments);
    })
    .catch((error) => res.send(error));
});
