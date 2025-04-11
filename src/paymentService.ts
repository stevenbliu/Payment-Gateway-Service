import Stripe from 'stripe';
import { Request, Response } from 'express';
import Joi from 'joi';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',  // Ensure this matches the version you're using
});

// Valdation schema for payment intent creation
const paymentSchema = Joi.object({
  amount: Joi.number().integer().min(1).required(),
  currency: Joi.string().valid('usd', 'eur').required(),
});

// Prisma client instance for database operations
const prisma = new PrismaClient();

export async function createPaymentIntent(req: Request, res: Response): Promise<void> {
  const { error } = paymentSchema.validate(req.body);
  if (error) {
    
      res.status(400).json({ error: error.details[0].message });
      return;
  }

  const { amount, currency } = req.body;

  try {
      // Create a PaymentIntent object
      const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // Amount in cents
          currency: currency,
          automatic_payment_methods: { enabled: true },
      });

      // // Store the successful transaction in the database
      // await prisma.transaction.create({
      //     data: {
      //         amount,
      //         currency,
      //         clientSecret: paymentIntent.client_secret!,
      //         status: paymentIntent.status,
      //     },
      // });

      // Return client secret from PaymentIntent for frontend to use
      res.status(200).json({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
          created: paymentIntent.created,
          amount_received: paymentIntent.amount_received,
          currency: paymentIntent.currency,
          payment_method: paymentIntent.payment_method,
      });
  } catch (error) {
      // Store the failed transaction in the database
      // await prisma.transaction.create({
      //     data: {
      //         amount,
      //         currency,
      //         clientSecret: '',
      //         status: 'failed',
      //         errorMessage: (error as Error).message,
      //     },
      // });

      console.error(error);
      res.status(500).json({
          error: 'Payment failed',
          error_message: (error as Error).message,
      });
  }
}

