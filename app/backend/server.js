require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Stripe = require('stripe');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors({ origin: 'http://localhost:4200' })); // Allow Angular App
app.use(express.json());

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- SCHEMAS ---
const ListingSchema = new mongoose.Schema({
  title: String,
  price: String,
  condition: String,
  emoji: String,
  contactEmail: String,
  sellerId: String, // From Clerk/Auth
  createdAt: { type: Date, default: Date.now }
});
const Listing = mongoose.model('Listing', ListingSchema);

// --- ROUTES ---

// 1. AI Analysis Endpoint (Securely call Gemini from backend)
app.post('/api/analyze', async (req, res) => {
  try {
    const { item } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
    
    const prompt = `Analyze "${item}" for waste sorting. Return JSON:
    { "disposal_method": "String", "bin_color": "String", "handling_instructions": "String", 
      "upcycling_ideas": ["String"], "environmental_impact": "String", 
      "recyclability_score": Number(1-10), "sdg_connection": "String" }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Clean up markdown if present
    const cleanJson = response.text().replace(/```json|```/g, '').trim();
    res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Analysis Failed" });
  }
});

// 2. Marketplace Endpoints (MongoDB)
app.get('/api/listings', async (req, res) => {
  const listings = await Listing.find().sort({ createdAt: -1 });
  res.json(listings);
});

app.post('/api/listings', async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: "Failed to save listing" });
  }
});

// 3. Stripe Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500, // $5.00
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));