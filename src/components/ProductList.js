import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductList.css";

const ProductList = ({ onCartUpdate, isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [addedMessage, setAddedMessage] = useState({});

   
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products/")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
    syncCartCount();
  }, [isLoggedIn]);

   
  const syncCartCount = () => {
    if (isLoggedIn) {
      const token = localStorage.getItem("access_token");
      axios.get("http://127.0.0.1:8000/api/cart/", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => onCartUpdate(res.data.reduce((sum, i) => sum + i.quantity, 0)))
        .catch(() => onCartUpdate(0));
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      onCartUpdate(guestCart.reduce((sum, i) => sum + i.quantity, 0));
    }
  };

   
  const handleAddToCart = (product) => {
    if (isLoggedIn) {
      const token = localStorage.getItem("access_token");
      axios.post(
        "http://127.0.0.1:8000/api/cart/",
        { product: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then(() => {
          setAddedMessage(prev => ({ ...prev, [product.id]: "success" }));
          syncCartCount();
          setTimeout(() => setAddedMessage(prev => ({ ...prev, [product.id]: "" })), 2000);
        })
        .catch(() => {
          setAddedMessage(prev => ({ ...prev, [product.id]: "error" }));
          setTimeout(() => setAddedMessage(prev => ({ ...prev, [product.id]: "" })), 2000);
        });
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const existing = guestCart.find(i => i.id === product.id);
      if (existing) existing.quantity += 1;
      else guestCart.push({
        id: product.id,
        quantity: 1,
        product_details: { id: product.id, name: product.name, price: product.price, image: product.image }
      });
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      setAddedMessage(prev => ({ ...prev, [product.id]: "success" }));
      syncCartCount();
      setTimeout(() => setAddedMessage(prev => ({ ...prev, [product.id]: "" })), 2000);
    }
  };

  return (
    <div className="grid">
      {products.map(product => (
        <div className="card" key={product.id}>
          {addedMessage[product.id] === "success" && <div className="badge success">Added</div>}
          {addedMessage[product.id] === "error" && <div className="badge error">Error</div>}
          {product.image && <img src={product.image} alt={product.name} className="image" />}
          <h3>{product.name}</h3>
          <p className="price">₹ {product.price}</p>
          <button className="button" onClick={() => handleAddToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;