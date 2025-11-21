const axios = require('axios');
const Product = require('../models/Product');

const SYSTEM_PROMPT = `You are an AI shopping assistant for an e-commerce store. Answer concisely,
suggest relevant products, highlight offers, and gently guide users to explore the catalog,
cart, or support options available on the site.`;

const parseOllamaStream = async (stream) => {
  let combined = '';

  for await (const chunk of stream) {
    const lines = chunk.toString().split('\n').map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      try {
        const payload = JSON.parse(line);
        if (payload?.message?.content) {
          combined += payload.message.content;
        }
      } catch (err) {
        console.warn('Failed to parse Ollama chunk:', err.message);
      }
    }
  }

  return combined.trim();
};

const CATEGORY_KEYWORDS = {
  Electronics: ['electronic', 'electronics', 'gadget', 'phone', 'smartphone', 'laptop', 'earbud', 'earbuds', 'headphone', 'camera', 'smart watch', 'smartwatch'],
  Clothing: ['cloth', 'clothing', 't-shirt', 'dress', 'jean', 'shirt', 'kurti'],
  Footwear: ['shoe', 'sneaker', 'footwear', 'sandals']
};

const detectCategoryIntent = (text = '') => {
  const normalized = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }
  return null;
};

const buildProductContext = async (category) => {
  const filter = category ? { category } : {};
  const products = await Product.find(filter).limit(8);

  if (!products.length) return null;

  const summary = products
    .map((product) => {
      const name = product.title || product.name || 'Product';
      const formattedPrice =
        typeof product.price === 'number' ? `₹${product.price.toFixed(2)}` : 'Price on request';
      return `• ${name} — ${formattedPrice}${product.description ? ` | ${product.description}` : ''}`;
    })
    .join('\n');

  return `Inventory snapshot (${category || 'all catalog'}):\n${summary}`;
};

const sanitizeHistory = (history = []) => {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (entry) =>
        entry &&
        typeof entry.role === 'string' &&
        typeof entry.content === 'string' &&
        entry.role.trim() &&
        entry.content.trim()
    )
    .slice(-10);
};

const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const userMessage = message.trim();
    const intentCategory = detectCategoryIntent(userMessage);

    let dynamicContext = null;
    if (intentCategory) {
      dynamicContext = await buildProductContext(intentCategory);
    }

    if (!dynamicContext) {
      const fallbackContext = await buildProductContext(null);
      dynamicContext = fallbackContext;
    }

    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(dynamicContext ? [{ role: 'system', content: dynamicContext }] : []),
      ...sanitizeHistory(history),
      { role: 'user', content: userMessage },
    ];

    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3.2';

    const keepAlive = process.env.OLLAMA_KEEP_ALIVE || '10m';
    const timeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS) || 60000;

    const response = await axios.post(
      `${ollamaUrl.replace(/\/$/, '')}/api/chat`,
      {
        model,
        messages: chatMessages,
        stream: true,
        keep_alive: keepAlive,
      },
      {
        timeout: timeoutMs,
        responseType: 'stream',
      }
    );

    const reply = await parseOllamaStream(response.data);

    if (!reply) {
      return res.status(502).json({ message: 'The AI assistant did not return a response.' });
    }

    return res.json({ reply });
  } catch (error) {
    console.error('AI chat error:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Unable to reach the AI assistant right now.' });
  }
};

module.exports = { chatWithAI };
