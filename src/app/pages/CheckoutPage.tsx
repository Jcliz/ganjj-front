import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Logo } from "../components/Logo";

// ─── Icons ────────────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#737373" strokeWidth="1.5" />
      <path d="M7 11V7a5 5 0 0110 0v4" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="#262626" />
      <polyline points="8,12 11,15 16,9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <polyline points="9,6 15,12 9,18" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Mock cart summary ────────────────────────────────────────────────────────

const CART_ITEMS = [
  { id: 1, name: "The Organic Cotton Box-Cut Tee", color: "Black",  colorHex: "#262626", size: "M",     price: 35,  qty: 1 },
  { id: 2, name: "The Merino Turtleneck",          color: "Forest", colorHex: "#2e4a3a", size: "S",     price: 120, qty: 1 },
  { id: 3, name: "The Straight Leg Jean",          color: "Slate",  colorHex: "#5c6b7a", size: "28×30", price: 98,  qty: 2 },
];
const SUBTOTAL = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
const SHIPPING  = 0;
const TAX       = Math.round(SUBTOTAL * 0.0875);
const TOTAL     = SUBTOTAL + SHIPPING + TAX;

// ─── Steps ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

// ─── Field helper ─────────────────────────────────────────────────────────────

function Field({
  id, label, value, onChange, type = "text", placeholder, half, focused, onFocus, onBlur, error
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; half?: boolean;
  focused: string | null; onFocus: (id: string) => void; onBlur: () => void; error?: string;
}) {
  return (
    <div className="checkout-field" style={{ flex: half ? "0 0 calc(50% - 6px)" : "1 1 100%" }}>
      <label className="checkout-field__label" htmlFor={id}>{label}</label>
      <input
        id={id}
        className="checkout-field__input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => onFocus(id)}
        onBlur={onBlur}
        style={{ borderColor: error ? "#d0021b" : focused === id ? "#262626" : "#dddbdc" }}
        autoComplete="off"
      />
      {error && <p className="checkout-field__error">{error}</p>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CheckoutPage() {
  const navigate = useNavigate();
  const [step,    setStep]    = useState<Step>(1);
  const [focused, setFocused] = useState<string | null>(null);

  // Step 1 – Shipping
  const [sFirstName,  setSFirstName]  = useState("");
  const [sLastName,   setSLastName]   = useState("");
  const [sEmail,      setSEmail]      = useState("");
  const [sPhone,      setSPhone]      = useState("");
  const [sAddress,    setSAddress]    = useState("");
  const [sApt,        setSApt]        = useState("");
  const [sCity,       setSCity]       = useState("");
  const [sState,      setSState]      = useState("");
  const [sZip,        setSZip]        = useState("");
  const [sCountry,    setSCountry]    = useState("United States");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [s1Errors,    setS1Errors]    = useState<Record<string, string>>({});

  // Step 2 – Payment
  const [cardName,    setCardName]    = useState("");
  const [cardNum,     setCardNum]     = useState("");
  const [cardExp,     setCardExp]     = useState("");
  const [cardCvv,     setCardCvv]     = useState("");
  const [payMethod,   setPayMethod]   = useState<"card" | "paypal" | "apple">("card");
  const [billSame,    setBillSame]    = useState(true);
  const [s2Errors,    setS2Errors]    = useState<Record<string, string>>({});

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!sFirstName.trim()) e.sFirstName = "Required";
    if (!sLastName.trim())  e.sLastName  = "Required";
    if (!sEmail.trim() || !/\S+@\S+\.\S+/.test(sEmail)) e.sEmail = "Valid email required";
    if (!sAddress.trim())   e.sAddress   = "Required";
    if (!sCity.trim())      e.sCity      = "Required";
    if (!sState.trim())     e.sState     = "Required";
    if (!sZip.trim())       e.sZip       = "Required";
    return e;
  }

  function validateStep2() {
    if (payMethod !== "card") return {};
    const e: Record<string, string> = {};
    if (!cardName.trim())                 e.cardName = "Required";
    if (cardNum.replace(/\s/g, "").length < 16) e.cardNum  = "Enter full card number";
    if (!cardExp.trim())                  e.cardExp  = "Required";
    if (cardCvv.length < 3)               e.cardCvv  = "Required";
    return e;
  }

  function handleStep1() {
    const e = validateStep1();
    if (Object.keys(e).length) { setS1Errors(e); return; }
    setStep(2);
    window.scrollTo(0, 0);
  }

  function handleStep2() {
    const e = validateStep2();
    if (Object.keys(e).length) { setS2Errors(e); return; }
    setStep(3);
    window.scrollTo(0, 0);
  }

  function formatCard(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExp(v: string) {
    return v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
  }

  const stepLabels: { n: Step; label: string }[] = [
    { n: 1, label: "Shipping" },
    { n: 2, label: "Payment" },
    { n: 3, label: "Confirmation" },
  ];

  return (
    <div className="checkout-page">
      {/* Minimal header */}
      <header className="checkout-header">
        <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <Logo />
        </div>
        <div className="checkout-steps">
          {stepLabels.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className={`checkout-step${step === s.n ? " checkout-step--active" : ""}${step > s.n ? " checkout-step--done" : ""}`}>
                <span className="checkout-step__dot">
                  {step > s.n ? <CheckIcon /> : s.n}
                </span>
                <span className="checkout-step__label">{s.label}</span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`checkout-step-line${step > s.n ? " checkout-step-line--done" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="checkout-header__secure">
          <LockIcon />
          <span>Secure checkout</span>
        </div>
      </header>

      <div className="checkout-layout">
        {/* ── Left: Form area ── */}
        <div className="checkout-form-area">

          {/* STEP 1 – Shipping */}
          {step === 1 && (
            <div className="checkout-card">
              <p className="checkout-card__title">Shipping Information</p>

              <div className="checkout-fields">
                <div className="checkout-fields__row">
                  <Field id="s-fn" label="FIRST NAME" value={sFirstName} onChange={setSFirstName} half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sFirstName} />
                  <Field id="s-ln" label="LAST NAME"  value={sLastName}  onChange={setSLastName}  half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sLastName} />
                </div>
                <div className="checkout-fields__row">
                  <Field id="s-em" label="EMAIL ADDRESS" value={sEmail} onChange={setSEmail} type="email" focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sEmail} />
                  <Field id="s-ph" label="PHONE" value={sPhone} onChange={setSPhone} type="tel" half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} />
                </div>
                <Field id="s-addr" label="ADDRESS" value={sAddress} onChange={setSAddress} placeholder="Street address" focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sAddress} />
                <Field id="s-apt"  label="APT / SUITE (optional)" value={sApt} onChange={setSApt} focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} />
                <div className="checkout-fields__row">
                  <Field id="s-city"  label="CITY"      value={sCity}    onChange={setSCity}    focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sCity} />
                  <Field id="s-state" label="STATE"     value={sState}   onChange={setSState}   half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sState} />
                  <Field id="s-zip"   label="ZIP CODE"  value={sZip}     onChange={setSZip}     half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sZip} />
                </div>
                <div className="checkout-field">
                  <label className="checkout-field__label">COUNTRY</label>
                  <select
                    className="checkout-field__input"
                    value={sCountry}
                    onChange={e => setSCountry(e.target.value)}
                    style={{ borderColor: "#dddbdc", appearance: "none" }}
                  >
                    {["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shipping method */}
              <div style={{ marginTop: 28 }}>
                <p className="checkout-card__subtitle">SHIPPING METHOD</p>
                <div className="checkout-shipping-opts">
                  {[
                    { key: "standard", label: "Standard Shipping",  sub: "5–7 business days",  price: "Free" },
                    { key: "express",  label: "Express Shipping",   sub: "2–3 business days",  price: "$12" },
                  ].map(opt => (
                    <label
                      key={opt.key}
                      className={`checkout-shipping-opt${shippingMethod === opt.key ? " checkout-shipping-opt--active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={opt.key}
                        checked={shippingMethod === opt.key}
                        onChange={() => setShippingMethod(opt.key as "standard" | "express")}
                        style={{ display: "none" }}
                      />
                      <div className="checkout-shipping-opt__radio">
                        {shippingMethod === opt.key && <span className="checkout-shipping-opt__dot" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className="checkout-shipping-opt__label">{opt.label}</p>
                        <p className="checkout-shipping-opt__sub">{opt.sub}</p>
                      </div>
                      <p className="checkout-shipping-opt__price">{opt.price}</p>
                    </label>
                  ))}
                </div>
              </div>

              <button className="checkout-submit-btn" onClick={handleStep1}>
                Continue to Payment
                <ChevronRightIcon />
              </button>
            </div>
          )}

          {/* STEP 2 – Payment */}
          {step === 2 && (
            <div className="checkout-card">
              <p className="checkout-card__title">Payment</p>

              {/* Method tabs */}
              <div className="checkout-pay-tabs">
                {([
                  { key: "card",   label: "Credit Card" },
                  { key: "paypal", label: "PayPal" },
                  { key: "apple",  label: "Apple Pay" },
                ] as const).map(m => (
                  <button
                    key={m.key}
                    className={`checkout-pay-tab${payMethod === m.key ? " checkout-pay-tab--active" : ""}`}
                    onClick={() => setPayMethod(m.key)}
                    type="button"
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {payMethod === "card" && (
                <div className="checkout-fields">
                  <Field id="c-name" label="NAME ON CARD" value={cardName} onChange={setCardName} focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s2Errors.cardName} />
                  <Field id="c-num"  label="CARD NUMBER"  value={cardNum}  onChange={v => setCardNum(formatCard(v))} placeholder="•••• •••• •••• ••••" focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s2Errors.cardNum} />
                  <div className="checkout-fields__row">
                    <Field id="c-exp" label="EXPIRY (MM/YY)" value={cardExp} onChange={v => setCardExp(formatExp(v))} placeholder="MM/YY" half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s2Errors.cardExp} />
                    <Field id="c-cvv" label="CVV"            value={cardCvv} onChange={v => setCardCvv(v.slice(0, 4))} placeholder="•••" half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s2Errors.cardCvv} />
                  </div>
                </div>
              )}

              {payMethod === "paypal" && (
                <div className="checkout-alt-pay">
                  <p>You'll be redirected to PayPal to complete your payment securely.</p>
                </div>
              )}

              {payMethod === "apple" && (
                <div className="checkout-alt-pay">
                  <p>Apple Pay will open on your device to confirm payment.</p>
                </div>
              )}

              {/* Billing address */}
              <div style={{ marginTop: 20 }}>
                <label className="checkout-same-billing">
                  <span
                    className="checkout-checkbox"
                    style={{ borderColor: billSame ? "#262626" : "#dddbdc", background: billSame ? "#262626" : "#fff" }}
                    onClick={() => setBillSame(v => !v)}
                  >
                    {billSame && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  Billing address same as shipping
                </label>
              </div>

              <div className="checkout-btn-row">
                <button className="checkout-back-btn" onClick={() => setStep(1)} type="button">← Back</button>
                <button className="checkout-submit-btn" onClick={handleStep2}>
                  Place Order · ${TOTAL}
                  <LockIcon />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 – Confirmation */}
          {step === 3 && (
            <div className="checkout-card checkout-confirmation">
              <div className="checkout-confirmation__icon">✓</div>
              <p className="checkout-confirmation__title">Order confirmed!</p>
              <p className="checkout-confirmation__sub">
                Thank you for your purchase. Your order{" "}
                <strong>#EV-{Math.floor(Math.random() * 90000) + 10000}</strong> has been placed and will be processed shortly.
              </p>
              <p className="checkout-confirmation__eta">
                Estimated delivery: <strong>
                  {new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  {" "}–{" "}
                  {new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </strong>
              </p>
              <p className="checkout-confirmation__email">
                A confirmation has been sent to <strong>{sEmail || "your email address"}</strong>.
              </p>
              <div className="checkout-confirmation__btns">
                <button className="checkout-submit-btn" onClick={() => navigate("/")}>Continue Shopping</button>
                <button className="checkout-outline-btn">Track Order</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Order summary ── */}
        <aside className="checkout-summary">
          <p className="checkout-summary__title">Order Summary</p>

          <div className="checkout-summary__items">
            {CART_ITEMS.map(item => (
              <div key={item.id} className="checkout-summary__item">
                <div
                  className="checkout-summary__swatch"
                  style={{ background: item.colorHex, border: parseInt(item.colorHex.replace("#", ""), 16) > 0xaaaaaa ? "1px solid #dddbdc" : "none" }}
                />
                <div style={{ flex: 1 }}>
                  <p className="checkout-summary__item-name">{item.name}</p>
                  <p className="checkout-summary__item-meta">{item.color} · {item.size} · Qty {item.qty}</p>
                </div>
                <p className="checkout-summary__item-price">${item.price * item.qty}</p>
              </div>
            ))}
          </div>

          <div className="checkout-summary__totals">
            <div className="checkout-summary__row">
              <span>Subtotal</span>
              <span>${SUBTOTAL}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Shipping</span>
              <span>{SHIPPING === 0 ? "Free" : `$${SHIPPING}`}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Tax</span>
              <span>${TAX}</span>
            </div>
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total</span>
              <span>${TOTAL}</span>
            </div>
          </div>

          <div className="checkout-summary__secure">
            <LockIcon />
            <span>256-bit SSL encryption</span>
          </div>

          {/* Return policy note */}
          <p className="checkout-summary__policy">
            Free returns within 30 days.{" "}
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => navigate("/returns")}
            >
              Learn more
            </span>
          </p>
        </aside>
      </div>
    </div>
  );
}
