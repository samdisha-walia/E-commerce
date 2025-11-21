const path = require('path');
const { pathToFileURL } = require('url');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const Product = require('../models/Product');

const loadFrontendProducts = async () => {
  const frontendFile = path.resolve(__dirname, '../../vite-frontend/src/data/products.js');
  const moduleUrl = pathToFileURL(frontendFile).href;
  const dataModule = await import(moduleUrl);
  return dataModule.default || dataModule.products || [];
};

const normalizeProducts = (products) =>
  products.map((item, index) => ({
    title: item.title || item.name || `Product ${index + 1}`,
    price: item.price ?? 0,
    category: item.category || 'General',
    description: item.description || '',
    image: item.image || '',
  }));

(async () => {
  try {
    const frontendProducts = await loadFrontendProducts();

    if (!Array.isArray(frontendProducts) || !frontendProducts.length) {
      throw new Error('No products found in vite-frontend/src/data/products.js');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const catalog = normalizeProducts(frontendProducts);

    await Product.deleteMany({});
    await Product.insertMany(catalog);

    console.log(`✅ Seeded ${catalog.length} products into MongoDB.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed products:', error.message);
    process.exit(1);
  }
})();
