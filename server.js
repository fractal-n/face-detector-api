import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";

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

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  db("login")
    .select("hash", "email")
    .where({ email: email })
    .then((entries) => {
      bcrypt.compare(password, entries[0].hash, (err, result) => {
        if (result === true) {
          db("users")
            .select("*")
            .where({ email: email })
            .then((users) => {
              if (users.length) {
                res.json(users[0]);
              } else {
                res.status(400).json("not found");
              }
            })
            .catch((err) => res.status(400).json("error getting user"));
        } else {
          res.status(400).json("wrong credentials");
        }
      });
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    db.transaction((trx) => {
      trx("login")
        .insert({
          hash: hash,
          email: email,
        })
        .returning("email")
        .then((loginEmails) => {
          return trx("users")
            .returning("*")
            .insert({
              name: name,
              email: loginEmails[0],
              entries: 0,
              joined: new Date(),
            })
            .then((users) => res.json(users[0]))
            .catch((err) => res.status(400).json("unable to register"));
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db("users")
    .where({ id: id })
    .then((users) => {
      if (users.length) {
        res.json(users[0]);
      } else {
        res.status(400).json("not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
});

app.patch("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where({ id: id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.status(400).json("not found");
      }
    })
    .catch((err) => res.status(400).json("error updating entries"));
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
