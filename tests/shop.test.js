const Shop = require('../src/shop');

describe('Shop (basic TDD)', () => {
  test('addProduct should store product and stock', () => {
    const shop = new Shop();
    shop.addProduct({ id: 'p1', name: 'Choco', price: 10 }, 5);
    const p = shop.getProduct('p1');
    expect(p.name).toBe('Choco');
    expect(p.stock).toBe(5);
  });

  test('purchase reduces stock and returns total', () => {
    const shop = new Shop();
    shop.addProduct({ id: 'p1', name: 'Choco', price: 10 }, 5);
    const receipt = shop.purchase([{ id: 'p1', quantity: 2 }]);
    expect(receipt.total).toBe(20);
    expect(shop.getStock('p1')).toBe(3);
  });

  test('throws when insufficient stock', () => {
    const shop = new Shop();
    shop.addProduct({ id: 'p2', name: 'Candy', price: 5 }, 1);
    expect(() => shop.purchase([{ id: 'p2', quantity: 2 }])).toThrow(/Insufficient stock/);
  });

  test('restock increases stock', () => {
    const shop = new Shop();
    shop.addProduct({ id: 'p3', name: 'Toffee', price: 3 }, 0);
    shop.restock('p3', 10);
    expect(shop.getStock('p3')).toBe(10);
  });
});
