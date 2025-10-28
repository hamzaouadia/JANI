"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import VerificationBadge from "@/components/VerificationBadge";

type Lot = {
  id: string;
  code: string;
  coop: string;
  harvestDate: string;
  status: "verified" | "pending" | "flagged";
};

const MOCK: Lot[] = [
  { id: "lot-001", code: "H-2025-0001", coop: "Alpha Coop", harvestDate: "2025-10-01", status: "verified" },
  { id: "lot-002", code: "H-2025-0002", coop: "Beta Coop", harvestDate: "2025-10-05", status: "pending" },
  { id: "lot-003", code: "H-2025-0003", coop: "Alpha Coop", harvestDate: "2025-10-08", status: "flagged" },
];

export default function ExporterLotsPage() {
  const [status, setStatus] = useState<string>("");
  const [coop, setCoop] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const filtered = useMemo(() => {
    return MOCK.filter((l) => {
      if (status && l.status !== status) return false;
      if (coop && !l.coop.toLowerCase().includes(coop.toLowerCase())) return false;
      if (from && new Date(l.harvestDate) < new Date(from)) return false;
      if (to && new Date(l.harvestDate) > new Date(to)) return false;
      return true;
    });
  }, [status, coop, from, to]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Exporter Lots</h1>
        <div className="text-sm text-gray-500">Pipeline: Planting → Harvest → Transfer → Export</div>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <select className="border rounded px-2 py-1" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
        </select>
        <input className="border rounded px-2 py-1" placeholder="Coop" value={coop} onChange={(e) => setCoop(e.target.value)} />
        <input className="border rounded px-2 py-1" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className="border rounded px-2 py-1" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <ul className="space-y-2">
        {filtered.map((l) => (
          <li key={l.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{l.code}</div>
              <div className="text-sm text-gray-500">{l.coop} • Harvest: {new Date(l.harvestDate).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-3">
              <VerificationBadge status={l.status} />
              <Link className="text-blue-600 underline" href={`/exporter/lots/${l.id}`}>Open</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}