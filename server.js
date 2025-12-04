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
   CORS CONFIG
   - Allows local Vite/React ports
   - Allows admin + main Patodia Exports domains
------------------------------------------ */
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:3000',

  // Production domains (adjust if needed)
  'https://patodiaexports.com',
  'https://www.patodiaexports.com',
  'https://admin.patodiaexports.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser tools like Postman/cURL (no Origin header)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return allowed === origin;
    });

    if (isAllowed) {
      return callback(null, true);
    }

    console.log('🚫 Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS
app.use(cors(corsOptions));
// Handle preflight requests
app.options('*', cors(corsOptions));

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
   Global Error Handler (includes CORS errors)
------------------------------------------ */
app.use((err, req, res, next) => {
  console.error('🔥 Global Error Handler:', err.message);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS error: Origin not allowed' });
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
