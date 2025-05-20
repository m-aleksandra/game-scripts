import React, { useState } from 'react';
import ProductList from './components/ProductList';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import { CartProvider } from './context/CartContext';

const App = () => {
  const [view, setView] = useState('products');

  return (
    <CartProvider>
      <div>
        <h1>Sklep Online</h1>
        <button onClick={() => setView('products')}>Product List</button>
        <button onClick={() => setView('cart')}>View Cart</button>
        <button onClick={() => setView('checkout')}>Checkout</button>
        <hr />
        {view === 'products' && <ProductList />}
        {view === 'cart' && <CartView />}
        {view === 'checkout' && <CheckoutView onBack={() => setView('cart')} />}
      </div>
    </CartProvider>
  );
};

export default App;
