"use client";

import { useState, useRef } from "react";

interface TiltCardProps {
  title: string;
  description: string;
  chapter: number;
  part: "beginner" | "intermediate" | "advanced";
  href: string;
}

const partConfig = {
  beginner: {
    label: "Beginner",
    color: "#34D25c",
    bg: "rgba(52, 210, 92, 0.08)",
    border: "rgba(52, 210, 92, 0.15)",
  },
  intermediate: {
    label: "Intermediate",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.08)",
    border: "rgba(59, 130, 246, 0.15)",
  },
  advanced: {
    label: "Advanced",
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.08)",
    border: "rgba(168, 85, 247, 0.15)",
  },
};

export function TiltCard({ title, description, chapter, part, href }: TiltCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const config = partConfig[part];

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -12;
    const tiltY = ((x - centerX) / centerX) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const shadowX = tilt.y * 0.5;
  const shadowY = -tilt.x * 0.5;

  return (
    <a
      id={`chapter-${chapter}`}
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="block group"
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="relative rounded-2xl border bg-white p-6 flex flex-col gap-4 h-full"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transition: "transform 200ms ease-out, box-shadow 200ms ease-out",
          borderColor: isHovered ? config.border : "#e7e5e4",
          boxShadow: isHovered
            ? `${shadowX}px ${shadowY}px 24px rgba(0,0,0,0.08), 0 0 0 1px ${config.border}`
            : "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {/* Chapter number */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-medium tracking-wider uppercase px-2.5 py-1 rounded-full"
            style={{
              color: config.color,
              backgroundColor: config.bg,
            }}
          >
            {config.label}
          </span>
          <span className="text-sm font-mono text-text-tertiary">
            {String(chapter).padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-text tracking-tight leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed flex-1">
          {description}
        </p>

        {/* Arrow */}
        <div className="flex items-center gap-2 text-sm font-medium pt-2" style={{ color: config.color }}>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            Start lesson →
          </span>
        </div>
      </div>
    </a>
  );
}
