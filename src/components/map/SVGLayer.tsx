import type { Integration, Flow, Environment } from "../../lib/types";
import { COLORS } from "../../lib/types";
import { STAGES, SYSTEMS, INTEGRATIONS } from "../../data";

const STAGE_W = 190;
const SYS_W = 150;
const ROW_H = 100;
const HEAD_H = 44;

function center(id: string) {
  for (let si = 0; si < SYSTEMS.length; si++) {
    const env = SYSTEMS[si].envs.find((e) => e.id === id);
    if (env) {
      const sti = STAGES.findIndex((s) => s.id === env.stage);
      const sibs = SYSTEMS[si].envs.filter((e) => e.stage === env.stage);
      const oi = sibs.findIndex((e) => e.id === id);
      const cw = STAGE_W / sibs.length;
      return {
        x: SYS_W + sti * STAGE_W + oi * cw + cw / 2,
        y: HEAD_H + si * ROW_H + ROW_H / 2,
      };
    }
  }
  return null;
}

function makePath(a: string, b: string): string | null {
  const f = center(a);
  const t = center(b);
  if (!f || !t) return null;
  const cx = Math.abs(t.x - f.x) * 0.4;
  return `M ${f.x} ${f.y} C ${f.x + cx} ${f.y}, ${t.x - cx} ${t.y}, ${t.x} ${t.y}`;
}

interface SVGLayerProps {
  activeFlow: string;
  flow: Flow;
  selectedEnv: Environment | null;
  hoveredInteg: Integration | null;
  inFlow: (integ: Integration) => boolean;
  onHoverInteg: (integ: Integration | null) => void;
  totalW: number;
  totalH: number;
}

export function SVGLayer({
  activeFlow,
  flow,
  selectedEnv,
  hoveredInteg,
  inFlow,
  onHoverInteg,
  totalW,
  totalH,
}: SVGLayerProps) {
  const c = COLORS;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: totalW,
        height: totalH,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <defs>
        <marker
          id="a1"
          markerWidth="5"
          markerHeight="4"
          refX="5"
          refY="2"
          orient="auto"
        >
          <polygon points="0 0,5 2,0 4" fill={c.textDim} />
        </marker>
        <marker
          id="a2"
          markerWidth="6"
          markerHeight="4"
          refX="6"
          refY="2"
          orient="auto"
        >
          <polygon points="0 0,6 2,0 4" fill={flow.color} />
        </marker>
        <marker
          id="a3"
          markerWidth="6"
          markerHeight="4"
          refX="6"
          refY="2"
          orient="auto"
        >
          <polygon points="0 0,6 2,0 4" fill="#e2e8f0" />
        </marker>
      </defs>
      {INTEGRATIONS.map((ig, i) => {
        const d = makePath(ig.from, ig.to);
        if (!d) return null;
        const inf = inFlow(ig);
        const hov =
          hoveredInteg?.from === ig.from && hoveredInteg?.to === ig.to;
        const sel =
          selectedEnv !== null &&
          (ig.from === selectedEnv.id || ig.to === selectedEnv.id) &&
          inf;
        if (activeFlow !== "all" && !inf) {
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={c.borderLight}
              strokeWidth={1}
              strokeDasharray="3,4"
              style={{ opacity: 0.3 }}
            />
          );
        }
        const lit = hov || sel;
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={
              hov
                ? "#e2e8f0"
                : sel
                  ? flow.color
                  : activeFlow !== "all"
                    ? flow.color
                    : c.textDim
            }
            strokeWidth={lit ? 2.5 : activeFlow !== "all" ? 2 : 1.5}
            strokeDasharray={
              lit || activeFlow !== "all" ? undefined : "5,4"
            }
            markerEnd={
              hov
                ? "url(#a3)"
                : lit || activeFlow !== "all"
                  ? "url(#a2)"
                  : "url(#a1)"
            }
            style={{
              transition: "all 0.2s ease",
              opacity: hoveredInteg !== null && !lit ? 0.1 : 1,
              pointerEvents: "stroke",
              cursor: "pointer",
            }}
            onMouseEnter={() => onHoverInteg(ig)}
            onMouseLeave={() => onHoverInteg(null)}
          />
        );
      })}
    </svg>
  );
}
