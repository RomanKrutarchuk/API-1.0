import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketEvents from "./socket.js";
import middleware from "./middleware.js";
import mongoose from "mongoose";

const port = 3080;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  optionsSuccessStatus: 204,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
let connections = [];
socketEvents(io, connections);
middleware(app);

httpServer.listen(port, () => {
  console.log(`SERVER_PORT: ${port}`);
});
//o7ZbxCNgai8qQvwx
