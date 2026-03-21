import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

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

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

type SettingsTab = "profile" | "password" | "notifications" | "payment" | "privacy" | "preferences" | "admin";

const USER_TABS: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: "profile",       label: "Profile",       icon: <UserIcon /> },
  { key: "password",      label: "Password",      icon: <LockIcon /> },
  { key: "notifications", label: "Notifications", icon: <BellIcon /> },
  { key: "payment",       label: "Payment",       icon: <CardIcon /> },
  { key: "privacy",       label: "Privacy",       icon: <ShieldIcon /> },
  { key: "preferences",   label: "Preferences",   icon: <GlobeIcon /> },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const isAdmin = true; // mock – in production this comes from auth context

  // Profile state
  const [firstName,  setFirstName]  = useState("Amelia");
  const [lastName,   setLastName]   = useState("Chen");
  const [email,      setEmail]      = useState("amelia.chen@everlane.com");
  const [phone,      setPhone]      = useState("+1 (415) 555-0192");
  const [focused,    setFocused]    = useState<string | null>(null);
  const [saved,      setSaved]      = useState(false);

  // Notification prefs
  const [notifOrder,   setNotifOrder]   = useState(true);
  const [notifPromo,   setNotifPromo]   = useState(false);
  const [notifReturn,  setNotifReturn]  = useState(true);
  const [notifSMS,     setNotifSMS]     = useState(false);
  const [notifNewArr,  setNotifNewArr]  = useState(true);

  // Privacy
  const [analytics,    setAnalytics]    = useState(true);
  const [marketing,    setMarketing]    = useState(false);
  const [thirdParty,   setThirdParty]   = useState(false);

  // Preferences
  const [currency,     setCurrency]     = useState("USD");
  const [language,     setLanguage]     = useState("English");
  const [sizeUnit,     setSizeUnit]     = useState("US");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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

  const tabs = isAdmin
    ? [...USER_TABS, { key: "admin" as SettingsTab, label: "Admin", icon: <ShieldIcon /> }]
    : USER_TABS;

  return (
    <div className="page">
      <Header />

      <main className="settings-page">
        {/* Page title */}
        <div className="settings-hero">
          <p className="settings-hero__label">MY ACCOUNT</p>
          <h1 className="settings-hero__title">Settings</h1>
        </div>

        <div className="settings-layout">
          {/* Sidebar */}
          <nav className="settings-nav">
            <div className="settings-nav__user">
              <div className="settings-nav__avatar">
                {firstName[0]}{lastName[0]}
              </div>
              <div>
                <p className="settings-nav__name">{firstName} {lastName}</p>
                <p className="settings-nav__role">{isAdmin ? "Admin" : "Customer"}</p>
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
                {tab.key === "admin" && (
                  <span className="settings-nav__admin-badge">Admin</span>
                )}
              </button>
            ))}
            <div className="settings-nav__divider" />
            <button className="settings-nav__item settings-nav__item--danger" onClick={() => navigate("/login")}>
              Sign Out
            </button>
          </nav>

          {/* Content */}
          <div className="settings-content">

            {/* ── PROFILE ── */}
            {activeTab === "profile" && (
              <SettingsSection title="Profile Information">
                <div className="settings-form">
                  <div className="settings-form__row">
                    {fi("s-fn", "FIRST NAME", firstName, setFirstName)}
                    {fi("s-ln", "LAST NAME",  lastName,  setLastName)}
                  </div>
                  {fi("s-em", "EMAIL ADDRESS", email, setEmail, "email")}
                  {fi("s-ph", "PHONE NUMBER",  phone, setPhone, "tel")}
                  <div className="settings-form__field">
                    <label className="settings-form__label">DATE OF BIRTH <span style={{ color: "#737373", fontWeight: 400 }}>(optional)</span></label>
                    <input
                      className="settings-form__input"
                      type="date"
                      defaultValue="1990-08-14"
                      onFocus={() => setFocused("dob")}
                      onBlur={() => setFocused(null)}
                      style={{ borderColor: focused === "dob" ? "#262626" : "#dddbdc" }}
                    />
                  </div>
                  <button className="settings-save-btn" onClick={handleSave}>
                    {saved ? "Saved ✓" : "Save Changes"}
                  </button>
                </div>

                <div style={{ marginTop: 32 }}>
                  <SettingsRow
                    label="Saved Addresses"
                    hint="2 addresses on file"
                    onClick={() => {}}
                  />
                  <SettingsRow
                    label="Order History"
                    hint="View all past orders"
                    onClick={() => {}}
                  />
                  <SettingsRow
                    label="Wishlist"
                    hint="12 saved items"
                    onClick={() => {}}
                  />
                </div>
              </SettingsSection>
            )}

            {/* ── PASSWORD ── */}
            {activeTab === "password" && (
              <SettingsSection title="Password & Security">
                <div className="settings-form">
                  <div className="settings-form__field">
                    <label className="settings-form__label">CURRENT PASSWORD</label>
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
                      <label className="settings-form__label">NEW PASSWORD</label>
                      <input className="settings-form__input" type="password" placeholder="••••••••"
                        onFocus={() => setFocused("np")} onBlur={() => setFocused(null)}
                        style={{ borderColor: focused === "np" ? "#262626" : "#dddbdc" }} />
                    </div>
                    <div className="settings-form__field">
                      <label className="settings-form__label">CONFIRM PASSWORD</label>
                      <input className="settings-form__input" type="password" placeholder="••••••••"
                        onFocus={() => setFocused("cfp")} onBlur={() => setFocused(null)}
                        style={{ borderColor: focused === "cfp" ? "#262626" : "#dddbdc" }} />
                    </div>
                  </div>
                  <button className="settings-save-btn">Update Password</button>
                </div>

                <div style={{ marginTop: 32 }}>
                  <p className="settings-section__subtitle">TWO-FACTOR AUTHENTICATION</p>
                  <SettingsRow
                    label="Authenticator App"
                    hint="Add an extra layer of security"
                    toggle={<Toggle on={false} onChange={() => {}} />}
                  />
                  <SettingsRow
                    label="SMS Verification"
                    hint="Receive codes via text message"
                    toggle={<Toggle on={true} onChange={() => {}} />}
                  />
                </div>

                <div style={{ marginTop: 24 }}>
                  <p className="settings-section__subtitle">SESSIONS</p>
                  <SettingsRow label="Active Sessions" hint="2 devices currently signed in" onClick={() => {}} />
                  <SettingsRow
                    label="Sign out all other devices"
                    hint="This will end all sessions except the current one"
                    onClick={() => {}}
                  />
                </div>
              </SettingsSection>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "notifications" && (
              <SettingsSection title="Notifications">
                <p className="settings-section__subtitle">EMAIL NOTIFICATIONS</p>
                <SettingsRow label="Order Updates" hint="Shipping confirmations, tracking, delivery" toggle={<Toggle on={notifOrder} onChange={setNotifOrder} />} />
                <SettingsRow label="Returns & Exchanges" hint="Status updates on your returns" toggle={<Toggle on={notifReturn} onChange={setNotifReturn} />} />
                <SettingsRow label="Promotions & Offers" hint="Exclusive deals and new arrivals" toggle={<Toggle on={notifPromo} onChange={setNotifPromo} />} />
                <SettingsRow label="New Arrivals" hint="Be the first to know about new products" toggle={<Toggle on={notifNewArr} onChange={setNotifNewArr} />} />

                <div style={{ marginTop: 24 }}>
                  <p className="settings-section__subtitle">SMS NOTIFICATIONS</p>
                  <SettingsRow label="Text Messages" hint="Receive updates and offers via SMS" toggle={<Toggle on={notifSMS} onChange={setNotifSMS} />} />
                </div>

                <div style={{ marginTop: 24 }}>
                  <p className="settings-section__subtitle">FREQUENCY</p>
                  <SettingsRow label="Email Frequency" hint="At most once a week" onClick={() => {}} />
                </div>
                <button className="settings-save-btn" style={{ marginTop: 24 }} onClick={handleSave}>
                  {saved ? "Saved ✓" : "Save Preferences"}
                </button>
              </SettingsSection>
            )}

            {/* ── PAYMENT ── */}
            {activeTab === "payment" && (
              <SettingsSection title="Payment Methods">
                <div className="settings-cards">
                  {[
                    { brand: "Visa",       last4: "4242", exp: "09/27", primary: true  },
                    { brand: "Mastercard", last4: "8888", exp: "03/26", primary: false },
                  ].map(card => (
                    <div key={card.last4} className="settings-card">
                      <div className="settings-card__left">
                        <div className="settings-card__brand">{card.brand}</div>
                        <div>
                          <p className="settings-card__num">•••• •••• •••• {card.last4}</p>
                          <p className="settings-card__exp">Expires {card.exp}</p>
                        </div>
                      </div>
                      <div className="settings-card__right">
                        {card.primary && <span className="settings-card__primary">Primary</span>}
                        <button className="settings-card__remove">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="settings-outline-btn" style={{ marginTop: 16 }}>
                  + Add Payment Method
                </button>

                <div style={{ marginTop: 32 }}>
                  <p className="settings-section__subtitle">BILLING ADDRESS</p>
                  <SettingsRow label="123 Market St, San Francisco, CA 94105" hint="Primary billing address" onClick={() => {}} />
                </div>
              </SettingsSection>
            )}

            {/* ── PRIVACY ── */}
            {activeTab === "privacy" && (
              <SettingsSection title="Privacy & Data">
                <p className="settings-section__subtitle">DATA USAGE</p>
                <SettingsRow label="Analytics & Performance" hint="Help us improve by sharing anonymous usage data" toggle={<Toggle on={analytics} onChange={setAnalytics} />} />
                <SettingsRow label="Marketing Personalization" hint="Personalize ads and recommendations based on your activity" toggle={<Toggle on={marketing} onChange={setMarketing} />} />
                <SettingsRow label="Third-Party Sharing" hint="Share data with trusted partners for relevant offers" toggle={<Toggle on={thirdParty} onChange={setThirdParty} />} />

                <div style={{ marginTop: 24 }}>
                  <p className="settings-section__subtitle">YOUR DATA</p>
                  <SettingsRow label="Download Your Data" hint="Request a copy of all data we hold about you" onClick={() => {}} />
                  <SettingsRow label="Delete Account" hint="Permanently remove your account and all data" onClick={() => {}} />
                </div>

                <div style={{ marginTop: 24 }}>
                  <p className="settings-section__subtitle">LEGAL</p>
                  <SettingsRow label="Privacy Policy" onClick={() => {}} />
                  <SettingsRow label="Terms of Service" onClick={() => {}} />
                  <SettingsRow label="Cookie Settings" onClick={() => {}} />
                </div>
              </SettingsSection>
            )}

            {/* ── PREFERENCES ── */}
            {activeTab === "preferences" && (
              <SettingsSection title="Preferences">
                <div className="settings-form">
                  <div className="settings-form__field">
                    <label className="settings-form__label">CURRENCY</label>
                    <select
                      className="settings-form__input"
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      style={{ borderColor: "#dddbdc", appearance: "none" }}
                    >
                      {["USD", "EUR", "GBP", "CAD", "AUD"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="settings-form__field">
                    <label className="settings-form__label">LANGUAGE</label>
                    <select
                      className="settings-form__input"
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      style={{ borderColor: "#dddbdc", appearance: "none" }}
                    >
                      {["English", "French", "Spanish", "German", "Japanese"].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="settings-form__field">
                    <label className="settings-form__label">SIZE SYSTEM</label>
                    <div className="settings-form__radios">
                      {["US", "EU", "UK"].map(s => (
                        <label key={s} className="contact-form__radio-label">
                          <span
                            className="contact-form__radio-box"
                            style={{ borderColor: sizeUnit === s ? "#262626" : "#dddbdc" }}
                            onClick={() => setSizeUnit(s)}
                          >
                            {sizeUnit === s && <span className="contact-form__radio-dot" />}
                          </span>
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="settings-save-btn" onClick={handleSave}>
                    {saved ? "Saved ✓" : "Save Preferences"}
                  </button>
                </div>
              </SettingsSection>
            )}

            {/* ── ADMIN ── */}
            {activeTab === "admin" && isAdmin && (
              <SettingsSection title="Admin Settings" badge="Admin Only">
                <p className="settings-section__subtitle">QUICK ACCESS</p>
                <SettingsRow label="User Management" hint="Create, edit and delete users" onClick={() => navigate("/admin/users")} />
                <SettingsRow label="Product Catalog" hint="Manage the product inventory" onClick={() => navigate("/admin/products")} />
                <SettingsRow label="Dashboard" hint="View store analytics and metrics" onClick={() => navigate("/admin/dashboard")} />

                <div style={{ marginTop: 24 }}>
                  <p className="settings-section__subtitle">STORE CONFIGURATION</p>
                  <SettingsRow label="Store Name" hint="Everlane" onClick={() => {}} />
                  <SettingsRow label="Store Currency" hint="USD · United States Dollar" onClick={() => {}} />
                  <SettingsRow label="Tax Settings" hint="US standard sales tax" onClick={() => {}} />
                  <SettingsRow label="Shipping Zones" hint="4 zones configured" onClick={() => {}} />
                </div>

                <div style={{ marginTop: 24 }}>
                  <p className="settings-section__subtitle">SYSTEM</p>
                  <SettingsRow
                    label="Maintenance Mode"
                    hint="Temporarily disable the storefront"
                    toggle={<Toggle on={false} onChange={() => {}} />}
                  />
                  <SettingsRow
                    label="Guest Checkout"
                    hint="Allow purchases without an account"
                    toggle={<Toggle on={true} onChange={() => {}} />}
                  />
                  <SettingsRow
                    label="Review Moderation"
                    hint="Manually approve customer reviews"
                    toggle={<Toggle on={false} onChange={() => {}} />}
                  />
                </div>

                <div style={{ marginTop: 24 }}>
                  <p className="settings-section__subtitle">DANGER ZONE</p>
                  <SettingsRow label="Export All Data" hint="Download a full CSV export of store data" onClick={() => {}} />
                  <SettingsRow label="Clear Cache" hint="Purge stored assets and session data" onClick={() => {}} />
                </div>
              </SettingsSection>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
