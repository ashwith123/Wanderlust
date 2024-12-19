const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Project");
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.log(err);
  }
}

app.get("/", (req, res) => {
  res.send("hi this is projects Root");
});

app.get("/test", async (req, res) => {
  try {
    let sample = new Listing({
      title: "ashwith test",
      description: "hope it works",
    });

    await sample.save(); // Correct method to save data
    res.send("Sample was saved!");
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).send("Error saving data.");
  }
});

app.listen(7070, () => {
  console.log("server is listening");
});
