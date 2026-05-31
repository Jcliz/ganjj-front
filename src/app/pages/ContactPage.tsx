import React, { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";


function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="#262626" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="3" stroke="#262626" strokeWidth="1.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#262626" strokeWidth="1.5" />
      <polyline points="22,6 12,13 2,6" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#262626" strokeWidth="1.5" />
      <polyline points="12,7 12,12 15,15" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Topic = "Pedido" | "Troca" | "Produto" | "Conta" | "Imprensa" | "Outro";
const TOPICS: Topic[] = ["Pedido", "Troca", "Produto", "Conta", "Imprensa", "Outro"];

export function ContactPage() {
  usePageTitle("Contato");
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [orderNum,  setOrderNum]  = useState("");
  const [topic,     setTopic]     = useState<Topic>("Pedido");
  const [message,   setMessage]   = useState("");
  const [focused,   setFocused]   = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors,    setErrors]    = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim())    e.name    = "Seu nome é obrigatório.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Informe um e-mail válido.";
    if (!message.trim()) e.message = "Descreva sua dúvida ou problema.";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="page">
        <Header />
        <main className="contact-page">
          <div className="contact-success">
            <div className="contact-success__icon">✓</div>
            <p className="contact-success__title">Mensagem enviada.</p>
            <p className="contact-success__sub">
              Obrigado, {name.split(" ")[0]}. Recebemos sua mensagem e retornaremos para{" "}
              <strong>{email}</strong> em até 1 dia útil.
            </p>
            <button className="contact-submit-btn" onClick={() => setSubmitted(false)}>
              Enviar outra mensagem
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header />

      <main className="contact-page">
        {/* Hero */}
        <div className="contact-hero">
          <p className="contact-hero__label">FALE COM A GANJJ</p>
          <h1 className="contact-hero__title">Fale conosco</h1>
          <p className="contact-hero__sub">Estamos aqui para ajudar. Entre em contato e responderemos em até 1 dia útil.</p>
        </div>

        <div className="contact-layout">

          {/* Left – info */}
          <aside className="contact-info">
            <div className="contact-info__block">
              <p className="contact-info__label">ATENDIMENTO AO CLIENTE</p>
              {[
                { icon: <MailIcon />,    text: "contato@ganjj.com.br" },
                { icon: <PhoneIcon />,   text: "+55 (11) 99999-0360" },
                { icon: <ClockIcon />,   text: "Seg–Sex, 9h – 18h (BRT)" },
              ].map(r => (
                <div key={r.text} className="contact-info__row">
                  {r.icon}
                  <span>{r.text}</span>
                </div>
              ))}
            </div>

            <div className="contact-info__block">
              <p className="contact-info__label">SEDE</p>
              {[
                { icon: <MapPinIcon />, text: "Curitiba, PR — Brasil" },
                { icon: <ClockIcon />, text: "Seg–Sex, 9h – 18h (BRT)" },
              ].map(r => (
                <div key={r.text} className="contact-info__row">
                  {r.icon}
                  <span style={{ whiteSpace: "pre-line" }}>{r.text}</span>
                </div>
              ))}
            </div>

            <div className="contact-info__block">
              <p className="contact-info__label">LINKS RÁPIDOS</p>
              {[
                { label: "Trocas e devoluções", path: "/returns" },
              ].map(l => (
                <p key={l.label} className="contact-info__link">{l.label}</p>
              ))}
            </div>
          </aside>

          {/* Right – form */}
          <div className="contact-form-wrap">
            <p className="contact-form-wrap__title">Envie uma mensagem</p>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {/* Name + email row */}
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="c-name">NOME COMPLETO</label>
                  <input
                    id="c-name"
                    className="contact-form__input"
                    placeholder="João Silva"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    style={{ borderColor: errors.name ? "#d0021b" : focused === "name" ? "#262626" : "#dddbdc" }}
                  />
                  {errors.name && <p className="contact-form__error">{errors.name}</p>}
                </div>
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="c-email">ENDEREÇO DE E-MAIL</label>
                  <input
                    id="c-email"
                    className="contact-form__input"
                    type="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    style={{ borderColor: errors.email ? "#d0021b" : focused === "email" ? "#262626" : "#dddbdc" }}
                  />
                  {errors.email && <p className="contact-form__error">{errors.email}</p>}
                </div>
              </div>

              {/* Topic row */}
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label className="contact-form__label">ASSUNTO</label>
                  <div className="contact-form__radios">
                    {TOPICS.map(t => (
                      <label key={t} className="contact-form__radio-label">
                        <span
                          className="contact-form__radio-box"
                          style={{ borderColor: topic === t ? "#262626" : "#dddbdc" }}
                          onClick={() => setTopic(t)}
                        >
                          {topic === t && <span className="contact-form__radio-dot" />}
                        </span>
                        {t}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="c-order">NÚMERO DO PEDIDO <span style={{ color: "#737373", fontWeight: 400 }}>(opcional)</span></label>
                  <input
                    id="c-order"
                    className="contact-form__input"
                    placeholder="#GJ-XXXXXX"
                    value={orderNum}
                    onChange={e => setOrderNum(e.target.value)}
                    onFocus={() => setFocused("order")}
                    onBlur={() => setFocused(null)}
                    style={{ borderColor: focused === "order" ? "#262626" : "#dddbdc" }}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="contact-form__field">
                <label className="contact-form__label" htmlFor="c-msg">MENSAGEM</label>
                <textarea
                  id="c-msg"
                  className="contact-form__input contact-form__textarea"
                  rows={5}
                  placeholder="Descreva sua dúvida ou problema com o máximo de detalhes possível…"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onFocus={() => setFocused("msg")}
                  onBlur={() => setFocused(null)}
                  style={{ borderColor: errors.message ? "#d0021b" : focused === "msg" ? "#262626" : "#dddbdc" }}
                />
                {errors.message && <p className="contact-form__error">{errors.message}</p>}
              </div>

              <button type="submit" className="contact-submit-btn">
                Enviar mensagem
              </button>

              <p className="contact-form__note">
                Ao enviar este formulário você concorda com nossa{" "}
                <span style={{ textDecoration: "underline", cursor: "pointer" }}>Política de Privacidade</span>.
                Não compartilhamos suas informações com terceiros.
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
