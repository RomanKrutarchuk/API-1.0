import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import modules from "./models.js";
import cors from "cors";

const app = express();
const Comments = modules.Comments;
const Users = modules.Users;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello vercel");
});
mongoose
  .connect(config.DBURL)
  .then((res) => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log("connection to db error-", error);
  });

app.post("/users/userCreate", (req, res) => {
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

app.post("/users", (req, res) => {
  Users.find({
    name: req.body.name,
    email: req.body.email,
  })
    .then((users) => {
      //users is an array
      const user = users.find((user) => user.name === req.body.name);

      const RequestPassword = req.body.password;
      // console.log("this user", user, RequestPassword);
      if (RequestPassword === user.password) {
        const response = {
          status: "authorized",
          user: {
            name: user.name,
            email: user.email,
          },
        };
        res.send(response);
      } else if (RequestPassword != user.password) {
        const response = { status: "invalid passoword" };
        res.send(response);
      }
    })
    .catch((error) => res.send(error));
});

app.get("/users", (req, res) => {
  Users.find().then((users) => {
    res.send(users);
  });
});

app.get("/comments", (req, res) => {
  Comments.find().then((comments) => {
    res.send(comments);
  });
});

app.post("/comments/create", (req, res) => {
  Comments.create({
    author: req.body.author.name,
    authoremail: req.body.author.email,
    text: req.body.text,
  }).then(res.send({ response: "your comment went to db" }));
  // console.log("new comment");
});

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

export default {
  app,
};
