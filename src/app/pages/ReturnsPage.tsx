import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function ReturnsPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <Header />

      <main className="returns-page">
        <div className="returns-hero">
          <p className="returns-hero__label">CUIDADO COM O CLIENTE</p>
          <h1 className="returns-hero__title">Devoluções e Trocas</h1>
          <p className="returns-hero__sub">Queremos que você ame o que veste. Se algo não estiver certo, nós resolveremos.</p>
        </div>

        <div className="returns-body">

          <section className="returns-section">
            <p className="returns-section__label">NOSSA POLÍTICA</p>
            <h2 className="returns-section__title">Devoluções Grátis em 30 Dias</h2>
            <p className="returns-section__text">
              Oferecemos devoluções e trocas grátis dentro de 30 dias a partir da data de entrega. Os itens devem estar
              não usados, não lavados e em sua condição original com todas as etiquetas anexadas. Itens em promoção não
              são elegíveis para devolução ou troca.
            </p>
          </section>

          <div className="returns-divider" />

          {/* Step-by-step */}
          <section className="returns-section">
            <p className="returns-section__label">COMO FUNCIONA</p>
            <h2 className="returns-section__title">Três passos simples.</h2>

            <div className="returns-steps">
              {[
                {
                  n: "01",
                  title: "Inicie sua devolução",
                  body: "Faça login na sua conta e vá até o seu Histórico de Pedidos. Selecione o(s) item(ns) que deseja devolver e escolha 'Iniciar uma Devolução'. Você receberá um rótulo de envio pré-pago por e-mail em minutos.",
                },
                {
                  n: "02",
                  title: "Embalagem e envio",
                  body: "Coloque o(s) item(ns) em qualquer caixa adequada ou na embalagem original, se ainda a tiver. Anexe seu rótulo de devolução pré-pago e entregue o pacote em qualquer local do USPS ou agende uma coleta gratuita. Recomendamos que você mantenha o número de rastreamento para seus registros.",
                },
                {
                  n: "03",
                  title: "Receba seu reembolso ou troca",
                  body: "Assim que recebermos e inspecionarmos sua devolução (normalmente dentro de 3 a 5 dias úteis), processaremos seu reembolso para o método de pagamento original ou despacharemos seu pedido de troca. Os reembolsos podem levar de 5 a 10 dias úteis para aparecer, dependendo do seu banco.",
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

          <section className="returns-section">
            <p className="returns-section__label">ELIGIBILITY</p>
            <h2 className="returns-section__title">O que pode ser devolvido?</h2>
            <div className="returns-eligibility">
              <div className="returns-eligibility__col returns-eligibility__col--yes">
                <p className="returns-eligibility__head">✓ &nbsp;Elegível para devolução</p>
                {[
                  "Itens a preço integral dentro de 30 dias",
                  "Itens não usados e não lavados",
                  "Itens com etiquetas originais anexadas",
                  "Itens na embalagem original",
                  "Itens em promoção (não finais)",
                ].map(line => (
                  <p key={line} className="returns-eligibility__item">{line}</p>
                ))}
              </div>
              <div className="returns-eligibility__col returns-eligibility__col--no">
                <p className="returns-eligibility__head">✕ &nbsp;Não elegível</p>
                {[
                  "Itens em promoção",
                  "Itens devolvidos após 30 dias",
                  "Itens lavados, usados ou alterados",
                  "Itens sem etiquetas originais",
                  "Cartões-presente",
                ].map(line => (
                  <p key={line} className="returns-eligibility__item">{line}</p>
                ))}
              </div>
            </div>
          </section>

          <div className="returns-divider" />

          <section className="returns-section">
            <p className="returns-section__label">TROCAS</p>
            <h2 className="returns-section__title">Precisa de um tamanho ou cor diferente?</h2>
            <p className="returns-section__text">
              As trocas são processadas da mesma forma que as devoluções. Durante o processo de devolução, basta selecionar "Troca"
              em vez de "Reembolso" e escolher o tamanho ou a cor desejada. Enviaremos a substituição assim que
              sua devolução original for confirmada em trânsito — assim você não precisará esperar que ela chegue ao nosso
              armazém antes de enviarmos o novo item.
            </p>
            <p className="returns-section__text" style={{ marginTop: 16 }}>
              Se o item de troca preferido estiver fora de estoque, emitiremos um reembolso total e notificaremos você por e-mail.
              Você também pode entrar em contato com nossa equipe de atendimento ao cliente em{" "}
              <span style={{ color: "#262626", textDecoration: "underline", cursor: "pointer" }}>
                cuidado@ganjj.com
              </span>
              {" "}e faremos o nosso melhor para encontrá-lo para você.
            </p>
          </section>

          <div className="returns-divider" />

          <section className="returns-section">
            <p className="returns-section__label">PERGUNTAS FREQUENTES</p>
            <h2 className="returns-section__title">Perguntas comuns.</h2>
            <div className="returns-faqs">
              {[
                {
                  q: "Quanto tempo leva para um reembolso ser processado?",
                  a: "Assim que sua devolução for recebida e inspecionada (3–5 dias úteis), os reembolsos são emitidos imediatamente, mas podem levar de 5 a 10 dias úteis para aparecer em seu extrato, dependendo do seu banco ou emissor do cartão.",
                },
                {
                  q: "Posso devolver um presente?",
                  a: "Sim. Presentes podem ser devolvidos para crédito na loja ou trocados por um item diferente. Você precisará do número do pedido, que pode ser encontrado no comprovante de embalagem dentro da embalagem original.",
                },
                {
                  q: "E se meu item chegar danificado ou com defeito?",
                  a: "Lamentamos saber disso. Entre em contato conosco pelo e-mail cuidado@ganjj.com com fotos do dano e seu número de pedido. Organizaremos uma substituição ou reembolso total sem custo para você — não é necessário devolver o item.",
                },
                {
                  q: "Posso devolver itens de vários pedidos em um único pacote?",
                  a: "Sim, mas inclua um comprovante de embalagem ou nota separada para cada pedido dentro do pacote e use o rótulo de devolução correspondente ao pedido de maior valor. Entre em contato conosco com antecedência para que possamos combinar tudo corretamente.",
                },
              ].map(faq => (
                <div key={faq.q} className="returns-faq">
                  <p className="returns-faq__q">{faq.q}</p>
                  <p className="returns-faq__a">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="returns-cta-banner">
            <p className="returns-cta-banner__title">Ainda tem perguntas?</p>
            <p className="returns-cta-banner__sub">Nossa equipe de atendimento ao cliente está disponível de segunda a sexta, das 9h às 17h PT.</p>
            <div className="returns-cta-banner__btns">
              <button className="returns-btn returns-btn--dark" onClick={() => navigate("/contact")}>
                Fale Conosco
              </button>
              <button className="returns-btn returns-btn--outline">
                cuidado@ganjj.com
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}