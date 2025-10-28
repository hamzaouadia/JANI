"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("farm");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  interface LoginResponse {
    user: {
      id: string;
      email: string;
      role: string;
    };
    message: string;
  }

  const roleLabels: Record<string, string> = {
    admin: "Admin ID",
    farm: "Registration ID",
    exporter: "Export License",
    buyer: "Buyer Code",
    logistics: "Fleet Code"
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, identifier }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Invalid credentials");
      }

      const data: LoginResponse = await res.json();
      
      // Token is now set as httpOnly cookie by the API route
      console.log("Login successful:", data.user);
      
      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/guest");
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Guest login failed");
      }
    } catch {
      setError("Guest login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">Login to JANI</h2>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isLoading}
          >
            <option value="admin">Administrator</option>
            <option value="farm">Farm Owner</option>
            <option value="exporter">Exporter</option>
            <option value="buyer">Buyer</option>
            <option value="logistics">Logistics</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {roleLabels[role]}
          </label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={`Enter your ${roleLabels[role]}`}
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          className="mt-4 w-full rounded bg-gray-600 py-2 text-white hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          onClick={handleGuestLogin}
          disabled={isLoading}
        >
          Continue as Guest
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
