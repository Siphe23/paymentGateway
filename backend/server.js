const express = require('express');
const stripe = require('stripe')('sk_test_51Q7YPz09Ta8MClJBdGmuN1Hhvm0X1SVdeECUe8Sd0EtBzKL3sRIyLZVC06Na4p8Xe4thX6qxjxkGhov4Mm5njOLU00vYjVbOQ3'); // Your secret key

const app = express();
app.use(express.json()); // Enable JSON body parsing middleware
const cors = require('cors');
app.use(cors());

// Endpoint to create payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Log the incoming request body to check if it's correctly parsed
    console.log('Received data:', req.body);  // Should log { amount: 1850, currency: 'ZAR' }

    // Ensure that amount and currency are provided in the request body
    if (!amount || !currency) {
      return res.status(400).json({ error: 'Missing required param: amount or currency.' });
    }

    // Create the payment intent with the amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'], // You can specify the types of payment methods you want to support
    });

    // Return the payment intent client secret to the frontend
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: null,  // Optional: Add logic to generate an ephemeral key if needed
      customer: null,      // Optional: Add logic to create or retrieve a customer
    });

  } catch (error) {
    console.error(error);
    // Return error response in case of any issues
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
