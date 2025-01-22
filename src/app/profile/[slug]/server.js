"use server";
import { auth } from "@/auth";
import { getUserId } from "@/components/server";
import { prisma } from "@/prisma";

export async function getUserProfile(userid) {
  console.log("Fetching user profile:", userid);
  return new Promise(async (resolve, reject) => {
    await prisma.user
      .findUnique({
        where: {
          id: userid,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })
      .then(async (data) => {
        await prisma.profile
          .findUnique({
            where: {
              email: data.email,
            },
          })
          .then(async (data) => {
            let userid = await getUserId();
            await prisma.match
              .findMany({
                where: {
                  OR: [
                    {
                      AND: {
                        userId: userid,
                        matchedUserId: data.id,
                      },
                    },
                    {
                      AND: {
                        userId: data.id,
                        matchedUserId: userid,
                      },
                    },
                  ],
                },
              })
              .then((data_) => {
                console.log("User matches fetched:", data_);
                data["matches"] = data_[0];
                resolve(data);
              });
          })
          .catch((error) => {
            console.error("Error fetching user profile:", error.message);
            reject(error);
          });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error.message);
        reject(error);
      });
  });
}

export async function sendMatchingRequest(receiverId) {
  console.log("Sending matching request to ", receiverId);
  return new Promise(async (resolve, reject) => {
    await getUserId().then(async (data) => {
      if (data === receiverId) {
        console.log("Cannot send matching request to yourself");
        resolve(3);
        return;
      }
      console.log("userid", data);
      console.log("receiverId", receiverId);

      const existingRequest = await prisma.match.findFirst({
        where: {
          OR: [
            {
              userId: data,
              matchedUserId: receiverId,
            },
            {
              userId: receiverId,
              matchedUserId: data,
            },
          ],
        },
      });

      console.log("existingRequest", existingRequest);

      if (existingRequest) {
        console.log("Matching request already exists");
        resolve(2);
        return;
      }

      try {
        await prisma.match.create({
          data: {
            status: "Pending",
            createdAt: new Date(),
            user: {
              connect: {
                id: data,
              },
            },
            matchedUser: {
              connect: {
                id: receiverId,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error sending matching request:", error.message);
        resolve(1);
      } finally {
        resolve(0);
      }
    });
  });
}
