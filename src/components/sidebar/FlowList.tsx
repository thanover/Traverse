import type { Flow } from "../../lib/types";
import { COLORS } from "../../lib/types";
import { FLOWS } from "../../data";
import { FlowPath } from "./FlowPath";

interface FlowListProps {
  activeFlow: string;
  flow: Flow;
  onSelectFlow: (id: string) => void;
}

export function FlowList({ activeFlow, flow, onSelectFlow }: FlowListProps) {
  const c = COLORS;

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: c.surface,
        borderRight: `1px solid ${c.border}`,
        padding: "16px 0",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "0 16px 10px",
          fontSize: 10,
          fontWeight: 600,
          color: c.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Flows
      </div>
      {FLOWS.map((f) => {
        const active = activeFlow === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onSelectFlow(f.id)}
            style={{
              width: "100%",
              padding: "9px 16px",
              border: "none",
              background: active ? `${f.color}12` : "transparent",
              borderLeft: active
                ? `2px solid ${f.color}`
                : "2px solid transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 10,
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>
              {f.icon}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? f.color : c.textMuted,
              }}
            >
              {f.label}
            </span>
            {f.systems && (
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  color: active ? f.color : c.textDim,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {f.systems.length}
              </span>
            )}
          </button>
        );
      })}

      {activeFlow !== "all" && <FlowPath flow={flow} />}
    </aside>
  );
}
