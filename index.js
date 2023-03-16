import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import config from "./config.js";
import modules from "./models.js";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();
const server = new http.createServer(app);
const Comments = modules.Comments;
const Users = modules.Users;
app.use(express.json());
app.use(
  cors({
    origin: config.APP_ORIGIN,
  })
);
app.get("/", (req, res) => {
  res.send(`ORIGIN:${config.APP_ORIGIN}, START_ON:${config.START_ON}`);
});

const io = new Server(
  server,
  {
    cors: {
      origin: config.APP_ORIGIN,
      credentials: true,
    },
  }
);
io.on("connection", (socket) => {
  //on connection
  const id = uuid();
  console.log(`new socket connection ${id}`);
  const status = { web_socket_connection: true };
  io.emit("connection_status", status);

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
      // console.log("Users_auth", users);
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

server.listen(config.PORT, () => {
  console.log(`ORIGIN:${config.APP_ORIGIN}, START_ON:${config.START_ON}, ...`);
});
export default {
  server,
};
