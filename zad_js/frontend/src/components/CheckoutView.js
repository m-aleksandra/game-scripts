import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { payForCart } from '../api';

const CheckoutView = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [card, setCard] = useState('');
  const [message, setMessage] = useState('');

  const { userId, setCart } = useContext(CartContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await payForCart(userId, email, card);
      setMessage(res.message);
      setCart({ items: [] });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br />
        <input
          type="text"
          required
          pattern="\d{14}"
          placeholder="Credit Card Number (14 digits)"
          value={card}
          onChange={e => setCard(e.target.value)}
        /><br />
        <button type="submit">Pay</button>
        <button type="button" onClick={onBack} style={{ marginLeft: '1rem' }}>Back</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CheckoutView;
