import { COLORS } from "../../lib/types";

export function Header() {
  const c = COLORS;

  return (
    <header
      style={{
        background: c.surface,
        borderBottom: `1px solid ${c.border}`,
        padding: "0 28px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="4" cy="12" r="2.5" fill="#818cf8" />
          <circle cx="14" cy="5" r="2.5" fill="#38bdf8" />
          <circle cx="20" cy="18" r="2.5" fill="#34d399" />
          <path
            d="M6.2 11L11.8 6.2"
            stroke="#4a5568"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M15.8 7L18.5 15.8"
            stroke="#4a5568"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "-0.02em",
            color: c.text,
          }}
        >
          Traverse
        </span>
      </div>
    </header>
  );
}
