import { useState } from "react";
import { useNavigate } from "react-router";

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12A18.45 18.45 0 015.06 6.06M9.9 4.24A9.12 9.12 0 0112 4C19 4 23 12 23 12A18.5 18.5 0 0121.76 14.36M1 1L23 23" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.78 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" fill="#262626" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
      <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.72 16.7 5.84 14.1H2.18V16.94C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.07H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.93L5.84 14.09Z" fill="#FBBC05" />
      <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.07L5.84 9.91C6.72 7.3 9.13 5.38 12 5.38Z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 900);
  }

  return (
    <div className="login-page">

      <main className="login-main">
        <div className="login-panel">
          <div className="login-panel__overlay">
            <div className="login-panel__quote">
              <p className="login-panel__quote-text">"Uma empresa não sustentável <br />é insustentável."</p>
              <p className="login-panel__quote-sub">Fábio Pestana Bezerra.</p>
            </div>
          </div>
        </div>

        <div className="login-form-side">
          <div className="login-form-card">
            <div className="login-form-card__header">
              <p className="login-form-card__title">Login</p>
              <p className="login-form-card__subtitle">
                Novo no ganjj?{" "}
                <span
                  className="login-form-card__link"
                  onClick={() => navigate("/register")}
                >
                  Crie uma conta!
                </span>
              </p>
            </div>

            <div className="login-socials">
              <button className="login-social-btn">
                <AppleIcon />
                <span>Continue com Apple</span>
              </button>
              <button className="login-social-btn">
                <GoogleIcon />
                <span>Continue com Google</span>
              </button>
              <button className="login-social-btn">
                <FacebookIcon />
                <span>Continue com Facebook</span>
              </button>
            </div>

            <div className="login-divider">
              <div className="login-divider__line" />
              <span className="login-divider__label">ou entre com seu e-mail</span>
              <div className="login-divider__line" />
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label className="login-field__label" htmlFor="login-email">
                  ENDEREÇO DE E-MAIL
                </label>
                <input
                  id="login-email"
                  className="login-field__input"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    borderColor: focusedField === "email" ? "#262626" : "#dddbdc",
                  }}
                  autoComplete="email"
                />
              </div>

              <div className="login-field">
                <div className="login-field__label-row">
                  <label className="login-field__label" htmlFor="login-password">
                    SENHA
                  </label>
                  <span
                    className="login-field__forgot"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Esqueceu a senha?
                  </span>
                </div>
                <div
                  className="login-field__input-wrap"
                  style={{ borderColor: focusedField === "password" ? "#262626" : "#dddbdc" }}
                >
                  <input
                    id="login-password"
                    className="login-field__input-inner"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-field__eye"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              {error && <p className="login-error">{error}</p>}

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "ENTRANDO…" : "ENTRAR"}
              </button>

              <p className="login-terms">
                Ao entrar, você concorda com nossa{" "}
                <span className="login-terms__link">Política de Privacidade</span>
                {" "}e{" "}
                <span className="login-terms__link">Termos de Serviço</span>.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}