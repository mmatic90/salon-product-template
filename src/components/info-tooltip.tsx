"use client";

import { Info } from "lucide-react";
import { useState } from "react";

export default function InfoTooltip({
  text,
  label = "Više informacija",
}: {
  text: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-app-soft bg-app-card-alt text-app-muted transition hover:bg-app-card hover:text-app-text"
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {open ? (
        <span className="absolute left-1/2 top-8 z-50 w-64 -translate-x-1/2 rounded-xl border border-app-soft bg-white p-3 text-left text-xs font-normal leading-relaxed text-app-text shadow-lg">
          {text}
        </span>
      ) : null}
    </span>
  );
}
