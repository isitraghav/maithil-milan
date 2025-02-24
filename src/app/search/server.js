"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function searchMatch({
  name,
  age = 1,
  age2 = 99,
  religion = "Any",
  gotra = "Any",
  height = 1,
  maritalStatus = "Unmarried",
  page = 1,
  pageSize = 10,
  motherTongue = "Any",
  gender = "Any",
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

    if (gender !== "Any") {
      where.gender = gender;
    }

    if (motherTongue !== "Any") {
      where.motherTongue = motherTongue;
    }

    if (gotra !== "Any") {
      where.gotra = { not: gotra };
    }

    // Apply the name filter only if a non-empty string is provided.
    if (name && name.trim() !== "") {
      where.OR = name
        .split(" ")
        .map((word) => ({ fullName: { contains: word } }));
    }

    console.log(where);

    const data = await prisma.profile.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    console.log(data);

    return data || [];
  } catch (error) {
    throw error;
  }
}
