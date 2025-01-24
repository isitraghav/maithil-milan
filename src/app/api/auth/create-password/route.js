import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    // Find the token in the database
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { token },
    });
    if (!tokenRecord || new Date() > tokenRecord.expires) {
      return Response.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: tokenRecord.identifier },
      data: { password: hashedPassword },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({ where: { token } });

    return Response.json(
      { message: "Password set successfully! You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
