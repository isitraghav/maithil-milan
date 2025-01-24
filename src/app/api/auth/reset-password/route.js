import {
  sendMail,
} from "@/authSendRequest";
import { prisma } from "@/prisma";
import { randomBytes } from "crypto";

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a reset token
    const resetToken = randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    // Save token in the database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires,
      },
    });

    // Create reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Send the reset email
    await sendMail({
      email,
      subject: "Password Reset Request",
      htmlContent: `
      <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>Forgot password on Maithil Milan?</h2>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
            <p>If you didn’t request this, please ignore this email.</p>
            <p>Thanks, <br><strong>The Maithil Milan Team</strong></p>
          </body>
        </html>
      `,
    });

    return Response.json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
