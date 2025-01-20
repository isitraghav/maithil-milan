import Google from "next-auth/providers/google";
import { sendVerificationRequest } from "./authSendRequest";

export default {
  providers: [
    Google,
    {
      id: "http-email",
      name: "Email",
      type: "email",
      maxAge: 60 * 60 * 24, // Email link will expire in 24 hours
      sendVerificationRequest,
    },
  ],
};
