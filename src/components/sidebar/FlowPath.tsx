import type { Flow } from "../../lib/types";
import { COLORS } from "../../lib/types";
import { SYSTEMS } from "../../data";

interface FlowPathProps {
  flow: Flow;
}

export function FlowPath({ flow }: FlowPathProps) {
  const c = COLORS;
  const systems = flow.systems ?? [];

  return (
    <div
      style={{
        margin: "14px 16px 0",
        padding: "12px",
        background: `${flow.color}08`,
        border: `1px solid ${flow.color}18`,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: flow.color,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
        }}
      >
        Path
      </div>
      {systems.map((sid, i) => {
        const s = SYSTEMS.find((sys) => sys.id === sid);
        return (
          <div key={sid}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: flow.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0f1117",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: c.text }}>
                {s?.name}
              </span>
            </div>
            {i < systems.length - 1 && (
              <div
                style={{
                  marginLeft: 7,
                  borderLeft: `1.5px solid ${flow.color}30`,
                  height: 8,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
