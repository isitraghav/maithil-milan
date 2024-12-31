"use server";
import { prisma } from "@/prisma";

export async function searchMatch({ age, age2, religion, caste }) {
  return new Promise(async (resolve, reject) => {
    const data = await prisma.profile.findMany({
      where: {
        age: {
          gte: age,
          lte: age2,
        },
        caste,
        religion,
      },
    });
    console.log(data);
  });
}
