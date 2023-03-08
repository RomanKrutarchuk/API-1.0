import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import modules from "./models.js";

const app = express();
const Comments = modules.Comments;

app.listen(config.PORT, () => {
  console.log(`Server has been startted on ${config.PORT}...`);
});

mongoose
  .connect(config.DBURL)
  .then((res) => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log("connection to db error-", error);
  });

app.get("/comments", (req, res) => {
  //Comments.create({name email text}) for create a new comments in db
  //   Comments.create({
  //     name: "Misha",
  //     email: "Misha@mail.com",
  //     text: "dayte mne mjod"
  //   })
  Comments.find()
    .then((comments) => {
      res.send(comments);
    })
    .catch((error) => res.send(error));
});
