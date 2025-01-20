export default function GoogleLoginButton() {
  async function loginWithGoogle() {
    location.href = "/api/auth/signin/";
  }

  return (
    <>
      <button
        onClick={() => {
          loginWithGoogle();
        }}
        className="text-sm bg-[#be123c] px-4 py-2 rounded-md text-white font-semibold hover:bg-[#771b32] transition duration-150 ease-in-out"
      >
        Register <div className="hidden md:inline">or Sign-in</div>
      </button>
    </>
  );
}
