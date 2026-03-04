import { COLORS } from "../../lib/types";
import { STAGES } from "../../data";

export function StageHeaders() {
  const c = COLORS;
  const sysW = 150;
  const stageW = 190;
  const headH = 44;

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: sysW,
          flexShrink: 0,
          height: headH,
          borderBottom: `1px solid ${c.border}`,
          borderRight: `1px solid ${c.border}`,
        }}
      />
      {STAGES.map((stg, i) => (
        <div
          key={stg.id}
          style={{
            width: stageW,
            flexShrink: 0,
            height: headH,
            borderBottom: `1px solid ${c.border}`,
            borderRight:
              i < STAGES.length - 1
                ? `1px solid ${c.borderLight}`
                : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: 1.5,
              background: stg.color,
              opacity: 0.6,
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: stg.color,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              fontFamily: "'DM Mono', monospace",
              opacity: 0.8,
            }}
          >
            {stg.label}
          </span>
        </div>
      ))}
    </div>
  );
}
