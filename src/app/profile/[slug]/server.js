"use server";
import { auth } from "@/auth";
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
          .then((data) => {
            console.log("User profile fetched:", data);
            resolve(data);
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
    let userEmail = (await auth()).user.email;
    await prisma.user
      .findUnique({
        where: {
          email: userEmail,
        },
        select: {
          id: true,
        },
      })
      .then(async (data) => {
        console.log("userid", data.id);
        console.log("receiverId", receiverId);
        try {
          await prisma.match.create({
            data: {
              status: "Pending",
              createdAt: new Date(),
              user: {
                connect: {
                  id: data.id,
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
          resolve(1);
          console.error("Error sending matching request:", error.message);
        } finally {
          resolve(0);
        }
      });
  });
}
