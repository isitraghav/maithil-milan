"use client";
import { signOut } from "next-auth/react";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import GoogleLoginButton from "./googleLoginButton";

export default function Navbar() {
  const [loggedin, setLoggedin] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (session == null) {
        setLoggedin(false);
      } else {
        setLoggedin(true);
        setUser(session.user);
        console.log(session.user);
      }
    });
  }, []);

  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <Link className="block" href="/">
              <span className="sr-only">Home</span>
              <Image
                src="/img/logo.png"
                alt="Maithil Milan"
                width={200}
                height={20}
                className="sm:w-1/3 md:w-full"
              />
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                {/* <li>
                  <Link
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="#"
                  >
                    Blog
                  </Link>
                </li> */}
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              {loggedin ? (
                <>
                  <div className="relative">
                    <div className="inline-flex items-center overflow-hidden rounded-full">
                      <button
                        onClick={() => setMenuOpened(!menuOpened)}
                        className="h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                      >
                        <span className="sr-only">Menu</span>
                        <img
                          loading="eager"
                          src={user.image}
                          alt={user.name}
                          width={30}
                          className="rounded-full"
                          height={30}
                        />
                      </button>
                    </div>

                    <div
                      className={`${
                        menuOpened ? "block" : "hidden"
                      } absolute end-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg`}
                      role="menu"
                    >
                      <div className="p-2">
                        <Link
                          href="/faqs"
                          className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          role="menuitem"
                        >
                          FAQs
                        </Link>
                        <Link
                          href="/privacy"
                          className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          role="menuitem"
                        >
                          Privacy Policy
                        </Link>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            signOut();
                          }}
                          type="submit"
                          className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          role="menuitem"
                        >
                          <CiLogout />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="sm:flex sm:gap-4 hidden md:block">
                    <GoogleLoginButton />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
