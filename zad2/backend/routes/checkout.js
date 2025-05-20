const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.post('/', async (req, res) => {
  const { userId, email, cardNumber } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    const digitsOnly = cardNumber.replace(/\D/g, '');
    if (digitsOnly.length !== 14) {
      return res.status(400).json({ success: false, message: 'Card number must be exactly 14 digits.' });
    }

    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.json({ success: true, message: 'Payment successful. Thank you!' });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
