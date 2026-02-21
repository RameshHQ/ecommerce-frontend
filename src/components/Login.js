import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosConfig";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/login/", {
        username: email.trim(),
        password,
      });

      
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

     

      if (onLoginSuccess) onLoginSuccess();

    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <div style={styles.forgotWrap}>
          <span
            style={styles.forgot}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </span>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "25px 20px",
    borderRadius: "12px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
    width: "90%",
  },
  title: {
    marginBottom: "20px",
    color: "#1976d2",
    fontSize: "24px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#e8f0fe",
    fontSize: "16px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  forgotWrap: {
    textAlign: "right",
    marginTop: "-5px",
  },
  forgot: {
    fontSize: "14px",
    color: "#1976d2",
    cursor: "pointer",
    fontWeight: "bold",
  },
  button: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
  error: {
    color: "#d32f2f",
    fontWeight: "bold",
    marginTop: "5px",
  },
};

export default Login;