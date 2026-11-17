import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { Diagram, DiagramNode } from "@/config/diagrams";
import { cn } from "@/lib/utils";

interface ArchitectureDiagramProps {
  diagram: Diagram;
  /** "wide" reads left to right; "tall" is the same grid turned on its side for phones. */
  layout: "wide" | "tall";
  selected: string;
  onSelect: (id: string) => void;
  className?: string;
}

interface Geometry {
  width: number;
  height: number;
  nodeW: number;
  nodeH: number;
  place: (node: DiagramNode) => Point;
}

interface Point {
  x: number;
  y: number;
}

interface Edge {
  key: string;
  routeId: string;
  routeIndex: number;
  step: number;
  steps: number;
  from: Point;
  to: Point;
}

const GEOMETRY: Record<ArchitectureDiagramProps["layout"], Geometry> = {
  wide: {
    width: 920,
    height: 420,
    nodeW: 148,
    nodeH: 56,
    place: (node) => ({ x: 90 + node.col * 185, y: 70 + node.row * 140 }),
  },
  tall: {
    width: 360,
    height: 540,
    nodeW: 102,
    nodeH: 48,
    place: (node) => ({ x: 62 + node.row * 118, y: 46 + node.col * 112 }),
  },
};

const EDGE_GAP = 5;
const ZONE_PAD = 14;
/** One hop of a request dot. Slow on purpose: the diagram should feel calm. */
const HOP_SECONDS = 1.7;
const ROUTE_PAUSE_SECONDS = 1.4;
const ROUTE_STAGGER_SECONDS = 0.9;

/** Where the line between two node centres leaves the first node's box. */
function leave(from: Point, to: Point, geometry: Geometry): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const scale = Math.min(
    dx === 0 ? Infinity : geometry.nodeW / 2 / Math.abs(dx),
    dy === 0 ? Infinity : geometry.nodeH / 2 / Math.abs(dy),
  );
  const gap = EDGE_GAP / length;
  return { x: from.x + dx * (scale + gap), y: from.y + dy * (scale + gap) };
}

export default function ArchitectureDiagram({
  diagram,
  layout,
  selected,
  onSelect,
  className,
}: ArchitectureDiagramProps) {
  const geometry = GEOMETRY[layout];
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const flowing = inView && !reducedMotion;

  const centres = new Map(diagram.nodes.map((node) => [node.id, geometry.place(node)]));
  const centre = (id: string): Point => centres.get(id) ?? { x: 0, y: 0 };

  const edges: Edge[] = diagram.routes.flatMap((route, routeIndex) =>
    route.path.slice(1).map((toId, step) => {
      const a = centre(route.path[step]);
      const b = centre(toId);
      return {
        key: `${route.id}-${step}`,
        routeId: route.id,
        routeIndex,
        step,
        steps: route.path.length - 1,
        from: leave(a, b, geometry),
        to: leave(b, a, geometry),
      };
    }),
  );

  const activeRoutes = new Set(
    diagram.routes.filter((route) => route.path.includes(selected)).map((route) => route.id),
  );
  const activeNodes = new Set(
    diagram.routes.filter((route) => activeRoutes.has(route.id)).flatMap((route) => route.path),
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      role="group"
      aria-label={`${diagram.name} architecture. Choose a part to read about it.`}
      className={cn("h-auto w-full", className)}
    >
      {diagram.zones.map((zone) => {
        const points = zone.nodes.map(centre);
        const left = Math.min(...points.map((p) => p.x)) - geometry.nodeW / 2 - ZONE_PAD;
        const right = Math.max(...points.map((p) => p.x)) + geometry.nodeW / 2 + ZONE_PAD;
        const top = Math.min(...points.map((p) => p.y)) - geometry.nodeH / 2 - ZONE_PAD - 14;
        const bottom = Math.max(...points.map((p) => p.y)) + geometry.nodeH / 2 + ZONE_PAD;
        return (
          <g key={zone.label}>
            <rect
              x={left}
              y={top}
              width={right - left}
              height={bottom - top}
              rx="12"
              strokeDasharray="5 5"
              className="fill-none stroke-border-strong"
            />
            <text x={left + 10} y={top + 15} className="fill-muted-foreground font-mono text-[10px]">
              {zone.label}
            </text>
          </g>
        );
      })}

      {edges.map((edge) => (
        <line
          key={edge.key}
          x1={edge.from.x}
          y1={edge.from.y}
          x2={edge.to.x}
          y2={edge.to.y}
          strokeWidth="1.5"
          className={cn(
            "stroke-border-strong transition-[stroke,opacity] duration-300",
            activeRoutes.has(edge.routeId) && "stroke-accent",
          )}
        />
      ))}

      {flowing &&
        edges.map((edge) => (
          <motion.circle
            key={`${diagram.id}-${edge.key}`}
            r={layout === "wide" ? 4 : 3.5}
            className={cn("fill-accent", !activeRoutes.has(edge.routeId) && "fill-muted-foreground")}
            initial={{ x: edge.from.x, y: edge.from.y, opacity: 0 }}
            animate={{
              x: [edge.from.x, edge.to.x],
              y: [edge.from.y, edge.to.y],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: HOP_SECONDS,
              ease: "linear",
              delay: edge.routeIndex * ROUTE_STAGGER_SECONDS + edge.step * HOP_SECONDS,
              repeat: Infinity,
              repeatDelay: (edge.steps - 1) * HOP_SECONDS + ROUTE_PAUSE_SECONDS,
              opacity: {
                duration: HOP_SECONDS,
                times: [0, 0.12, 0.88, 1],
                delay: edge.routeIndex * ROUTE_STAGGER_SECONDS + edge.step * HOP_SECONDS,
                repeat: Infinity,
                repeatDelay: (edge.steps - 1) * HOP_SECONDS + ROUTE_PAUSE_SECONDS,
              },
            }}
          />
        ))}

      {diagram.nodes.map((node) => {
        const { x, y } = centre(node.id);
        const isSelected = node.id === selected;
        const press = (event: React.KeyboardEvent) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onSelect(node.id);
        };
        return (
          <g
            key={node.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`${node.label}, ${node.sub}`}
            onClick={() => onSelect(node.id)}
            onKeyDown={press}
            className={cn(
              "group cursor-pointer outline-none transition-opacity duration-300",
              !activeNodes.has(node.id) && "opacity-70 hover:opacity-100 focus-visible:opacity-100",
            )}
          >
            <rect
              x={x - geometry.nodeW / 2}
              y={y - geometry.nodeH / 2}
              width={geometry.nodeW}
              height={geometry.nodeH}
              rx="8"
              strokeWidth={isSelected ? 2 : 1.25}
              className={cn(
                "fill-surface stroke-border-strong transition-[fill,stroke] duration-200 group-hover:stroke-accent group-focus-visible:stroke-accent group-focus-visible:[stroke-width:2.5]",
                isSelected && "fill-surface-raised stroke-accent",
              )}
            />
            <text
              x={x}
              y={y - 3}
              textAnchor="middle"
              className={cn(
                "fill-foreground font-sans font-semibold",
                layout === "wide" ? "text-[14px]" : "text-[12px]",
              )}
            >
              {node.label}
            </text>
            <text
              x={x}
              y={y + 13}
              textAnchor="middle"
              className={cn(
                "font-mono",
                layout === "wide" ? "text-[10.5px]" : "text-[9px]",
                isSelected ? "fill-accent" : "fill-muted-foreground",
              )}
            >
              {node.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
