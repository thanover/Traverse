export interface Stage {
  id: string;
  label: string;
  color: string;
}

export interface Environment {
  id: string;
  label: string;
  stage: string;
}

export interface EnvironmentWithSystem extends Environment {
  systemId: string;
  systemName: string;
}

export interface System {
  id: string;
  name: string;
  subtitle: string;
  envs: Environment[];
}

export interface Integration {
  from: string;
  to: string;
  flows: string[];
}

export interface Flow {
  id: string;
  label: string;
  icon: string;
  color: string;
  systems?: string[];
}

export interface Point {
  x: number;
  y: number;
}

export interface EnvDetail extends Omit<EnvironmentWithSystem, "stage"> {
  stage: Stage;
  envFlows: Flow[];
  up: EnvironmentWithSystem[];
  down: EnvironmentWithSystem[];
}

export const COLORS = {
  bg: "#0f1117",
  surface: "#161921",
  surfaceAlt: "#1c1f2b",
  border: "#252836",
  borderLight: "#1e2130",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#3e4459",
} as const;
