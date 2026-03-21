import React from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const returnsSubNav = [
  { label: "Returns & Exchanges", active: true, path: "/returns" },
  { label: "Shipping Info" },
  { label: "Help Center" },
  { label: "Contact Us", path: "/contact" },
];

export function ReturnsPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <Header subNavItems={returnsSubNav} />

      <main className="returns-page">
        {/* Hero strip */}
        <div className="returns-hero">
          <p className="returns-hero__label">CUSTOMER CARE</p>
          <h1 className="returns-hero__title">Returns &amp; Exchanges</h1>
          <p className="returns-hero__sub">We want you to love what you wear. If something isn't right, we'll make it right.</p>
        </div>

        {/* Content */}
        <div className="returns-body">

          {/* Policy overview */}
          <section className="returns-section">
            <p className="returns-section__label">OUR POLICY</p>
            <h2 className="returns-section__title">30-Day Free Returns</h2>
            <p className="returns-section__text">
              We offer free returns and exchanges within 30 days of your delivery date. Items must be unworn,
              unwashed, and in their original condition with all tags attached. Final Sale items are not eligible
              for return or exchange.
            </p>
          </section>

          <div className="returns-divider" />

          {/* Step-by-step */}
          <section className="returns-section">
            <p className="returns-section__label">HOW IT WORKS</p>
            <h2 className="returns-section__title">Three simple steps.</h2>

            <div className="returns-steps">
              {[
                {
                  n: "01",
                  title: "Initiate your return",
                  body: "Log in to your account and navigate to your Order History. Select the item(s) you'd like to return and choose 'Start a Return.' You'll receive a prepaid shipping label by email within minutes.",
                },
                {
                  n: "02",
                  title: "Pack & ship",
                  body: "Place the item(s) in any suitable box or the original packaging if you still have it. Attach your prepaid return label and drop the package at any USPS location or schedule a free pickup. We recommend keeping the tracking number for your records.",
                },
                {
                  n: "03",
                  title: "Receive your refund or exchange",
                  body: "Once we receive and inspect your return (typically within 3–5 business days), we'll process your refund to the original payment method or dispatch your exchange order. Refunds may take 5–10 business days to appear depending on your bank.",
                },
              ].map(step => (
                <div key={step.n} className="returns-step">
                  <p className="returns-step__num">{step.n}</p>
                  <div className="returns-step__content">
                    <p className="returns-step__title">{step.title}</p>
                    <p className="returns-step__body">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="returns-divider" />

          {/* Conditions grid */}
          <section className="returns-section">
            <p className="returns-section__label">ELIGIBILITY</p>
            <h2 className="returns-section__title">What can be returned?</h2>
            <div className="returns-eligibility">
              <div className="returns-eligibility__col returns-eligibility__col--yes">
                <p className="returns-eligibility__head">✓ &nbsp;Eligible for return</p>
                {[
                  "Full-price items within 30 days",
                  "Unworn & unwashed items",
                  "Items with original tags attached",
                  "Items in original packaging",
                  "Sale items (non-final)",
                ].map(line => (
                  <p key={line} className="returns-eligibility__item">{line}</p>
                ))}
              </div>
              <div className="returns-eligibility__col returns-eligibility__col--no">
                <p className="returns-eligibility__head">✕ &nbsp;Not eligible</p>
                {[
                  "Final Sale items",
                  "Items returned after 30 days",
                  "Washed, worn or altered items",
                  "Items without original tags",
                  "Gift cards",
                ].map(line => (
                  <p key={line} className="returns-eligibility__item">{line}</p>
                ))}
              </div>
            </div>
          </section>

          <div className="returns-divider" />

          {/* Exchange section */}
          <section className="returns-section">
            <p className="returns-section__label">EXCHANGES</p>
            <h2 className="returns-section__title">Need a different size or color?</h2>
            <p className="returns-section__text">
              Exchanges are processed the same way as returns. During the return process, simply select "Exchange"
              instead of "Refund" and choose your preferred size or color. We'll ship the replacement as soon as
              your original return is confirmed in transit — so you won't have to wait for it to arrive at our
              warehouse before we send the new item.
            </p>
            <p className="returns-section__text" style={{ marginTop: 16 }}>
              If your preferred exchange item is out of stock, we'll issue a full refund and notify you by email.
              You can also contact our customer care team at{" "}
              <span style={{ color: "#262626", textDecoration: "underline", cursor: "pointer" }}>
                care@everlane.com
              </span>
              {" "}and we'll do our best to source it for you.
            </p>
          </section>

          <div className="returns-divider" />

          {/* International */}
          <section className="returns-section">
            <p className="returns-section__label">INTERNATIONAL ORDERS</p>
            <h2 className="returns-section__title">Returning from outside the US?</h2>
            <p className="returns-section__text">
              For international returns, please contact our customer care team to receive return instructions
              specific to your country. Please note that international return shipping costs are the responsibility
              of the customer and are non-refundable. We recommend using a tracked shipping service.
            </p>
            <p className="returns-section__text" style={{ marginTop: 16 }}>
              Duties and taxes paid at the time of purchase are non-refundable. Refunds are issued in USD at
              the exchange rate applicable on the date the refund is processed.
            </p>
          </section>

          <div className="returns-divider" />

          {/* FAQ */}
          <section className="returns-section">
            <p className="returns-section__label">FREQUENTLY ASKED</p>
            <h2 className="returns-section__title">Common questions.</h2>
            <div className="returns-faqs">
              {[
                {
                  q: "How long does a refund take?",
                  a: "Once your return is received and inspected (3–5 business days), refunds are issued immediately but may take an additional 5–10 business days to appear on your statement, depending on your bank or card issuer.",
                },
                {
                  q: "Can I return a gift?",
                  a: "Yes. Gifts can be returned for store credit or exchanged for a different item. You'll need the order number, which you can find on the packing slip inside the original packaging.",
                },
                {
                  q: "What if my item arrived damaged or defective?",
                  a: "We're sorry to hear that. Please contact us at care@everlane.com with photos of the damage and your order number. We'll arrange a replacement or full refund at no cost to you — no return shipping needed.",
                },
                {
                  q: "Can I return items from multiple orders in one package?",
                  a: "Yes, but please include a separate packing slip or note for each order inside the package, and use the return label corresponding to the highest-value order. Contact us in advance so we can match everything correctly.",
                },
              ].map(faq => (
                <div key={faq.q} className="returns-faq">
                  <p className="returns-faq__q">{faq.q}</p>
                  <p className="returns-faq__a">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA banner */}
          <div className="returns-cta-banner">
            <p className="returns-cta-banner__title">Still have questions?</p>
            <p className="returns-cta-banner__sub">Our customer care team is available Monday–Friday, 9 am–5 pm PT.</p>
            <div className="returns-cta-banner__btns">
              <button className="returns-btn returns-btn--dark" onClick={() => navigate("/contact")}>
                Contact Us
              </button>
              <button className="returns-btn returns-btn--outline">
                care@everlane.com
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}