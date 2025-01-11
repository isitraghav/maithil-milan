import { signIn } from "next-auth/react";
import Image from "next/image";

export default function GoogleLoginButton() {
  async function loginWithGoogle() {
    await signIn("google", {
      callbackUrl: "/profile",
    });
  }

  return (
    <>
      <button
        onClick={loginWithGoogle}
        className="hidden md:block text-sm bg-[#be123c] px-4 py-2 rounded-md text-white font-semibold hover:bg-[#771b32] transition duration-150 ease-in-out  items-center"
      >
        <div className="center-all">
          Continue With
          <Image
            loading="eager"
            src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
            alt="google"
            width={20}
            height={20}
            className="ml-2"
          />
        </div>
      </button>

      <button
        onClick={() => {
          loginWithGoogle();
        }}
        className="md:hidden text-sm bg-[#be123c] px-4 py-2 rounded-md text-white font-semibold hover:bg-[#771b32] transition duration-150 ease-in-out"
      >
        Register
      </button>
    </>
  );
}
