"use strict";
const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const cors = require("cors");
const { write, writeFile } = require("fs");

const app = express();

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
  // [ { "id": 0, "title": "foo", "text": "asdf" }]
  let existingNotes = await readNotes();

  let newNote = req.body;
  let randId = Math.floor(Math.random() * 99999999999);

  newNote.id = randId;

  existingNotes.push(newNote);
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

app.delete("/api/notes/:id", async (req, res) => {
  // get notes that have been saved
  let existingNotes = await readNotes();
  // get the index of the note with the specified id
  //   use a for loop
  let i = 0;
  for (; i < existingNotes.length; i++) {
    if (existingNotes[i].id == req.params.id) {
      break;
    }
  }

  if (i < existingNotes.length) {
    // use splice to delete the note by index
    // save changes to db.json using writeFile
    existingNotes.splice(i, 1);
    await fs.writeFile(
      "./db/db.json",
      JSON.stringify(existingNotes, undefined, "  "),
      {
        encoding: "utf-8",
      }
    );
  }

  res.send();
});

const PORT = parseInt(process.env.PORT) || 3001;
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
