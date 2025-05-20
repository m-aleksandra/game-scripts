import { createContext, useState, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart } from '../api';
import { decrementCartItem as apiDecrementCartItem } from '../api';
import { v4 as uuidv4 } from 'uuid';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [] });
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        let storedId = localStorage.getItem('userId');
        if (!storedId) {
            storedId = uuidv4();
            localStorage.setItem('userId', storedId);
        }
        setUserId(storedId);
    }, []);

    useEffect(() => {
        if (userId) {
            getCart(userId).then(data => {
                if (data) setCart(data);
            });
        }
    }, [userId]);

    const addToCart = async (product) => {
        if (!userId) return;
        const updated = await apiAddToCart(product._id, 1, userId);
        setCart(updated);
        console.log(updated)
    };

    const removeFromCart = async (productId) => {
        if (!userId) return;
        const updated = await apiDecrementCartItem(productId, userId);
        setCart(updated);
    };

    return (
  <CartContext.Provider value={{ cart, addToCart, removeFromCart, userId, setCart }}>
    {children}
  </CartContext.Provider>
);


};
