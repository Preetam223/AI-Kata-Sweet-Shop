const request = require('supertest');
const app = require('../src/server');

describe('Shop API', () => {
  test('GET /products returns products with stock', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('stock');
  });

  test('POST /purchase reduces stock and returns receipt', async () => {
    const res = await request(app)
      .post('/purchase')
      .send({ items: [{ id: 'p1', quantity: 2 }] });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(20);
  });

  test('POST /purchase fails with insufficient stock', async () => {
    const res = await request(app)
      .post('/purchase')
      .send({ items: [{ id: 'p1', quantity: 999 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Insufficient stock/);
  });
});
