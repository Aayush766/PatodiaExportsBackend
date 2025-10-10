const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();


const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes'); // <-- Add this
const authRoutes =require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

const app = express();


app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes); 
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Patodia Exports API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});