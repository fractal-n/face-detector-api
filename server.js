import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";

import { handleRegister } from "./controllers/register.js";
import { handleSignIn } from "./controllers/signin.js";
import { handleProfileGet } from "./controllers/profile.js";
import { handleImage } from "./controllers/image.js";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "UXfqA7&!5$c&",
    database: "face-detector",
  },
});

const app = express();
const saltRounds = 10;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  db("users")
    .select("*")
    .then((users) => res.send(users));
});

app.post("/signin", (req, res) => handleSignIn(req, res, db, bcrypt));
app.post("/register", (req, res) =>
  handleRegister(req, res, db, bcrypt, saltRounds)
);
app.get("/profile/:id", (req, res) => handleProfileGet(req, res, db));
app.patch("/image", (req, res) => handleImage(req, res, db));

app.listen(3000, () => {
  console.log("listening on port 3000");
});
