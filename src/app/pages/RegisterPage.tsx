import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12A18.45 18.45 0 015.06 6.06M9.9 4.24A9.12 9.12 0 0112 4C19 4 23 12 23 12A18.5 18.5 0 0121.76 14.36M1 1L23 23" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <polyline points="20,6 9,17 4,12" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  focusedField: string | null;
  onFocus: () => void;
  onBlur: () => void;
  autoComplete?: string;
  error?: string;
  hint?: string;
  rightSlot?: React.ReactNode;
}

function Field({
  id, label, type = "text", placeholder, value, onChange,
  focusedField, onFocus, onBlur, autoComplete, error, hint, rightSlot,
}: FieldProps) {
  const focused = focusedField === id;
  return (
    <div className="register-field">
      <label className="login-field__label" htmlFor={id}>{label}</label>
      <div
        className="login-field__input-wrap"
        style={{ borderColor: error ? "#d0021b" : focused ? "#262626" : "#dddbdc" }}
      >
        <input
          id={id}
          className="login-field__input-inner"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={autoComplete}
        />
        {rightSlot}
      </div>
      {error && <p className="register-field__error">{error}</p>}
      {hint && !error && <p className="register-field__hint">{hint}</p>}
    </div>
  );
}

const STRENGTHS = [
  { label: "Fraca",    color: "#d0021b", min: 1 },
  { label: "Moderada", color: "#f5a623", min: 2 },
  { label: "Boa",      color: "#7ed321", min: 3 },
  { label: "Forte",    color: "#417505", min: 4 },
];

function passwordStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const pwStrength = passwordStrength(password);
  const strengthInfo = STRENGTHS[Math.min(pwStrength - 1, 3)] ?? null;

  function validate() {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Primeiro nome é necessário.";
    if (!lastName.trim()) e.lastName = "Sobrenome é necessário.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Insira um endereço de email válido.";
    if (password.length < 8) e.password = "A senha deve ter pelo menos 8 caracteres.";
    if (confirm !== password) e.confirm = "As senhas não coincidem.";
    if (!agreed) e.agreed = "Você deve aceitar os termos para continuar.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const allEmpty = !firstName.trim() && !lastName.trim() && !email.trim() && !password && !confirm && !agreed;
    if (allEmpty) {
      setGeneralError("Preencha todos os campos corretamente.");
      setErrors({});
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setGeneralError("");
      return;
    }

    setErrors({});
    setGeneralError("");
    setLoading(true);

    try {
      await register({ firstName, lastName, email, password });
      setSuccess(true);
    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="login-page">
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
          <div className="register-success">
            <div className="register-success__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="#262626" strokeWidth="1.5" />
                <polyline points="7,12 10.5,15.5 17,8.5" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="register-success__title">Conta Criada</p>
            <p className="register-success__sub">Bem-vindo, {firstName}. Sua conta Ganjj está pronta.</p>
            <button className="login-submit-btn" style={{ marginTop: 8 }} onClick={() => navigate("/")}>
              IR PARA A LOJA
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="login-page">
      <main className="login-main">
        <div className="login-panel">
          <div className="login-panel__overlay">
            <div className="login-panel__quote">
              <p className="login-panel__quote-text">"O seu estilo.<br />Os seus valores.<br />Você."</p>
              <p className="login-panel__quote-sub">Junte-se a uma comunidade que se preocupa.</p>
            </div>
          </div>
        </div>

        <div className="login-form-side" style={{ width: 520 }}>
          <div className="login-form-card" style={{ maxWidth: 400 }}>
            <div className="login-form-card__header">
              <p className="login-form-card__title">Crie sua conta</p>
              <p className="login-form-card__subtitle">
                Já tem uma?{" "}
                <span className="login-form-card__link" onClick={() => navigate("/login")}>
                  Entrar
                </span>
              </p>
            </div>

            <div className="login-socials">
              <button className="login-social-btn"><AppleIcon /><span>Continue com Apple</span></button>
              <button className="login-social-btn"><GoogleIcon /><span>Continue com Google</span></button>
              <button className="login-social-btn"><FacebookIcon /><span>Continue com Facebook</span></button>
            </div>

            <div className="login-divider">
              <div className="login-divider__line" />
              <span className="login-divider__label">ou registre-se com email</span>
              <div className="login-divider__line" />
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="register-name-row">
                <Field
                  id="firstName" label="Primeiro nome" placeholder="Jane"
                  value={firstName} onChange={setFirstName}
                  focusedField={focused} onFocus={() => setFocused("firstName")} onBlur={() => setFocused(null)}
                  autoComplete="given-name" error={errors.firstName}
                />
                <Field
                  id="lastName" label="Sobrenome" placeholder="Doe"
                  value={lastName} onChange={setLastName}
                  focusedField={focused} onFocus={() => setFocused("lastName")} onBlur={() => setFocused(null)}
                  autoComplete="family-name" error={errors.lastName}
                />
              </div>

              <Field
                id="email" label="Endereço de e-mail" type="email" placeholder="voce@exemplo.com"
                value={email} onChange={setEmail}
                focusedField={focused} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                autoComplete="email" error={errors.email}
              />

              <div className="register-field">
                <label className="login-field__label" htmlFor="pw">SENHA</label>
                <div
                  className="login-field__input-wrap"
                  style={{ borderColor: errors.password ? "#d0021b" : focused === "pw" ? "#262626" : "#dddbdc" }}
                >
                  <input
                    id="pw"
                    className="login-field__input-inner"
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 8 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("pw")}
                    onBlur={() => setFocused(null)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="login-field__eye" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                    <EyeIcon visible={showPw} />
                  </button>
                </div>

                {password.length > 0 && (
                  <div className="register-strength">
                    <div className="register-strength__bars">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className="register-strength__bar"
                          style={{ background: pwStrength >= i ? (strengthInfo?.color ?? "#dddbdc") : "#dddbdc" }}
                        />
                      ))}
                    </div>
                    {strengthInfo && (
                      <span className="register-strength__label" style={{ color: strengthInfo.color }}>
                        {strengthInfo.label}
                      </span>
                    )}
                  </div>
                )}
                {errors.password && <p className="register-field__error">{errors.password}</p>}
              </div>

              <div className="register-field">
                <label className="login-field__label" htmlFor="confirm">CONFIRMAR SENHA</label>
                <div
                  className="login-field__input-wrap"
                  style={{ borderColor: errors.confirm ? "#d0021b" : focused === "confirm" ? "#262626" : "#dddbdc" }}
                >
                  <input
                    id="confirm"
                    className="login-field__input-inner"
                    type={showCf ? "text" : "password"}
                    placeholder="Re-escreva sua senha"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused(null)}
                    autoComplete="new-password"
                  />
                  {confirm.length > 0 && confirm === password && (
                    <span style={{ padding: "0 10px", color: "#417505", display: "flex", alignItems: "center" }}>
                      <CheckIcon />
                    </span>
                  )}
                  <button type="button" className="login-field__eye" onClick={() => setShowCf(v => !v)} tabIndex={-1}>
                    <EyeIcon visible={showCf} />
                  </button>
                </div>
                {errors.confirm && <p className="register-field__error">{errors.confirm}</p>}
              </div>

              <div className="register-checkbox-row">
                <div
                  className="register-checkbox"
                  onClick={() => setAgreed(v => !v)}
                  style={{ borderColor: errors.agreed ? "#d0021b" : "#dddbdc", background: agreed ? "#262626" : "#fff" }}
                >
                  {agreed && <CheckIcon />}
                </div>
                <p className="register-checkbox-label">
                  Concordo com os{" "}
                  <span className="login-terms__link">Termos de Serviço</span>
                  {" "}e{" "}
                  <span className="login-terms__link">Política de Privacidade</span>
                  . Gostaria de receber e-mails sobre novos produtos e promoções.
                </p>
              </div>
              {errors.agreed && <p className="register-field__error" style={{ marginTop: -12 }}>{errors.agreed}</p>}

              {generalError && <p className="login-error">{generalError}</p>}

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "CRIANDO CONTA…" : "CRIAR CONTA"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
