import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useAuth } from "../../contexts/AuthContext";

// ─── Icons ────────────────────────────────────────────────────────────────────

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <polyline points="9,6 15,12 9,18" stroke="#b0aeae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: on ? "#262626" : "#dddbdc",
        position: "relative", cursor: "pointer",
        transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3,
        left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: "#fff",
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function SettingsSection({
  title, children, badge
}: { title: string; children: React.ReactNode; badge?: string }) {
  return (
    <section className="settings-section">
      <div className="settings-section__head">
        <p className="settings-section__title">{title}</p>
        {badge && <span className="settings-section__badge">{badge}</span>}
      </div>
      <div className="settings-section__body">{children}</div>
    </section>
  );
}

function SettingsRow({
  label, value, hint, onClick, toggle, children
}: {
  label: string; value?: string; hint?: string;
  onClick?: () => void; toggle?: React.ReactNode; children?: React.ReactNode;
}) {
  return (
    <div className={`settings-row${onClick ? " settings-row--clickable" : ""}`} onClick={onClick}>
      <div className="settings-row__left">
        <p className="settings-row__label">{label}</p>
        {(value || hint) && (
          <p className="settings-row__hint">{value || hint}</p>
        )}
        {children}
      </div>
      <div className="settings-row__right">
        {toggle}
        {onClick && !toggle && <ChevronRightIcon />}
      </div>
    </div>
  );
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

type SettingsTab = "profile" | "password";

const USER_TABS: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Perfil", icon: <UserIcon /> },
  { key: "password", label: "Senha", icon: <LockIcon /> },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile state — inicializado com dados da sessão
  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  function fi(id: string, label: string, value: string, set: (v: string) => void, type = "text") {
    return (
      <div className="settings-form__field">
        <label className="settings-form__label">{label}</label>
        <input
          className="settings-form__input"
          type={type}
          value={value}
          onChange={e => set(e.target.value)}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
          style={{ borderColor: focused === id ? "#262626" : "#dddbdc" }}
        />
      </div>
    );
  }

  const tabs = USER_TABS;

  // Iniciais do avatar
  const initials = nome
    ? nome.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="page">
      <Header />

      <main className="settings-page">
        {/* Título da página */}
        <div className="settings-hero">
          <p className="settings-hero__label">MINHA CONTA</p>
          <h1 className="settings-hero__title">Configurações</h1>
        </div>

        <div className="settings-layout">
          {/* Sidebar */}
          <nav className="settings-nav">
            <div className="settings-nav__user">
              <div className="settings-nav__avatar">
                {initials}
              </div>
              <div>
                <p className="settings-nav__name">{nome || "—"}</p>
                <p className="settings-nav__role">Cliente</p>
              </div>
            </div>
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`settings-nav__item${activeTab === tab.key ? " settings-nav__item--active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="settings-nav__item-icon">{tab.icon}</span>
                {tab.label}

              </button>
            ))}
            <div className="settings-nav__divider" />
            <button className="settings-nav__item settings-nav__item--danger" onClick={handleLogout}>
              Sair
            </button>
          </nav>

          {/* Conteúdo */}
          <div className="settings-content">

            {/* ── PERFIL ── */}
            {activeTab === "profile" && (
              <SettingsSection title="Informações do Perfil">
                <div className="settings-form">
                  {fi("s-nm", "NOME COMPLETO", nome, setNome)}
                  {fi("s-em", "E-MAIL", email, setEmail, "email")}
                  {fi("s-ph", "TELEFONE", phone, setPhone, "tel")}
                  <div className="settings-form__field">
                    <label className="settings-form__label">
                      DATA DE NASCIMENTO{" "}
                      <span style={{ color: "#737373", fontWeight: 400 }}>(opcional)</span>
                    </label>
                    <input
                      className="settings-form__input"
                      type="date"
                      onFocus={() => setFocused("dob")}
                      onBlur={() => setFocused(null)}
                      style={{ borderColor: focused === "dob" ? "#262626" : "#dddbdc" }}
                    />
                  </div>
                  <button className="settings-save-btn" onClick={handleSave}>
                    {saved ? "Salvo ✓" : "Salvar Alterações"}
                  </button>
                </div>

                {/* <div style={{ marginTop: 32 }}>
                  <SettingsRow
                    label="Endereços Salvos"
                    hint="2 endereços cadastrados"
                    onClick={() => {}}
                  />
                  <SettingsRow
                    label="Histórico de Pedidos"
                    hint="Ver todos os pedidos anteriores"
                    onClick={() => {}}
                  />
                  <SettingsRow
                    label="Lista de Desejos"
                    hint="12 itens salvos"
                    onClick={() => {}}
                  />
                </div> */}
              </SettingsSection>
            )}

            {/* ── SENHA ── */}
            {activeTab === "password" && (
              <SettingsSection title="Senha e Segurança">
                <div className="settings-form">
                  <div className="settings-form__field">
                    <label className="settings-form__label">SENHA ATUAL</label>
                    <input
                      className="settings-form__input"
                      type="password"
                      placeholder="••••••••"
                      onFocus={() => setFocused("cp")}
                      onBlur={() => setFocused(null)}
                      style={{ borderColor: focused === "cp" ? "#262626" : "#dddbdc" }}
                    />
                  </div>
                  <div className="settings-form__row">
                    <div className="settings-form__field">
                      <label className="settings-form__label">NOVA SENHA</label>
                      <input className="settings-form__input" type="password" placeholder="••••••••"
                        onFocus={() => setFocused("np")} onBlur={() => setFocused(null)}
                        style={{ borderColor: focused === "np" ? "#262626" : "#dddbdc" }} />
                    </div>
                    <div className="settings-form__field">
                      <label className="settings-form__label">CONFIRMAR SENHA</label>
                      <input className="settings-form__input" type="password" placeholder="••••••••"
                        onFocus={() => setFocused("cfp")} onBlur={() => setFocused(null)}
                        style={{ borderColor: focused === "cfp" ? "#262626" : "#dddbdc" }} />
                    </div>
                  </div>
                  <button className="settings-save-btn">Atualizar Senha</button>
                </div>

                {/* <div style={{ marginTop: 32 }}>
                  <p className="settings-section__subtitle">AUTENTICAÇÃO DE DOIS FATORES</p>
                  <SettingsRow
                    label="Aplicativo Autenticador"
                    hint="Adicione uma camada extra de segurança"
                    toggle={<Toggle on={false} onChange={() => { }} />}
                  />
                  <SettingsRow
                    label="Verificação por SMS"
                    hint="Receba códigos via mensagem de texto"
                    toggle={<Toggle on={true} onChange={() => { }} />}
                  />
                </div> */}

                {/* <div style={{ marginTop: 24 }}>
                  <p className="settings-section__subtitle">SESSÕES</p>
                  <SettingsRow label="Sessões Ativas" hint="2 dispositivos conectados" onClick={() => { }} />
                  <SettingsRow
                    label="Sair de todos os outros dispositivos"
                    hint="Encerrará todas as sessões exceto a atual"
                    onClick={() => { }}
                  />
                </div> */}
              </SettingsSection>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
