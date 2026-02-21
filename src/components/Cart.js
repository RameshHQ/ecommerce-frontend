import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosConfig";
import "./Cart.css";

const Cart = ({ isLoggedIn, onRequireLogin, onCartUpdate }) => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  
  const fetchCart = async () => {
    if (isLoggedIn) {
      const token = localStorage.getItem("access_token");
      try {
        const res = await axiosInstance.get("api/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);
        onCartUpdate?.(res.data.reduce((sum, i) => sum + i.quantity, 0));
      } catch {
        setCartItems([]);
        onCartUpdate?.(0);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      setCartItems(guestCart);
      onCartUpdate?.(guestCart.reduce((sum, i) => sum + i.quantity, 0));
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

 
  const handleRemove = async (item) => {
    if (isLoggedIn) {
      try {
        await axiosInstance.delete(`api/cart/${item.id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
      } catch {}
      fetchCart();
    } else {
      const updated = cartItems.filter((i) => i.id !== item.id);
      setCartItems(updated);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
      onCartUpdate?.(updated.reduce((sum, i) => sum + i.quantity, 0));
    }
  };


  const handleQuantityChange = async (item, value) => {
    let qty = parseInt(value);
    if (isNaN(qty) || qty < 1) qty = 1;

    if (isLoggedIn) {
      try {
        await axiosInstance.patch(
          `api/cart/${item.id}/`,
          { quantity: qty },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
      } catch {}
      fetchCart();
    } else {
      const updated = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: qty } : i
      );
      setCartItems(updated);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
      onCartUpdate?.(updated.reduce((sum, i) => sum + i.quantity, 0));
    }
  };

  
  const handleCheckout = async () => {
   
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }

    if (cartItems.length === 0) return;

    try {
      
      for (const item of cartItems) {
        await axiosInstance.delete(`api/cart/${item.id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
      }

      
      await fetchCart();

      setMessage("✅ Order placed successfully! Thank you for shopping with us.");
    } catch {
      setMessage("❌ Something went wrong. Please try again.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  
  const formatPrice = (amount) =>
    amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  const grandTotal = cartItems.reduce(
    (sum, i) => sum + (i.price || i.product_details?.price) * i.quantity,
    0
  );

  return (
    <div
      className="cart-container"
      style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}
    >
      <h2
        className="cart-title"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        My Cart
      </h2>

      {message && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "15px",
            fontWeight: "bold",
            color: message.includes("✅") ? "green" : "red",
          }}
        >
          {message}
        </div>
      )}

      {cartItems.length === 0 && (
        <p style={{ textAlign: "center" }}>Your cart is empty</p>
      )}

      <div className="cart-grid" style={{ display: "grid", gap: "20px" }}>
        {cartItems.map((item) => {
          const details = item.product_details || item;
          return (
            <div
              key={item.id}
              className="cart-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "15px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              {details.image && (
                <img
                  src={details.image}
                  alt={details.name}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "contain",
                    marginBottom: "10px",
                  }}
                />
              )}
              <h4>{details.name}</h4>
              <p>Price: {formatPrice(details.price)}</p>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item, e.target.value)
                }
                style={{
                  width: "100px",
                  padding: "8px",
                  textAlign: "center",
                  border: "none",
                }}
              />
              <p className="cart-total">
                Total: {formatPrice(details.price * item.quantity)}
              </p>
              <button
                onClick={() => handleRemove(item)}
                style={{
                  background: "#d32f2f",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  border: "none",
                  marginTop: "8px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {cartItems.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <h3>
            Grand Total:{" "}
            <span style={{ color: "#1976d2" }}>
              {formatPrice(grandTotal)}
            </span>
          </h3>
          <button
            onClick={handleCheckout}
            style={{
              padding: "12px 30px",
              backgroundColor: "#1976d2",
              color: "#fff",
              borderRadius: "10px",
              fontWeight: "bold",
              border: "none",
              marginTop: "15px",
              cursor: "pointer",
            }}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;