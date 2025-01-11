"use server";

import { getUserId } from "@/components/server";

const { auth } = require("@/auth");
const { prisma } = require("@/prisma");

export async function getreceivedmatches() {
  return new Promise(async (resolve, reject) => {
    let userData = {
      id: await getUserId(),
    };

    await prisma.match
      .findMany({
        where: {
          matchedUserId: userData.id,
          status: "Pending",
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
        console.log("Received matches:", data);
        userData["matches"] = data;
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
