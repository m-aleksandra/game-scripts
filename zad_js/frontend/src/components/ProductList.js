import React, { useEffect, useState, useContext } from 'react';
import { fetchProducts } from '../api';
import { CartContext } from '../context/CartContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    return (
        <div>
            <h2>Product List</h2>
            {products?.map(product => (
                <div key={product._id}>
                    <h3>{product.name}</h3>
                    <p>Price: {product.price}$</p>
                    <button onClick={() => addToCart(product)}>Add to cart</button>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
