const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.post('/:userId/add', async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.params.userId });

  if (!cart) cart = new Cart({ userId: req.params.userId, items: [] });

  const index = cart.items.findIndex(item => item.productId.equals(productId));
  if (index >= 0) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  await cart.populate('items.productId');
  res.json(cart);

});

router.get('/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
  res.json(cart);
});

router.patch('/:userId/decrement/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  const cart = await Cart.findOne({ userId });

  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const index = cart.items.findIndex(item => item.productId.toString() === productId);
  if (index === -1) return res.status(404).json({ message: 'Product not in cart' });

  if (cart.items[index].quantity > 1) {
    cart.items[index].quantity -= 1;
  } else {
    cart.items.splice(index, 1);
  }

  await cart.save();
  await cart.populate('items.productId');
  res.json(cart);


});


module.exports = router;