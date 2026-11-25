
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const competitions = await prisma.competition.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Competitions retrieved successfully",
        data: competitions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching competitions:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve competitions",
      },
      { status: 500 }
    );
  }
}
