// "use client";

// import { useState, type FormEvent } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   loginWithMockCredentials,
//   signupWithMockCredentials,
// } from "@/lib/mockAuth";

// type Tab = "login" | "signup";

// const inputClassName =
//   "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#23100A]/20 focus:border-[#23100A]";

// const primaryButtonClassName =
//   "w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] disabled:opacity-60 disabled:cursor-not-allowed text-[#23100A] font-bold py-3 px-4 rounded-lg text-base transition-colors";

// export default function AccountAuthPanel() {
//   const router = useRouter();
//   const [tab, setTab] = useState<Tab>("login");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [entryReference, setEntryReference] = useState("");
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   function switchTab(next: Tab) {
//     setTab(next);
//     setError("");
//     setPassword("");
//     setEntryReference("");
//   }

//   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError("");

//     if (!email.trim() || !password) {
//       setError(
//         tab === "login"
//           ? "Please enter your email and password."
//           : "Please fill in all required fields."
//       );
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // PROTOTYPE-ONLY: mock auth — see src/lib/mockAuth.ts
//       await new Promise((resolve) => setTimeout(resolve, 250));

//       const result =
//         tab === "login"
//           ? loginWithMockCredentials(email, password)
//           : signupWithMockCredentials(email, password, entryReference);

//       if (!result.ok) {
//         setError(result.error);
//         setSubmitting(false);
//         return;
//       }

//       router.push("/dashboard");
//     } catch {
//       setError(
//         tab === "login"
//           ? "Incorrect email or password. Please try again."
//           : "We couldn’t create your account. Please check your details and try again."
//       );
//       setSubmitting(false);
//     }
//   }

//   return (
//     <div className="bg-white border-2 border-dashed border-slate-400/60 rounded-lg p-5 md:p-8 shadow-sm">
//       <div
//         className="flex rounded-lg border border-slate-200 p-1 mb-6 bg-slate-50"
//         role="tablist"
//         aria-label="Account"
//       >
//         <button
//           type="button"
//           role="tab"
//           aria-selected={tab === "login"}
//           onClick={() => switchTab("login")}
//           className={`flex-1 rounded-md px-4 py-2.5 text-base font-semibold transition-colors ${
//             tab === "login"
//               ? "bg-white text-slate-900 shadow-sm border border-slate-200"
//               : "text-slate-500 hover:text-slate-700 border border-transparent"
//           }`}
//         >
//           Log in
//         </button>
//         <button
//           type="button"
//           role="tab"
//           aria-selected={tab === "signup"}
//           onClick={() => switchTab("signup")}
//           className={`flex-1 rounded-md px-4 py-2.5 text-base font-semibold transition-colors ${
//             tab === "signup"
//               ? "bg-white text-slate-900 shadow-sm border border-slate-200"
//               : "text-slate-500 hover:text-slate-700 border border-transparent"
//           }`}
//         >
//           Sign up
//         </button>
//       </div>

//       <h1 className="text-xl font-semibold text-slate-900 mb-1">
//         {tab === "login" ? "Log in to your account" : "Create your account"}
//       </h1>
//       <p className="text-base text-slate-500 mb-5">
//         {tab === "login"
//           ? "Track your entry status, judge progress and results."
//           : "Link your paid entry so you can track progress and results."}
//       </p>

//       {error && (
//         <div
//           className="mb-4 rounded-lg border-2 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-800"
//           role="alert"
//         >
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4" noValidate>
//         <div>
//           <label htmlFor="auth-email" className="block text-base font-medium text-slate-700 mb-1">
//             Email
//           </label>
//           <input
//             id="auth-email"
//             type="text"
//             inputMode="email"
//             autoComplete="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className={inputClassName}
//             placeholder="you@example.com"
//           />
//         </div>

//         <div>
//           <label htmlFor="auth-password" className="block text-base font-medium text-slate-700 mb-1">
//             Password
//           </label>
//           <input
//             id="auth-password"
//             type="password"
//             autoComplete={tab === "login" ? "current-password" : "new-password"}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className={inputClassName}
//             placeholder={tab === "login" ? "Your password" : "Choose a password"}
//           />
//         </div>

//         {tab === "signup" && (
//           <div>
//             <label
//               htmlFor="auth-entry-reference"
//               className="block text-base font-medium text-slate-700 mb-1"
//             >
//               Entry reference number
//             </label>
//             <input
//               id="auth-entry-reference"
//               type="text"
//               value={entryReference}
//               onChange={(e) => setEntryReference(e.target.value)}
//               required
//               className={inputClassName}
//               placeholder="MAYA-2026-XXXXXXXX"
//               autoComplete="off"
//             />
//             <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
//               You&apos;ll find this on your entry confirmation page or email, e.g.
//               MAYA-2026-XXXXXXX
//             </p>
//           </div>
//         )}

//         <button type="submit" disabled={submitting} className={primaryButtonClassName}>
//           {submitting
//             ? tab === "login"
//               ? "Logging in…"
//               : "Creating account…"
//             : tab === "login"
//               ? "Log in"
//               : "Create account"}
//         </button>
//       </form>

//       {tab === "login" && (
//         <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3">
//           <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
//             Prototype logins
//           </p>
//           <ul className="space-y-1 text-xs text-slate-500 leading-relaxed">
//             <li>
//               <span className="font-medium text-slate-600">Applicant</span> —{" "}
//               applicant@demo.maya / Demo1234
//             </li>
//             <li>
//               <span className="font-medium text-slate-600">Sub-judge</span> —{" "}
//               subjudge@demo.maya / Demo1234
//             </li>
//             <li>
//               <span className="font-medium text-slate-600">Head judge</span> —{" "}
//               headjudge@demo.maya / Demo1234
//             </li>
//           </ul>
//         </div>
//       )}

//       {tab === "login" && (
//         <div className="mt-4 text-center">
//           {/* TODO: wire forgot-password flow */}
//           <Link
//             href="/account"
//             className="text-sm text-slate-500 underline hover:text-slate-700"
//           >
//             Forgot password?
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }






"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Tab = "login" | "signup";

type RegisterResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

const inputClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#23100A]/20 focus:border-[#23100A]";

const primaryButtonClassName =
  "w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] disabled:opacity-60 disabled:cursor-not-allowed text-[#23100A] font-bold py-3 px-4 rounded-lg text-base transition-colors";

export default function AccountAuthPanel() {
  const [tab, setTab] = useState<Tab>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [entryReference, setEntryReference] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  function switchTab(next: Tab) {
    setTab(next);
    setError("");
    setSuccess("");
    setPassword("");
    setName("");
    setEntryReference("");
  }


  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (tab === "signup" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setSubmitting(true);

    try {
      if (tab === "login") {
        const result = await signIn("credentials", {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
        });
        console.log("Login result:", result);
        if (!result || result.error) {
          setError("Incorrect email or password. Please try again.");
          return;
        }

        router.push("/dashboard");
        router.refresh();
        return;
      }

      // Registration
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const firstError = result.errors
          ? Object.values(result.errors)
              .flat()
              .find((message) => typeof message === "string")
          : null;

        setError(
          typeof firstError === "string"
            ? firstError
            : result.message || "Unable to create your account."
        );
        return;
      }

      setTab("login");
      setPassword("");
      setName("");
      setEntryReference("");

      setSuccess(
        "Account created successfully. You can now log in."
      );
    } catch (error) {
      console.error("Authentication error:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="bg-white border-2 border-dashed border-slate-400/60 rounded-lg p-5 md:p-8 shadow-sm">
      {/* Login / Signup tabs */}
      <div
        className="flex rounded-lg border border-slate-200 p-1 mb-6 bg-slate-50"
        role="tablist"
        aria-label="Account"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "login"}
          onClick={() => switchTab("login")}
          className={`flex-1 rounded-md px-4 py-2.5 text-base font-semibold transition-colors ${
            tab === "login"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-700 border border-transparent"
          }`}
        >
          Log in
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === "signup"}
          onClick={() => switchTab("signup")}
          className={`flex-1 rounded-md px-4 py-2.5 text-base font-semibold transition-colors ${
            tab === "signup"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-700 border border-transparent"
          }`}
        >
          Sign up
        </button>
      </div>

      {/* Heading */}
      <h1 className="text-xl font-semibold text-slate-900 mb-1">
        {tab === "login"
          ? "Log in to your account"
          : "Create your account"}
      </h1>

      <p className="text-base text-slate-500 mb-5">
        {tab === "login"
          ? "Track your entry status, judge progress and results."
          : "Create your Maya account to manage your competition entries."}
      </p>

      {/* Error message */}
      {error && (
        <div
          className="mb-4 rounded-lg border-2 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div
          className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800"
          role="status"
        >
          {success}
        </div>
      )}

      {/* Authentication form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full name — signup only */}
        {tab === "signup" && (
          <div>
            <label
              htmlFor="auth-name"
              className="block text-base font-medium text-slate-700 mb-1"
            >
              Full name <span className="text-red-500">*</span>
            </label>

            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              minLength={2}
              maxLength={255}
              className={inputClassName}
              placeholder="Enter your full name"
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label
            htmlFor="auth-email"
            className="block text-base font-medium text-slate-700 mb-1"
          >
            Email <span className="text-red-500">*</span>
          </label>

          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClassName}
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="auth-password"
            className="block text-base font-medium text-slate-700 mb-1"
          >
            Password <span className="text-red-500">*</span>
          </label>

          <input
            id="auth-password"
            type="password"
            autoComplete={
              tab === "login" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={tab === "signup" ? 12 : undefined}
            className={inputClassName}
            placeholder={
              tab === "login"
                ? "Your password"
                : "Choose a password (minimum 12 characters)"
            }
          />

          {tab === "signup" && (
            <p className="mt-1.5 text-sm text-slate-500">
              Use at least 12 characters.
            </p>
          )}
        </div>

        {/* Optional entry reference — signup only */}
        {tab === "signup" && (
          <div>
            <label
              htmlFor="auth-entry-reference"
              className="block text-base font-medium text-slate-700 mb-1"
            >
              Entry reference number{" "}
              <span className="text-slate-400 font-normal">
                (optional)
              </span>
            </label>

            <input
              id="auth-entry-reference"
              type="text"
              value={entryReference}
              onChange={(e) => setEntryReference(e.target.value)}
              className={inputClassName}
              placeholder="MAYA-2026-XXXXXXXX"
              autoComplete="off"
            />

            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
              If you already have a competition entry reference, you can
              enter it here. Entry linking is not yet available, so this
              reference will not be saved.
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className={primaryButtonClassName}
        >
          {submitting
            ? tab === "login"
              ? "Logging in…"
              : "Creating account…"
            : tab === "login"
              ? "Log in"
              : "Create account"
          }
        </button>
      </form>

      {/* Forgot password */}
      {tab === "login" && (
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-500">
            Password recovery will be available soon.
          </p>
        </div>
      )}

      {/* Switch between login and signup */}
      <div className="mt-6 text-center text-sm text-slate-600">
        {tab === "login" ? (
          <p>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => switchTab("signup")}
              className="font-semibold text-[#23100A] underline"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchTab("login")}
              className="font-semibold text-[#23100A] underline"
            >
              Log in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}