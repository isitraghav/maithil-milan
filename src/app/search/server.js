"use server";
import { auth } from "@/auth";
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
  let userEmail = (await auth()).user.email;
  return new Promise(async (resolve, reject) => {
    await prisma.user
      .findUnique({
        where: {
          email: userEmail,
        },
      })
      .then(async (res) => {
        let where = {
          NOT: {
            email: userEmail,
          },
          age: {
            gte: age,
            lte: age2,
          },
          height: {
            gte: height,
          },
          maritalStatus,
          gender: "Female",
        };

        if (caste !== "Any") {
          where.caste = caste;
        }

        if (religion !== "Any") {
          where.religion = religion;
        }

        if (res.gender === "Female") {
          where.gender = "Male";
        } else {
          where.gender = "Female";
        }

        console.log(where);

        const data = await prisma.profile.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
        });
        console.log(data);
        resolve(data);
      });
  });
}
