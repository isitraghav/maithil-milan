"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getsidebarnotifications } from "./server";
import {
  LuBookDashed,
  LuCheck,
  LuDownload,
  LuLayoutDashboard,
  LuSearch,
  LuUser,
} from "react-icons/lu";
import Link from "next/link";

export default function Sidebar({ children }) {
  const { data: session, status } = useSession(); // Access the session and loading status
  const [hasRun, setHasRun] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (status === "authenticated" && !hasRun) {
      // Run effect only when session is authenticated and hasn't run yet
      console.log("User is authenticated:", session);
      setHasRun(true);
      setLoggedin(true);
      getsidebarnotifications().then((data) => {
        setUserData(data);
        console.log(data);
      });
    }
  }, [status, session, hasRun]);

  return (
    <>
      <div className="w-full flex min-h-screen">
        {loggedin && (
          <div className="w-1/6 md:w-1/5 p-4 px-0 md:px-4 bg-[#f6f6f6]">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard"
                  className="group flex items-center justify-between rounded-lg bg-gray-100 px-4 py-2 text-gray-700"
                >
                  <span className="text-sm flex gap-2 font-medium">
                    <LuLayoutDashboard size={20} />
                    <div className="hidden md:block">Dashboard</div>
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/profile"
                  className="group flex items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <span className="text-sm flex gap-2 font-medium">
                    <LuUser size={20} />
                    <div className="hidden md:block">Profile</div>
                  </span>

                  {userData.profile == 0 && (
                    <span className="shrink-0 rounded-full bg-red-500 px-3 py-0.5 text-xs text-white">
                      No Profile Created
                    </span>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  href="/matches"
                  className="group flex items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <span className="text-sm flex gap-2 font-medium">
                    <LuCheck size={20} />
                    <div className="hidden md:block">Sucessful Matches</div>
                  </span>
                  {userData.matches > 0 && (
                    <span className="shrink-0 rounded-full bg-red-500 px-3 py-0.5 text-xs text-white">
                      {userData.matches}
                    </span>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  href="/matches"
                  className="group flex items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <span className="text-sm flex gap-2 font-medium">
                    <LuDownload size={20} />
                    <div className="hidden md:block">Received Matches</div>
                  </span>
                  {userData.recievedMathes > 0 && (
                    <span className="shrink-0 rounded-full bg-red-500 px-3 py-0.5 text-xs text-white">
                      {userData.recievedMathes}
                    </span>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  href="/search"
                  className="group flex items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <span className="text-sm flex gap-2 font-medium">
                    <LuSearch size={20} />
                    <div className="hidden md:block">Search</div>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        )}
        <div className={loggedin ? "w-3/4" : "w-full"}>{children}</div>
      </div>
    </>
  );
}
