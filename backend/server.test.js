import request from 'supertest';
import { app } from './server.js';
import { jest } from '@jest/globals';

describe('Server API Tests', () => {
  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('GET /api/recipes should return an array of recipes', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });
});
