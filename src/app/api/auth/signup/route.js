import bcrypt from "bcryptjs";
import { sendMail } from "@/authSendRequest";
import { prisma } from "@/prisma";
import { randomBytes } from "crypto";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json({ error: "Email already in use" }, { status: 400 });
    }

    // Create user without a password (set password to null initially)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate password creation token
    const token = randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60), // Expires in 1 hour
      },
    });

    // Send password creation link to email
    // const passwordCreationUrl = `${process.env.NEXTAUTH_URL}/create-password?token=${token}`;
    // await sendMail({
    //   email,
    //   subject: "Password Creation Link",
    //   htmlContent: `
    //   <html>
    //       <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    //         <h2>Password Creation Link</h2>
    //         <p>Click the button below to create your password:</p>
    //         <a href="${passwordCreationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
    //           Create Password
    //         </a>
    //         <p>If you didn’t request this, please ignore this email.</p>
    //         <p>Thanks, <br><strong>The Maithil Milan Team</strong></p>
    //       </body>
    //     </html>
    //   `,
    // });

    return Response.json(
      { message: "Registration successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
