import type { Integration, Flow, Environment } from "../../lib/types";
import { COLORS } from "../../lib/types";
import { STAGES, SYSTEMS } from "../../data";
import { SVGLayer } from "./SVGLayer";
import { StageHeaders } from "./StageHeaders";
import { SystemRow } from "./SystemRow";

const SYS_W = 150;
const STAGE_W = 190;
const ROW_H = 100;
const HEAD_H = 44;

interface MapGridProps {
  activeFlow: string;
  flow: Flow;
  selectedEnv: Environment | null;
  hoveredInteg: Integration | null;
  filtered: Integration[];
  inFlow: (integ: Integration) => boolean;
  envInFlow: (id: string) => boolean;
  sysInFlow: (id: string) => boolean;
  hlEnv: (id: string) => boolean;
  onSelectEnv: (env: Environment | null) => void;
  onHoverInteg: (integ: Integration | null) => void;
  onClearFlow: () => void;
}

export function MapGrid({
  activeFlow,
  flow,
  selectedEnv,
  hoveredInteg,
  filtered,
  inFlow,
  envInFlow,
  sysInFlow,
  hlEnv,
  onSelectEnv,
  onHoverInteg,
  onClearFlow,
}: MapGridProps) {
  const c = COLORS;
  const totalW = SYS_W + STAGES.length * STAGE_W;
  const totalH = HEAD_H + SYSTEMS.length * ROW_H;

  return (
    <main
      style={{
        flex: 1,
        padding: "16px 20px",
        overflowX: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {activeFlow !== "all" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
            padding: "6px 12px",
            borderRadius: 6,
            background: `${flow.color}08`,
            border: `1px solid ${flow.color}15`,
          }}
        >
          <span style={{ fontSize: 13 }}>{flow.icon}</span>
          <span
            style={{ fontSize: 12, fontWeight: 600, color: flow.color }}
          >
            {flow.label}
          </span>
          <span style={{ fontSize: 11, color: c.textMuted }}>
            {filtered.length} integrations
          </span>
          <button
            onClick={onClearFlow}
            style={{
              marginLeft: "auto",
              padding: "2px 8px",
              borderRadius: 4,
              border: `1px solid ${c.border}`,
              background: c.surface,
              fontSize: 10,
              fontWeight: 500,
              cursor: "pointer",
              color: c.textMuted,
              fontFamily: "inherit",
            }}
          >
            Clear
          </button>
        </div>
      )}

      <div
        style={{
          background: c.surface,
          borderRadius: 12,
          border: `1px solid ${c.border}`,
          minWidth: totalW,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <SVGLayer
          activeFlow={activeFlow}
          flow={flow}
          selectedEnv={selectedEnv}
          hoveredInteg={hoveredInteg}
          inFlow={inFlow}
          onHoverInteg={onHoverInteg}
          totalW={totalW}
          totalH={totalH}
        />
        <StageHeaders />
        {SYSTEMS.map((sys, si) => (
          <SystemRow
            key={sys.id}
            system={sys}
            isLast={si === SYSTEMS.length - 1}
            active={sysInFlow(sys.id)}
            activeFlow={activeFlow}
            flow={flow}
            selectedEnv={selectedEnv}
            hlEnv={hlEnv}
            envInFlow={envInFlow}
            onSelectEnv={onSelectEnv}
          />
        ))}
      </div>
    </main>
  );
}
