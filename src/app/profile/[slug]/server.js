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
  try {
    console.log("Sending matching request to", receiverId);
    const senderId = await getUserId();

    // Validate users
    if (senderId === receiverId) {
      console.log("Cannot send matching request to yourself");
      return 3;
    }

    // Check user existence first
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId } }),
      prisma.user.findUnique({ where: { id: receiverId } }),
    ]);

    console.log("Sender:", sender, "Receiver:", receiver);
    if (!sender || !receiver) {
      console.log("One or both users not found");
      return 4; // New error code for missing users
    }

    // Check existing matches using unique constraint
    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { userId: senderId, matchedUserId: receiverId },
          { userId: receiverId, matchedUserId: senderId },
        ],
      },
    });

    if (existingMatch) {
      console.log("Matching request already exists");
      return 2;
    }

    // Create match with direct ID assignment
    await prisma.match.create({
      data: {
        userId: senderId,
        matchedUserId: receiverId,
        status: "Pending",
        // createdAt/updatedAt are automatic
      },
    });

    const userData = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        name: true,
        profile: true,
      },
    });
    // Send email (no need for extra user lookup - use receiver from earlier)
    console.log("Sending email to user");
    await sendMail({
      email: receiver.email,
      subject: `Matching Request from ${sender.name}`,
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>You have a matching request on Maithil Milan!</h2>
            <p>${sender.name} has sent you a matching request. Click below to respond:</p>
            <a href="${process.env.NEXTAUTH_URL}/profile/${senderId}"
               style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                      color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Matching Request
            </a>
            <p>Questions? Contact <a href="mailto:info@maithilmilan.com">info@maithilmilan.com</a></p>
            <p>Thanks, <br><strong>The Maithil Milan Team</strong></p>
          </body>
        </html>
      `,
    });

    if (userData) {
      await sendMail({
        email: (await auth()).user.email,
        subject: "Sent connection request to " + userData.name,
        htmlContent: `
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
              <td style="border: 1px solid #ddd; padding: 8px;">${userData.profile?.fullName}</td>
            </tr>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Age</th>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${userData.profile?.dateOfBirth
                  ? Math.floor(
                      (new Date().getTime() -
                        new Date(userData.profile.dateOfBirth).getTime()) /
                        (1000 * 60 * 60 * 24 * 365.25)
                    )
                  : "-"}
                years old
              </td>
            </tr>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Gender</th>
              <td style="border: 1px solid #ddd; padding: 8px;">${userData.profile?.gender}</td>
            </tr>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Religion</th>
              <td style="border: 1px solid #ddd; padding: 8px;">${userData.profile?.religion}</td>
            </tr>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Gotra</th>
              <td style="border: 1px solid #ddd; padding: 8px;">${userData.profile?.gotra}</td>
            </tr>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Mother Tongue</th>
              <td style="border: 1px solid #ddd; padding: 8px;">${userData.profile?.motherTongue}</td>
            </tr>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Profile Image</th>
              <td style="border: 1px solid #ddd; padding: 8px;">
                <img
                  src={userData.profile?.image}
                  alt={userData.profile?.fullName}
                  className="w-40 object-cover aspect-square h-40 rounded-full"
                />
              </td>
            </tr>
          </tbody>
        </table>
        `,
      });
    }

    return 0; // Success
  } catch (error) {
    console.error("Error sending matching request:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      console.log("Duplicate match detected");
      return 2;
    }
    if (error.code === "P2003") {
      console.log("Invalid user reference");
      return 4;
    }

    return 1; // Generic error
  }
}
