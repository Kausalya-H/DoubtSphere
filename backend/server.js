const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

/* -------------------------
   MIDDLEWARE (MUST BE TOP)
--------------------------*/
mongoose.connect("mongodb://127.0.0.1:27017/doubtsphere")
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log(err));
app.use(cors());
app.use(express.json());

/* -------------------------
   IN-MEMORY STORAGE
--------------------------*/
const doubtSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: "OPEN" },
  acceptedBy: { type: String, default: null }
});

const Doubt = mongoose.model("Doubt", doubtSchema);

/* -------------------------
   TEST ROUTE
--------------------------*/
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

/* -------------------------
   CREATE DOUBT
--------------------------*/
app.post("/doubt", async (req, res) => {
  const { title, description } = req.body;

  const newDoubt = await Doubt.create({
    title,
    description
  });

  res.json(newDoubt);
});

/* -------------------------
   GET ALL DOUBTS
--------------------------*/
app.get("/doubts", async (req, res) => {
  try {
    const doubts = await Doubt.find();
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------
   UPDATE DOUBT
--------------------------*/
app.put("/doubt/:id", async (req, res) => {
  const updated = await Doubt.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

/* -------------------------
   ACCEPT DOUBT (CORE FEATURE)
--------------------------*/
app.post("/accept-doubt", async (req, res) => {
  const { doubtId, userId } = req.body;

  const doubt = await Doubt.findById(doubtId);

  if (!doubt) {
    return res.status(404).json({ error: "Doubt not found" });
  }

  // 🔒 already taken check
  if (doubt.status !== "OPEN") {
    return res.status(400).json({ error: "Doubt already accepted" });
  }

  doubt.status = "MATCHED";
  doubt.acceptedBy = userId;

  await doubt.save();

  res.json({
    message: "Doubt accepted successfully",
    doubt
  });
});

/* -------------------------
   DELETE DOUBT
--------------------------*/
app.delete("/doubt/:id", async (req, res) => {
  const deleted = await Doubt.findByIdAndDelete(req.params.id);
  res.json(deleted);
});

/* -------------------------
   START SERVER
--------------------------*/
app.listen(3000, () => {
  console.log("Server running on port 3000");
});