import type { Metadata } from "next";
import DashboardGate from "./DashboardGate";

export const metadata: Metadata = {
  title: "Your dashboard",
  description: "Track your Maya Poetry Book Awards entry.",
};

export default function DashboardPage() {
  return <DashboardGate />;
}
