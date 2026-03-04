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
