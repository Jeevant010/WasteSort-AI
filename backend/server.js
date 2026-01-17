require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// 1. FIRST: Apply body parsing middleware
app.use(express.json({ limit: "1mb" }));

// 2. CORS Configuration - SIMPLIFIED & RELIABLE
const allowedOrigins = [
  "http://localhost:4200",
  "http://127.0.0.1:4200",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

// If you have ALLOWED_ORIGINS in .env, use it
if (process.env.ALLOWED_ORIGINS) {
  const envOrigins = process.env.ALLOWED_ORIGINS.split(",").map((s) =>
    s.trim(),
  );
  allowedOrigins.push(...envOrigins);
}

// CORS middleware configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Check if it's a localhost origin for development convenience
      if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked: ${origin}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: false,
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// 3. Apply CORS middleware globally
app.use(cors(corsOptions));

// 4. Handle preflight requests for ALL routes - FIXED: Use regex instead of '*'
app.options(/.*/, cors(corsOptions));

// ALTERNATIVE: Manual preflight handler for all routes
// Use a regex to match all paths to avoid path-to-regexp parsing '*' as a parameter
app.options(/.*/, (req, res) => {
  const origin = req.headers.origin;
  if (
    allowedOrigins.includes(origin) ||
    !origin ||
    /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
  ) {
    res.header("Access-Control-Allow-Origin", origin || allowedOrigins[0]);
  }
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.status(200).end();
});

// Health check - no CORS issues here
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    ts: new Date().toISOString(),
    cors: "enabled",
    origins: allowedOrigins,
  });
});

// Test CORS endpoint
app.get("/api/test-cors", (req, res) => {
  res.json({
    message: "CORS is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

// AI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));
} else {
  console.warn("⚠️ MONGODB_URI not set. Database features disabled.");
}

// --- Schemas & Models ---
const ListingSchema = new mongoose.Schema({
  title: String,
  price: String,
  condition: String,
  contact: String,
  emoji: String,
  sellerId: String,
  sellerName: String,
  createdAt: { type: Date, default: Date.now },
});
const Listing = mongoose.model("Listing", ListingSchema);

const ChallengeSchema = new mongoose.Schema({
  day: Number,
  completed: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});
const Challenge = mongoose.model("Challenge", ChallengeSchema);

const CarbonSchema = new mongoose.Schema({
  commute: String,
  diet: String,
  score: Number,
  createdAt: { type: Date, default: Date.now },
});
const Carbon = mongoose.model("Carbon", CarbonSchema);

const VolunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  interests: String,
  createdAt: { type: Date, default: Date.now },
});
const Volunteer = mongoose.model("Volunteer", VolunteerSchema);

const ContactSchema = new mongoose.Schema({
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", ContactSchema);

// --- API Routes ---

// MAIN ANALYZE ENDPOINT - with explicit CORS headers
app.post("/api/analyze", async (req, res) => {
  try {
    console.log("Analyze request received from origin:", req.headers.origin);
    console.log("Request body:", req.body);

    const { item } = req.body;
    if (!item) {
      return res.status(400).json({ error: "Item is required" });
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
      console.warn("GEMINI_API_KEY not set, using mock response");
      // Mock response for testing
      const mockResponses = [
        {
          disposal_method: "Recycling",
          bin_color: "Blue",
          handling_instructions: "Clean and dry before recycling",
          environmental_impact:
            "Reduces landfill waste and conserves resources",
          sdg_connection: "SDG 12: Responsible Consumption and Production",
        },
        {
          disposal_method: "Composting",
          bin_color: "Green",
          handling_instructions: "Remove non-compostable packaging first",
          environmental_impact: "Reduces methane emissions from landfills",
          sdg_connection: "SDG 13: Climate Action",
        },
        {
          disposal_method: "Landfill",
          bin_color: "Black",
          handling_instructions: "Dispose in general waste bin",
          environmental_impact: "Contributes to landfill growth",
          sdg_connection: "SDG 11: Sustainable Cities and Communities",
        },
      ];

      const randomResponse =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];
      return res.json(randomResponse);
    }

    // Use specific model as requested
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze "${item}" for waste sorting. Return JSON only with no additional text:
    { 
      "disposal_method": "String", 
      "bin_color": "String", 
      "handling_instructions": "String", 
      "environmental_impact": "String", 
      "sdg_connection": "String" 
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    // Clean up code fences
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const analysis = JSON.parse(text);
    console.log("Analysis result:", analysis);
    res.json(analysis);
  } catch (error) {
    console.error("AI Error:", error.message);

    // Fallback mock response on error
    const mockResponses = [
      {
        disposal_method: "Recycling",
        bin_color: "Blue",
        handling_instructions: "Clean and dry before recycling",
        environmental_impact: "Reduces landfill waste and conserves resources",
        sdg_connection: "SDG 12: Responsible Consumption and Production",
      },
      {
        disposal_method: "Composting",
        bin_color: "Green",
        handling_instructions: "Remove non-compostable packaging first",
        environmental_impact: "Reduces methane emissions from landfills",
        sdg_connection: "SDG 13: Climate Action",
      },
      {
        disposal_method: "Landfill",
        bin_color: "Black",
        handling_instructions: "Dispose in general waste bin",
        environmental_impact: "Contributes to landfill growth",
        sdg_connection: "SDG 11: Sustainable Cities and Communities",
      },
    ];

    const randomResponse =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];
    res.json(randomResponse);
  }
});

// Other API endpoints
app.get("/api/listings", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (e) {
    console.error("Listings error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/listings", async (req, res) => {
  try {
    const created = await new Listing(req.body).save();
    res.json(created);
  } catch (e) {
    console.error("Create listing error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/challenge", async (req, res) => {
  try {
    const progress = await Challenge.find({ completed: true });
    res.json(progress.map((p) => p.day));
  } catch (e) {
    console.error("Challenge error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/challenge", async (req, res) => {
  try {
    const { day, completed } = req.body;
    await Challenge.findOneAndUpdate({ day }, { completed }, { upsert: true });
    res.json({ success: true });
  } catch (e) {
    console.error("Update challenge error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/carbon", async (req, res) => {
  try {
    const { commute, diet } = req.body;
    let score = 1000;
    if (commute?.includes("Car")) score += 500;
    if (commute?.includes("EV")) score += 200;
    if (diet?.includes("Meat")) score += 600;
    if (diet?.includes("Vegan")) score -= 100;
    await new Carbon({ commute, diet, score }).save();
    res.json({ score });
  } catch (e) {
    console.error("Carbon error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/volunteer", async (req, res) => {
  try {
    await new Volunteer(req.body).save();
    res.json({ success: true });
  } catch (e) {
    console.error("Volunteer error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    await new Contact(req.body).save();
    res.json({ success: true });
  } catch (e) {
    console.error("Contact error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/news", (req, res) => {
  res.json([
    {
      title: "New Enzyme Degrading Plastic",
      category: "Innovation",
      summary: "Scientists find bacteria that eats PET.",
    },
    {
      title: "Global Plastic Treaty",
      category: "Policy",
      summary: "UN agrees on binding rules.",
    },
    {
      title: "E-Waste Gold Rush",
      category: "Tech",
      summary: "Recycling smartphones is now profitable.",
    },
  ]);
});

app.get("/api/events", (req, res) => {
  res.json([
    { title: "Beach Cleanup", location: "Santa Monica", day: "12 OCT" },
    { title: "E-Waste Drive", location: "City Hall", day: "15 OCT" },
  ]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  if (err.message.includes("CORS")) {
    return res.status(403).json({
      error: "CORS Error",
      message: err.message,
      allowedOrigins: allowedOrigins,
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server (use 3001 by default to avoid conflicts with other dev servers)
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
  console.log(`📡 Also accessible on http://0.0.0.0:${PORT}`);
  console.log(`✅ CORS enabled for origins:`, allowedOrigins);
  console.log(`✅ Test CORS at: http://localhost:${PORT}/api/health`);
  console.log("✅ Test analyze endpoint:");
  console.log("   curl -X POST http://localhost:" + PORT + "/api/analyze \\");
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d "{\"item\":\"plastic bottle\"}"');
});
