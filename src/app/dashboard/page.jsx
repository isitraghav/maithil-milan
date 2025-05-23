"use client";
import { LuClock, LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import {
  checkProfileCompletion,
  getRecommendations,
  getUserMatchStatus,
} from "./server";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { sendMatchingRequest } from "../profile/[slug]/server";
import { PlusCircle } from "lucide-react";
import { isAdminServer } from "../admin/server";

export default function Dashboard() {
  const [userData, setUserData] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [recomendations, setRecomendations] = useState([]);
  const [matches, setMatches] = useState({
    Accepted: 0,
    Declined: 0,
    Pending: 0,
  });

  useEffect(() => {
    checkProfileCompletion().then((data) => {
      setProfileCompletion(data.completionPercentage);
      console.log(data);
      setUserData(data.data);
    });
    getRecommendations().then((data) => {
      console.log(data);
      setRecomendations(data);
    });
    getUserMatchStatus().then((data) => {
      setMatches(data);
    });
    isAdminServer().then((data) => {
      if (data) {
        location.href = "/admin";
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="lg:w-5/6 w-11/12 m-2 md:m-5">
        <div className="flex gap-3 w-full justify-evenly">
          {[
            {
              color: "green",
              icon: <LuThumbsUp size={35} />,
              text: `${matches.Accepted} approved match`,
              link: "/matches",
            },
            {
              color: "red",
              icon: <LuThumbsDown size={35} />,
              text: `${matches.Declined} declined match`,
              link: "/dashboard",
            },
            {
              color: "#987e1d",
              icon: <LuClock size={35} />,
              text: `${matches.Pending} pending matches`,
              link: "/sentmatches",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg text-sm rounded-2xl p-2 md:p-4 lg:p-6 mb-4"
            >
              <Link
                href={item.link}
                style={{
                  color: item.color,
                }}
                className={`pb-1 grid place-items-center`}
              >
                {item.icon}
              </Link>
              <div className="text-gray-800 text-center">{item.text}</div>
            </div>
          ))}
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 relative">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Your Profile
          </h2>
          {profileCompletion == 0 ? (
            <p className="text-gray-600">
              You have not completed your profile yet. Please complete your
              profile to get better matches.
            </p>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <img
                  src={userData?.image}
                  alt={userData?.fullName}
                  className="rounded-full w-24 mb-4 sm:mb-0 sm:mr-6 border-4 border-[#f8a845] aspect-square object-cover"
                />
                <div>
                  <h3 className="text-xl font-medium text-gray-800">
                    {userData?.fullName}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {userData?.age} years,{" "}
                    {Math.floor(userData?.height / 30.48)} ft{" "}
                    {Math.round(userData?.height % 30.48)} in
                    {userData?.profession}
                  </p>
                  <p className="text-gray-600 mb-4">{userData?.education}</p>
                  <Link
                    href="/profile"
                    className="bg-[#cb8734] text-white px-4 py-2 rounded-full transition-colors duration-200"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
              {profileCompletion < 100 && (
                <div className="w-full mt-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-[#f8a845] text-center  text-white text-xs h-full rounded-full"
                    style={{ width: `${profileCompletion}%` }}
                  >
                    {profileCompletion}% profile completed
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Profile Recommendations */}
      {recomendations.length > 0 && (
        <div className="lg:w-5/6 m-2 w-11/12 md:m-5 bg-white shadow-lg rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Recommended Profiles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recomendations.map((profile) => (
              <div
                key={profile.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
              >
                <Link
                  href={`/profile/${profile.userId}`}
                  className="flex items-center mb-4"
                >
                  <img
                    src={profile.image}
                    alt={profile.fullName}
                    className="rounded-full mr-4 w-16 aspect-square object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-lg text-gray-800">
                      {profile.fullName}
                    </h4>
                    <p className="text-gray-600">
                      {profile.age} years, {profile.profession}
                    </p>
                  </div>
                </Link>
                <p className="text-gray-600 mb-4">
                  {Math.floor(profile?.height / 30.48)} ft{" "}
                  {Math.round(profile?.height % 30.48)} in, {profile.education}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center"></div>
                  <div className="flex space-x-2">
                    <button
                      onClick={async (event) => {
                        const btn = event.currentTarget;
                        btn.disabled = true;
                        console.log(profile);
                        try {
                          const res = await sendMatchingRequest(profile.userId);
                          console.log(res);
                          if (res == 0) {
                            Swal.fire({
                              icon: "success",
                              title: "Request Sent",
                              text: "Your matching request was successfully sent.",
                            });
                          } else if (res == 2) {
                            Swal.fire({
                              icon: "error",
                              title: "Error",
                              text: "You have already sent a matching request to this user.",
                            });
                          } else {
                            Swal.fire({
                              icon: "error",
                              title: "Error",
                              text: "There was an error sending your matching request.",
                            });
                          }
                        } finally {
                          btn.disabled = false;
                        }
                      }}
                      className="bg-pink-100 text-pink-600 p-2 rounded-full hover:bg-pink-200 transition-colors duration-200"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                    {/* <button className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
                        <IoMdClose className="w-5 h-5" />
                      </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={async () => {
                setRecomendations(await getRecommendations());
              }}
              className="bg-white border border-pink-500 hover:bg-pink-500 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-full"
            >
              Refresh Recommendations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
