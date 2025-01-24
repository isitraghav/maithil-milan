"use server";
import { auth } from "@/auth";
import { sendMail, sendMatchingRequestRecieved } from "@/authSendRequest";
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
        console.log("User profile fetched:", data);
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

        await prisma.user
          .findUnique({
            where: {
              id: receiverId,
            },
            select: {
              email: true,
              name: true,
              id: true,
            },
          })
          .then(async (data) => {
            await sendMail({
              email: data.email,
              subject: "Matching Request from " + data.name,
              htmlContent: `
                <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>You have a matching request on Maithil Milan!</h2>
            <p>${data.name} has sent you a matching request. Click the button below to accept or decline:</p>
            <a href="${process.env.NEXTAUTH_URL}/profile/${data.id}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Matching Request
            </a>
            <p>If you have any questions, reply to this email or contact us at <a href="mailto:info@maithilmilan.com">info@maithilmilan.com</a>.</p>
            <p>Thanks, <br><strong>The Maithil Milan Team</strong></p>
          </body>
        </html>
        `,
            });
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
