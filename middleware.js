import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { OAuth2Client } from "google-auth-library";
import models from "./models.js";


// Qq0DJFqt5NxfxNrU

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
    console.log("DB_CONNECTED");
  })
  .catch((error) => {
    console.log("DB_FAIL_CONNECTION", error);
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
    //invalid media type is header error 
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(successStatus));
  });
  app.post("/auth", async (req, res) => {
    const body = JSON.parse(req.body);
    // console.log(body);
    if (body.token) {
      const token = body.token;
      const googleData = await verify(token).catch(console.error);
      const user = await findUser({ googleData })
      console.log("/auth.user.googleData");
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(user))
    }
    if (body.id) {
      const user = await findUser({ id: body.id })
      console.log("/auth.user.id");
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(user))
    }
    if (body.authData) {
      const user = await findUser({ authData: body.authData })
      console.log("/auth.user.authData");
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(user))
    }
  });
  app.post("/getUserData", async (req, res) => {
    const body = JSON.parse(req.body);
    // console.log(body.id);
    const user = await findUser({ id: body.id })
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(user))
  })
}
async function findUser(value) {
  if (value.id) {
    return await Users.find({ id: value.id }).then((users) => {
      // console.log(users);
      const user = users[0]
      // console.log({ findUserByID: user });
      return user
    })
  }
  if (value.googleData) {
    console.log("auth.value.googleData");
    return await Users.find({
      name: value.googleData.name,
      email: value.googleData.email,
    }).then((users) => {
      if (users.length === 0) {
        const user = createUser(googleData);
        return user;
      }
      const user = users.find((user) => user.email === user.email);
      // console.log({ findUser: user });
      return user;
    });
  }
  if (value.authData) {
    console.log("auth.value.authData");

    return await Users.find({ name: value.authData.name, email: value.authData.email }).then((users) => {
      // console.log(users);
      if (users.length === 0) {
        const user = createUser(value.authData);
        return user;
      }
      const user = users[0]
      console.log({ findByAuthData: user });
      return user
    })
  }

}
async function createUser(data) {
  const payload = data
  if (!data.picture) payload.picture = "default"
  return await Users.create({
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  }).then((user) => {
    console.log({ createUser: user });
    return user;
  });
}
