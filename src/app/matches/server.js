"use server";

import { getUserId } from "@/components/server";

const { auth } = require("@/auth");
const { prisma } = require("@/prisma");

export async function getAcceptedMatches() {
  return new Promise(async (resolve, reject) => {
    let userData = {
      id: await getUserId(),
    };

    //Accepted matches
    await prisma.match
      .findMany({
        where: {
          status: "Accepted",
          OR: [{ userId: userData.id }, { matchedUserId: userData.id }],
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
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

export async function getMatchInfo(id) {
  return new Promise(async (resolve, reject) => {
    await prisma.user
      .findUnique({
        where: {
          id: id,
        },
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("Error fetching matches:", error.message);
      });
  });
}
