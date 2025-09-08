const express = require("express");
const app = express();
app.use(express.json());

app.use("/auth", require("./Routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("Listening...");
});

app.listen(5001, () => {
  console.log("App is Listening in the port 5001");
});
