"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const params = useSearchParams();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (response?.error) {
      setError("Invalid email or password");
    } else {
      if (params.get("redirect")) {
        router.push(params.get("redirect"));
      } else {
        router.push("/dashboard");
      }
    }
  }

  return (
    <div
      style={{ backgroundImage: "url(/img/wallpaper.jpg)" }}
      className="flex flex-col gap-2 min-h-screen items-center justify-center bg-no-repeat bg-cover bg-center"
    >
      <button
        className="bg-white p-4 rounded-lg shadow-md w-full max-w-96"
        onClick={() => {
          signIn("google", {
            redirectTo: "/dashboard",
          });
        }}
      >
        Login With Google
      </button>
      <div className="text-center font-semibold text-gray-500 max-w-96">OR</div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md max-w-96"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>

        <div className="mt-4">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link href="/signup" legacyBehavior>
              <a className="text-blue-500 hover:underline">Sign up</a>
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
