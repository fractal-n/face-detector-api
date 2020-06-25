export function handleRegister(req, res, db, bcrypt, saltRounds) {
  const { email, name, password } = req.body;
  console.log(req.body);

  if (!email || !name || !password) {
    // console.log(`email ${email}, name ${name}. pass ${password}`);
    return res.status(400).json("incorrect form submission");
  }

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
}
