import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const navigate = useNavigate();

 
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = useCallback(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("access_token");
      if (token) {
        fetch("http://127.0.0.1:8000/api/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(data => setCartCount(data.reduce((sum, i) => sum + (i.quantity || 1), 0)))
          .catch(() => setCartCount(0));
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      setCartCount(guestCart.reduce((sum, i) => sum + (i.quantity || 1), 0));
    }
  }, [isLoggedIn]);

  
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"));
    updateCartCount();
  }, [updateCartCount]);

  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);      
    updateCartCount();
    navigate("/");
  };


  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setIsLoggedIn(false);     
    setCartCount(0);           

    navigate("/");
  };

   
  const requireLogin = () => navigate("/login");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        cartCount={cartCount}   
      />

      <main style={{ flex: 1, padding: "20px 0", backgroundColor: "#f9f9f9" }}>
        <Routes>
          <Route
            path="/"
            element={
              <ProductList
                isLoggedIn={isLoggedIn}
                onCartUpdate={updateCartCount} 
              />
            }
          />

          <Route
            path="/cart"
            element={
              <Cart
                isLoggedIn={isLoggedIn}
                onRequireLogin={requireLogin}
                onCartUpdate={updateCartCount} 
              />
            }
          />

          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:uid/:token"
            element={<ResetPassword />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;