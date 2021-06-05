const jwt = require("jsonwebtoken");

exports.createToken = (user) => {
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  res.header("token").send(token);
};
