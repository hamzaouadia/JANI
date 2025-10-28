"use client";

import { useParams } from "next/navigation";
import VerificationBadge from "@/components/VerificationBadge";

export default function ConsumerTracePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const lot = {
    publicId: id,
    farmName: "Alpha Farm",
    location: "Kigali, RW",
    harvestDate: "2025-10-05",
    status: (id?.includes("ok") ? "verified" : "pending") as "verified" | "pending" | "flagged",
  };

  const steps = [
    { k: "seed", label: "Seed Lot", ok: true },
    { k: "plant", label: "Planting", ok: true },
    { k: "apply", label: "Input Application", ok: true },
    { k: "harvest", label: "Harvest", ok: true },
    { k: "transfer", label: "Transfer", ok: lot.status !== "flagged" },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Trace #{lot.publicId}</h1>
        <div className="text-gray-600">{lot.farmName} • {lot.location}</div>
        <div className="flex items-center gap-3">
          <div className="text-gray-500 text-sm">Harvest {new Date(lot.harvestDate).toLocaleDateString()}</div>
          <VerificationBadge status={lot.status} />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Provenance Timeline</h2>
        <div className="grid grid-cols-5 gap-3">
          {steps.map((s) => (
            <div key={s.k} className={`rounded border p-3 text-center ${s.ok ? "bg-white" : "bg-amber-50"}`}>
              <div className="font-medium">{s.label}</div>
              <div className={`text-sm ${s.ok ? "text-emerald-700" : "text-amber-700"}`}>{s.ok ? "Verified" : "Pending"}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Farmer Story</h2>
        <p className="text-gray-700 text-sm">This harvest was grown by a smallholder cooperative using sustainable practices.</p>
      </div>
    </div>
  );
}