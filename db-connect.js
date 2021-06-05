const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: "true",
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (err) => {
  console.log("error", err);
});
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});
