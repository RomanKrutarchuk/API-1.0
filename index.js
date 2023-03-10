import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import modules from "./models.js";
import cors from "cors";

const app = express();
// const Comments = modules.Comments;
const Users = modules.Users;
app.use(express.json());
app.use(cors());

mongoose
  .connect(config.DBURL)
  .then((res) => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log("connection to db error-", error);
  });

app.get("/usersCreate", (req, res) => {
  Users.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  console.log("new user created", {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
});

app
  .get("/users", (req, res) => {
    Users.find().then((users) => {
      res.send(users);
    });
  })
  .catch((error) => res.send(error));

// app.get("/comments", (req, res) => {
//Comments.create({name email text}) for create a new comments in db
//   Comments.create({
//     name: "Misha",
//     email: "Misha@mail.com",
//     text: "dayte mne mjod"
//   })
// Comments.find()
//   .then((comments) => {
//     res.setHeader("Content-Type", "application/json");
//     res.json(comments);
//     res.end();
//   })
//   .catch((error) => res.send(error));
// });
// app.post("/comments", (req, res) => {
//   Comments.create({
//     name: req.body.name,
//     email: req.body.email,
//     text: req.body.text,
//   })
//     .then(() => {
//       console.log(
//         `A new comment has been added to DB [${req.body.name},${req.body.email},${req.body.text}]`
//       );
//     })
//     .catch((error) => res.send(error));
// });
app.listen(config.PORT, () => {
  console.log(`Server has been startted on ${config.PORT}...`);
});
