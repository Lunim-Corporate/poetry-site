
import { prisma } from "@/lib/prisma";
import { syncVerifiedPaidEntry } from "@/lib/googleSheets";
import {
  sendEntrantConfirmation,
  sendAdminNotification,
  type EmailEntry,
} from "@/lib/email";

export async function processPaymentFulfillment(
  checkoutId: string
) {
  const fulfillment = await prisma.paymentFulfillment.findUnique({
    where: {
      checkoutId,
    },
    include: {
      checkout: {
        include: {
          user: true,
          submission: {
            include: {
              books: true,
            },
          },
        },
      },
    },
  });

  if (!fulfillment) {
    throw new Error(
      `Payment fulfillment not found for checkout ${checkoutId}`
    );
  }

  const checkout = fulfillment.checkout;

  if (
    checkout.status !== "PAID" ||
    !checkout.submission ||
    checkout.submission.books.length === 0
  ) {
    throw new Error(
      "Checkout has not completed payment registration."
    );
  }

  const bookTitles = checkout.submission.books.map(
    (book) => book.title
  );

  const bookCount = bookTitles.length;

  const totalGBP = checkout.expectedAmountPence / 100;

  return {
    checkoutId,
    paymentIntentId: checkout.stripePaymentIntentId,
    entrantName: checkout.user.name,
    entrantEmail: checkout.user.email,
    entryToken: checkout.entryToken,
    bookTitles,
    bookCount,
    totalGBP,
    sheetsSyncedAt: fulfillment.sheetsSyncedAt,
    entrantEmailedAt: fulfillment.entrantEmailedAt,
    adminEmailedAt: fulfillment.adminEmailedAt,
  };
}




export async function syncPaymentToGoogleSheets(
  checkoutId: string
) {
  const fulfillment = await prisma.paymentFulfillment.findUnique({
    where: { checkoutId },
    include: {
      checkout: {
        include: {
          user: true,
          submission: {
            include: {
              books: true,
            },
          },
        },
      },
    },
  });

  if (!fulfillment) {
    throw new Error("Payment fulfillment record not found.");
  }

  const { checkout } = fulfillment;

  if (
    checkout.status !== "PAID" ||
    !checkout.stripePaymentIntentId ||
    !checkout.submission ||
    checkout.submission.books.length === 0
  ) {
    throw new Error(
      "Payment registration is incomplete."
    );
  }

  if (
    fulfillment.sheetsStatus === "COMPLETED" ||
    fulfillment.sheetsSyncedAt
  ) {
    return {
      alreadySynced: true,
      sheetRowUrl: fulfillment.sheetRowUrl,
    };
  }

  // Atomically claim this synchronization task.
  const claim = await prisma.paymentFulfillment.updateMany({
    where: {
      checkoutId,
      sheetsStatus: "PENDING",
      sheetsSyncedAt: null,
    },
    data: {
      sheetsStatus: "PROCESSING",
      sheetsClaimedAt: new Date(),
    },
  });

  if (claim.count === 0) {
    return {
      alreadySynced: false,
      alreadyProcessing: true,
    };
  }

  const books = checkout.submission.books;

  try {
    const sheetRowUrl = await syncVerifiedPaidEntry({
      reference: books[0].reference,
      token: checkout.entryToken,
      name: checkout.user.name,
      email: checkout.user.email,
      phone: checkout.user.phoneNumber ?? "",
      quantity: books.length,
      bookTitles: books.map((book) => book.title),
      priceGBP: checkout.expectedAmountPence / 100,
      paymentId: checkout.stripePaymentIntentId,
      rulesConfirmed: true,
      createdAt: checkout.createdAt.toISOString(),
      paidAt: new Date().toISOString(),
    });

    await prisma.paymentFulfillment.update({
      where: { checkoutId },
      data: {
        sheetsStatus: "COMPLETED",
        sheetsSyncedAt: new Date(),
        sheetsClaimedAt: null,
        sheetRowUrl,
        lastError: null,
      },
    });

    return {
      alreadySynced: false,
      sheetRowUrl,
    };
 
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown Google Sheets synchronization error.";

    try {
      await prisma.paymentFulfillment.updateMany({
        where: {
          checkoutId,
          sheetsStatus: "PROCESSING",
          sheetsSyncedAt: null,
        },
        data: {
          sheetsStatus: "PENDING",
          sheetsClaimedAt: null,
          lastError: message,
        },
      });
    } catch (databaseError) {
      console.error(
        "Failed to record Google Sheets synchronization error:",
        databaseError
      );
    }

    throw error;
  }

}


export async function sendPaymentConfirmationEmails(
  checkoutId: string,
  emailEntry: EmailEntry
) {
  const fulfillment =
    await prisma.paymentFulfillment.findUnique({
      where: { checkoutId },
      include: {
        checkout: true,
      },
    });

  if (!fulfillment) {
    throw new Error("Payment fulfillment record not found.");
  }

  if (
    fulfillment.checkout.status !== "PAID" ||
    fulfillment.checkout.stripePaymentIntentId !==
      emailEntry.paymentId
  ) {
    throw new Error("Payment registration is incomplete or mismatched.");
  }

  const errors: string[] = [];

  let entrantEmailed = Boolean(
    fulfillment.entrantEmailedAt
  );

  let adminEmailed = Boolean(
    fulfillment.adminEmailedAt
  );

  // Send entrant confirmation if not previously recorded.
  if (!entrantEmailed) {
    try {
      await sendEntrantConfirmation(emailEntry);

      await prisma.paymentFulfillment.update({
        where: { checkoutId },
        data: {
          entrantEmailedAt: new Date(),
        },
      });

      entrantEmailed = true;
    } catch (error) {
      errors.push(
        "Entrant email: " +
          (error instanceof Error
            ? error.message
            : "Unknown error")
      );
    }
  }

  // Send administrator notification independently.
  if (!adminEmailed) {
    try {
      await sendAdminNotification(emailEntry);

      await prisma.paymentFulfillment.update({
        where: { checkoutId },
        data: {
          adminEmailedAt: new Date(),
        },
      });

      adminEmailed = true;
    } catch (error) {
      errors.push(
        "Admin email: " +
          (error instanceof Error
            ? error.message
            : "Unknown error")
      );
    }
  }
  if (errors.length > 0) {
    await prisma.paymentFulfillment.update({
      where: { checkoutId },
      data: {
        lastError: errors.join("; "),
      },
    });
  } else if (entrantEmailed && adminEmailed) {
    await prisma.paymentFulfillment.updateMany({
      where: {
        checkoutId,
        sheetsStatus: "COMPLETED",
        OR: [
          {
            lastError: {
              startsWith: "Entrant email:",
            },
          },
          {
            lastError: {
              startsWith: "Admin email:",
            },
          },
        ],
      },
      data: {
        lastError: null,
      },
    });
  }

  return {
    entrantEmailed,
    adminEmailed,
    errors,
  };

}