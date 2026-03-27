import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Logo } from "../components/Logo";

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <line x1="20" y1="12" x2="4" y2="12" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="10,6 4,12 10,18" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#262626" strokeWidth="1.5" />
      <polyline points="2,4 12,13 22,4" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Step = "email" | "sent";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep]         = useState<Step>("email");
  const [email, setEmail]       = useState("");
  const [focused, setFocused]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("sent");
    }, 900);
  }

  return (
    <div className="login-page">
      {/* Minimal header */}
      <header className="login-header">
        <div className="login-header__logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <Logo />
        </div>
      </header>

      <main className="login-main">
        {/* Left editorial panel */}
        <div className="login-panel">
          <div className="login-panel__overlay">
            <div className="login-panel__quote">
              <p className="login-panel__quote-text">"Radical Transparency.<br />Radical Simplicity."</p>
              <p className="login-panel__quote-sub">The Everlane promise.</p>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="login-form-side">
          {step === "email" ? (
            <div className="login-form-card">
              {/* Back link */}
              <button
                type="button"
                className="forgot-back-btn"
                onClick={() => navigate("/login")}
              >
                <ArrowLeftIcon />
                <span>Back to Sign In</span>
              </button>

              {/* Heading */}
              <div className="login-form-card__header">
                <p className="login-form-card__title">Reset Password</p>
                <p className="login-form-card__subtitle">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Divider */}
              <div className="login-divider">
                <div className="login-divider__line" />
              </div>

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="login-field">
                  <label className="login-field__label" htmlFor="forgot-email">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="forgot-email"
                    className="login-field__input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{ borderColor: error ? "#d0021b" : focused ? "#262626" : "#dddbdc" }}
                    autoComplete="email"
                  />
                  {error && <p className="register-field__error">{error}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "SENDING…" : "SEND RESET LINK"}
                </button>

                {/* No account */}
                <p className="login-terms" style={{ textAlign: "center" }}>
                  Don't have an account?{" "}
                  <span
                    className="login-terms__link"
                    style={{ color: "#262626" }}
                    onClick={() => navigate("/register")}
                  >
                    Create one
                  </span>
                </p>
              </form>
            </div>
          ) : (
            /* ---- Sent state ---- */
            <div className="login-form-card">
              <div className="forgot-sent">
                <div className="forgot-sent__icon">
                  <MailIcon />
                </div>

                <div className="login-form-card__header" style={{ alignItems: "center", textAlign: "center" }}>
                  <p className="login-form-card__title">Check your inbox</p>
                  <p className="login-form-card__subtitle">
                    We've sent a password reset link to
                  </p>
                  <p className="forgot-sent__email">{email}</p>
                  <p className="login-form-card__subtitle" style={{ marginTop: 4 }}>
                    The link expires in 30 minutes. If you don't see it, check your spam folder.
                  </p>
                </div>

                <div className="login-divider">
                  <div className="login-divider__line" />
                </div>

                <button
                  type="button"
                  className="login-submit-btn"
                  onClick={() => navigate("/login")}
                >
                  BACK TO SIGN IN
                </button>

                <p className="login-terms" style={{ textAlign: "center" }}>
                  Didn't receive the email?{" "}
                  <span
                    className="login-terms__link"
                    style={{ color: "#262626" }}
                    onClick={() => { setStep("email"); setEmail(""); }}
                  >
                    Try again
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
