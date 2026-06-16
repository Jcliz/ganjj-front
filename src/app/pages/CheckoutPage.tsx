import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

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

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type Step = 1 | 2 | 3;

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

export function CheckoutPage() {
  usePageTitle("Checkout");
  const navigate = useNavigate();
  const { usuario, loading } = useAuth();

  useEffect(() => {
    if (!loading && !usuario) navigate("/login", { replace: true });
  }, [loading, usuario, navigate]);
  const { items, subtotal, clearCart } = useCart();
  const [step,      setStep]      = useState<Step>(1);
  const [focused,   setFocused]   = useState<string | null>(null);
  const [orderId,   setOrderId]   = useState<string | null>(null);
  const [confirmedAt, setConfirmedAt] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [sFirstName,  setSFirstName]  = useState("");
  const [sLastName,   setSLastName]   = useState("");
  const [sEmail,      setSEmail]      = useState("");
  const [sPhone,      setSPhone]      = useState("");
  const [sAddress,    setSAddress]    = useState("");
  const [sApt,        setSApt]        = useState("");
  const [sCity,       setSCity]       = useState("");
  const [sState,      setSState]      = useState("");
  const [sZip,        setSZip]        = useState("");
  const [shippingMethod, setShippingMethod] = useState<"normal" | "rapido">("normal");

  const shippingCost = shippingMethod === "rapido" ? 12 : 0;
  const tax          = Math.round(subtotal * 0.0875);
  const total        = subtotal + shippingCost + tax;
  const [s1Errors,    setS1Errors]    = useState<Record<string, string>>({});

  const [cardName,    setCardName]    = useState("");
  const [cardNum,     setCardNum]     = useState("");
  const [cardExp,     setCardExp]     = useState("");
  const [cardCvv,     setCardCvv]     = useState("");
  const [payMethod,   setPayMethod]   = useState<"cartao" | "pix" | "apple">("cartao");
  const [billSame,    setBillSame]    = useState(true);
  const [s2Errors,    setS2Errors]    = useState<Record<string, string>>({});

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!sFirstName.trim()) e.sFirstName = "Obrigatório";
    if (!sLastName.trim())  e.sLastName  = "Obrigatório";
    if (!sEmail.trim() || !/\S+@\S+\.\S+/.test(sEmail)) e.sEmail = "Email válido é obrigatório";
    if (!sAddress.trim())   e.sAddress   = "Obrigatório";
    if (!sCity.trim())      e.sCity      = "Obrigatório";
    if (!sState.trim())     e.sState     = "Obrigatório";
    if (!sZip.trim())       e.sZip       = "Obrigatório";
    return e;
  }

  function validateStep2() {
    if (payMethod !== "cartao") return {};
    const e: Record<string, string> = {};
    if (!cardName.trim())                 e.cardName = "Obrigatório";
    if (cardNum.replace(/\s/g, "").length < 16) e.cardNum  = "Digite o número completo do cartão";
    if (!cardExp.trim())                  e.cardExp  = "Obrigatório";
    if (cardCvv.length < 3)               e.cardCvv  = "Obrigatório";
    return e;
  }

  function handleStep1() {
    const e = validateStep1();
    if (Object.keys(e).length) { setS1Errors(e); return; }
    setStep(2);
    window.scrollTo(0, 0);
  }

  async function handleStep2() {
    const e = validateStep2();
    if (Object.keys(e).length) { setS2Errors(e); return; }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${API_URL}/api/pedidos`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itens: items.map(item => ({
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            preco: item.preco,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Erro ao finalizar pedido');
      }

      const data = await res.json();
      setOrderId(data.codigo);
      setConfirmedAt(Date.now());
      await clearCart();
      setStep(3);
      window.scrollTo(0, 0);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao finalizar pedido');
    } finally {
      setSubmitting(false);
    }
  }

  function formatCard(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExp(v: string) {
    return v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
  }

  const stepLabels: { n: Step; label: string }[] = [
    { n: 1, label: "Frete" },
    { n: 2, label: "Pagamento" },
    { n: 3, label: "Confirmação" },
  ];

  return (
    <div className="checkout-page">
      <header className="checkout-header">
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
          <span>Checkout seguro</span>
        </div>
      </header>

      <div className="checkout-layout">
        <div className="checkout-form-area">

          {step === 1 && (
            <div className="checkout-card">
              <p className="checkout-card__title">Informações de entrega</p>

              <div className="checkout-fields">
                <div className="checkout-fields__row">
                  <Field id="s-fn" label="NOME" value={sFirstName} onChange={setSFirstName} half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sFirstName} />
                  <Field id="s-ln" label="SOBRENOME"  value={sLastName}  onChange={setSLastName}  half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sLastName} />
                </div>
                <div className="checkout-fields__row">
                  <Field id="s-em" label="EMAIL" value={sEmail} onChange={setSEmail} type="email" focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sEmail} />
                  <Field id="s-ph" label="TELEFONE" value={sPhone} onChange={setSPhone} type="tel" half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} />
                </div>
                <Field id="s-addr" label="ENDEREÇO" value={sAddress} onChange={setSAddress} placeholder="Endereço" focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sAddress} />
                <Field id="s-apt"  label="APT / SUITE (opcional)" value={sApt} onChange={setSApt} focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} />
                <div className="checkout-fields__row">
                  <Field id="s-city"  label="CIDADE"      value={sCity}    onChange={setSCity}    focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sCity} />
                  <Field id="s-state" label="ESTADO"     value={sState}   onChange={setSState}   half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sState} />
                  <Field id="s-zip"   label="CEP"  value={sZip}     onChange={setSZip}     half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s1Errors.sZip} />
                </div>
              </div>

              <div style={{ marginTop: 28 }}>
                <p className="checkout-card__subtitle">MÉTODO DE ENVIO</p>
                <div className="checkout-shipping-opts">
                  {[
                    { key: "normal", label: "Envio Normal",  sub: "5–7 dias úteis",  price: "Grátis" },
                    { key: "rapido",  label: "Envio Rápido",   sub: "2–3 dias úteis",  price: "R$12" },
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
                        onChange={() => setShippingMethod(opt.key as "normal" | "rapido")}
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
                Continuar para pagamento
                <ChevronRightIcon />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-card">
              <p className="checkout-card__title">Pagamento</p>

              <div className="checkout-pay-tabs">
                {([
                  { key: "cartao",   label: "Cartão de Crédito" },
                  { key: "pix", label: "Pix" },
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

              {payMethod === "cartao" && (
                <div className="checkout-fields">
                  <Field id="c-name" label="NOME NO CARTÃO" value={cardName} onChange={setCardName} focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s2Errors.cardName} />
                  <Field id="c-num"  label="NÚMERO DO CARTÃO"  value={cardNum}  onChange={v => setCardNum(formatCard(v))} placeholder="•••• •••• •••• ••••" focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s2Errors.cardNum} />
                  <div className="checkout-fields__row">
                    <Field id="c-exp" label="VALIDADE (MM/YY)" value={cardExp} onChange={v => setCardExp(formatExp(v))} placeholder="MM/YY" half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s2Errors.cardExp} />
                    <Field id="c-cvv" label="CVV"            value={cardCvv} onChange={v => setCardCvv(v.slice(0, 4))} placeholder="•••" half focused={focused} onFocus={setFocused} onBlur={() => setFocused(null)} error={s2Errors.cardCvv} />
                  </div>
                </div>
              )}

              {payMethod === "pix" && (
                <div className="checkout-alt-pay">
                  <p>Você será redirecionado para uma integração com o Abacate Pay para concluir seu pagamento com segurança.</p>
                </div>
              )}

              {payMethod === "apple" && (
                <div className="checkout-alt-pay">
                  <p>O Apple Pay será aberto em seu dispositivo para confirmar o pagamento.</p>
                </div>
              )}

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
                  Endereço de cobrança igual ao de entrega
                </label>
              </div>

              {submitError && (
                <p style={{ color: "#d0021b", fontSize: 12, marginTop: 12 }}>{submitError}</p>
              )}
              <div className="checkout-btn-row">
                <button className="checkout-back-btn" onClick={() => setStep(1)} type="button" disabled={submitting}>← Voltar</button>
                <button className="checkout-submit-btn" onClick={handleStep2} disabled={submitting}>
                  {submitting ? "Processando..." : `Finalizar Pedido · R$${total.toFixed(2)}`}
                  {!submitting && <LockIcon />}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="checkout-card checkout-confirmation">
              <div className="checkout-confirmation__icon">✓</div>
              <p className="checkout-confirmation__title">Pedido confirmado!</p>
              <p className="checkout-confirmation__sub">
                Obrigado pela sua compra. Seu pedido{" "}
                <strong>{orderId ?? "—"}</strong> foi realizado e será processado em breve.
              </p>
              <p className="checkout-confirmation__eta">
                Entrega estimada: <strong>
                  {new Date((confirmedAt ?? 0) + 5 * 86400000).toLocaleDateString("pt-BR", { month: "long", day: "numeric", year: "numeric" })}
                  {" "}–{" "}
                  {new Date((confirmedAt ?? 0) + 7 * 86400000).toLocaleDateString("pt-BR", { month: "long", day: "numeric", year: "numeric" })}
                </strong>
              </p>
              <p className="checkout-confirmation__email">
                A confirmação foi enviada para <strong>{sEmail || "seu endereço de e-mail"}</strong>.
              </p>
              <div className="checkout-confirmation__btns">
                <button className="checkout-submit-btn" onClick={() => navigate("/")}>Continuar Comprando</button>
              </div>
            </div>
          )}
        </div>

        <aside className="checkout-summary">
          <p className="checkout-summary__title">Resumo do Pedido</p>

          <div className="checkout-summary__items">
            {items.map(item => (
              <div key={item.id} className="checkout-summary__item">
                <div
                  className="checkout-summary__swatch"
                  style={
                    item.imagem_url
                      ? { backgroundImage: `url(${item.imagem_url})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : { background: "#f0f0f0" }
                  }
                />
                <div style={{ flex: 1 }}>
                  <p className="checkout-summary__item-name">{item.nome}</p>
                  <p className="checkout-summary__item-meta">
                    {item.cor ? `${item.cor} · ` : ""}Qtd {item.quantidade}
                  </p>
                </div>
                <p className="checkout-summary__item-price">R${(item.preco * item.quantidade).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="checkout-summary__totals">
            <div className="checkout-summary__row">
              <span>Subtotal</span>
              <span>R${subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Frete</span>
              <span>{shippingCost === 0 ? "Grátis" : `R$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Taxa</span>
              <span>R${tax.toFixed(2)}</span>
            </div>
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total</span>
              <span>R${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="checkout-summary__secure">
            <LockIcon />
            <span>Criptografia SSL de 256 bits</span>
          </div>

          <p className="checkout-summary__policy">
            Devoluções grátis dentro de 30 dias.{" "}
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => navigate("/returns")}
            >
              Saiba mais
            </span>
          </p>
        </aside>
      </div>
    </div>
  );
}
