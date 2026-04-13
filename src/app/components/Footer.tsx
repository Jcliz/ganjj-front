export function Footer() {
  const getLinkProps = (label: string) => {
    const routes: Record<string, { href: string; target?: string; rel?: string }> = {
      "Login": { href: "/login" },
      "Cadastro": { href: "/register" },
      "Sobre": { href: "/about" },
      "Política de Devolução": { href: "/returns" },

      "Facebook": { href: "https://facebook.com", target: "_blank", rel: "noopener noreferrer" },
      "Instagram": { href: "https://instagram.com", target: "_blank", rel: "noopener noreferrer" },
      "Twitter": { href: "https://twitter.com", target: "_blank", rel: "noopener noreferrer" },
    };

    return routes[label] || { href: "#" };
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__cols">
          <div className="footer__col">
            <p className="footer__col-title">Conta</p>
            <div className="footer__links">
              {["Login", "Cadastro", "Resgatar um Cartão Presente"].map(l => (
                <a key={l} className="footer__link" {...getLinkProps(l)}>{l}</a>
              ))}
            </div>
          </div>
          <div className="footer__col">
            <p className="footer__col-title">Empresa</p>
            <div className="footer__links">
              {["Sobre", "Iniciativas Ambientais", "Fábricas", "DEI", "Carreiras", "Internacional", "Acessibilidade"].map(l => (
                <a key={l} className="footer__link" {...getLinkProps(l)}>{l}</a>
              ))}
            </div>
          </div>
          <div className="footer__col">
            <p className="footer__col-title">Ajuda</p>
            <div className="footer__links">
              {["Central de Ajuda", "Política de Devolução", "Informações de Envio", "Pedidos em Grande Escala"].map(l => (
                <a key={l} className="footer__link" {...getLinkProps(l)}>{l}</a>
              ))}
            </div>
          </div>
          <div className="footer__col">
            <p className="footer__col-title">Conectar</p>
            <div className="footer__links">
              {["Facebook", "Instagram", "Twitter", "Afiliados", "Nossas Lojas"].map(l => (
                <a key={l} className="footer__link" {...getLinkProps(l)}>{l}</a>
              ))}
            </div>
          </div>
          <div className="footer__email-form" style={{ height: "100px" }}>
            <input
              className="footer__email-input"
              type="email"
              placeholder="Endereço de e-mail"
            />
            <button className="footer__email-btn" aria-label="Subscribe">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <polyline points="15,6 21,12 15,18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__legal-links">
            {["Política de Privacidade", "Termos de Serviço", "Não Vender ou Compartilhar Minhas Informações Pessoais", "Transparência da Cadeia de Suprimentos CS", "Código de Conduta do Fornecedor", "Páginas do Sitemap", "Produtos do Sitemap"].map(l => (
              <a key={l} className="footer__legal-link" {...getLinkProps(l)}>{l}</a>
            ))}
          </div>
          <p className="footer__copyright">© 2026 Todos os Direitos Reservados</p>
        </div>
      </div>
    </footer>
  );
}