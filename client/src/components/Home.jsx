import React, { useState } from "react";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email) return "Email is required";
    // simple email pattern
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      // Adjust endpoint as needed (relative path used here)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Login failed");
        return;
      }

      // Example: backend returns { token, message, user }
      setSuccess(data?.message || "Logged in successfully");

      if (data?.token) {
        const storage = remember ? localStorage : sessionStorage;
        try {
          storage.setItem("authToken", data.token);
        } catch (e) {
          // storage can fail in some environments (incognito, denied)
        }
      }

      // reset form (optional)
      setEmail("");
      setPassword("");
      setRemember(false);
      setShowPassword(false);
    } catch (networkErr) {
      setError(networkErr?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg,#f5f7fa,#c3cfe2)",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      padding: "24px",
    },
    card: {
      width: "100%",
      maxWidth: 420,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 8px 30px rgba(20, 30, 50, 0.12)",
      padding: 28,
    },
    title: { margin: 0, marginBottom: 8, fontSize: 22, fontWeight: 600 },
    subtitle: { margin: 0, marginBottom: 20, color: "#556", fontSize: 13 },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid #d6dbe6",
      fontSize: 14,
      marginBottom: 12,
      boxSizing: "border-box",
    },
    row: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    checkboxLabel: { display: "flex", alignItems: "center", gap: 8, color: "#334" },
    button: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 8,
      border: "none",
      background: "#0969da",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: 15,
    },
    smallLink: { color: "#0969da", textDecoration: "none", fontSize: 13 },
    messageError: { color: "#b00020", marginBottom: 12 },
    messageSuccess: { color: "#0a7a3d", marginBottom: 12 },
    pwdToggle: { cursor: "pointer", fontSize: 13, color: "#4b5563", marginLeft: 8 },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.subtitle}>Welcome back — please enter your credentials to continue.</p>

        {error && <div style={styles.messageError}>{error}</div>}
        {success && <div style={styles.messageSuccess}>{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email" style={{ fontSize: 13, color: "#334", display: "block", marginBottom: 6 }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="you@example.com"
            autoComplete="email"
            aria-required="true"
            disabled={loading}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="password" style={{ fontSize: 13, color: "#334", display: "block", marginBottom: 6 }}>
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-required="true"
                disabled={loading}
              />
            </div>
            <div style={{ alignSelf: "end", marginBottom: 12 }}>
              <span
                onClick={() => setShowPassword((s) => !s)}
                style={styles.pwdToggle}
                role="button"
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <div style={styles.row}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                aria-checked={remember}
                disabled={loading}
              />
              Remember me
            </label>
            <a href="#" style={styles.smallLink} onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          <button type="submit" style={{ ...styles.button, opacity: loading ? 0.8 : 1 }} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;