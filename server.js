// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// ---- Route Imports ----
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const aboutRoutes = require('./routes/aboutRoutes');

const app = express();

/* -----------------------------------------
   🔓 SIMPLE CORS (LET IT WORK)
   - Allows ALL origins (good enough for public API)
   - If you want to restrict later, we can tighten it
------------------------------------------ */
app.use(
  cors({
    origin: true,          // Reflects the request origin in Access-Control-Allow-Origin
    credentials: true,     // Allow credentials if ever needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* -----------------------------------------
   Body Parsers
------------------------------------------ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -----------------------------------------
   Simple Request Logger
------------------------------------------ */
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

/* -----------------------------------------
   MongoDB Connection
------------------------------------------ */
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

/* -----------------------------------------
   API Routes
------------------------------------------ */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/about', aboutRoutes);

/* -----------------------------------------
   Root Route
------------------------------------------ */
app.get('/', (req, res) => {
  res.send('Patodia Exports API is running...');
});

/* -----------------------------------------
   404 Handler
------------------------------------------ */
app.use((req, res, next) => {
  console.log('❌ 404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Not Found', path: req.originalUrl });
});

/* -----------------------------------------
   Global Error Handler
------------------------------------------ */
app.use((err, req, res, next) => {
  console.error('🔥 Global Error Handler:', err);

  // If response already sent, just end
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ message: 'Internal Server Error' });
});

/* -----------------------------------------
   Start Server
------------------------------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
