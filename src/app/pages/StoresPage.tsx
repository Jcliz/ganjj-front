import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  storeSeattle, storeSF, storePaloAlto,
  storeLa, storeBoston, storeNy,
  storeBrooklyn, storeKop, storeGeorgetown,
} from "../../assets/assets";

const storeRows = [
  [
    { img: storeSeattle, city: "SEATTLE", name: "University Village" },
    { img: storeSF, city: "SAN FRANCISCO", name: "Valencia Street, San Francisco" },
    { img: storePaloAlto, city: "PALO ALTO", name: "Stanford" },
  ],
  [
    { img: storeLa, city: "LOS ANGELES", name: "Abbot Kinney" },
    { img: storeBoston, city: "BOSTON", name: "Seaport" },
    { img: storeNy, city: "NEW YORK", name: "Prince Street, New York" },
  ],
  [
    { img: storeBrooklyn, city: "BROOKLYN", name: "Williamsburg" },
    { img: storeKop, city: "KING OF PRUSSIA", name: "King of Prussia" },
    { img: storeGeorgetown, city: "GEORGETOWN", name: "Georgetown" },
  ],
];

const aboutSubNav = [
  { label: "About", path: "/about" },
  { label: "Stores", active: true },
  { label: "Factories" },
  { label: "Environmental Initiatives" },
  { label: "Our Carbon Commitment" },
  { label: "Annual Impact Report" },
  { label: "Cleaner Fashion" },
];

export function StoresPage() {
  return (
    <div className="page">
      <Header activeTab="about" subNavItems={aboutSubNav} />

      <section className="stores-section">
        <div className="stores-header">
          <p className="stores-header__title">Stores</p>
          <p className="stores-header__subtitle">Find one of our 11 stores nearest you.</p>
        </div>

        {storeRows.map((row, ri) => (
          <div key={ri} className="stores-grid">
            {row.map(({ img, city, name }) => (
              <div key={name} className="store-card" style={{ cursor: "pointer" }}>
                <div className="store-card__img">
                  <img src={img} alt={name} />
                </div>
                <p className="store-card__city">{city}</p>
                <p className="store-card__name">{name}</p>
              </div>
            ))}
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
