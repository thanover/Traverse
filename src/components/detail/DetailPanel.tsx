import type { Flow, EnvironmentWithSystem } from "../../lib/types";
import { COLORS } from "../../lib/types";

interface DetailData {
  id: string;
  label: string;
  systemId: string;
  systemName: string;
  stage: { id: string; label: string; color: string };
  envFlows: Flow[];
  up: EnvironmentWithSystem[];
  down: EnvironmentWithSystem[];
}

interface DetailPanelProps {
  detail: DetailData;
  activeFlow: string;
  onSelectFlow: (id: string) => void;
}

export function DetailPanel({ detail, activeFlow, onSelectFlow }: DetailPanelProps) {
  const c = COLORS;

  return (
    <div
      style={{
        marginTop: 14,
        background: c.surface,
        borderRadius: 10,
        border: `1px solid ${c.border}`,
        padding: "16px 20px",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
        {/* Identity */}
        <div style={{ minWidth: 180 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: c.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Environment
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'DM Mono', monospace",
              marginBottom: 6,
            }}
          >
            {detail.systemName}{" "}
            <span style={{ color: c.textDim }}>›</span> {detail.label}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: 4,
              background: `${detail.stage.color}15`,
              color: detail.stage.color,
              fontFamily: "'DM Mono', monospace",
              textTransform: "uppercase",
            }}
          >
            {detail.stage.label} Stage
          </span>
        </div>

        {/* Integrations */}
        <div style={{ minWidth: 180 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: c.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Integrations
          </div>
          {detail.up.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, color: c.textDim, marginBottom: 3 }}>
                Upstream
              </div>
              {detail.up.map((e) => (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 2,
                  }}
                >
                  <span style={{ color: c.textDim, fontSize: 10 }}>←</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: "'DM Mono', monospace",
                      color: c.text,
                    }}
                  >
                    {e.systemName} {e.label}
                  </span>
                </div>
              ))}
            </div>
          )}
          {detail.down.length > 0 && (
            <div>
              <div style={{ fontSize: 10, color: c.textDim, marginBottom: 3 }}>
                Downstream
              </div>
              {detail.down.map((e) => (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 2,
                  }}
                >
                  <span style={{ color: c.textDim, fontSize: 10 }}>→</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: "'DM Mono', monospace",
                      color: c.text,
                    }}
                  >
                    {e.systemName} {e.label}
                  </span>
                </div>
              ))}
            </div>
          )}
          {detail.up.length === 0 && detail.down.length === 0 && (
            <span
              style={{
                fontSize: 11,
                color: c.textDim,
                fontStyle: "italic",
              }}
            >
              None{activeFlow !== "all" ? " in this flow" : ""}
            </span>
          )}
        </div>

        {/* Flows */}
        <div style={{ minWidth: 160 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: c.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Flows
          </div>
          {detail.envFlows.length > 0 ? (
            detail.envFlows.map((f) => (
              <button
                key={f.id}
                onClick={() => onSelectFlow(f.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 4,
                  padding: "4px 8px",
                  borderRadius: 5,
                  width: "100%",
                  background:
                    activeFlow === f.id ? `${f.color}12` : "transparent",
                  border: `1px solid ${activeFlow === f.id ? f.color + "30" : c.border}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 11 }}>{f.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: activeFlow === f.id ? f.color : c.textMuted,
                  }}
                >
                  {f.label}
                </span>
              </button>
            ))
          ) : (
            <span
              style={{
                fontSize: 11,
                color: c.textDim,
                fontStyle: "italic",
              }}
            >
              None
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
