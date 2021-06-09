const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../model/user");
const router = express.Router();

const {
  createToken,
  verifyAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../middleware/create_token");

// authorize user
router.get("/user", verifyAccessToken, async (req, res) => {
  // req.payload
  const user = req.payload;
  const authUser = await Users.findById(user.aud, { password: 0 }).exec();
  res.send(authUser);
});

router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw res.status(400);
    const userId = await verifyRefreshToken(refreshToken);
    const accessToken = await createToken(userId);
    // const refToken = await createRefreshToken(userId);

    res.send({ accessToken });
  } catch (error) {
    res.send(error);
  }
});

// register user in Database
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  // if (!email || !password) return res.sendStatus(404);
  // validate user email address
  const userExist = await Users.findOne({ email: email });
  if (userExist) return res.status(403).send("user already exist");
  // // bcrypt password with bcrypt

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    const user = new Users({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const saveUser = await user.save();
    res.send(saveUser);
  } catch (err) {
    res.status(404).send(err);
  }
});

// login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // check user exist or not
  const user = await Users.findOne({ email: email });
  if (!user) return res.status(400).send("user not registered");

  // conform password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email and Password");
  const accessToken = await createToken(user.id);
  const refreshToken = await createRefreshToken(user.id);
  res.send({ accessToken, refreshToken });
});

module.exports = router;
