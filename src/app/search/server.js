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
        include: {
          profile: true,
        },
      })
      .then(async (res) => {
        console.log("res", res);
        if (res == null) {
          resolve(2);
          return;
        }
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
        };

        if (caste !== "Any") {
          where.caste = caste;
        }

        if (religion !== "Any") {
          where.religion = religion;
        }

        if (res.profile.gender == "Female") {
          where["gender"] = "Male";
        } else {
          where["gender"] = "Female";
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
