import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import config from "./config.js";
import modules from "./models.js";
import cors from "cors";
import { v4 as uuid } from "uuid";

// const clients = {};
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});
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

app.post("/users/create", (req, res) => {
  Users.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }).then(res.send({ response: "succefull user create" }));
  // console.log("new user created", {
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  // });
});

app.get("/users/create", (req, res) => {
  res.send("user create page");
});

app.post("/users", (req, res) => {
  Users.find({
    name: req.body.name,
    email: req.body.email,
  })
    .then((users) => {
      console.log(users,"--------");
      if (users.length === 0) {
        const response = {
          status: "user_not_defiened",
        };
        res.send(response);
      } else {
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

// app.post("/comments/create", (req, res) => {
//   Comments.create({
//     author: req.body.author.name,
//     authoremail: req.body.author.email,
//     text: req.body.text,
//   }).then(res.send({ response: "your comment went to db" }));
// });

io.on("connection", (socket) => {
  //on connection
  const id = uuid();
  console.log(`new socket connection ${id}`);
  const status = { web_socket_connection: true };
  io.emit("connection_status", status);
  //on disconnect
  socket.on("disconnect", (reason) => {
    console.log(`socket has leave ${id}`);
  });
  //send message at other sockets and write this on database
  socket.on("socket send message", (data) => {
    const comment = {
      text: data.text,
      author: data.author.name,
      email: data.author.email,
    };
    Comments.create({
      text: data.text,
      author: data.author.name,
      email: data.author.email,
    }).then(
      console.log(`socket ${id} send ${comment.text} and this went to DB`)
    );
    io.emit("socket send message", {
      comment,
    });
  });
});

server.listen(config.PORT, () => {
  console.log(`Server has been startted on ${config.PORT}...`);
});

export default {
  server,
};
