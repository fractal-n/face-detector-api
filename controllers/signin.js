export function handleSignIn(req, res, db, bcrypt) {
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
}
