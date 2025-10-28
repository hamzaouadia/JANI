"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_USER_URL || "http://localhost:5000";

type HistoryEntry = { at: string; note?: string; change?: Record<string, unknown>; byUserId: string };
type Farm = { _id: string; name: string; identifier?: string; status?: string; location?: string; notes?: string; history?: HistoryEntry[] };

type SearchResult = { _id: string; name: string; identifier: string; status?: string; updatedAt?: string };

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function loadAccessible() {
    if (!token) return;
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/farms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch farms");
      const data: Farm[] = await res.json();
      setFarms(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error";
      setError(message);
    }
  }

  useEffect(() => {
    loadAccessible();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/farms/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Search failed");
      const data: SearchResult[] = await res.json();
      setResults(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function onLink(identifier: string) {
    if (!token) return;
    const accessCode = window.prompt("Enter farm access code (password)") || "";
    if (!accessCode) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/farms/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ identifier, accessCode }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to link farm");
      }
      setQuery("");
      setResults([]);
      await loadAccessible();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="p-6">
        <p>Please login first.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Farms</h1>

      <form onSubmit={onSearch} className="flex items-center gap-2">
        <input
          className="border rounded px-2 py-1"
          placeholder="Search by farm identifier"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button
          className="bg-emerald-600 text-white px-3 py-1 rounded disabled:opacity-50"
          disabled={loading}
        >
          Search
        </button>
      </form>

      {error && <div className="text-red-600">{error}</div>}

      {loading && <div>Loading...</div>}

      {results.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Search Results</h2>
          <ul className="space-y-2">
            {results.map((r) => (
              <li key={r._id} className="border rounded p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-sm text-gray-500">Identifier: {r.identifier}</div>
                </div>
                <button className="text-blue-600 underline" onClick={() => onLink(r.identifier)}>Link</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Accessible Farms</h2>
        <ul className="space-y-2">
          {farms.map((f) => (
            <li key={f._id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{f.name}</div>
                <div className="text-sm text-gray-500">Status: {f.status || "n/a"}</div>
              </div>
              <Link className="text-blue-600 underline" href={`/dashboard/farms/${f._id}`}>Open</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
