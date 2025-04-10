import Stripe from 'stripe';
import { Request, Response } from 'express';

// Load environment variables from .env
import dotenv from 'dotenv';
dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// Function to handle payment
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;

    // Create a PaymentIntent object
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      automatic_payment_methods: { enabled: true },
    });

    // Return client secret from PaymentIntent for frontend to use
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment failed' });
  }
};
