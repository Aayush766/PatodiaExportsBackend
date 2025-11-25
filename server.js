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

const app = express();

// CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DEBUG: log every request
app.use((req, res, next) => {
  console.log('➡️', req.method, req.originalUrl);
  next();
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 🔗 Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Patodia Exports API is running...');
});

// Custom 404 – MUST be last
app.use((req, res, next) => {
  console.log('❌ 404 for path:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Not Found', path: req.originalUrl });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
