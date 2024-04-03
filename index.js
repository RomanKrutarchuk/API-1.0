import http from "http";
// import express from "express";
// import cors from "cors";
import { Server } from "socket.io";

const port = 3000;

const httpServer = http.createServer();
httpServer.on("request", (req, res) => {
  console.log("HTTP CONNECTION");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","*")
  res.statusCode = 200;
  res.end("connected");
});
// const httpServer = http.createServer((req, res) => {
//   console.log("HTTP CONNECTION");
//   const headers = {
//     "Content-Type": "application/json, */*",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   };
//   res.writeHead(200, headers);
//   if (req.method === "OPTIONS") {
//     res.writeHead(204, headers);
//   }
//   if (req.method === "GET") {
//     res.writeHead(204, headers);
//   }
//   if (req.method === "POST") {
//     res.writeHead(204, headers);
//   }
//   res.end();
// });

const io = new Server(httpServer, {
  optionsSuccessStatus: 204,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// io.set("transports", ["websocket"]);

httpServer.listen(port, () => {
  console.log(`SERVER_PORT: ${port}`);

  io.on("connection", (socket) => {
    console.log(`socket connection: ${socket.id}`);
    socket.handshake.headers.origin = "*";
    // console.log(socket);
    io.emit("socket send message", {
      message: "success",
    });
  });
});





// import http from "http";
// import express from "express";

// const port = 80;
// const app = express();

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   if (req.method === "OPTIONS") {
//     res.status(200);
//   }
//   next();
// });
// app.get("/", (req, res) => {
//   console.log("New connection");
//   res.send("/");
// });

// const httpServer = http.createServer(app);

// httpServer.listen(port, () => {
//   console.log(`SERVER_PORT: ${port}`);
// });



// import http from "http";
// // import express from "express";
// // import cors from "cors";
// import { Server } from "socket.io";

// const port = 80;

// const httpServer = http.createServer((req, res) => {
//   console.log("HTTP CONNECTION");
//   const headers = {
//     "Content-Type": "application/json, */*",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   };
//   res.writeHead(200, headers);
//   if (req.method === "OPTIONS") {
//     res.writeHead(204, headers);
//   }
//   res.end();
// });
// const io = new Server({
//   optionsSuccessStatus: 204,
//   transports: ["polling"],
//   upgrade: false,
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
//   handlePreflightRequest: (req, res) => {
//     res.writeHead(200, {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET,POST,PUT",
//       "Content-Type": "application/json",
//     });
//     res.end();
//   },
// });
// io.listen(httpServer)


// httpServer.listen(port, () => {
//   console.log(`SERVER_PORT: ${port}`);
//   io.on("connection", (socket) => {
//     console.log(`socket connection: ${socket.id}`);
//     socket.handshake.headers.origin = "*";
//     // console.log(socket);
//     io.emit("socket send message", {
//       message: "success",
//     });
//   });
// });

// import express from "express";
// import mongoose from "mongoose";
// import { Server } from "socket.io";
// import https from "http";
// import config from "./config.js";
// import modules from "./models.js";
// import cors from "cors";
// import { v4 as uuid } from "uuid";
// import { WebSocketServer } from "ws";

// const app = express();
// const server = new https.createServer(
//   app.use(
//     cors({
//       origin: [config.APP_ORIGIN, "*"],
//     })
//   )
// );
// const wss = new WebSocketServer({ server});
// const Comments = modules.Comments;
// const Users = modules.Users;

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send(`ORIGIN:${config.APP_ORIGIN}, START_ON:${config.START_ON}`);
// });
// wss.on("headers", (headers, request) => {
//   headers.push("Access-Control-Allow-Origin: *");
//   headers.push(
//     "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
//   );
// });
// wss.on("connection", (ws) => {
//   console.log("new ws connection");
//   ws.on("close", () => {
//     console.log("ws disconnect");
//   });
// });

// const io = new Server(
//   server,
//   // cors: {
//   //   origin: "*",
//   //   methods: "*",
//   // },
//   // cors: {
//   //   origin: "*",
//   //   methods: ["GET", "POST", "OPTIONS", "PUT"],
//   // },
// );
// io.on("connection", (socket) => {
//   //on connection
//   const id = uuid();
//   console.log(`new socket connection ${id}`);
//   const status = { web_socket_connection: true };
//   io.emit("connection_status", status);

//   socket.on("disconnect", (reason) => {
//     console.log(`socket has leave ${id}`);
//   });

//   //send message at other sockets and write this on database
//   socket.on("socket send message", (data) => {
//     const comment = {
//       text: data.text,
//       author: data.author.name,
//       email: data.author.email,
//     };
//     Comments.create({
//       text: data.text,
//       author: data.author.name,
//       email: data.author.email,
//     }).then(
//       console.log(`socket ${id} send ${comment.text} and this went to DB`)
//     );
//     io.emit("socket send message", {
//       comment,
//     });
//   });
// });

// mongoose
//   .connect(config.DBURL)
//   .then((res) => {
//     console.log("connected to database");
//   })
//   .catch((error) => {
//     console.log("connection to db error-", error);
//   });

// app.post("/users/create", (req, res) => {
//   Users.create({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//   }).then(res.send({ response: "succefull user create" }));
// });

// app.get("/users/create", (req, res) => {
//   res.send("user create page");
// });

// app.post("/users", (req, res) => {
//   Users.find({
//     name: req.body.name,
//     email: req.body.email,
//   })
//     .then((users) => {
//       // console.log("Users_auth", users);
//       if (users.length === 0) {
//         const response = {
//           status: "user_not_defiened",
//         };
//         res.send(response);
//       } else {
//         //users is an array
//         const user = users.find((user) => user.name === req.body.name);
//         const RequestPassword = req.body.password;
//         // console.log("this user", user, RequestPassword);
//         if (RequestPassword === user.password) {
//           const response = {
//             status: "authorized",
//             user: {
//               name: user.name,
//               email: user.email,
//             },
//           };
//           res.send(response);
//           res.end();
//         } else if (RequestPassword != user.password) {
//           const response = { status: "invalid passoword" };
//           res.send(response);
//         }
//       }
//     })
//     .catch((error) => res.send(error));
// });

// app.get("/users", (req, res) => {
//   Users.find().then((users) => {
//     res.send(users);
//   });
// });

// app.get("/comments", (req, res) => {
//   Comments.find().then((comments) => {
//     res.send(comments);
//   });
// });

// server.listen(config.PORT, (res, req) => {
//   console.log(`ORIGIN:${config.APP_ORIGIN}, START_ON:${config.START_ON}, ...`);
// });
// export default {
//   server,
// };
