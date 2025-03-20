"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
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
import { IoMdClose } from "react-icons/io";
import { usePathname } from "next/navigation";
import "./sidebar.css";
import { PiGear } from "react-icons/pi";
import { isAdminServer } from "@/app/admin/server";
import { auth } from "@/auth";
import { Send } from "lucide-react";

export default function Sidebar({ children }) {
  const { data: session, status } = useSession(); // Access the session and loading status
  const [hasRun, setHasRun] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [userData, setUserData] = useState({});
  const [location, setLocation] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && !hasRun) {
      // Run effect only when session is authenticated and hasn't run yet
      console.log("User is authenticated:", session);
      setHasRun(true);
      setLoggedin(true);
      getsidebarnotifications().then((data) => {
        setUserData(data);
      });
    }
    isAdminServer().then((data) => {
      setIsAdmin(data);
    });
  }, [status, session, hasRun]);

  const pathname = usePathname();

  useEffect(() => {
    setLocation(pathname.split("/")[1]);
  }, [pathname]); // Runs every time the pathname changes

  return (
    <>
      <div className="w-full flex min-h-screen">
        {loggedin && (
          <div className="w-1/6 md:w-1/5 p-4 px-0 md:px-4 bg-[#ffffff]">
            <ul className="space-y-1">
              <li className="flex items-center justify-center md:justify-start">
                <Link
                  href="/dashboard"
                  className={`hover:bg-[#f5f6f8] w-full group ${
                    location == "dashboard" && "bg-[#f5f6f8]"
                  } flex items-center justify-between rounded-lg px-2 mx-2 md:mx-0 md:px-4 py-2 text-gray-800`}
                >
                  <span className="text-sm flex gap-2 font-medium">
                    <LuLayoutDashboard size={20} />
                    <div className="hidden md:block">Dashboard</div>
                  </span>
                </Link>
              </li>

              <li className="flex items-center justify-center md:justify-start">
                <Link
                  href="/profile"
                  className={`hover:bg-[#f5f6f8] w-full group ${
                    location == "profile" && "bg-[#f5f6f8]"
                  } flex items-center justify-between rounded-lg px-2 mx-2 md:mx-0 md:px-4 py-2 text-gray-800`}
                >
                  <span className="text-sm flex gap-2 font-medium">
                    <LuUser size={20} />
                    <div className="hidden md:block">Profile</div>
                  </span>

                  {userData.profile == 0 && (
                    <>
                      <span className="hidden ml-0 md:ml-2 md:grid place-items-center rounded-full bg-red-500  p-0.5 text-xs text-white">
                        <IoMdClose size={13} />
                      </span>
                      <span className="md:hidden relative top-2 right-2 ml-0 md:ml-2 grid place-items-center rounded-full bg-red-500  p-0.5 text-xs text-white">
                        <IoMdClose size={10} />
                      </span>
                    </>
                  )}
                </Link>
              </li>

              <li className="flex items-center justify-center md:justify-start">
                <Link
                  href="/matches"
                  className={`hover:bg-[#f5f6f8] w-full group ${
                    location == "matches" && "bg-[#f5f6f8]"
                  } flex items-center justify-between rounded-lg px-2 mx-2 md:mx-0 md:px-4 py-2 text-gray-800`}
                >
                  <span className="text-sm flex gap-2 font-medium">
                    <LuCheck size={20} />
                    <div className="hidden md:block">Successful Matches</div>
                  </span>
                  {userData.matches > 0 && (
                    <span className="shrink-0 rounded-full bg-red-500 px-3 py-0.5 text-xs text-white">
                      {userData.matches}
                    </span>
                  )}
                </Link>
              </li>

              <li className="flex items-center justify-center md:justify-start">
                <Link
                  href="/receivedmatches"
                  className={`hover:bg-[#f5f6f8] w-full group ${
                    location == "receivedmatches" && "bg-[#f5f6f8]"
                  } flex items-center justify-between rounded-lg px-2 mx-2 md:mx-0 md:px-4 py-2 text-gray-800`}
                >
                  <span className="text-sm flex gap-2 font-medium">
                    <LuDownload size={20} />
                    <div className="hidden md:block">Received Matches</div>
                  </span>
                  {userData.recievedMathes > 0 && (
                    <>
                      <span className="hidden ml-0 md:ml-2 md:grid place-items-center rounded-full bg-red-500  px-1 text-xs text-white">
                        {userData.recievedMathes}
                      </span>
                      <span className="md:hidden relative top-2 right-2 ml-0 md:ml-2 grid place-items-center rounded-full bg-red-500  px-1 text-xs text-white">
                        {userData.recievedMathes}
                      </span>
                    </>
                  )}
                </Link>
              </li>

              <li className="flex items-center justify-center md:justify-start">
                <Link
                  href="/sentmatches"
                  className={`hover:bg-[#f5f6f8] w-full group ${
                    location == "sentmatches" && "bg-[#f5f6f8]"
                  } flex items-center justify-between rounded-lg px-2 mx-2 md:mx-0 md:px-4 py-2 text-gray-800`}
                >
                  <span className="text-sm flex gap-2 font-medium">
                    <Send size={18} />
                    <div className="hidden md:block">Sent Matches</div>
                  </span>
                  {userData.sentMathes > 0 && (
                    <>
                      <span className="hidden ml-0 md:ml-2 md:grid place-items-center rounded-full bg-red-500  px-1 text-xs text-white">
                        {userData.sentMathes}
                      </span>
                      <span className="md:hidden relative top-2 right-2 ml-0 md:ml-2 grid place-items-center rounded-full bg-red-500  px-1 text-xs text-white">
                        {userData.sentMathes}
                      </span>
                    </>
                  )}
                </Link>
              </li>

              <li className="flex items-center justify-center md:justify-start">
                <Link
                  href="/search"
                  className={`hover:bg-[#f5f6f8] w-full group ${
                    location == "search" && "bg-[#f5f6f8]"
                  } flex items-center justify-between rounded-lg px-2 mx-2 md:mx-0 md:px-4 py-2 text-gray-800`}
                >
                  <span className="text-sm flex gap-2 font-medium">
                    <LuSearch size={20} />
                    <div className="hidden md:block">Search</div>
                  </span>
                </Link>
              </li>

              {isAdmin && (
                <li className="flex items-center justify-center md:justify-start">
                  <Link
                    href="/admin"
                    className={`hover:bg-[#f5f6f8] w-full group ${
                      location == "admin" && "bg-[#f5f6f8]"
                    } flex items-center justify-between rounded-lg px-2 mx-2 md:mx-0 md:px-4 py-2 text-gray-800`}
                  >
                    <span className="text-sm flex gap-2 font-medium">
                      <PiGear size={20} />
                      <div className="hidden md:block">Admin Panel</div>
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
        <div className={loggedin ? "w-5/6 md:w-3/4 mx-auto" : "w-full"}>
          {children}
        </div>
      </div>
    </>
  );
}
