import { sendMail } from "@/authSendRequest";
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await prisma.user.update({
      where: { email: tokenRecord.identifier },
      data: { password: hashedPassword },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({ where: { token } });

    // Create success message
    const successUrl = `${process.env.NEXTAUTH_URL}/login?success=true`;

    // Send the success email
    await sendMail({
      email: tokenRecord.identifier,
      subject: "Password Change Successful",
      htmlContent: `Your password has been successfully changed. <br> <a href="${successUrl}">Click here to log in</a>`,
    });

    return Response.json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
