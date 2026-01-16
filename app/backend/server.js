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

// Schema
const ListingSchema = new mongoose.Schema({
  title: String,
  price: String,
  condition: String,
  contact: String,
  createdAt: { type: Date, default: Date.now }
});
const Listing = mongoose.model('Listing', ListingSchema);

// --- 2. API Routes ---

// AI Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { item } = req.body;
    if (!item) return res.status(400).json({ error: "Item is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
    const prompt = `Analyze "${item}" for waste sorting. Return JSON only:
    { "disposal_method": "String", "bin_color": "String", "handling_instructions": "String", "environmental_impact": "String" }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// Marketplace GET
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// Marketplace POST
app.post('/api/listings', async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: "Could not save listing" });
  }
});

// --- 3. Serve Frontend (Auto-Detect Path) ---

// Define possible paths where Angular might output files
const possiblePaths = [
  path.join(__dirname, '../dist/waste-sort-ai/browser'), // New Angular Builder
  path.join(__dirname, '../dist/waste-sort-ai')         // Standard Build
];

// Find the first path that actually exists
let angularDist = possiblePaths.find(p => fs.existsSync(p));

if (!angularDist) {
  console.error("❌ CRITICAL ERROR: Could not find Angular build folder.");
  console.error("   Tried checking:", possiblePaths);
  console.error("   Please run 'npm run build' in the root folder first!");
  // Fallback to avoid crash, but app won't work
  angularDist = path.join(__dirname, '../dist/waste-sort-ai');
} else {
  console.log(`✅ Serving Frontend from: ${angularDist}`);
}

// Serve static files
app.use(express.static(angularDist));

// Catch-all route
// FIX: Using Regex /.*/ avoids "Missing parameter name" error in newer Express versions
app.get(/.*/, (req, res) => {
  const indexHtml = path.join(angularDist, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.status(404).send(`Error: index.html not found in ${angularDist}. Did you run 'npm run build'?`);
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));