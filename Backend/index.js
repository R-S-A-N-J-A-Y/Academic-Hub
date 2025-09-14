const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

app.use("/auth", require("./Routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("Listening...");
});

app.listen(5001, () => {
  console.log("App is Listening in the port 5001");
});
