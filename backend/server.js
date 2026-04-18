const express = require("express");
const cors = require("cors");

const app = express();

/* -------------------------
   MIDDLEWARE (MUST BE TOP)
--------------------------*/
app.use(cors());
app.use(express.json());

/* -------------------------
   IN-MEMORY STORAGE
--------------------------*/
let doubts = [];

/* -------------------------
   TEST ROUTE
--------------------------*/
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

/* -------------------------
   CREATE DOUBT
--------------------------*/
app.post("/doubt", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description required" });
  }

  const newDoubt = {
    id: doubts.length + 1,
    title,
    description,
    status: "OPEN",
    acceptedBy: null
  };

  doubts.push(newDoubt);
  res.json(newDoubt);
});

/* -------------------------
   GET ALL DOUBTS
--------------------------*/
app.get("/doubts", (req, res) => {
  res.json(doubts);
});

/* -------------------------
   UPDATE DOUBT
--------------------------*/
app.put("/doubt/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const doubt = doubts.find(d => d.id === id);

  if (!doubt) {
    return res.status(404).json({ error: "Doubt not found" });
  }

  const { status } = req.body || {};

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  doubt.status = status;

  res.json(doubt);
});

/* -------------------------
   ACCEPT DOUBT (CORE FEATURE)
--------------------------*/
app.post("/accept-doubt", (req, res) => {
  const { doubtId, userId } = req.body;

  const doubt = doubts.find(d => d.id === doubtId);

  if (!doubt) {
    return res.status(404).json({ error: "Doubt not found" });
  }

  if (doubt.status !== "OPEN") {
    return res.status(400).json({ error: "Doubt already accepted" });
  }

  doubt.status = "MATCHED";
  doubt.acceptedBy = userId;

  res.json({
    message: "Doubt accepted successfully",
    doubt
  });
});

/* -------------------------
   DELETE DOUBT
--------------------------*/
app.delete("/doubt/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = doubts.findIndex(d => d.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Doubt not found" });
  }

  const deleted = doubts.splice(index, 1);

  res.json({
    message: "Deleted successfully",
    deleted: deleted[0]
  });
});

/* -------------------------
   START SERVER
--------------------------*/
app.listen(3000, () => {
  console.log("Server running on port 3000");
});