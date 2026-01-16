require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Allow requests from Angular Local (4200) & Vercel
app.use(cors({
  origin: ['http://localhost:4200', 'https://wastesort-ai.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// --- MongoDB Connection ---
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecosort";
mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// --- Schemas ---
const ListingSchema = new mongoose.Schema({
  title: String, price: String, condition: String, contact: String, emoji: String,
  sellerId: String, sellerName: String,
  createdAt: { type: Date, default: Date.now }
});
const Listing = mongoose.model('Listing', ListingSchema);

const ChallengeSchema = new mongoose.Schema({
  day: Number, completed: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});
const Challenge = mongoose.model('Challenge', ChallengeSchema);

const CarbonSchema = new mongoose.Schema({
  commute: String, diet: String, score: Number,
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

app.get('/', (req, res) => {
  res.send('EcoSort API is running (2-Server Mode)');
});

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

app.get('/api/listings', async (req, res) => {
  const listings = await Listing.find().sort({ createdAt: -1 });
  res.json(listings);
});
app.post('/api/listings', async (req, res) => {
  try { await new Listing(req.body).save(); res.status(201).json({ success: true }); } 
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/challenge', async (req, res) => {
  const progress = await Challenge.find({ completed: true });
  res.json(progress.map(p => p.day));
});
app.post('/api/challenge', async (req, res) => {
  const { day, completed } = req.body;
  await Challenge.findOneAndUpdate({ day }, { completed }, { upsert: true });
  res.json({ success: true });
});

app.post('/api/carbon', async (req, res) => {
  const { commute, diet } = req.body;
  let score = 1000;
  if (commute.includes('Car')) score += 500;
  if (diet.includes('Meat')) score += 600;
  await new Carbon({ commute, diet, score }).save();
  res.json({ score });
});

app.post('/api/volunteer', async (req, res) => {
  await new Volunteer(req.body).save();
  res.json({ success: true });
});
app.post('/api/contact', async (req, res) => {
  await new Contact(req.body).save();
  res.json({ success: true });
});

// Dynamic News via AI
app.get('/api/news', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
    const prompt = `Generate 3 recent, positive environmental news headlines from this year. 
    Return a valid JSON array of objects with keys: title, category, summary, source. 
    Example: [{"title": "Ocean Cleanup", "category": "Innovation", "summary": "...", "source": "BBC"}]`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    res.json(JSON.parse(text));
  } catch (e) {
    // Fallback if AI fails
    res.json([
      { title: 'New Enzyme Degrading Plastic', category: 'Innovation', summary: 'Scientists find bacteria that eats PET.', source: 'Science Daily' },
      { title: 'Global Plastic Treaty', category: 'Policy', summary: 'UN agrees on binding rules.', source: 'UN News' }
    ]);
  }
});

// Dynamic Events via AI
app.get('/api/events', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
    const prompt = `Generate 3 realistic upcoming community eco-events for the current month.
    Return a valid JSON array of objects with keys: title, location, day (e.g. "12 OCT").`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    res.json(JSON.parse(text));
  } catch (e) {
    res.json([
      { title: 'Beach Cleanup', location: 'Santa Monica', day: '12 OCT' },
      { title: 'E-Waste Drive', location: 'City Hall', day: '15 OCT' }
    ]);
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 API Server running on port ${PORT}`));
}

module.exports = app;