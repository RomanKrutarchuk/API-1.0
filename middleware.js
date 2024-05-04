import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { OAuth2Client } from "google-auth-library";
import models from "./models.js";
const googleClientID =
  "1044712585347-ctp0cq62k0ljekp1q1bka7u390g1sv8d.apps.googleusercontent.com";
const client = new OAuth2Client(googleClientID);
const successStatus = { status: 200 };
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: googleClientID,
  });
  const payload = ticket.getPayload();
  // console.log(JSON.stringify(payload));
  return payload;
}
const Users = models.Users;
mongoose
  .connect(
    "mongodb+srv://makarenaclubg:o7ZbxCNgai8qQvwx@cluster0.obec1a5.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((res) => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log("connection to db error-", error);
  });

export default function (app) {
  // to support JSON-encoded bodies
  app.use(express.json());
  app.use(bodyParser.text({ type: "*/*" }));
  app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json, text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.statusCode = 200;
    next();
  });
  app.get("/", (req, res) => {
    res.send(JSON.stringify(successStatus));
  });
  app.post("/auth", async (req, res) => {
    const body = JSON.parse(req.body);
    // console.log(body.token);
    const token = body.token;
    const googleData = await verify(token).catch(console.error);
    const user = await findUser(googleData)
    console.log({createdUser:user});
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(user))
  });
}
async function findUser(googleData) {
  return await Users.find({
    name: googleData.name,
    email: googleData.email,
  }).then((users) => {
    if (users.length === 0) {
      const user = createUser(googleData);
      return user;
    }
    const user = users.find((user) => user.email === user.email);
    return user;
  });
}
async function createUser(googleData) {
  return await Users.create({
    email: googleData.email,
    name: googleData.name,
    picture: googleData.picture,
  }).then((user) => {
    console.log({ createUser: user });
    return user;
  });
}
