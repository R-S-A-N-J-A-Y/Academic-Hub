const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Listening...");
});

app.listen(5001, () => {
  console.log("App is Listening in the port 5001");
});
