
import { prisma } from "@/lib/prisma";
import { syncVerifiedPaidEntry } from "@/lib/googleSheets";

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
        },
        data: {
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
