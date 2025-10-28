"use client";

type Props = { status: "verified" | "pending" | "flagged"; className?: string };

export default function VerificationBadge({ status, className = "" }: Props) {
  const map = {
    verified: {
      label: "Verified",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
    },
    pending: {
      label: "Pending",
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
    },
    flagged: {
      label: "Flagged",
      bg: "bg-red-50",
      text: "text-red-700",
      ring: "ring-red-200",
    },
  } as const;
  const m = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${m.bg} ${m.text} ${m.ring} ${className}`}>
      {m.label}
    </span>
  );
}