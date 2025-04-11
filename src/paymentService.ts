import Stripe from 'stripe';
import { Request, Response } from 'express';
import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',  // Ensure this matches the version you're using
});

const paymentSchema = Joi.object({
  amount: Joi.number().integer().min(1).required(),
  currency: Joi.string().valid('usd', 'eur').required(),
});

export async function createPaymentIntent(req: Request, res: Response): Promise<void> {
    // Validate request body against the schema
    const { error } = paymentSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    
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
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        created: paymentIntent.created,
        amount_received: paymentIntent.amount,
        currency: paymentIntent.currency,
        payment_method: paymentIntent.payment_method,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Payment failed', error_message: (error as Error).message });   
    }
    }

// // Explicitly type the return value to match Express' response expectations
// export const createPaymentIntent = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { error } = paymentSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }

//   try {
//     const { amount, currency } = req.body;

//     // Create a PaymentIntent object
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount, // Amount in cents
//       currency: currency,
//       automatic_payment_methods: { enabled: true },
//     });

//     // Return client secret from PaymentIntent for frontend to use
//     return res.status(200).json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Payment failed' });
//   }
// };
