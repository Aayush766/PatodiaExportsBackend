// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const aboutRoutes = require('./routes/aboutRoutes');

const app = express();

/* -----------------------------------------
   🔥 CORS FIX: Works for ALL local Vite ports
------------------------------------------ */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:3000',
  'https://wwww.patodiaexport.com',
  'https://patodiaexport.com',
  'https://admin.patodiaexport.com',

];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman/cURL
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log('🚫 Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
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
   Debug every request
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
  .then(() => console.log('MongoDB Connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

/* -----------------------------------------
   Mount Routes
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
  console.log('❌ 404 for path:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Not Found', path: req.originalUrl });
});

/* -----------------------------------------
   Start Server
------------------------------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
