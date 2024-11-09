-- CreateEnum
CREATE TYPE "Class" AS ENUM ('Participant', 'Admin', 'Onspot');

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "class" "Class" NOT NULL,
    "event" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subevent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Subevent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subevent" ADD CONSTRAINT "Subevent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
