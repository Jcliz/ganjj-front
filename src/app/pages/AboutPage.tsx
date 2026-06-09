import { usePageTitle } from "../hooks/usePageTitle";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  aboutHero, aboutImg1, aboutImg3,
} from "../../assets/assets";

export function AboutPage() {
  usePageTitle("Sobre");
  return (
    <div className="page">
      <Header activeTab="sobre" />

      <section className="about-hero">
        <img src={aboutHero} alt="" className="about-hero__bg" />
        <div className="about-hero__content">
          <div className="about-hero__title">
            <p style={{ margin: 0 }}>Acreditamos</p>
            <p style={{ margin: 0 }}>que todos nós podemos</p>
            <p style={{ margin: 0 }}>fazer a diferença.</p>
          </div>
          <div className="about-hero__subtitle">
            <p style={{ margin: 0 }}>Nosso caminho: Qualidade excepcional.</p>
            <p style={{ margin: 0 }}>Fábricas éticas. Transparência radical.</p>
          </div>
        </div>
      </section>

      <div className="about-intro">
        <p className="about-intro__text">
          Na GANJJ, queremos que a escolha certa seja tão fácil quanto colocar uma ótima camiseta.
          É por isso que nos parcerizamos com as melhores fábricas éticas do mundo. Usamos apenas
          os melhores materiais. E compartilhamos essas histórias com você—explicitamente o custo verdadeiro de cada
          produto que fazemos. É uma nova forma de faire as coisas. Chamamos de Transparência Radical.
        </p>
      </div>

      <div className="about-split about-split--733px">
        <div className="about-split__img">
          <img src={aboutImg1} alt="Our ethical approach" className="about-split__img-tag" />
        </div>
        <div className="about-split__text">
          <div className="about-split__text-inner">
            <div>
              <p className="about-section__label">NOSSAS FÁBRICAS</p>
              <p className="about-section__title">Nossa abordagem ética.</p>
            </div>
            <p className="about-section__body">
              Gastamos meses encontrando as melhores fábricas do mundo—as mesmas que
              produzem suas marcas de designer favoritas. Visitamos com frequência e construímos relacionamentos pessoais fortes
              com os proprietários. Cada fábrica recebe uma auditoria de conformidade para avaliar
              fatores como salários justos, horas razoáveis e ambiente. Nosso objetivo? Uma pontuação de 90
              ou superior para cada fábrica.
            </p>
          </div>
        </div>
      </div>

      <div className="about-split about-split--552px">
        <div className="about-split__text">
          <div className="about-split__text-inner">
            <div>
              <p className="about-section__label">NOSSA QUALIDADE</p>
              <p style={{ ...{ fontSize: "40px", lineHeight: "48px", letterSpacing: "0.2px", fontWeight: 400, width: "100%" }, margin: 0 }}>Projetado</p>
              <p className="about-section__title">para durar.</p>
            </div>
            <p className="about-section__body">
              Na GANJJ, não estamos muito interessados em tendências. Queremos que você use nossas peças por anos,
              até mesmo décadas. É por isso que selecionamos os melhores materiais e fábricas para
              nossos produtos atemporais—como nossos suéteres de caxemira grau A, sapatos italianos e
              camisetas Peruvian Pima.
            </p>
          </div>
        </div>
        <div className="about-split__img">
          <img src={aboutImg3} alt="Designed to last" className="about-split__img-tag" />
        </div>
      </div>

      <Footer />
    </div>
  );
}

