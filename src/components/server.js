"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function getsidebarnotifications() {
  return new Promise(async (resolve, reject) => {
    const user = (await auth()).user;
    let userData = {
      id: await getUserId(),
    };
    //no of matches sent to the user
    await prisma.match
      .findMany({
        where: {
          OR: [
            {
              userId: userData.id,
              status: "Accepted",
            },
            {
              matchedUserId: userData.id,
              status: "Accepted",
            },
          ],
        },
      })
      .then((data) => {
        userData["matches"] = data.length;
      });

    //no of matches received by the user
    await prisma.match
      .findMany({
        where: {
          matchedUserId: userData.id,
          status: "Pending",
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

export async function getUserId() {
  const email = (await auth()).user.email;
  return new Promise(async (resolve, reject) => {
    let userData = {};
    await prisma.user
      .findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
        },
      })
      .then((data) => {
        if (data) {
          userData["id"] = data.id;
        }
      });
    resolve(userData.id);
  });
}

async function approveMatchingRequest(matchId) {
  return new Promise(async (resolve, reject) => {
    try {
      let userid = await getUserId();
      await prisma.match
        .findMany({
          where: {
            OR: [
              {
                AND: {
                  userId: userid,
                  matchedUserId: matchId,
                },
              },
              {
                AND: {
                  userId: matchId,
                  matchedUserId: userid,
                },
              },
            ],
          },
          select: {
            id: true,
          },
        })
        .then(async (data) => {
          if (data) {
            data.forEach(async (possibility) => {
              await prisma.match
                .update({
                  where: {
                    id: possibility.id,
                  },
                  data: {
                    status: "Accepted",
                  },
                })
                .then(() => {
                  resolve(true);
                });
            });
          }
        });
    } catch (error) {
      console.error("Error approving matching request:", error.message);
      reject(error);
    }
  });
}

async function declineMatchingRequest(matchId) {
  return new Promise(async (resolve, reject) => {
    try {
      let userid = await getUserId();
      await prisma.match
        .findMany({
          where: {
            OR: [
              {
                AND: {
                  userId: userid,
                  matchedUserId: matchId,
                },
              },
              {
                AND: {
                  userId: matchId,
                  matchedUserId: userid,
                },
              },
            ],
          },
          select: {
            id: true,
          },
        })
        .then(async (data) => {
          if (data) {
            data.forEach(async (possibility) => {
              await prisma.match
                .update({
                  where: {
                    id: possibility.id,
                  },
                  data: {
                    status: "Declined",
                  },
                })
                .then(() => {
                  resolve(true);
                });
            });
          }
        });
    } catch (error) {
      console.error("Error approving matching request:", error.message);
      reject(error);
    }
  });
}

export async function handleMatchingRequest(matchId, action) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = false;
      console.log("Handling matching request:", matchId, action);
      if (action === "Accepted") {
        result = await approveMatchingRequest(matchId);
      } else if (action === "Declined") {
        result = await declineMatchingRequest(matchId);
      } else {
        console.error("Invalid action:", action);
      }

      resolve(true);
    } catch (error) {
      console.error("Error handling request:", error.message);
      reject(false);
    }
  });
}
