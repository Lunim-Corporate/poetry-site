import type { Metadata } from "next";
import AccountAuthPanel from "./AccountAuthPanel";

export const metadata: Metadata = {
  title: "My Account",
  description: "Log in or create an account to track your Maya Poetry Book Awards entry.",
};

export default function AccountPage() {
  return (
    <section className="py-12 md:py-16 font-sans">
      <div className="max-w-md mx-auto px-6">
        <AccountAuthPanel />
      </div>
    </section>
  );
}
