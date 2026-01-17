require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// --- 1. FIXED CORS SETUP ---
// Simplified CORS configuration to handle preflight requests correctly
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200', 'https://wastesort-ai.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecosort";
mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// --- Schemas & Models ---
const ListingSchema = new mongoose.Schema({
  title: String, price: String, condition: String, contact: String, emoji: String,
  sellerId: String, sellerName: String,
  createdAt: { type: Date, default: Date.now }
});
const Listing = mongoose.model('Listing', ListingSchema);

const ChallengeSchema = new mongoose.Schema({
  day: Number,
  completed: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});
const Challenge = mongoose.model('Challenge', ChallengeSchema);

const CarbonSchema = new mongoose.Schema({
  commute: String,
  diet: String,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});
const Carbon = mongoose.model('Carbon', CarbonSchema);

const VolunteerSchema = new mongoose.Schema({
  name: String, email: String, interests: String,
  createdAt: { type: Date, default: Date.now }
});
const Volunteer = mongoose.model('Volunteer', VolunteerSchema);

const ContactSchema = new mongoose.Schema({
  email: String, message: String,
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);

// --- API Routes ---

app.post('/api/analyze', async (req, res) => {
  try {
    const { item } = req.body;
    if (!item) return res.status(400).json({ error: "Item is required" });

    // Use specific model as requested
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const prompt = `Analyze "${item}" for waste sorting. Return JSON only:
    { "disposal_method": "String", "bin_color": "String", "handling_instructions": "String", "environmental_impact": "String", "sdg_connection": "String" }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    // Clean up code fences
    text = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    res.json(JSON.parse(text));
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
});

app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/listings', async (req, res) => {
  try {
    const created = await new Listing(req.body).save();
    res.json(created);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/challenge', async (req, res) => {
  try {
    const progress = await Challenge.find({ completed: true });
    res.json(progress.map(p => p.day));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/challenge', async (req, res) => {
  try {
    const { day, completed } = req.body;
    await Challenge.findOneAndUpdate({ day }, { completed }, { upsert: true });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/carbon', async (req, res) => {
  try {
    const { commute, diet } = req.body;
    let score = 1000;
    if (commute?.includes('Car')) score += 500;
    if (commute?.includes('EV')) score += 200;
    if (diet?.includes('Meat')) score += 600;
    if (diet?.includes('Vegan')) score -= 100;
    await new Carbon({ commute, diet, score }).save();
    res.json({ score });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/volunteer', async (req, res) => {
  try {
    await new Volunteer(req.body).save();
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/contact', async (req, res) => {
  try {
    await new Contact(req.body).save();
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/news', (req, res) => {
  res.json([
    { title: 'New Enzyme Degrading Plastic', category: 'Innovation', summary: 'Scientists find bacteria that eats PET.' },
    { title: 'Global Plastic Treaty', category: 'Policy', summary: 'UN agrees on binding rules.' },
    { title: 'E-Waste Gold Rush', category: 'Tech', summary: 'Recycling smartphones is now profitable.' }
  ]);
});

app.get('/api/events', (req, res) => {
  res.json([
    { title: 'Beach Cleanup', location: 'Santa Monica', day: '12 OCT' },
    { title: 'E-Waste Drive', location: 'City Hall', day: '15 OCT' }
  ]);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));