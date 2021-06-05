const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../model/user");
const createToken = require("../middleware/create_token");
const router = express.Router();

// register user in Database
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // validate user email address
  const validEmail = await Users.findOne({ email: email });
  if (validEmail) return res.status(400).send("email already exist");

  // bcrypt password with bcrypt
  const hashPassword = await bcrypt.hash(password, 10);

  const user = new Users({
    username: username,
    email: email,
    password: hashPassword,
  });

  try {
    const saveUser = await user.save();
    res.send(saveUser);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // check user exist or not
  const user = await Users.findOne({ email: email });
  if (!user) return res.status(400).send("user not registered");

  // conform password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send('"Envalid username Password"');
  const token = createToken.createToken(user);
  res.send(token);
});

module.exports = router;
