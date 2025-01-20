export async function sendVerificationRequest({ identifier: email, url }) {
  try {
    const response = await fetch(
      "https://email-api-maithil.vercel.app/api/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, // Recipient email
          url, // Verification link
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send email: ${errorData.error}`);
    }

    console.log("✅ Verification email sent successfully");
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
  }
}
