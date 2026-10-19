-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ENTRANT', 'SUBJUDGE', 'JUDGE', 'ADMIN');

-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('SUBMITTED', 'RECEIVED', 'SUB_SELECTED', 'SUB_SENT', 'SUB_REJECTED', 'MAIN_RECEIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(50),
    "role" "Role" NOT NULL DEFAULT 'ENTRANT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judge_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(100),
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "judge_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitions" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "entry_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" UUID NOT NULL,
    "competition_id" UUID NOT NULL,
    "entrant_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "cover_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" UUID NOT NULL,
    "submission_id" UUID NOT NULL,
    "prize_id" UUID,
    "reference" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "cover_image_url" TEXT,
    "status" "BookStatus" NOT NULL DEFAULT 'SUBMITTED',
    "qr_code_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judgements" (
    "id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "judge_id" UUID NOT NULL,
    "feedback" TEXT,
    "selected" BOOLEAN,
    "judged_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "judgements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prizes" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "display_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prizes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "judge_profiles_user_id_key" ON "judge_profiles"("user_id");

-- CreateIndex
CREATE INDEX "submissions_competition_id_idx" ON "submissions"("competition_id");

-- CreateIndex
CREATE INDEX "submissions_entrant_id_idx" ON "submissions"("entrant_id");

-- CreateIndex
CREATE UNIQUE INDEX "books_reference_key" ON "books"("reference");

-- CreateIndex
CREATE INDEX "books_submission_id_idx" ON "books"("submission_id");

-- CreateIndex
CREATE INDEX "books_prize_id_idx" ON "books"("prize_id");

-- CreateIndex
CREATE INDEX "judgements_judge_id_idx" ON "judgements"("judge_id");

-- CreateIndex
CREATE UNIQUE INDEX "judgements_book_id_judge_id_key" ON "judgements"("book_id", "judge_id");

-- CreateIndex
CREATE UNIQUE INDEX "prizes_name_key" ON "prizes"("name");

-- AddForeignKey
ALTER TABLE "judge_profiles" ADD CONSTRAINT "judge_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_entrant_id_fkey" FOREIGN KEY ("entrant_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_prize_id_fkey" FOREIGN KEY ("prize_id") REFERENCES "prizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judgements" ADD CONSTRAINT "judgements_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judgements" ADD CONSTRAINT "judgements_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
