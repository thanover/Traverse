import type { Environment } from "../../lib/types";
import { COLORS } from "../../lib/types";

interface EnvNodeProps {
  env: Environment;
  stageColor: string;
  siblingCount: number;
  highlighted: boolean;
  dimmed: boolean;
  selected: boolean;
  onSelect: (env: Environment | null) => void;
}

export function EnvNode({
  env,
  stageColor,
  siblingCount,
  highlighted,
  dimmed,
  selected,
  onSelect,
}: EnvNodeProps) {
  const c = COLORS;

  return (
    <button
      onClick={() => !dimmed && onSelect(selected ? null : env)}
      style={{
        width: siblingCount > 1 ? 72 : 88,
        padding: "10px 0",
        borderRadius: 8,
        border: `1.5px solid ${selected ? stageColor : highlighted ? `${stageColor}80` : dimmed ? c.borderLight : c.border}`,
        background: selected
          ? `${stageColor}15`
          : highlighted
            ? `${stageColor}0a`
            : dimmed
              ? c.bg
              : c.surfaceAlt,
        cursor: dimmed ? "default" : "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        fontFamily: "inherit",
        transition: "all 0.2s ease",
        transform: selected
          ? "scale(1.08)"
          : highlighted
            ? "scale(1.03)"
            : "scale(1)",
        boxShadow: selected
          ? `0 4px 16px ${stageColor}20`
          : highlighted
            ? `0 2px 8px ${stageColor}10`
            : "none",
        opacity: dimmed ? 0.2 : 1,
        position: "relative",
        zIndex: selected ? 12 : highlighted ? 10 : 1,
      }}
    >
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: selected || highlighted ? stageColor : c.text,
        }}
      >
        {env.label}
      </span>
    </button>
  );
}
