import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const CartView = () => {
    const { cart, removeFromCart } = useContext(CartContext);

    if (!cart || cart.items.length === 0) {
        return <div><h2>Your cart is empty</h2></div>;
    }

    return (
        
        <div>

            <h2>Your Cart</h2>
            <ul>
                {cart.items.map(({ productId, quantity }) => (
                    <li key={productId._id}>
                        <strong>{productId.name}</strong> — {quantity} pcs — ${(productId.price * quantity).toFixed(2)}
                        <button onClick={() => removeFromCart(productId._id)} style={{ marginLeft: '1rem' }}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
            <hr />
            <strong>
                Total: $
                {cart.items.reduce((total, item) =>
                    total + item.quantity * item.productId.price, 0).toFixed(2)}
            </strong>

        </div>
    );
};

export default CartView;
