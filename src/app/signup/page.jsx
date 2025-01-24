"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    try {
      const res = await axios.post("/api/auth/signup", {
        name: formData.get("name"),
        email: formData.get("email"),
      });

      setMessage(res.data.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setError(error.response?.data?.error || "An unexpected error occurred");
    }
  }

  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-100">
      <button
        className="bg-white p-4 rounded-lg shadow-md w-96"
        onClick={() => {
          signIn("google", {
            redirectTo: "/dashboard",
          });
        }}
      >
        Login With Google
      </button>
      <div className="text-center font-semibold text-gray-500">OR</div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Sign Up
        </button>
        <div className="mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/login" legacyBehavior>
              <a className="text-blue-500 hover:underline">Log in</a>
            </Link>
          </p>
          <p className="text-sm">
            Forgot password?{" "}
            <Link href="/forgot-password" legacyBehavior>
              <a className="text-blue-500 hover:underline">Reset password</a>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
