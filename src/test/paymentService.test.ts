import request from 'supertest';
import express from 'express';
import { createPaymentIntent } from '../paymentService';

jest.mock('stripe'); // Use the manual mock

const app = express();
app.use(express.json());
app.post('/create-payment-intent', createPaymentIntent);

describe('POST /create-payment-intent', () => {
  it('returns 200 and clientSecret for valid input', async () => {
    const res = await request(app).post('/create-payment-intent').send({
      amount: 500,
      currency: 'usd',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('clientSecret', 'mocked_client_secret');
  });

  it('returns 400 for invalid input', async () => {
    const res = await request(app).post('/create-payment-intent').send({
      amount: 0,
      currency: 'usd',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
