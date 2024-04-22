import express from "express";
const successStatus = { status: 200 };
export default function (app) {
  app.use(express.json());
  app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.statusCode = 200;
    next();
  });

  app.get("/", (req, res) => {
    res.send(JSON.stringify(successStatus));
  });
}
