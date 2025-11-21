const Category = require('../models/Category');

const formatCategory = (category) => ({
  id: category._id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  isActive: category.isActive,
  createdAt: category.createdAt,
});

exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.json({ categories: categories.map(formatCategory) });
  } catch (error) {
    console.error('Failed to fetch categories', error);
    return res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, isActive = true } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required.' });
    }

    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return res.status(409).json({ message: 'Category with same name or slug already exists.' });
    }

    const category = await Category.create({ name, slug, description, isActive });
    return res.status(201).json({ category: formatCategory(category) });
  } catch (error) {
    console.error('Failed to create category', error);
    return res.status(500).json({ message: 'Failed to create category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await Category.findByIdAndUpdate(id, updates, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.json({ category: formatCategory(category) });
  } catch (error) {
    console.error('Failed to update category', error);
    return res.status(500).json({ message: 'Failed to update category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete category', error);
    return res.status(500).json({ message: 'Failed to delete category' });
  }
};
