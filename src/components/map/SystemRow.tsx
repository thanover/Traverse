import type { System, Environment, Flow } from "../../lib/types";
import { COLORS } from "../../lib/types";
import { STAGES } from "../../data";
import { EnvNode } from "./EnvNode";

interface SystemRowProps {
  system: System;
  isLast: boolean;
  active: boolean;
  activeFlow: string;
  flow: Flow;
  selectedEnv: Environment | null;
  hlEnv: (id: string) => boolean;
  envInFlow: (id: string) => boolean;
  onSelectEnv: (env: Environment | null) => void;
}

export function SystemRow({
  system,
  isLast,
  active,
  activeFlow,
  flow,
  selectedEnv,
  hlEnv,
  envInFlow,
  onSelectEnv,
}: SystemRowProps) {
  const c = COLORS;
  const stageW = 190;
  const sysW = 150;
  const rowH = 100;

  return (
    <div
      style={{
        display: "flex",
        height: rowH,
        borderBottom: !isLast ? `1px solid ${c.borderLight}` : "none",
        transition: "opacity 0.3s ease",
        opacity: active ? 1 : 0.15,
      }}
    >
      <div
        style={{
          width: sysW,
          flexShrink: 0,
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRight: `1px solid ${c.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 600, fontSize: 12, color: c.text }}>
            {system.name}
          </span>
          {activeFlow !== "all" && active && flow.systems && (
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: flow.color,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0f1117",
                fontSize: 8,
                fontWeight: 700,
              }}
            >
              {flow.systems.indexOf(system.id) + 1}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 10,
            color: c.textDim,
            marginTop: 2,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {system.subtitle}
        </div>
      </div>
      {STAGES.map((stg, sti) => {
        const envs = system.envs.filter((e) => e.stage === stg.id);
        return (
          <div
            key={stg.id}
            style={{
              width: stageW,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderRight:
                sti < STAGES.length - 1
                  ? `1px solid ${c.borderLight}`
                  : "none",
              position: "relative",
              zIndex: 3,
            }}
          >
            {envs.length === 0 ? (
              <span style={{ fontSize: 10, color: c.textDim }}>—</span>
            ) : (
              envs.map((env) => (
                <EnvNode
                  key={env.id}
                  env={env}
                  stageColor={stg.color}
                  siblingCount={envs.length}
                  highlighted={hlEnv(env.id)}
                  dimmed={activeFlow !== "all" && !envInFlow(env.id)}
                  selected={selectedEnv?.id === env.id}
                  onSelect={onSelectEnv}
                />
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
