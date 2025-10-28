"use client";

import { useParams } from "next/navigation";
import VerificationBadge from "@/components/VerificationBadge";

export default function LotDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // Placeholder lot
  const lot = {
    id,
    code: id?.toUpperCase?.() || "LOT",
    status: (id?.endsWith("1") ? "verified" : id?.endsWith("2") ? "pending" : "flagged") as
      | "verified"
      | "pending"
      | "flagged",
    farmer: "Amina K.",
    farm: "Alpha Farm",
    coop: "Alpha Coop",
    harvestDate: "2025-10-05",
    weightKg: 1250,
  };

  const timeline = [
    { key: "seed", label: "Seed Lot Created", date: "2025-06-01", ok: true },
    { key: "plant", label: "Planting", date: "2025-06-05", ok: true },
    { key: "apply", label: "Input Application", date: "2025-07-15", ok: true },
    { key: "harvest", label: "Harvest", date: lot.harvestDate, ok: true },
    { key: "transfer", label: "Transfer", date: "2025-10-10", ok: lot.status !== "flagged" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{lot.code}</h1>
          <div className="text-gray-600 text-sm">{lot.coop} • Harvest: {new Date(lot.harvestDate).toLocaleDateString()}</div>
        </div>
        <VerificationBadge status={lot.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-medium">Timeline</h2>
          <ol className="relative border-l pl-4">
            {timeline.map((t) => (
              <li key={t.key} className="mb-6 ml-2">
                <div className={`absolute -left-1.5 w-3 h-3 rounded-full ${t.ok ? "bg-emerald-500" : "bg-amber-500"}`} />
                <div className="flex items-center justify-between">
                  <div className="font-medium">{t.label}</div>
                  <div className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Verification Panel</h2>
          <div className="border rounded p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Photos</span>
              <span className="text-emerald-700">✓ Attached</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GPS</span>
              <span className="text-emerald-700">✓ Geofenced</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Agent Audit</span>
              <span className={lot.status === "flagged" ? "text-amber-700" : "text-emerald-700"}>
                {lot.status === "flagged" ? "Pending" : "Passed"}
              </span>
            </div>
          </div>

          <button
            className="w-full bg-emerald-600 text-white px-3 py-2 rounded"
            onClick={() => window.alert("Certificate generation is not yet wired to backend.")}
          >
            Download Certificate (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}