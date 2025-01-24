"use server";
import axios from "axios";
export async function sendMail({ email, subject, htmlContent }) {
  try {
    console.log(`Sending email to ${email} with subject: ${subject}`);
    const response = await axios.post(
      "https://email-api-maithil.vercel.app/api/send-email",
      {
        email, // Recipient email
        content: htmlContent,
        subject,
      }
    );

    if (!response.data.success) {
      console.log(response.data);
    }

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
