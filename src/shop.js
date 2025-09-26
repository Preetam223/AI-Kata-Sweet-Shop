class Shop {
  constructor() {
    this.products = new Map(); // id -> {id,name,price}
    this.inventory = new Map(); // id -> number
  }

  addProduct(product, amount = 0) {
    if (!product || !product.id) throw new Error('Invalid product');
    this.products.set(product.id, { id: product.id, name: product.name, price: product.price });
    this.inventory.set(product.id, amount);
  }

  getProduct(id) {
    const p = this.products.get(id);
    if (!p) return null;
    return { ...p, stock: this.getStock(id) };
  }

  getStock(id) {
    return this.inventory.get(id) || 0;
  }

  restock(id, amount) {
    if (amount <= 0) throw new Error('Restock amount must be positive');
    this.inventory.set(id, this.getStock(id) + amount);
  }

  purchase(items = []) {
    if (!Array.isArray(items) || items.length === 0) throw new Error('No items to purchase');

    for (const it of items) {
      if (!this.products.has(it.id)) throw new Error(`Unknown product ${it.id}`);
      if (!Number.isInteger(it.quantity) || it.quantity <= 0) throw new Error('Invalid quantity');
      if (this.getStock(it.id) < it.quantity) throw new Error(`Insufficient stock for ${it.id}`);
    }

    let total = 0;
    const receipt = items.map(it => {
      const p = this.products.get(it.id);
      const lineTotal = p.price * it.quantity;
      total += lineTotal;
      this.inventory.set(it.id, this.getStock(it.id) - it.quantity);
      return { id: it.id, name: p.name, unitPrice: p.price, quantity: it.quantity, lineTotal };
    });

    return { items: receipt, total };
  }
}

module.exports = Shop;
