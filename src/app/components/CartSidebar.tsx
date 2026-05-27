import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="5" x2="12" y2="19" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <line x1="5" y1="12" x2="19" y2="12" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <polyline points="3,6 5,6 21,6" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6l-1 14H6L5 6" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#737373" strokeWidth="1.5" />
      <path d="M7 11V7a5 5 0 0110 0v4" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { items, loading, updateItem, removeItem, itemCount, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 100 ? 0 : 8;
  const total = subtotal - discount + shipping;

  function applyPromo() {
    if (promoCode.trim().toUpperCase() === "GANJJ10") setPromoApplied(true);
  }

  function handleCheckout() {
    onClose();
    navigate("/checkout");
  }

  return (
    <>
      {isOpen && (
        <div className="cart-backdrop" onClick={onClose} />
      )}

      <div className={`cart-drawer${isOpen ? " cart-drawer--open" : ""}`}>
        <div className="cart-drawer__head">
          <p className="cart-drawer__title">
            Seu carrinho
            {itemCount > 0 && (
              <span className="cart-drawer__count"> ({itemCount})</span>
            )}
          </p>
          <button className="cart-drawer__close" onClick={onClose}><CloseIcon /></button>
        </div>

        {!usuario ? (
          <div className="cart-empty">
            <p className="cart-empty__title">Faça login para ver seu carrinho.</p>
            <p className="cart-empty__sub">Seus itens ficam salvos na sua conta.</p>
            <button className="cart-cta" onClick={() => { onClose(); navigate("/login"); }}>
              Entrar
            </button>
          </div>
        ) : loading ? (
          <div className="cart-empty">
            <p className="cart-empty__sub">Carregando...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty__title">Seu carrinho está vazio.</p>
            <p className="cart-empty__sub">Adicione itens para começar.</p>
            <button className="cart-cta" onClick={() => { onClose(); navigate("/listing"); }}>
              Comprar agora
            </button>
          </div>
        ) : (
          <>
            {shipping > 0 && (
              <div className="cart-shipping-notice">
                Adicione <strong>R${(100 - subtotal).toFixed(0)} a mais</strong> para frete grátis
              </div>
            )}
            {shipping === 0 && (
              <div className="cart-shipping-notice cart-shipping-notice--free">
                ✓ Você desbloqueou o frete grátis!
              </div>
            )}

            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div
                    className="cart-item__thumb"
                    style={
                      item.imagem_url
                        ? { backgroundImage: `url(${item.imagem_url})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : { background: "#f0f0f0" }
                    }
                  />
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.nome}</p>
                    {item.cor && (
                      <p className="cart-item__meta">{item.cor}</p>
                    )}
                    <div className="cart-item__bottom">
                      <div className="cart-qty">
                        <button
                          className="cart-qty__btn"
                          onClick={() => updateItem(item.produto_id, item.quantidade - 1)}
                        >
                          <MinusIcon />
                        </button>
                        <span className="cart-qty__val">{item.quantidade}</span>
                        <button
                          className="cart-qty__btn"
                          onClick={() => updateItem(item.produto_id, item.quantidade + 1)}
                        >
                          <PlusIcon />
                        </button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <p className="cart-item__price">R${(item.preco * item.quantidade).toFixed(0)}</p>
                        <button
                          className="cart-item__remove"
                          onClick={() => removeItem(item.produto_id)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-promo">
              <input
                className="cart-promo__input"
                placeholder="Promo code"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                disabled={promoApplied}
              />
              <button
                className={`cart-promo__btn${promoApplied ? " cart-promo__btn--applied" : ""}`}
                onClick={applyPromo}
                disabled={promoApplied}
              >
                {promoApplied ? "Aplicado" : "Aplicar"}
              </button>
            </div>
            {promoApplied && (
              <p style={{ fontSize: 11, color: "#2a7a3b", letterSpacing: "0.4px", padding: "0 20px", marginTop: -8 }}>
                10% de desconto aplicado — código GANJJ10
              </p>
            )}

            <div className="cart-summary">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>R${subtotal.toFixed(0)}</span>
              </div>
              {promoApplied && (
                <div className="cart-summary__row cart-summary__row--discount">
                  <span>Desconto (10%)</span>
                  <span>R${discount.toFixed(0)}</span>
                </div>
              )}
              <div className="cart-summary__row">
                <span>Frete</span>
                <span>{shipping === 0 ? "Grátis" : `R$${shipping}`}</span>
              </div>
              <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>R${total.toFixed(0)}</span>
              </div>
            </div>

            <div className="cart-footer">
              <button className="cart-cta" onClick={handleCheckout}>
                Checkout · R${total.toFixed(0)}
              </button>
              <p className="cart-secure">
                <LockIcon />
                Checkout criptografado para a sua proteção.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
