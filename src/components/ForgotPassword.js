import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosConfig";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setResetLink("");
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/password-reset/", { email });

      setMessage(
        "📩 Password reset link sent successfully! Please check your email."
      );

     
      if (res.data?.reset_link) {
        setResetLink(res.data.reset_link);
      } else if (res.data?.uid && res.data?.token) {
        setResetLink(
          `${window.location.origin}/reset-password/${res.data.uid}/${res.data.token}`
        );
      } else {
      
        setResetLink(
          `${window.location.origin}/reset-password/test-uid/test-token`
        );
      }
    } catch (err) {
      console.error(err);
      setError("❌ Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {message && <p style={styles.success}>{message}</p>}

      {resetLink && (
        <p style={styles.link}>
          🔗{" "}
          <a href={resetLink} target="_blank" rel="noopener noreferrer">
            Click here to reset your password (TESTING)
          </a>
        </p>
      )}

      {error && <p style={styles.error}>{error}</p>}

      <p style={styles.back} onClick={() => navigate("/login")}>
        Back to Login
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "25px",
    borderRadius: "12px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
  },
  title: {
    color: "#1976d2",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc", 
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  success: {
    color: "green",
    marginTop: "15px",
    fontWeight: "bold",
  },
  link: {
    marginTop: "12px",
    fontWeight: "bold",
    wordBreak: "break-all",
    color: "#1976d2",
  },
  error: {
    color: "#d32f2f",
    marginTop: "15px",
    fontWeight: "bold",
  },
  back: {
    marginTop: "20px",
    cursor: "pointer",
    color: "#1976d2",
    fontWeight: "bold",
  },
};

export default ForgotPassword;