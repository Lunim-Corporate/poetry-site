"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MOCK_APPLICANT_ENTRY,
  clearMockSession,
  getMockSession,
  roleDashboardLabel,
  type MockSession,
} from "@/lib/mockAuth";
import ApplicantDashboard from "./ApplicantDashboard";
import SubJudgeDashboard from "./SubJudgeDashboard";
import HeadJudgeDashboard from "./HeadJudgeDashboard";
import DashboardHeaderActions from "@/components/DashboardHeaderActions";

type LoadState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "ready"; session: MockSession };

export default function DashboardGate() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  /** Bumped after Reset demo data so role dashboards remount from seed state. */
  const [demoEpoch, setDemoEpoch] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // Brief delay so the loading/skeleton state is visible during prototype demos
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      const session = getMockSession();
      if (!session) {
        setState({ status: "unauthenticated" });
        return;
      }
      // Legacy organiser sessions are no longer supported
      if ((session.role as string) === "organiser") {
        clearMockSession();
        setState({ status: "unauthenticated" });
        return;
      }
      setState({ status: "ready", session });
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (state.status === "unauthenticated") {
      router.replace("/account");
    }
  }, [state, router]);

  function handleSignOut() {
    clearMockSession();
    router.push("/account");
  }

  function handleDemoDataReset() {
    setDemoEpoch((n) => n + 1);
  }

  if (state.status === "loading" || state.status === "unauthenticated") {
    return <DashboardSkeleton />;
  }

  const { session } = state;

  if (session.role === "applicant") {
    const entry =
      session.email.toLowerCase() === MOCK_APPLICANT_ENTRY.email.toLowerCase()
        ? MOCK_APPLICANT_ENTRY
        : {
            ...MOCK_APPLICANT_ENTRY,
            name: session.name,
            email: session.email,
            books: MOCK_APPLICANT_ENTRY.books,
          };

    return (
      <section className="py-10 md:py-12 font-sans">
        <div className="max-w-2xl mx-auto px-6">
          <ApplicantDashboard
            key={demoEpoch}
            entry={entry}
            onSignOut={handleSignOut}
            onDemoDataReset={handleDemoDataReset}
          />
        </div>
      </section>
    );
  }

  if (session.role === "sub_judge") {
    return (
      <section className="py-10 md:py-12 font-sans">
        <div className="max-w-5xl mx-auto px-6">
          <SubJudgeDashboard
            key={demoEpoch}
            judgeName={session.name}
            judgeEmail={session.email}
            onSignOut={handleSignOut}
            onDemoDataReset={handleDemoDataReset}
          />
        </div>
      </section>
    );
  }

  if (session.role === "head_judge") {
    return (
      <section className="py-10 md:py-12 font-sans">
        <div className="max-w-6xl mx-auto px-6">
          <HeadJudgeDashboard
            key={demoEpoch}
            judgeName={session.name}
            judgeEmail={session.email}
            onSignOut={handleSignOut}
            onDemoDataReset={handleDemoDataReset}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 font-sans">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white border-2 border-dashed border-slate-400/60 rounded-lg p-6 md:p-8">
          <p className="text-sm font-medium text-slate-500 mb-2">
            Signed in as {session.email}
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            {roleDashboardLabel(session.role)} dashboard — coming soon
          </h1>
          <p className="text-base text-slate-600 mb-6 leading-relaxed">
            This role&apos;s workspace will be designed next. You can sign out and try
            another prototype account from the account page.
          </p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center text-base text-slate-500 underline hover:text-slate-700"
            >
              Return to home page
            </Link>
            <DashboardHeaderActions
              role={session.role}
              onSignOut={handleSignOut}
              onDemoDataReset={handleDemoDataReset}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <section className="py-10 md:py-12 font-sans" aria-busy="true" aria-live="polite">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <span
            className="h-5 w-5 rounded-full border-2 border-[#23100A] border-t-transparent animate-spin"
            aria-hidden
          />
          <span className="text-base text-slate-500">Loading your dashboard…</span>
        </div>
        <div className="space-y-6">
          <div className="h-8 w-48 rounded-lg bg-slate-200/80 animate-pulse" />
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
            <div className="h-5 w-40 rounded bg-slate-200/80 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
            <div className="h-5 w-24 rounded bg-slate-200/80 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
