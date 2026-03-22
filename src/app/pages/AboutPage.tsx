import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  aboutHero, aboutImg1, aboutImg2, aboutImg3, aboutImg4,
  aboutScreenshot, aboutMore1, aboutMore2, aboutMore3,
} from "../../assets/assets";

const aboutSubNav = [
  { label: "About", active: true },
  { label: "Stores" },
  { label: "Factories" },
  { label: "Environmental Initiatives" },
  { label: "Our Carbon Commitment" },
  { label: "Annual Impact Report" },
  { label: "Cleaner Fashion" },
];

export function AboutPage() {
  return (
    <div className="page">
      <Header activeTab="about" subNavItems={aboutSubNav} />

      {/* Hero */}
      <section className="about-hero">
        <img src={aboutHero} alt="About Hero" />
        <div className="about-hero__overlay">
          <p className="about-hero__title">We believe we can all make a difference.</p>
          <p className="about-hero__subtitle">The Art + Science of Radical Transparency</p>
        </div>
      </section>

      {/* Body */}
      <div className="about-body">
        <p className="about-intro">
          At Everlane, we want the right choice to be as easy as putting on a great T-shirt. That's why we partner
          with the best, ethical factories around the world. Source only the finest materials. And share those stories
          with you—down to the true cost of every product we make. It's a new way of doing things. We call it Radical
          Transparency.
        </p>

        {/* Our Ethical Approach */}
        <div className="about-split">
          <div className="about-split__img">
            <img src={aboutImg1} alt="Ethical approach" />
          </div>
          <div className="about-split__text">
            <p className="about-split__label">OUR APPROACH</p>
            <p className="about-split__title">Our ethical approach.</p>
            <p className="about-split__desc">
              We spend months vetting every factory we work with. We visit them regularly. We care about the people
              who make our clothes—that means the right pay, the right hours, and the right environment. To learn more
              visit our Factories page.
            </p>
          </div>
        </div>

        {/* Full-width image */}
        <div style={{ width: "100%", height: 400, position: "relative", overflow: "hidden" }}>
          <img
            src={aboutImg2}
            alt="Factory"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Designed to last */}
        <div className="about-split about-split--reverse">
          <div className="about-split__img">
            <img src={aboutImg3} alt="Quality" />
          </div>
          <div className="about-split__text">
            <p className="about-split__label">MATERIALS</p>
            <p className="about-split__title">Designed to last.</p>
            <p className="about-split__desc">
              At Everlane, we set out to create. Choose to use only the best by seeking the best materials, fabrics,
              hardware, craftsmanship, labor sourcing, and the Radical Transparency that guides us.
            </p>
          </div>
        </div>

        {/* Materials swatches + images */}
        <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 24, flexShrink: 0 }}>
            <div className="material-swatch">
              <div className="material-swatch__color" style={{ background: "#b0a99a" }} />
              <p className="material-swatch__name">Cashmere Frost</p>
            </div>
            <div className="material-swatch">
              <div className="material-swatch__color" style={{ background: "#c8bfb3" }} />
              <p className="material-swatch__name">Turtleneck Bone</p>
            </div>
          </div>
          <div style={{ flex: 1, height: 280, position: "relative", overflow: "hidden" }}>
            <img
              src={aboutImg4}
              alt="Material"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ flex: 1, height: 280, position: "relative", overflow: "hidden" }}>
            <img
              src={aboutScreenshot}
              alt="Material 2"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Radically Transparent */}
        <div className="about-transparency">
          <p className="about-transparency__title">Radically Transparent.</p>
          <p className="about-transparency__desc">
            We believe our customers have a right to know exactly where their clothes are made, who made them, and
            what they really cost to produce. That's why we share our true costs with you—materials, labor, duties,
            transport, and our markup.
          </p>
        </div>
      </div>

      {/* More to Explore */}
      <div className="more-to-explore">
        <p className="more-to-explore__title">More to Explore</p>
        <div className="more-to-explore__grid">
          {[
            { img: aboutMore1, label: "Our Products" },
            { img: aboutMore2, label: "Our Stores" },
            { img: aboutMore3, label: "Careers" },
          ].map(({ img, label }) => (
            <div key={label} className="explore-card" style={{ cursor: "pointer" }}>
              <div className="explore-card__img">
                <img src={img} alt={label} />
              </div>
              <p className="explore-card__label">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
