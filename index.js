const express = require("express");
const app = express();
require("dotenv").config();
require("./db-connect");

const routes = require("./routers/index");

app.use(express.json());
app.use("/", routes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`app running on Port 5000`);
});
