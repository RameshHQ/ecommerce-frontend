

import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/";
export const fetchProducts = () => axios.get(`${BASE_URL}products/`);
export const fetchCart = () => axios.get(`${BASE_URL}carts/`);
export const addToCart = (data) => axios.post(`${BASE_URL}carts/`, data);
export const placeOrder = (data) => axios.post(`${BASE_URL}orders/`, data);

