const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model");

//post register
router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//post login
router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // res.status(200).json({ message: `Welcome ${user.username}` });
        req.session.user = user;
        res
          .status(200)
          .json({ message: `Welcome ${user.username}, its cookie time!` });
      } else {
        res.status(401).json({ message: "You shall not pass" });
      }
    })
    .catch(err => res.status(500).json(err));
});

//delete session for logout
router.delete("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("unable to logout");
      } else {
        res.send("Goodbye");
      }
    });
  } else {
    res.end();
  }
});

module.exports = router;
