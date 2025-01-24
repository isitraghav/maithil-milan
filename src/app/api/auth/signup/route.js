import { sendVerificationRequest } from "@/authSendRequest";
import { prisma } from "@/prisma";
import { randomBytes } from "crypto";

export async function POST(req) {
  try {
    const { name, email } = await req.json();

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json({ error: "Email already in use" }, { status: 400 });
    }

    // Create user without a password (set password to null initially)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: null, // No password set yet
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
    const passwordCreationUrl = `${process.env.NEXTAUTH_URL}/create-password?token=${token}`;
    await sendVerificationRequest({
      identifier: email,
      url: passwordCreationUrl,
    });

    return Response.json(
      { message: "Password creation link sent to your email!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
