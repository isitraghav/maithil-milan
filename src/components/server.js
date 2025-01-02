"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function getsidebarnotifications() {
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
    //no of matches sent to the user
    await prisma.match
      .findMany({
        where: {
          matchedUserId: userData.id,
          status: "Pending",
        },
      })
      .then((data) => {
        userData["matches"] = data.length;
      });

    //no of matches received by the user
    await prisma.match
      .findMany({
        where: {
          userId: userData.id,
        },
      })
      .then((data) => {
        userData["recievedMathes"] = data.length;
      });

    await prisma.profile
      .count({
        where: {
          email: user.email,
        },
      })
      .then((data) => {
        userData["profile"] = data;
      });
    resolve(userData);
  });
}
