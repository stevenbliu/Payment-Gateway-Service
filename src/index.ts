import express from 'express';
import { createPaymentIntent } from './paymentService';  // Importing from paymentService.ts

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON (Express built-in middleware)
app.use(express.json());  // Using express.json() instead of body-parser

// Define API route
app.post('/create-payment-intent', createPaymentIntent);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
