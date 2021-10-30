"use strict";
const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const cors = require("cors");
const { write, writeFile } = require("fs");

const app = express();
const PORT = 3001;
console.log("configuring express");
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

async function readNotes() {
  let notes = await fs.readFile("./db/db.json", { encoding: "utf-8" });
  return JSON.parse(notes);
}

app.get("/api/notes", async (req, res) => {
  res.json(await readNotes());
});

app.post("/api/notes", async (req, res) => {
  let existingNotes = await readNotes();

  existingNotes.push(req.body);

  console.log(existingNotes);

  await fs.writeFile(
    "./db/db.json",
    JSON.stringify(existingNotes, undefined, "  "),
    {
      encoding: "utf-8",
    }
  );

  res.send();
});

app.listen(PORT, () =>
  console.log(`Test Example app listening at http://localhost:${PORT}`)
);
