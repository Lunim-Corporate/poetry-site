
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEntrantSubmissions } from "@/lib/queries/entrant";

import DashboardGate from "./DashboardGate";
import DashboardSessionProvider from "./DashboardSessionProvider";

import type { EntrantDashboardData } from "@/types/entrant-dashboard";

export const metadata: Metadata = {
  title: "Your dashboard",
  description: "Track your Maya Poetry Book Awards entry.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/account");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/account");
  }

  let entrantData: EntrantDashboardData | null = null;

  if (user.role === "ENTRANT") {
    const submissions = await getEntrantSubmissions(user.id);

    entrantData = {
      name: user.name,
      email: user.email,
      submissions: submissions.map((submission) => ({
        id: submission.id,
        title: submission.title,
        createdAt: submission.createdAt.toISOString(),
        competition: {
          id: submission.competition.id,
          name: submission.competition.name,
        },
        books: submission.books.map((book) => ({
          id: book.id,
          reference: book.reference,
          title: book.title,
          status: book.status,
          qrCodeUrl: book.qrCodeUrl,
          prize: book.prize,
        })),
      })),
    };
  }

  return (
    <DashboardSessionProvider>
      <DashboardGate
        role={user.role}
        entrantData={entrantData}
      />
    </DashboardSessionProvider>
  );
}
