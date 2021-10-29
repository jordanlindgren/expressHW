const express = require("express");
const path = require("path");
const fs = require("fs/promises");

const app = express();
const PORT = 3001;
console.log("configuring express");
app.use(express.static("public"));

app.get("/api/notes", async (req, res) => {
  let notes = await fs.readFile("./db/db.json");

  res.json(notes);
});

app.listen(PORT, () =>
  console.log(`Test Example app listening at http://localhost:${PORT}`)
);
