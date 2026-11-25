"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupWithMockCredentials } from "@/lib/mockAuth";

type CreateAccountFormProps = {
  email: string;
  /** Optional reference from the success page; falls back to a demo-shaped value. */
  entryReference?: string;
};

export default function CreateAccountForm({
  email,
  entryReference = "MAYA-2026-A1B2C3D4",
}: CreateAccountFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Please choose a password with at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      // PROTOTYPE-ONLY: mock auth — see src/lib/mockAuth.ts
      await new Promise((resolve) => setTimeout(resolve, 250));
      const result = signupWithMockCredentials(email, password, entryReference);
      if (!result.ok) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong creating your account. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-10 p-5 md:p-6 border-2 border-dashed border-slate-400/60 rounded-lg bg-white">
      <h3 className="text-lg font-semibold text-slate-900 mb-1">
        Create your account
      </h3>
      <p className="text-base text-slate-500 mb-4">
        Create a password to track your entry status, judge progress and results.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="account-email" className="block text-base font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            id="account-email"
            type="email"
            value={email}
            readOnly
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-base text-slate-700 cursor-default"
          />
        </div>

        <div>
          <label htmlFor="account-password" className="block text-base font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="account-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Choose a password"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#23100A]/20 focus:border-[#23100A]"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !email}
          className="w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] disabled:opacity-60 disabled:cursor-not-allowed text-[#23100A] font-bold py-3 px-4 rounded-lg text-base transition-colors"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link
          href="/"
          className="text-sm text-slate-500 underline hover:text-slate-700"
        >
          Skip for now — I&apos;ll set this up later
        </Link>
      </div>
    </div>
  );
}
