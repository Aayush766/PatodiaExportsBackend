const Product = require('../models/product');
const cloudinary = require('cloudinary').v2;

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description } = req.body;
    
   
    const imageSrc = req.file.path; 
    const imagePublicId = req.file.filename; 

    if (!title || !description || !req.file) {
        return res.status(400).json({ message: 'Title, description, and image are required.' });
    }

    const product = new Product({ 
        title, 
        description, 
        imageSrc,
        imagePublicId 
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };

   
    if (req.file) {
     
      updateData.imageSrc = req.file.path;
      updateData.imagePublicId = req.file.filename;

      
      const oldProduct = await Product.findById(req.params.id);
      if (oldProduct && oldProduct.imagePublicId) {
          await cloudinary.uploader.destroy(oldProduct.imagePublicId);
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
       
        if (product.imagePublicId) {
            await cloudinary.uploader.destroy(product.imagePublicId);
        }

        
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};