"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function searchMatch({
  name,
  age,
  age2,
  religion = "Any",
  gotra = "Any",
  height = 1,
  maritalStatus = "Unmarried",
  page = 1,
  pageSize = 10,
  motherTongue = "Any",
}) {
  try {
    const where = {
      age: {
        gte: age,
        lte: age2,
      },
      height: {
        gte: height,
      },
      maritalStatus,
    };

    const user = await auth();
    if (user) {
      where.email = { not: user.user.email };
    }

    if (motherTongue !== "Any") {
      where.motherTongue = motherTongue;
    }

    if (gotra !== "Any") {
      where.gotra = { not: gotra };
    }

    // Apply the name filter only if a non-empty string is provided.
    if (name && name.trim() !== "") {
      where.fullName = { contains: name };
    }

    console.log(where);

    const data = await prisma.profile.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return data || [];
  } catch (error) {
    throw error;
  }
}
