// Test script to verify checkout flow
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testCheckout() {
  try {
    // Create a test payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 42999, // $429.99 in cents
      currency: 'usd',
      metadata: {
        orderId: 'test-order-123',
        customerEmail: 'test@example.com'
      }
    });

    console.log('✅ Payment intent created:', paymentIntent.id);
    console.log('Client secret:', paymentIntent.client_secret);

    // Test webhook endpoint
    console.log('\n🔗 Test your webhook endpoint:');
    console.log('POST https://your-domain.com/api/stripe-webhook');
    console.log('Use Stripe CLI: stripe listen --forward-to localhost:3000/api/stripe-webhook');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCheckout();
