import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Received webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  try {
    // Extract order data from session metadata
    const orderItems = JSON.parse(session.metadata?.orderItems || '[]');
    const shippingAddress = JSON.parse(session.metadata?.shippingAddress || '{}');
    const billingAddress = JSON.parse(session.metadata?.billingAddress || '{}');
    const email = session.metadata?.email || session.customer_email;

    // Create order in DynamoDB (you'll need to implement this)
    const orderData = {
      id: `order_${Date.now()}`,
      customerEmail: email,
      customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      items: orderItems,
      subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : 0,
      tax: session.total_details?.amount_tax ? session.total_details.amount_tax / 100 : 0,
      shipping: session.total_details?.amount_shipping ? session.total_details.amount_shipping / 100 : 0,
      total: session.amount_total ? session.amount_total / 100 : 0,
      status: 'processing',
      shippingAddress,
      billingAddress,
      paymentIntentId: session.payment_intent as string,
      stripeSessionId: session.id,
      shippingMethod: 'standard',
      trackingNumber: '',
      notes: '',
      quickbooksInvoiceId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to DynamoDB
    await saveOrderToDynamoDB(orderData);

    // Update inventory
    await updateInventory(orderItems);

    // Create QuickBooks invoice (if configured)
    if (process.env.QB_CLIENT_ID) {
      await createQuickBooksInvoice(orderData);
    }

    // Send confirmation email
    await sendOrderConfirmationEmail(orderData);

    console.log('Order processed successfully:', orderData.id);

  } catch (error) {
    console.error('Error processing checkout session:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  // Additional payment success logic if needed
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  // Handle payment failure (notify customer, update order status, etc.)
}

// Helper functions (implement these based on your needs)
async function saveOrderToDynamoDB(orderData: any) {
  // Implement DynamoDB save logic
  console.log('Saving order to DynamoDB:', orderData.id);
}

async function updateInventory(items: any[]) {
  // Implement inventory update logic
  console.log('Updating inventory for items:', items);
}

async function createQuickBooksInvoice(orderData: any) {
  // Implement QuickBooks integration
  console.log('Creating QuickBooks invoice for order:', orderData.id);
}

async function sendOrderConfirmationEmail(orderData: any) {
  // Implement email sending logic
  console.log('Sending confirmation email for order:', orderData.id);
}
