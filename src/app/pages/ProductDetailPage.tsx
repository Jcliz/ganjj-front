import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { produtoApi } from "../../lib/api";
import type { Produto } from "../../lib/api";

// TODO: AWS S3 — Instalar e configurar o SDK:
//   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
//
// import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
//
// const s3 = new S3Client({ region: import.meta.env.VITE_AWS_REGION });
//
// async function resolverUrlS3(chave: string): Promise<string> {
//   const cmd = new GetObjectCommand({ Bucket: import.meta.env.VITE_AWS_S3_BUCKET, Key: chave });
//   return getSignedUrl(s3, cmd, { expiresIn: 3600 });
// }
//
// async function listarImagensProduto(produtoId: number): Promise<string[]> {
//   const cmd = new ListObjectsV2Command({
//     Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
//     Prefix: `produtos/${produtoId}/`,
//   });
//   const res = await s3.send(cmd);
//   return Promise.all((res.Contents ?? []).map(obj => resolverUrlS3(obj.Key!)));
// }

function resolverImagem(imagem_url: string | null): string | null {
  if (!imagem_url) return null;
  // TODO: AWS S3 — Se imagem_url for uma chave S3 (ex: "produtos/42/capa.jpg"),
  // substituir esta linha por: return resolverUrlS3(imagem_url);
  return imagem_url;
}


function PlaceholderImagem({ tamanho = 48 }: { tamanho?: number }) {
  return (
    <div style={{
      position: "absolute", inset: 0, background: "#f5f4f4",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 8,
    }}>
      <svg width={tamanho} height={tamanho} viewBox="0 0 48 48" fill="none">
        <rect x="4" y="8" width="40" height="32" rx="2" stroke="#dddbdc" strokeWidth="1.5" />
        <circle cx="17" cy="21" r="4" stroke="#dddbdc" strokeWidth="1.5" />
        <path d="M4 36l10-8 8 6 8-10 14 12" stroke="#dddbdc" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      {tamanho >= 40 && (
        <p style={{ fontSize: 11, color: "#b0aeae", letterSpacing: "0.3px" }}>Sem imagem</p>
      )}
    </div>
  );
}

function ProdutoNaoEncontrado() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <Header activeTab="men" />
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 24, padding: "80px 40px",
      }}>
        <svg width={64} height={64} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="31" stroke="#dddbdc" strokeWidth="1.5" />
          <path d="M20 20l24 24M44 20L20 44" stroke="#dddbdc" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", textAlign: "center" }}>
          <p style={{ fontSize: 20, lineHeight: "28px", color: "#262626" }}>Produto não encontrado</p>
          <p style={{ fontSize: 14, color: "#737373", letterSpacing: "0.2px" }}>
            O produto que você procura não existe ou foi removido.
          </p>
        </div>
        <button
          onClick={() => navigate("/listing")}
          style={{
            background: "#262626", color: "#fff", padding: "14px 32px",
            fontSize: 12, letterSpacing: "1.2px", border: "none",
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          VER TODOS OS PRODUTOS
        </button>
      </div>
      <Footer />
    </div>
  );
}

const tamanhos = ["XS", "S", "M", "L", "XL", "XXL"];


function formatarPreco(valor: number): string {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

export function ProductDetailPage() {
  usePageTitle("Produto");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const { addItem } = useCart();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [recomendados, setRecomendados] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // TODO: AWS S3 — Substituir por listarImagensProduto(produto.id)
  const [imagemPrincipal, setImagemPrincipal] = useState<string | null>(null);

  const [tamanhoSelecionado, setTamanhoSelecionado] = useState("M");
  const [adicionando, setAdicionando] = useState(false);
  const [msgAdicionado, setMsgAdicionado] = useState("");

  useEffect(() => {
    if (!id) return;
    setCarregando(true);
    setErro(false);

    produtoApi
      .getById(Number(id))
      .then((p) => {
        setProduto(p);

        const url = resolverImagem(p.imagem_url);
        setImagemPrincipal(url);

        produtoApi
          .getAll()
          .then((todos) => {
            const outros = todos.filter((t) => t.id !== p.id && t.status).slice(0, 4);
            setRecomendados(outros);
          })
          .catch(() => {});
      })
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return (
      <div className="page">
        <Header activeTab="men" />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 40px" }}>
          <p style={{ fontSize: 14, color: "#737373", letterSpacing: "0.3px" }}>Carregando produto...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (erro || !produto) return <ProdutoNaoEncontrado />;

  return (
    <div className="page">
      <Header activeTab={produto.feminino ? "women" : "men"} />

      {/* Breadcrumb */}
      <div style={{ padding: "12px 40px", borderBottom: "1px solid #dddbdc" }}>
        <p style={{ fontSize: 12, color: "#737373", letterSpacing: "0.2px" }}>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Início</span>
          {" > "}
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/listing")}>
            {produto.feminino ? "Feminino" : "Masculino"}
          </span>
          {" > "}
          {produto.nome}
        </p>
      </div>

      {/* Área principal */}
      <div style={{ display: "flex", gap: 40, padding: "0 0 60px", width: "100%", alignItems: "flex-start" }}>

        {/* Imagem do produto */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "24px 0 0 40px" }}>
          <div style={{ maxWidth: "45vw", width: "100%", aspectRatio: "3/4", maxHeight: "70vh", position: "relative", overflow: "hidden", background: "#f5f4f4" }}>
            {imagemPrincipal ? (
              <img
                src={imagemPrincipal}
                alt={produto.nome}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <PlaceholderImagem tamanho={64} />
            )}
          </div>
        </div>

        {/* Informações do produto */}
        <div style={{ width: 340, flexShrink: 0, padding: "40px 40px 0 0", display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 0 }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 20, lineHeight: "28px", color: "#262626" }}>{produto.nome}</p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ color: "#262626", fontSize: 16, fontWeight: 600 }}>
                {formatarPreco(produto.preco)}
              </span>
            </div>

          </div>

          {/* Cor */}
          {produto.cor && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 12, color: "#262626", letterSpacing: "0.2px" }}>
                Cor: <strong>{produto.cor}</strong>
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <div
                  title={produto.cor}
                  style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: produto.cor, cursor: "default",
                    border: "2px solid #262626",
                    outline: "1px solid #fff",
                    outlineOffset: -4,
                  }}
                />
              </div>
            </div>
          )}

          {/* Tamanho */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#262626", letterSpacing: "0.2px" }}>
              <span>Tamanho</span>
              <span style={{ color: "#737373", textDecoration: "underline", cursor: "pointer" }}>Guia de Tamanhos</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tamanhos.map(tam => (
                <button
                  key={tam}
                  onClick={() => setTamanhoSelecionado(tam)}
                  style={{
                    border: `1px solid ${tamanhoSelecionado === tam ? "#262626" : "#dddbdc"}`,
                    padding: "8px 12px", fontSize: 12, letterSpacing: "0.2px",
                    cursor: "pointer",
                    background: tamanhoSelecionado === tam ? "#262626" : "#fff",
                    color: tamanhoSelecionado === tam ? "#fff" : "#262626",
                    fontFamily: "inherit",
                  }}
                >
                  {tam}
                </button>
              ))}
            </div>
          </div>

          {/* Estoque esgotado */}
          {produto.estoque === 0 && (
            <p style={{ fontSize: 12, color: "#d0021b", letterSpacing: "0.3px" }}>Produto indisponível</p>
          )}

          {/* Adicionar ao carrinho */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              disabled={adicionando || produto.estoque === 0}
              onClick={async () => {
                if (!usuario) { navigate("/login"); return; }
                setAdicionando(true);
                setMsgAdicionado("");
                try {
                  await addItem(produto.id, 1);
                  setMsgAdicionado("Item adicionado ao carrinho!");
                  setTimeout(() => setMsgAdicionado(""), 3000);
                } catch (err: unknown) {
                  setMsgAdicionado(err instanceof Error ? err.message : "Erro ao adicionar item.");
                } finally {
                  setAdicionando(false);
                }
              }}
              style={{
                width: "100%",
                background: adicionando || produto.estoque === 0 ? "#737373" : "#262626",
                color: "#fff", padding: "16px", fontSize: 14, letterSpacing: "1.4px",
                textAlign: "center",
                cursor: adicionando || produto.estoque === 0 ? "not-allowed" : "pointer",
                border: "none", fontFamily: "inherit",
              }}
            >
              {adicionando ? "ADICIONANDO..." : produto.estoque === 0 ? "INDISPONÍVEL" : "ADICIONAR AO CARRINHO"}
            </button>
            {msgAdicionado && (
              <p style={{
                fontSize: 12,
                color: msgAdicionado.startsWith("Item") ? "#2a7a3b" : "#d0021b",
                letterSpacing: "0.3px", textAlign: "center",
              }}>
                {msgAdicionado}
              </p>
            )}
          </div>

          {/* Benefícios */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: "📦", text: "Frete grátis em pedidos acima de R$100" },
              { icon: "↩", text: "Devoluções fáceis — 30 dias ao criar sua conta" },
              { icon: "🌿", text: "Receba em 3–4 dias úteis" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 12, color: "#262626", letterSpacing: "0.2px" }}>
                <span>{icon}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>

          {/* Descrição */}
          {produto.descricao && (
            <div style={{ borderTop: "1px solid #dddbdc", paddingTop: 16 }}>
              <p style={{ fontSize: 14, lineHeight: "22px", color: "#262626", letterSpacing: "0.2px" }}>
                {produto.descricao}
              </p>
            </div>
          )}

          {/* Estoque disponível */}
          <div style={{ borderTop: "1px solid #dddbdc", paddingTop: 16, fontSize: 12, color: "#262626" }}>
            <p style={{ color: "#737373", marginBottom: 4 }}>Estoque disponível</p>
            <p>{produto.estoque} unidade{produto.estoque !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {/* Produtos recomendados */}
      {recomendados.length > 0 && (
        <div className="recommended-section" style={{ borderTop: "1px solid #dddbdc" }}>
          <p className="recommended-section__title">Produtos Recomendados</p>
          <div className="recommended-grid">
            {recomendados.map((rec) => {
              const recImg = resolverImagem(rec.imagem_url);
              return (
                <div key={rec.id} className="recommended-card" onClick={() => navigate(`/product/${rec.id}`)}>
                  <div className="recommended-card__img">
                    {recImg ? (
                      <img src={recImg} alt={rec.nome} />
                    ) : (
                      <PlaceholderImagem tamanho={32} />
                    )}
                  </div>
                  <p className="recommended-card__name">{rec.nome}</p>
                  <p className="recommended-card__price">{formatarPreco(rec.preco)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
