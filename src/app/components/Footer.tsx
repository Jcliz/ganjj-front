import React from "react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__cols">
          {/* Account */}
          <div className="footer__col">
            <p className="footer__col-title">Acount</p>
            <div className="footer__links">
              {["Log In", "Sign Up", "Redeem a Gift Card"].map(l => (
                <p key={l} className="footer__link">{l}</p>
              ))}
            </div>
          </div>
          {/* Company */}
          <div className="footer__col">
            <p className="footer__col-title">Company</p>
            <div className="footer__links">
              {["About", "Environmental Initiatives", "Factories", "DEI", "Careers", "International", "Accessibility"].map(l => (
                <p key={l} className="footer__link">{l}</p>
              ))}
            </div>
          </div>
          {/* Get Help */}
          <div className="footer__col">
            <p className="footer__col-title">Get Help</p>
            <div className="footer__links">
              {["Help Center", "Return Policy", "Shipping Info", "Bulk Orders"].map(l => (
                <p key={l} className="footer__link">{l}</p>
              ))}
            </div>
          </div>
          {/* Connect */}
          <div className="footer__col">
            <p className="footer__col-title">Connect</p>
            <div className="footer__links">
              {["Facebook", "Instagram", "Twitter", "Affiliates", "Out Stores"].map(l => (
                <p key={l} className="footer__link">{l}</p>
              ))}
            </div>
          </div>
          {/* Email Signup */}
          <div className="footer__email-form">
            <input
              className="footer__email-input"
              type="email"
              placeholder="Email Address"
            />
            <button className="footer__email-btn" aria-label="Subscribe">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <polyline points="15,6 21,12 15,18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <div className="footer__legal-links">
            {["Privacy Policy", "Terms of Service", "Do Not Sell or Share My Personal Information", "CS Supply Chain Transparency", "Vendor Code of Conduct", "Sitemap Pages", "Sitemap Products"].map(l => (
              <span key={l} className="footer__legal-link">{l}</span>
            ))}
          </div>
          <p className="footer__copyright">© 2023 All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
