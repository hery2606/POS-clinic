const express = require('express');
const midtransClient = require('midtrans-client');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Init Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Health check endpoint (untuk testing)
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Endpoint untuk create transaction
app.post('/api/create-transaction', async (req, res) => {
  try {
    const { order_id, amount, customer_name, customer_email } = req.body;

    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: customer_name || 'Customer',
        email: customer_email || 'customer@example.com'
      }
    };

    const transaction = await snap.createTransaction(parameter);
    res.json({ 
      token: transaction.token, 
      redirect_url: transaction.redirect_url 
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Webhook untuk notifikasi pembayaran
app.post('/api/midtrans-notification', async (req, res) => {
  try {
    const notification = req.body;
    const statusResponse = await snap.transaction.notification(notification);
    
    console.log('Payment Notification:', statusResponse);
    
    // Di sini Anda bisa update database
    // updateOrderStatus(statusResponse.order_id, statusResponse.transaction_status);
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Test health: http://localhost:${PORT}/api/health`);
});