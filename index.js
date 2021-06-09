const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routers/index");

require("dotenv").config();
require("./db-connect");

app.use(express.json());
app.use(cors());
app.use("/", routes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`app running on Port 5000`);
});
