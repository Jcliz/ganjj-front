import { usePageTitle } from "../hooks/usePageTitle";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  landingHero,
  catShirts, catDenim, catTees, catPants, catSweaters, catOuterwear,
  bannerNewArrivals, bannerBestSellers, bannerHoliday,
  missionBanner,
  perkShipping, perkSustain,
} from "../../assets/assets";

const categoryItems = [
  { img: catShirts, label: "CAMISAS", dir: "/listing" },
  { img: catDenim, label: "JEANS", dir: "/listing" },
  { img: catTees, label: "TEES", dir: "/listing" },
  { img: catPants, label: "CALÇAS", dir: "/listing" },
  { img: catSweaters, label: "CASACOS", dir: "/listing" },
  { img: catOuterwear, label: "JAQUETAS", dir: "/listing" },
];

const bannerItems = [
  { img: bannerNewArrivals, title: "Novos", cta: "PEÇAS MAIS NOVAS", dir: "/listing" },
  { img: bannerBestSellers, title: "Populares", cta: "COMPRE OS POPULARES", dir: "/listing" },
  { img: bannerHoliday, title: "Sale GANJJ", cta: "ACESSE A SALE", dir: "/sale" },
];

export function LandingPage() {
  usePageTitle("");
  return (
    <div className="page">
      <Header />

      <section className="hero">
        <img src={landingHero} alt="Hero" className="hero__bg" />
        <div className="hero__content">
          <div className="hero__inner">
            <div className="hero__text-block">
              <p className="hero__title">A sua melhor opção</p>
              <div className="hero__subtitle">
                <p>conforto.</p>
                <p>cuidado.</p>
                <p>carinho.</p>
              </div>
            </div>
            <a className="btn btn--wide" href="/listing">COMPRE AGORA</a>
          </div>
        </div>
      </section>

      <section className="section-categories">
        <p className="section-categories__title">Navegue pelas categorias</p>
        <div className="category-grid">
          {categoryItems.map(({ img, label, dir }) => (
            <div key={label} className="category-card">
              <div className="category-card__img">
                <img src={img} alt={label} />
              </div>
              <a className="category-card__label" href={dir}>{label}</a>
            </div>
          ))}
        </div>
      </section>

      <section className="section-banners">
        {bannerItems.map(({ img, title, cta, dir }) => (
          <div key={title} className="banner-card">
            <img src={img} alt={title} className="banner-card__bg" />
            <p className="banner-card__title">{title}</p>
            <a href={dir} className="btn btn--wide">{cta}</a>
          </div>
        ))}
      </section>

      <section className="section-mission">
        <div className="mission-banner">
          <img src={missionBanner} alt="Mission" className="mission-banner__bg" />
          <div className="mission-banner__content">
            <p className="mission-banner__title">Nossa missão em relação à sustentabilidade</p>
            <p className="mission-banner__subtitle">Leia mais sobre o nosso progresso</p>
            <a className="btn btn--wide" href="/about">SOBRE-NÓS</a>
          </div>
        </div>
      </section>

      <section className="section-perks">
        <div className="perks-grid">
          <div className="perk">
            <div className="perk__icon">
              <img src={perkShipping} alt="Shipping" />
            </div>
            <div>
              <p className="perk__title">Entrega gratuita</p>
              <p className="perk__desc">Aproveite o frete grátis para pedidos feitos do Sul</p>
            </div>
          </div>
          <div className="perk">
            <div className="perk__icon">
              <img src={perkSustain} alt="Sustainability" />
            </div>
            <div>
              <p className="perk__title">Conscientemente criado.</p>
              <p className="perk__desc">Projeto com você e o planeta em mente.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
