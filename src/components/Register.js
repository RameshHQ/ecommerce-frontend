import React, { useState } from "react";
import axiosInstance from "./axiosConfig";

function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

     
    if (password !== confirm) {
      setError("❌ Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post("/api/register/", {
        username: email.trim(),
        email: email.trim(),
        password: password,
      });

      if (res.status === 201) {
        setSuccess("✅ Registered successfully. You can now login!");
        setEmail("");
        setPassword("");
        setConfirm("");

         
        if (onRegister) onRegister();
      }
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response && err.response.data) {
        const data = err.response.data;
        let msg = "";
        for (let key in data) {
          if (Array.isArray(data[key])) {
            msg += `${data[key].join(" ")} `;
          } else {
            msg += `${data[key]} `;
          }
        }
        setError(msg.trim() || "Registration failed. Try again.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          autoComplete="off"
          onChange={(e) => setConfirm(e.target.value)}
          style={styles.input}
          required
        />

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "30px auto",
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
  button: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
    width: "100%",
  },
  error: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  success: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
};

export default Register;