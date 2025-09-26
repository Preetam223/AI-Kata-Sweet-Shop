const express = require('express');
const path = require('path');
const Shop = require('./shop');

const app = express();
const shop = new Shop();

app.use(express.json());

// Seed some products
shop.addProduct({ id: 'p1', name: 'Choco', price: 10 }, 5);
shop.addProduct({ id: 'p2', name: 'Candy', price: 5 }, 10);
shop.addProduct({ id: 'p3', name: 'Toffee', price: 3 }, 8);

// Serve frontend
app.use(express.static(path.join(__dirname, '../client')));

// API routes
app.get('/products', (req, res) => {
  const products = Array.from(shop.products.values()).map(p => ({
    ...p,
    stock: shop.getStock(p.id)
  }));
  res.json(products);
});

app.post('/purchase', (req, res) => {
  try {
    const receipt = shop.purchase(req.body.items);
    res.json(receipt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
