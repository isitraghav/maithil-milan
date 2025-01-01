"use server";
import { prisma } from "@/prisma";

export async function searchMatch({
  age,
  age2,
  religion,
  caste,
  height,
  maritalStatus,
  page,
  pageSize,
}) {
  return new Promise(async (resolve, reject) => {
    let where = {
      age: {
        gte: age,
        lte: age2,
      },
      height: {
        gte: height,
      },
      maritalStatus,
    };

    if (caste !== "Any") {
      where.caste = caste;
    }

    if (religion !== "Any") {
      where.religion = religion;
    }

    const data = await prisma.profile.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    console.log(data);
    resolve(data);
  });
}

