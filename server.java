const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./db');

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

const usageSchema = new mongoose.Schema({
  site: String,
  time: Number,
  date: { type: Date, default: Date.now }
});
const Usage = mongoose.model('Usage', usageSchema);

app.post('/api/track', async (req, res) => {
  const { site, time } = req.body;
  try {
    const newUsage = new Usage({ site, time });
    await newUsage.save();
    res.status(201).json({ message: "Saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save" });
  }
});

app.get('/api/report', async (req, res) => {
  const usage = await Usage.find().sort({ date: -1 }).limit(20);
  res.json(usage);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
