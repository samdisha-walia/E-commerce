const Product = require('../models/Product');
const Category = require('../models/Category');

const formatProduct = (product) => ({
  id: product._id,
  name: product.name,
  price: product.price,
  category: product.category,
  quantity: product.quantity,
  image: product.image,
  productId: product.productId,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category').sort({ createdAt: -1 });
    return res.json({ products: products.map(formatProduct) });
  } catch (error) {
    console.error('Failed to fetch products', error);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, categoryId, image = '', quantity = 0, productId } = req.body;

    if (!name || typeof price !== 'number' || !categoryId || !productId) {
      return res.status(400).json({ message: 'Name, price, category, and productId are required.' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const product = await Product.create({
      name,
      price,
      category: categoryId,
      image,
      quantity,
      productId,
    });

    await product.populate('category');
    return res.status(201).json({ product: formatProduct(product) });
  } catch (error) {
    console.error('Failed to create product', error);
    return res.status(500).json({ message: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.categoryId) {
      const category = await Category.findById(updates.categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }
      updates.category = updates.categoryId;
      delete updates.categoryId;
    }

    const allowedFields = ['name', 'price', 'quantity', 'image', 'productId', 'category'];
    Object.keys(updates).forEach((key) => {
      if (!allowedFields.includes(key)) {
        delete updates[key];
      }
    });

    const product = await Product.findByIdAndUpdate(id, updates, { new: true }).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ product: formatProduct(product) });
  } catch (error) {
    console.error('Failed to update product', error);
    return res.status(500).json({ message: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete product', error);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};
