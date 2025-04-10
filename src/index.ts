import express from 'express';
import bodyParser from 'body-parser';
import { createPaymentIntent } from './paymentService';

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Define API route
app.post('/create-payment-intent', createPaymentIntent);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
