import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-4">
      <div>Welcome to Dashboard ✅</div>
      <div className="flex gap-4">
        <Link className="text-blue-600 underline" href="/dashboard/farms">Manage Farms</Link>
        <Link className="text-blue-600 underline" href="/exporter/lots">Exporter Lots</Link>
        <Link className="text-blue-600 underline" href="/trace/demo-ok">Consumer Trace (demo)</Link>
      </div>
    </div>
  );
}
