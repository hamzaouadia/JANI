"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_USER_URL || "http://localhost:5000";

type HistoryEntry = { at: string; note?: string; change?: Record<string, unknown>; byUserId: string };
type Farm = { _id: string; name: string; status?: string; location?: string; notes?: string; history?: HistoryEntry[] };

export default function FarmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const [farm, setFarm] = useState<Farm | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function load() {
    if (!token || !id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/farms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch farm");
      const data: Farm = await res.json();
      setFarm(data);
      setStatus(data.status || "");
      setNotes(data.notes || "");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/farms/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes, note: "Status/notes updated" }),
      });
      if (!res.ok) throw new Error("Failed to save");
      await load();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) return <div className="p-6">Please login first.</div>;
  if (!id) return <div className="p-6">Invalid farm id.</div>;

  return (
    <div className="p-6 space-y-6">
      <button className="text-sm text-blue-600 underline" onClick={() => router.back()}>
        ← Back
      </button>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {farm && (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">{farm.name}</h1>
          <div className="text-gray-600">Location: {farm.location || "—"}</div>
          <form onSubmit={save} className="space-y-3 max-w-md">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Status</label>
              <input
                className="border rounded px-2 py-1"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="e.g., active, maintenance, harvesting"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Notes</label>
              <textarea
                className="border rounded px-2 py-1"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any updates, observations, or tasks..."
              />
            </div>
            <button
              className="bg-emerald-600 text-white px-3 py-1 rounded disabled:opacity-50"
              disabled={loading}
            >
              Save
            </button>
          </form>
          <div>
            <h2 className="text-lg font-medium mt-6 mb-2">Recent Updates</h2>
            <ul className="space-y-2">
              {(farm.history || []).slice().reverse().slice(0, 10).map((h: HistoryEntry, i: number) => (
                <li key={i} className="text-sm text-gray-700">
                  <span className="text-gray-500">{new Date(h.at).toLocaleString()}:</span> {h.note || JSON.stringify(h.change)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}