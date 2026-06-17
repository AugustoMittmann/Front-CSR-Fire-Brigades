// Outline SVG icons for the "Objetivos" section.
// Stroke uses currentColor so the parent CSS controls the tint.

const baseProps = {
  width: 48,
  height: 48,
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export function HandBulbIcon() {
  return (
    <svg {...baseProps}>
      <path d="M24 6c-4.4 0-8 3.4-8 7.6 0 2.7 1.4 5 3.5 6.4.9.6 1.5 1.6 1.5 2.7V25h6v-2.3c0-1.1.6-2.1 1.5-2.7C30.6 18.6 32 16.3 32 13.6 32 9.4 28.4 6 24 6Z" />
      <path d="M21 28h6M22 31h4" />
      <path d="M8 36c4-2 8-2 12 0 3 1.4 6 1.4 9 0 3-1.4 6-1.4 9 0" />
      <path d="M6 41c4-2 8-2 12 0 3 1.4 6 1.4 9 0 3-1.4 6-1.4 9 0" />
    </svg>
  );
}

export function MegaphoneIcon() {
  return (
    <svg {...baseProps}>
      <path d="M10 19v10l4 1 2 9h5l-1.5-8 14 4V14L20 18H12a2 2 0 0 0-2 2Z" />
      <path d="M38 18v12" />
      <path d="M42 20v8" />
    </svg>
  );
}

export function FlowIcon() {
  return (
    <svg {...baseProps}>
      <circle cx="10" cy="36" r="3" />
      <path d="M13 36h10a6 6 0 0 0 6-6V18a6 6 0 0 1 6-6h6" />
      <polyline points="36,8 41,12 36,16" />
      <line x1="32" y1="32" x2="40" y2="40" />
      <line x1="40" y1="32" x2="32" y2="40" />
    </svg>
  );
}

export function PeopleIcon() {
  return (
    <svg {...baseProps}>
      <circle cx="24" cy="16" r="4" />
      <path d="M16 30c0-4 3.6-7 8-7s8 3 8 7" />
      <circle cx="12" cy="20" r="3" />
      <path d="M6 32c0-3 2.7-5 6-5" />
      <circle cx="36" cy="20" r="3" />
      <path d="M42 32c0-3-2.7-5-6-5" />
    </svg>
  );
}

export function BulbCheckIcon() {
  return (
    <svg {...baseProps}>
      <path d="M24 8c-5 0-9 3.8-9 8.6 0 3 1.5 5.5 3.8 7.1 1 .7 1.7 1.7 1.7 2.9V28h7v-1.4c0-1.2.7-2.2 1.7-2.9 2.3-1.6 3.8-4.1 3.8-7.1C33 11.8 29 8 24 8Z" />
      <path d="M21 31h6M22 34h4" />
      <polyline points="20,18 23,21 28,15" />
      <line x1="24" y1="3" x2="24" y2="6" />
      <line x1="36" y1="9" x2="38" y2="7" />
      <line x1="12" y1="9" x2="10" y2="7" />
      <line x1="40" y1="20" x2="43" y2="20" />
      <line x1="5" y1="20" x2="8" y2="20" />
    </svg>
  );
}

export function PeopleGroupIcon() {
  return (
    <svg {...baseProps}>
      <circle cx="14" cy="16" r="4" />
      <circle cx="34" cy="16" r="4" />
      <circle cx="24" cy="22" r="4" />
      <path d="M6 32c0-4 3.6-7 8-7s8 3 8 7" />
      <path d="M26 32c0-4 3.6-7 8-7s8 3 8 7" />
      <path d="M16 38c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
