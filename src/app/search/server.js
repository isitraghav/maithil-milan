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
  console.log("searching for matches", {
    name,
    age,
    age2,
    religion,
    gotra,
    height,
    maritalStatus,
    page,
    pageSize,
  });
  return new Promise(async (resolve, reject) => {
    const where = {
      age: {
        gte: parseInt(age),
        lte: parseInt(age2),
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

    if (religion !== "Any") {
      where.religion = religion;
    }

    if (gotra !== "Any") {
      where.gotra = { not: gotra };
    }

    if (name !== "" || name !== null || name !== undefined) {
      where.fullName = { contains: name };
    }

    console.log(where);

    const data = await prisma.profile.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    resolve(data || []);
  });
}
