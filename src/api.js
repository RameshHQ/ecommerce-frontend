

import axios from "axios";

const BASE_URL = "https://ecommerce-backend-2qhm.onrender.com/api/";
export const fetchProducts = () => axios.get(`${BASE_URL}products/`);
export const fetchCart = () => axios.get(`${BASE_URL}carts/`);
export const addToCart = (data) => axios.post(`${BASE_URL}carts/`, data);
export const placeOrder = (data) => axios.post(`${BASE_URL}orders/`, data);

