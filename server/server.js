const express = require("express");

const app = express();

const PORT = 5000;
app.use(express.json()); //It is middleware
app.get("/", (req, res) => {
  res.send("Hashnode API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
