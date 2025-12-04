// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const aboutRoutes = require('./routes/aboutRoutes');

const app = express();

/* -----------------------------------------
   CORS FIX – Allows all local Vite ports AND
   both www / non-www patodiaexport.com
------------------------------------------ */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:3000',
  'https://admin.patodiaexport.com',
  /^https:\/\/(www\.)?patodiaexport\.com$/
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow Postman, cURL etc.

      const isAllowed = allowedOrigins.some((allowed) => {
        return allowed instanceof RegExp ? allowed.test(origin) : allowed === origin;
      });

      if (isAllowed) return callback(null, true);

      console.log('🚫 Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
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
   Request Logger
------------------------------------------ */
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

/* -----------------------------------------
   MongoDB Connection
------------------------------------------ */
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

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
app.use((req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Not Found', path: req.originalUrl });
});

/* -----------------------------------------
   Start Server
------------------------------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
