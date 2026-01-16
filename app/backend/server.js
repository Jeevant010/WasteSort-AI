require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Added to check if folders exist
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Initialize Gemini
// Ensure GEMINI_API_KEY is in your backend/.env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Middleware
app.use(cors()); 
app.use(express.json());

// --- 1. MongoDB Connection ---
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecosort";
mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// --- Schemas (The Data Models) ---
const ListingSchema = new mongoose.Schema({
  title: String, price: String, condition: String, contact: String, emoji: String,
  sellerId: String, sellerName: String,
  createdAt: { type: Date, default: Date.now }
});
const Listing = mongoose.model('Listing', ListingSchema);

const ChallengeSchema = new mongoose.Schema({
  day: Number,
  completed: { type: Boolean, default: false },
  // In a real app with auth, you'd add userId here
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

// --- 2. API Routes ---

// AI Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { item } = req.body;
    if (!item) return res.status(400).json({ error: "Item is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
    const prompt = `Analyze "${item}" for waste sorting. Return JSON only:
    { "disposal_method": "String", "bin_color": "String", "handling_instructions": "String", "environmental_impact": "String", "sdg_connection": "String" }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// Marketplace Endpoints
app.get('/api/listings', async (req, res) => {
  const listings = await Listing.find().sort({ createdAt: -1 });
  res.json(listings);
});
app.post('/api/listings', async (req, res) => {
  try { await new Listing(req.body).save(); res.status(201).json({ success: true }); } 
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Challenge Endpoints (Real Persistence)
app.get('/api/challenge', async (req, res) => {
  const progress = await Challenge.find({ completed: true });
  res.json(progress.map(p => p.day));
});
app.post('/api/challenge', async (req, res) => {
  const { day, completed } = req.body;
  // Upsert: Update if exists, Insert if new
  await Challenge.findOneAndUpdate({ day }, { completed }, { upsert: true });
  res.json({ success: true });
});

// Carbon Endpoint (Save Calculation)
app.post('/api/carbon', async (req, res) => {
  const { commute, diet } = req.body;
  // Calculate score
  let score = 1000; // Base baseline
  if (commute.includes('Car')) score += 500;
  if (commute.includes('EV')) score += 200;
  if (diet.includes('Meat')) score += 600;
  if (diet.includes('Vegan')) score -= 100;
  
  try {
    await new Carbon({ commute, diet, score }).save();
    res.json({ score });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Volunteer & Contact
app.post('/api/volunteer', async (req, res) => {
  await new Volunteer(req.body).save();
  res.json({ success: true });
});
app.post('/api/contact', async (req, res) => {
  await new Contact(req.body).save();
  res.json({ success: true });
});

// Dynamic News (Mocked for now, can be DB)
app.get('/api/news', (req, res) => {
  res.json([
    { title: 'New Enzyme Degrading Plastic', category: 'Innovation', summary: 'Scientists find bacteria that eats PET.' },
    { title: 'Global Plastic Treaty', category: 'Policy', summary: 'UN agrees on binding rules.' },
    { title: 'E-Waste Gold Rush', category: 'Tech', summary: 'Recycling smartphones is now profitable.' }
  ]);
});

// Dynamic Events
app.get('/api/events', (req, res) => {
  res.json([
    { title: 'Beach Cleanup', location: 'Santa Monica', day: '12 OCT' },
    { title: 'E-Waste Drive', location: 'City Hall', day: '15 OCT' }
  ]);
});

// --- 3. Serve Frontend (SPA Build) ---
const possiblePaths = [
  path.join(__dirname, '../dist/waste-sort-ai/browser'),
  path.join(__dirname, '../dist/waste-sort-ai')
];
let angularDist = possiblePaths.find(p => fs.existsSync(p));

if (!angularDist) {
  console.error("❌ CRITICAL ERROR: Could not find Angular build folder.");
  angularDist = path.join(__dirname, '../dist/waste-sort-ai');
}

app.use(express.static(angularDist));

// Use regex to catch all routes for SPA support
app.get(/.*/, (req, res) => {
  const indexHtml = path.join(angularDist, 'index.html');
  if (fs.existsSync(indexHtml)) res.sendFile(indexHtml);
  else res.status(404).send("Build not found. Run npm run build.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));