"use server";

const { auth } = require("@/auth");
const { prisma } = require("@/prisma");

export async function getUserMatches() {
  return new Promise(async (resolve, reject) => {
    const user = (await auth()).user;
    let userData = {};
    await prisma.user
      .findUnique({
        where: {
          email: user.email,
        },
        select: {
          id: true,
        },
      })
      .then((data) => {
        userData["id"] = data.id;
      });
    //Accepted matches
    await prisma.match
      .findMany({
        where: {
          status: "Accepted",
          OR: [{ userId: userData.id }, { matchedUserId: userData.id }],
        },
      })
      .then(async (data) => {
        userData["matches"] = data;
      })
      .catch((error) => {
        console.error("Error fetching matches:", error.message);
      })
      .finally(() => {
        resolve(userData);
      });
  });
}
