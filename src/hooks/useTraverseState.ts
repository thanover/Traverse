import { useState, useMemo } from "react";
import type { Environment, EnvironmentWithSystem, Integration } from "../lib/types";
import { STAGES, SYSTEMS, INTEGRATIONS, FLOWS } from "../data";

function getEnvById(id: string): EnvironmentWithSystem | null {
  for (const sys of SYSTEMS) {
    const env = sys.envs.find((e) => e.id === id);
    if (env) return { ...env, systemId: sys.id, systemName: sys.name };
  }
  return null;
}

export function useTraverseState() {
  const [activeFlow, setActiveFlow] = useState("all");
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
  const [hoveredInteg, setHoveredInteg] = useState<Integration | null>(null);

  const flow = FLOWS.find((f) => f.id === activeFlow) ?? FLOWS[0];

  const inFlow = (integ: Integration) =>
    activeFlow === "all" || integ.flows.includes(activeFlow);

  const filtered = useMemo(
    () => INTEGRATIONS.filter(inFlow),
    [activeFlow],
  );

  const activeEnvs = useMemo(() => {
    const set = new Set<string>();
    if (activeFlow !== "all") {
      filtered.forEach((c) => {
        set.add(c.from);
        set.add(c.to);
      });
    }
    return set;
  }, [activeFlow, filtered]);

  const envInFlow = (id: string) => activeFlow === "all" || activeEnvs.has(id);

  const sysInFlow = (id: string) =>
    activeFlow === "all" || (flow.systems?.includes(id) ?? false);

  const hlEnv = (id: string): boolean => {
    if (hoveredInteg) return hoveredInteg.from === id || hoveredInteg.to === id;
    if (selectedEnv) {
      if (selectedEnv.id === id) return true;
      return INTEGRATIONS.some(
        (c) =>
          inFlow(c) &&
          ((c.from === selectedEnv.id && c.to === id) ||
            (c.to === selectedEnv.id && c.from === id)),
      );
    }
    return false;
  };

  const detail = useMemo(() => {
    if (!selectedEnv) return null;
    const full = getEnvById(selectedEnv.id);
    if (!full) return null;
    const stage = STAGES.find((s) => s.id === selectedEnv.stage);
    if (!stage) return null;
    const envFlows = FLOWS.filter(
      (f) =>
        f.id !== "all" &&
        INTEGRATIONS.some(
          (c) =>
            c.flows.includes(f.id) &&
            (c.from === selectedEnv.id || c.to === selectedEnv.id),
        ),
    );
    const up = INTEGRATIONS.filter((c) => c.to === selectedEnv.id && inFlow(c))
      .map((c) => getEnvById(c.from))
      .filter((e): e is EnvironmentWithSystem => e !== null);
    const down = INTEGRATIONS.filter(
      (c) => c.from === selectedEnv.id && inFlow(c),
    )
      .map((c) => getEnvById(c.to))
      .filter((e): e is EnvironmentWithSystem => e !== null);
    return { ...full, stage, envFlows, up, down };
  }, [selectedEnv, activeFlow]);

  const selectFlow = (id: string) => {
    setActiveFlow(id);
    setSelectedEnv(null);
  };

  const selectEnv = (env: Environment | null) => {
    setSelectedEnv(env);
  };

  const clearFlow = () => {
    setActiveFlow("all");
    setSelectedEnv(null);
  };

  return {
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
  };
}
