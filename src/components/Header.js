import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ cartCount, isLoggedIn, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  useEffect(() => {
    const closeOnScroll = () => {
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("scroll", closeOnScroll);
    return () => window.removeEventListener("scroll", closeOnScroll);
  }, [menuOpen]);

  const isMobile = screenWidth <= 768;

  const navigateTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const styles = {
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      backgroundColor: "#1976d2",
      color: "#fff",
      position: "relative",
      zIndex: 100,
    },
    logo: { fontSize: "24px", fontWeight: "bold", cursor: "pointer" },
    nav: { display: "flex", alignItems: "center", gap: "12px" },
    navButton: {
      backgroundColor: "#fff",
      color: "#1976d2",
      border: "none",
      padding: "6px 14px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      position: "relative",
    },
    badge: {
      position: "absolute",
      top: "-6px",
      right: "-6px",
      backgroundColor: "#d32f2f",
      color: "#fff",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: "12px",
      fontWeight: "bold",
    },
    hamburger: { fontSize: "26px", cursor: "pointer" },
    menu: {
      position: "absolute",
      top: "65px",
      right: "30px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
      padding: "8px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      minWidth: "160px",
    },
    blueBtn: {
      backgroundColor: "#1976d2",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      width: "100%",
    },
    redBtn: {
      backgroundColor: "#d32f2f",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      width: "100%",
    },
  };

   
  const displayCartCount = () => {
    if (!isLoggedIn) {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      return guestCart.reduce((sum, i) => sum + (i.quantity || 1), 0);
    }
    return cartCount;
  };

   
  const handleLogout = () => {
    onLogout();      
    setMenuOpen(false);  
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo} onClick={() => navigateTo("/")}>
        MARTIQ
      </div>

      <div style={styles.nav}>
        {!isMobile && (
          <>
            <button style={styles.navButton} onClick={() => navigateTo("/")}>
              Products
            </button>

            <button style={styles.navButton} onClick={() => navigateTo("/cart")}>
              Cart
              {displayCartCount() > 0 && (
                <span style={styles.badge}>{displayCartCount()}</span>
              )}
            </button>

            {!isLoggedIn ? (
              <>
                <button
                  style={styles.navButton}
                  onClick={() => navigateTo("/login")}
                >
                  Login
                </button>
                <button
                  style={styles.navButton}
                  onClick={() => navigateTo("/register")}
                >
                  Register
                </button>
              </>
            ) : (
              <button style={styles.redBtn} onClick={handleLogout}>
                Logout
              </button>
            )}
          </>
        )}

        {isMobile && (
          <div
            style={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>
        )}
      </div>

      {menuOpen && (
        <div style={styles.menu}>
          <button style={styles.blueBtn} onClick={() => navigateTo("/")}>
            Products
          </button>

          <button style={styles.blueBtn} onClick={() => navigateTo("/cart")}>
            Cart {displayCartCount() > 0 && `(${displayCartCount()})`}
          </button>

          {!isLoggedIn ? (
            <>
              <button
                style={styles.blueBtn}
                onClick={() => navigateTo("/login")}
              >
                Login
              </button>
              <button
                style={styles.blueBtn}
                onClick={() => navigateTo("/register")}
              >
                Register
              </button>
            </>
          ) : (
            <button style={styles.redBtn} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;