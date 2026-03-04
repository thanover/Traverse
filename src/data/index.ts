import type { Stage, System, Integration, Flow } from "../types";

export const STAGES: Stage[] = [
  { id: "dev", label: "Dev", color: "#818cf8" },
  { id: "test", label: "Test", color: "#38bdf8" },
  { id: "mo", label: "MO", color: "#fbbf24" },
  { id: "prod", label: "Prod", color: "#34d399" },
];

export const SYSTEMS: System[] = [
  {
    id: "sys1",
    name: "Policy Admin",
    subtitle: "Core policy mgmt",
    envs: [
      { id: "sys1-dev", label: "DEV", stage: "dev" },
      { id: "sys1-uat", label: "UAT", stage: "test" },
      { id: "sys1-mo", label: "MO", stage: "mo" },
      { id: "sys1-prod", label: "PROD", stage: "prod" },
    ],
  },
  {
    id: "sys2",
    name: "Rating Engine",
    subtitle: "Premium calculation",
    envs: [
      { id: "sys2-dev", label: "DEV", stage: "dev" },
      { id: "sys2-test", label: "TEST", stage: "test" },
      { id: "sys2-uat", label: "UAT", stage: "test" },
      { id: "sys2-mo", label: "MO", stage: "mo" },
      { id: "sys2-prod", label: "PROD", stage: "prod" },
    ],
  },
  {
    id: "sys3",
    name: "Doc Generator",
    subtitle: "Document output",
    envs: [
      { id: "sys3-dev", label: "DEV", stage: "dev" },
      { id: "sys3-uat", label: "UAT", stage: "test" },
      { id: "sys3-mo", label: "MO", stage: "mo" },
      { id: "sys3-prod", label: "PROD", stage: "prod" },
    ],
  },
  {
    id: "sys4",
    name: "Underwriting",
    subtitle: "Risk assessment",
    envs: [
      { id: "sys4-dev", label: "DEV", stage: "dev" },
      { id: "sys4-test", label: "TEST", stage: "test" },
      { id: "sys4-uat", label: "UAT", stage: "test" },
      { id: "sys4-mo", label: "MO", stage: "mo" },
      { id: "sys4-prod", label: "PROD", stage: "prod" },
    ],
  },
];

export const INTEGRATIONS: Integration[] = [
  { from: "sys1-dev", to: "sys2-test", flows: ["quote-home", "quote-auto"] },
  { from: "sys2-test", to: "sys3-dev", flows: ["quote-home", "quote-auto"] },
  { from: "sys1-dev", to: "sys4-test", flows: ["uw-auto"] },
  { from: "sys4-test", to: "sys2-test", flows: ["uw-auto"] },
  { from: "sys1-uat", to: "sys2-uat", flows: ["quote-home", "quote-auto"] },
  { from: "sys2-uat", to: "sys3-uat", flows: ["quote-home"] },
  { from: "sys1-uat", to: "sys4-uat", flows: ["uw-auto"] },
  { from: "sys4-uat", to: "sys2-uat", flows: ["uw-auto"] },
  {
    from: "sys1-prod",
    to: "sys2-prod",
    flows: ["quote-home", "quote-auto", "uw-auto"],
  },
  { from: "sys2-prod", to: "sys3-prod", flows: ["quote-home", "quote-auto"] },
  { from: "sys1-prod", to: "sys4-prod", flows: ["uw-auto"] },
  { from: "sys4-prod", to: "sys2-prod", flows: ["uw-auto"] },
  { from: "sys1-mo", to: "sys2-mo", flows: ["quote-home", "quote-auto"] },
  { from: "sys2-mo", to: "sys3-mo", flows: ["quote-home"] },
];

export const FLOWS: Flow[] = [
  { id: "all", label: "All", icon: "◎", color: "#94a3b8" },
  {
    id: "quote-home",
    label: "Quoting Homeowners",
    icon: "🏠",
    color: "#818cf8",
    systems: ["sys1", "sys2", "sys3"],
  },
  {
    id: "quote-auto",
    label: "Quoting Auto",
    icon: "🚗",
    color: "#38bdf8",
    systems: ["sys1", "sys2", "sys3"],
  },
  {
    id: "uw-auto",
    label: "Underwriting Auto",
    icon: "📋",
    color: "#fbbf24",
    systems: ["sys1", "sys4", "sys2"],
  },
];
