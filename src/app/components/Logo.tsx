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
        cursor: "pointer",
        flexShrink: 0,
        fontSize: "20px",
        fontWeight: 600,
        letterSpacing: "3.2px",
        color: "#262626",
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        textTransform: "uppercase",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      GANJJ
    </div>
  );
}
