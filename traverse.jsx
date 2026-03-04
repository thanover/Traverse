import { useState } from "react";

const STAGES = [
  { id: "dev", label: "Dev", color: "#818cf8" },
  { id: "test", label: "Test", color: "#38bdf8" },
  { id: "mo", label: "MO", color: "#fbbf24" },
  { id: "prod", label: "Prod", color: "#34d399" },
];

const SYSTEMS = [
  {
    id: "sys1", name: "Policy Admin", subtitle: "Core policy mgmt",
    envs: [
      { id: "sys1-dev", label: "DEV", stage: "dev" },
      { id: "sys1-uat", label: "UAT", stage: "test" },
      { id: "sys1-mo", label: "MO", stage: "mo" },
      { id: "sys1-prod", label: "PROD", stage: "prod" },
    ],
  },
  {
    id: "sys2", name: "Rating Engine", subtitle: "Premium calculation",
    envs: [
      { id: "sys2-dev", label: "DEV", stage: "dev" },
      { id: "sys2-test", label: "TEST", stage: "test" },
      { id: "sys2-uat", label: "UAT", stage: "test" },
      { id: "sys2-mo", label: "MO", stage: "mo" },
      { id: "sys2-prod", label: "PROD", stage: "prod" },
    ],
  },
  {
    id: "sys3", name: "Doc Generator", subtitle: "Document output",
    envs: [
      { id: "sys3-dev", label: "DEV", stage: "dev" },
      { id: "sys3-uat", label: "UAT", stage: "test" },
      { id: "sys3-mo", label: "MO", stage: "mo" },
      { id: "sys3-prod", label: "PROD", stage: "prod" },
    ],
  },
  {
    id: "sys4", name: "Underwriting", subtitle: "Risk assessment",
    envs: [
      { id: "sys4-dev", label: "DEV", stage: "dev" },
      { id: "sys4-test", label: "TEST", stage: "test" },
      { id: "sys4-uat", label: "UAT", stage: "test" },
      { id: "sys4-mo", label: "MO", stage: "mo" },
      { id: "sys4-prod", label: "PROD", stage: "prod" },
    ],
  },
];

const INTEGRATIONS = [
  { from: "sys1-dev", to: "sys2-test", flows: ["quote-home", "quote-auto"] },
  { from: "sys2-test", to: "sys3-dev", flows: ["quote-home", "quote-auto"] },
  { from: "sys1-dev", to: "sys4-test", flows: ["uw-auto"] },
  { from: "sys4-test", to: "sys2-test", flows: ["uw-auto"] },
  { from: "sys1-uat", to: "sys2-uat", flows: ["quote-home", "quote-auto"] },
  { from: "sys2-uat", to: "sys3-uat", flows: ["quote-home"] },
  { from: "sys1-uat", to: "sys4-uat", flows: ["uw-auto"] },
  { from: "sys4-uat", to: "sys2-uat", flows: ["uw-auto"] },
  { from: "sys1-prod", to: "sys2-prod", flows: ["quote-home", "quote-auto", "uw-auto"] },
  { from: "sys2-prod", to: "sys3-prod", flows: ["quote-home", "quote-auto"] },
  { from: "sys1-prod", to: "sys4-prod", flows: ["uw-auto"] },
  { from: "sys4-prod", to: "sys2-prod", flows: ["uw-auto"] },
  { from: "sys1-mo", to: "sys2-mo", flows: ["quote-home", "quote-auto"] },
  { from: "sys2-mo", to: "sys3-mo", flows: ["quote-home"] },
];

const FLOWS = [
  { id: "all", label: "All", icon: "◎", color: "#94a3b8" },
  { id: "quote-home", label: "Quoting Homeowners", icon: "🏠", color: "#818cf8", systems: ["sys1", "sys2", "sys3"] },
  { id: "quote-auto", label: "Quoting Auto", icon: "🚗", color: "#38bdf8", systems: ["sys1", "sys2", "sys3"] },
  { id: "uw-auto", label: "Underwriting Auto", icon: "📋", color: "#fbbf24", systems: ["sys1", "sys4", "sys2"] },
];

function getSystemById(id) { return SYSTEMS.find(s => s.id === id); }
function getEnvById(id) {
  for (const sys of SYSTEMS) {
    const env = sys.envs.find(e => e.id === id);
    if (env) return { ...env, systemId: sys.id, systemName: sys.name };
  }
  return null;
}

export default function Traverse() {
  const [activeFlow, setActiveFlow] = useState("all");
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [hoveredInteg, setHoveredInteg] = useState(null);

  const flow = FLOWS.find(f => f.id === activeFlow);
  const inFlow = (integ) => activeFlow === "all" || integ.flows?.includes(activeFlow);
  const filtered = INTEGRATIONS.filter(inFlow);

  const activeEnvs = new Set();
  if (activeFlow !== "all") filtered.forEach(c => { activeEnvs.add(c.from); activeEnvs.add(c.to); });
  const envInFlow = (id) => activeFlow === "all" || activeEnvs.has(id);
  const sysInFlow = (id) => activeFlow === "all" || flow?.systems?.includes(id);

  const hlEnv = (id) => {
    if (hoveredInteg) return hoveredInteg.from === id || hoveredInteg.to === id;
    if (selectedEnv) {
      if (selectedEnv.id === id) return true;
      return INTEGRATIONS.some(c => inFlow(c) && ((c.from === selectedEnv.id && c.to === id) || (c.to === selectedEnv.id && c.from === id)));
    }
    return false;
  };

  const detail = (() => {
    if (!selectedEnv) return null;
    const full = getEnvById(selectedEnv.id);
    const stage = STAGES.find(s => s.id === selectedEnv.stage);
    const envFlows = FLOWS.filter(f => f.id !== "all" && INTEGRATIONS.some(c => c.flows.includes(f.id) && (c.from === selectedEnv.id || c.to === selectedEnv.id)));
    const up = INTEGRATIONS.filter(c => c.to === selectedEnv.id && inFlow(c)).map(c => getEnvById(c.from)).filter(Boolean);
    const down = INTEGRATIONS.filter(c => c.from === selectedEnv.id && inFlow(c)).map(c => getEnvById(c.to)).filter(Boolean);
    return { ...full, stage, envFlows, up, down };
  })();

  const sysW = 150, stageW = 190, rowH = 100, headH = 44;
  const totalW = sysW + STAGES.length * stageW;
  const totalH = headH + SYSTEMS.length * rowH;

  const center = (id) => {
    for (let si = 0; si < SYSTEMS.length; si++) {
      const env = SYSTEMS[si].envs.find(e => e.id === id);
      if (env) {
        const sti = STAGES.findIndex(s => s.id === env.stage);
        const sibs = SYSTEMS[si].envs.filter(e => e.stage === env.stage);
        const oi = sibs.findIndex(e => e.id === id);
        const cw = stageW / sibs.length;
        return { x: sysW + sti * stageW + oi * cw + cw / 2, y: headH + si * rowH + rowH / 2 };
      }
    }
    return null;
  };

  const path = (a, b) => {
    const f = center(a), t = center(b);
    if (!f || !t) return null;
    const cx = Math.abs(t.x - f.x) * 0.4;
    return `M ${f.x} ${f.y} C ${f.x + cx} ${f.y}, ${t.x - cx} ${t.y}, ${t.x} ${t.y}`;
  };

  const c = {
    bg: "#0f1117",
    surface: "#161921",
    surfaceAlt: "#1c1f2b",
    border: "#252836",
    borderLight: "#1e2130",
    text: "#e2e8f0",
    textMuted: "#64748b",
    textDim: "#3e4459",
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: c.bg, minHeight: "100vh", color: c.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{ background: c.surface, borderBottom: `1px solid ${c.border}`, padding: "0 28px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Logo — arrow path through three dots */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="4" cy="12" r="2.5" fill="#818cf8" />
            <circle cx="14" cy="5" r="2.5" fill="#38bdf8" />
            <circle cx="20" cy="18" r="2.5" fill="#34d399" />
            <path d="M6.2 11L11.8 6.2" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M15.8 7L18.5 15.8" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", color: c.text }}>Traverse</span>
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 52px)" }}>
        {/* ─── Sidebar: Flows ─── */}
        <aside style={{ width: 240, flexShrink: 0, background: c.surface, borderRight: `1px solid ${c.border}`, padding: "16px 0", overflowY: "auto" }}>
          <div style={{ padding: "0 16px 10px", fontSize: 10, fontWeight: 600, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Flows
          </div>
          {FLOWS.map(f => {
            const active = activeFlow === f.id;
            return (
              <button key={f.id} onClick={() => { setActiveFlow(f.id); setSelectedEnv(null); }} style={{
                width: "100%", padding: "9px 16px", border: "none",
                background: active ? `${f.color}12` : "transparent",
                borderLeft: active ? `2px solid ${f.color}` : "2px solid transparent",
                cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                display: "flex", alignItems: "center", gap: 10,
                transition: "all 0.15s ease",
              }}>
                <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{f.icon}</span>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? f.color : c.textMuted }}>{f.label}</span>
                {f.systems && <span style={{ marginLeft: "auto", fontSize: 10, color: active ? f.color : c.textDim, fontFamily: "'DM Mono', monospace" }}>{f.systems.length}</span>}
              </button>
            );
          })}

          {activeFlow !== "all" && (
            <div style={{ margin: "14px 16px 0", padding: "12px", background: `${flow.color}08`, border: `1px solid ${flow.color}18`, borderRadius: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: flow.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Path</div>
              {flow.systems.map((sid, i) => {
                const s = getSystemById(sid);
                return (
                  <div key={sid}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, background: flow.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1117", fontSize: 9, fontWeight: 700 }}>{i + 1}</div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: c.text }}>{s?.name}</span>
                    </div>
                    {i < flow.systems.length - 1 && <div style={{ marginLeft: 7, borderLeft: `1.5px solid ${flow.color}30`, height: 8 }} />}
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* ─── Map ─── */}
        <main style={{ flex: 1, padding: "16px 20px", overflowX: "auto", display: "flex", flexDirection: "column" }}>
          {activeFlow !== "all" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "6px 12px", borderRadius: 6, background: `${flow.color}08`, border: `1px solid ${flow.color}15` }}>
              <span style={{ fontSize: 13 }}>{flow.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: flow.color }}>{flow.label}</span>
              <span style={{ fontSize: 11, color: c.textMuted }}>{filtered.length} integrations</span>
              <button onClick={() => { setActiveFlow("all"); setSelectedEnv(null); }} style={{
                marginLeft: "auto", padding: "2px 8px", borderRadius: 4,
                border: `1px solid ${c.border}`, background: c.surface, fontSize: 10,
                fontWeight: 500, cursor: "pointer", color: c.textMuted, fontFamily: "inherit",
              }}>Clear</button>
            </div>
          )}

          <div style={{ background: c.surface, borderRadius: 12, border: `1px solid ${c.border}`, minWidth: totalW, position: "relative", overflow: "hidden" }}>
            {/* SVG */}
            <svg style={{ position: "absolute", top: 0, left: 0, width: totalW, height: totalH, pointerEvents: "none", zIndex: 2 }}>
              <defs>
                <marker id="a1" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0,5 2,0 4" fill={c.textDim} /></marker>
                <marker id="a2" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto"><polygon points="0 0,6 2,0 4" fill={flow?.color || "#fff"} /></marker>
                <marker id="a3" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto"><polygon points="0 0,6 2,0 4" fill="#e2e8f0" /></marker>
              </defs>
              {INTEGRATIONS.map((ig, i) => {
                const d = path(ig.from, ig.to);
                if (!d) return null;
                const inf = inFlow(ig);
                const hov = hoveredInteg?.from === ig.from && hoveredInteg?.to === ig.to;
                const sel = selectedEnv && (ig.from === selectedEnv.id || ig.to === selectedEnv.id) && inf;
                if (activeFlow !== "all" && !inf) return <path key={i} d={d} fill="none" stroke={c.borderLight} strokeWidth={1} strokeDasharray="3,4" style={{ opacity: 0.3 }} />;
                const lit = hov || sel;
                return (
                  <path key={i} d={d} fill="none"
                    stroke={hov ? "#e2e8f0" : sel ? flow.color : activeFlow !== "all" ? flow.color : c.textDim}
                    strokeWidth={lit ? 2.5 : activeFlow !== "all" ? 2 : 1.5}
                    strokeDasharray={lit || activeFlow !== "all" ? "none" : "5,4"}
                    markerEnd={hov ? "url(#a3)" : lit || activeFlow !== "all" ? "url(#a2)" : "url(#a1)"}
                    style={{ transition: "all 0.2s ease", opacity: (hoveredInteg && !lit) ? 0.1 : 1, pointerEvents: "stroke", cursor: "pointer" }}
                    onMouseEnter={() => setHoveredInteg(ig)}
                    onMouseLeave={() => setHoveredInteg(null)}
                  />
                );
              })}
            </svg>

            {/* Headers */}
            <div style={{ display: "flex" }}>
              <div style={{ width: sysW, flexShrink: 0, height: headH, borderBottom: `1px solid ${c.border}`, borderRight: `1px solid ${c.border}` }} />
              {STAGES.map((stg, i) => (
                <div key={stg.id} style={{
                  width: stageW, flexShrink: 0, height: headH,
                  borderBottom: `1px solid ${c.border}`,
                  borderRight: i < STAGES.length - 1 ? `1px solid ${c.borderLight}` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: 1.5, background: stg.color, opacity: 0.6 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: stg.color, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'DM Mono', monospace", opacity: 0.8 }}>{stg.label}</span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {SYSTEMS.map((sys, si) => {
              const sActive = sysInFlow(sys.id);
              return (
                <div key={sys.id} style={{
                  display: "flex", height: rowH,
                  borderBottom: si < SYSTEMS.length - 1 ? `1px solid ${c.borderLight}` : "none",
                  transition: "opacity 0.3s ease", opacity: sActive ? 1 : 0.15,
                }}>
                  <div style={{ width: sysW, flexShrink: 0, padding: "0 16px", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: `1px solid ${c.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 12, color: c.text }}>{sys.name}</span>
                      {activeFlow !== "all" && sActive && flow.systems && (
                        <span style={{ width: 14, height: 14, borderRadius: 3, background: flow.color, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#0f1117", fontSize: 8, fontWeight: 700 }}>{flow.systems.indexOf(sys.id) + 1}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: c.textDim, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{sys.subtitle}</div>
                  </div>
                  {STAGES.map((stg, sti) => {
                    const envs = sys.envs.filter(e => e.stage === stg.id);
                    return (
                      <div key={stg.id} style={{
                        width: stageW, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        borderRight: sti < STAGES.length - 1 ? `1px solid ${c.borderLight}` : "none",
                        position: "relative", zIndex: 3,
                      }}>
                        {envs.length === 0 ? (
                          <span style={{ fontSize: 10, color: c.textDim }}>—</span>
                        ) : envs.map(env => {
                          const h = hlEnv(env.id);
                          const dim = activeFlow !== "all" && !envInFlow(env.id);
                          const sel = selectedEnv?.id === env.id;
                          const stgColor = stg.color;
                          return (
                            <button key={env.id} onClick={() => !dim && setSelectedEnv(sel ? null : env)} style={{
                              width: envs.length > 1 ? 72 : 88, padding: "10px 0", borderRadius: 8,
                              border: `1.5px solid ${sel ? stgColor : h ? `${stgColor}80` : dim ? c.borderLight : c.border}`,
                              background: sel ? `${stgColor}15` : h ? `${stgColor}0a` : dim ? c.bg : c.surfaceAlt,
                              cursor: dim ? "default" : "pointer",
                              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                              fontFamily: "inherit", transition: "all 0.2s ease",
                              transform: sel ? "scale(1.08)" : h ? "scale(1.03)" : "scale(1)",
                              boxShadow: sel ? `0 4px 16px ${stgColor}20` : h ? `0 2px 8px ${stgColor}10` : "none",
                              opacity: dim ? 0.2 : 1,
                              position: "relative", zIndex: sel ? 12 : h ? 10 : 1,
                            }}>
                              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: sel || h ? stgColor : c.text }}>{env.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* ─── Detail Panel ─── */}
          {detail && (
            <div style={{
              marginTop: 14, background: c.surface, borderRadius: 10,
              border: `1px solid ${c.border}`, padding: "16px 20px",
              animation: "fadeIn 0.15s ease",
            }}>
              <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
              <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
                {/* Identity */}
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Environment</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>
                    {detail.systemName} <span style={{ color: c.textDim }}>›</span> {detail.label}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: `${detail.stage.color}15`, color: detail.stage.color, fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
                    {detail.stage.label} Stage
                  </span>
                </div>

                {/* Integrations */}
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Integrations</div>
                  {detail.up.length > 0 && (
                    <div style={{ marginBottom: 6 }}>
                      <div style={{ fontSize: 10, color: c.textDim, marginBottom: 3 }}>Upstream</div>
                      {detail.up.map(e => (
                        <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                          <span style={{ color: c.textDim, fontSize: 10 }}>←</span>
                          <span style={{ fontSize: 11, fontWeight: 500, fontFamily: "'DM Mono', monospace", color: c.text }}>{e.systemName} {e.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {detail.down.length > 0 && (
                    <div>
                      <div style={{ fontSize: 10, color: c.textDim, marginBottom: 3 }}>Downstream</div>
                      {detail.down.map(e => (
                        <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                          <span style={{ color: c.textDim, fontSize: 10 }}>→</span>
                          <span style={{ fontSize: 11, fontWeight: 500, fontFamily: "'DM Mono', monospace", color: c.text }}>{e.systemName} {e.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {detail.up.length === 0 && detail.down.length === 0 && (
                    <span style={{ fontSize: 11, color: c.textDim, fontStyle: "italic" }}>None{activeFlow !== "all" ? " in this flow" : ""}</span>
                  )}
                </div>

                {/* Flows */}
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Flows</div>
                  {detail.envFlows.length > 0 ? detail.envFlows.map(f => (
                    <button key={f.id} onClick={() => setActiveFlow(f.id)} style={{
                      display: "flex", alignItems: "center", gap: 5, marginBottom: 4,
                      padding: "4px 8px", borderRadius: 5, width: "100%",
                      background: activeFlow === f.id ? `${f.color}12` : "transparent",
                      border: `1px solid ${activeFlow === f.id ? f.color + "30" : c.border}`,
                      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 11 }}>{f.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: activeFlow === f.id ? f.color : c.textMuted }}>{f.label}</span>
                    </button>
                  )) : <span style={{ fontSize: 11, color: c.textDim, fontStyle: "italic" }}>None</span>}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
