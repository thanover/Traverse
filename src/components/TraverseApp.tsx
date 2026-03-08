import { COLORS } from "../lib/types";
import { useTraverseState } from "../hooks/useTraverseState";
import { Header } from "./ui/Header";
import { FlowList } from "./sidebar/FlowList";
import { MapGrid } from "./map/MapGrid";
import { DetailPanel } from "./detail/DetailPanel";

export default function TraverseApp() {
  const {
    activeFlow,
    selectedEnv,
    hoveredInteg,
    flow,
    filtered,
    detail,
    inFlow,
    envInFlow,
    sysInFlow,
    hlEnv,
    selectFlow,
    selectEnv,
    clearFlow,
    setHoveredInteg,
  } = useTraverseState();

  const c = COLORS;

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        background: c.bg,
        minHeight: "100vh",
        color: c.text,
      }}
    >
      <Header />
      <div style={{ display: "flex", minHeight: "calc(100vh - 52px)" }}>
        <FlowList
          activeFlow={activeFlow}
          flow={flow}
          onSelectFlow={selectFlow}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <MapGrid
            activeFlow={activeFlow}
            flow={flow}
            selectedEnv={selectedEnv}
            hoveredInteg={hoveredInteg}
            filtered={filtered}
            inFlow={inFlow}
            envInFlow={envInFlow}
            sysInFlow={sysInFlow}
            hlEnv={hlEnv}
            onSelectEnv={selectEnv}
            onHoverInteg={setHoveredInteg}
            onClearFlow={clearFlow}
          />
          {detail && (
            <div style={{ padding: "0 20px 16px" }}>
              <DetailPanel
                detail={detail}
                activeFlow={activeFlow}
                onSelectFlow={selectFlow}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
