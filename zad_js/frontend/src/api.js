import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchProducts = () => axios.get(`${API_URL}/products`).then(res => res.data);
export const fetchCategories = () => axios.get(`${API_URL}/categories`).then(res => res.data);
export const getCart = (userId) => axios.get(`${API_URL}/cart/${userId}`).then(res => res.data);
export const addToCart = (productId, quantity = 1, userId) => axios.post(`${API_URL}/cart/${userId}/add`, { productId, quantity }).then(res => res.data);
export const decrementCartItem = (productId, userId) => axios.patch(`${API_URL}/cart/${userId}/decrement/${productId}`).then(res => res.data);
export const payForCart = (userId, email, cardNumber) => axios.post(`${API_URL}/checkout`, { userId, email, cardNumber }).then(res => res.data);

