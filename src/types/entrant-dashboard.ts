
import type { BookStatus } from "@prisma/client";

export type EntrantDashboardBook = {
  id: string;
  reference: string;
  title: string;
  status: BookStatus;
  qrCodeUrl: string | null;
  prize: {
    id: string;
    name: string;
  } | null;
};

export type EntrantDashboardSubmission = {
  id: string;
  title: string;
  createdAt: string;
  competition: {
    id: string;
    name: string;
  };
  books: EntrantDashboardBook[];
};

export type EntrantDashboardData = {
  name: string;
  email: string;
  submissions: EntrantDashboardSubmission[];
};
