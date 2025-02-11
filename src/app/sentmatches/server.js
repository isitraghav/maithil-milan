"use server";

import { getUserId } from "@/components/server";

const { auth } = require("@/auth");
const { prisma } = require("@/prisma");

export async function getsentmatches() {
  return new Promise(async (resolve, reject) => {
    let userData = {
      id: await getUserId(),
    };

    await prisma.match
      .findMany({
        where: {
          userId: userData.id,
          status: "Pending",
        },
        include: {
          matchedUser: {
            include: {
              profile: true,
            },
          },
        },
      })
      .then(async (data) => {
        console.log("Sent matches:", data);
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

export async function deleteRequest(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const record = await prisma.match.findUnique({
        where: {
          id: id,
        },
      });
      if (!record) {
        console.error("Record not found:", id);
        resolve(false);
        return;
      }
      await prisma.match.delete({
        where: {
          id: id,
        },
      });
      resolve(true);
    } catch (error) {
      console.error("Error deleting request:", error.message);
      resolve(false);
    }
  });
}
