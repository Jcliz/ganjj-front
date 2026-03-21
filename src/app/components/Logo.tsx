import React from "react";
import svgPaths from "../../imports/svg-61drw48kvb";

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "127.624px",
        height: "14px",
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {/* E */}
      <div style={{ position: "absolute", inset: "-0.01% 51.61% 0.04% 38.8%" }}>
        <svg style={{ position: "absolute", display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 12.2316 13.9957">
          <path d={svgPaths.p246e4cf0} fill="#262626" />
        </svg>
      </div>
      {/* N */}
      <div style={{ position: "absolute", inset: "0.07% 13.2% 0.02% 77.04%" }}>
        <svg style={{ position: "absolute", display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 12.4514 13.988">
          <path d={svgPaths.p1861080} fill="#262626" />
        </svg>
      </div>
      {/* E2 */}
      <div style={{ position: "absolute", inset: "0.25% 65.64% 0.3% 25.72%" }}>
        <svg style={{ position: "absolute", display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 11.0277 13.9226">
          <path d={svgPaths.p20e97200} fill="#262626" />
        </svg>
      </div>
      {/* E3 */}
      <div style={{ position: "absolute", inset: "0.48% -0.01% 0.32% 91.35%" }}>
        <svg style={{ position: "absolute", display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 11.0426 13.8876">
          <path d={svgPaths.pb2ee500} fill="#262626" />
        </svg>
      </div>
      {/* E4 */}
      <div style={{ position: "absolute", inset: "0.37% 91.34% 0.46% 0" }}>
        <svg style={{ position: "absolute", display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 11.0601 13.8826">
          <path d={svgPaths.p38d8a00} fill="#262626" />
        </svg>
      </div>
      {/* A */}
      <div style={{ position: "absolute", inset: "-0.04% 26.24% -0.02% 62.84%" }}>
        <svg style={{ position: "absolute", display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 13.9351 14.0091">
          <path d={svgPaths.p2ccb0600} fill="#262626" />
        </svg>
      </div>
      {/* V */}
      <div style={{ position: "absolute", inset: "0.06% 77.33% -0.02% 11.68%" }}>
        <svg style={{ position: "absolute", display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 14.025 13.9936">
          <path d={svgPaths.pc6fe600} fill="#262626" />
        </svg>
      </div>
      {/* L */}
      <div style={{ position: "absolute", inset: "0.36% 39.56% 0.39% 52.54%" }}>
        <svg style={{ position: "absolute", display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 10.086 13.8951">
          <path d={svgPaths.p1c5d400} fill="#262626" />
        </svg>
      </div>
    </div>
  );
}
