const Register = (req, res) => {
  const { user } = req.body;
  console.log(user);
  res.json({ message: "Recieved the user" });
};

module.exports = { Register };
