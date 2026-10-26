
import "server-only";

import { prisma } from "@/lib/prisma";

export async function getEntrantSubmissions(entrantId: string) {
  return prisma.submission.findMany({
    where: {
      entrantId,
    },
    include: {
      competition: {
        select: {
          id: true,
          name: true,
        },
      },
      books: {
        select: {
          id: true,
          reference: true,
          title: true,
          status: true,
          qrCodeUrl: true,
          createdAt: true,
          prize: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
