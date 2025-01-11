"use client";
import Image from "next/image";
import { CiStar } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { LuThumbsUp } from "react-icons/lu";
import { checkProfileCompletion, getRecomendations } from "./server";
import { useEffect, useState } from "react";
import { handleMatchingRequest } from "@/components/server";
import Swal from "sweetalert2";

export default function Dashboard() {
  const [userData, setUserData] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [recomendations, setRecomendations] = useState([]);

  useEffect(() => {
    checkProfileCompletion().then((data) => {
      setProfileCompletion(data.profileCompletion);
      console.log(data);
      setUserData(data.data);
    });
    getRecomendations().then((data) => {
      console.log(data);
      setRecomendations(data);
    });
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="lg:w-5/6 w-11/12 m-2 md:m-5">
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 relative">
          <div
            className="absolute top-0 right-0 mr-4 mt-4"
            style={{
              width: `${profileCompletion}%`,
              height: "4px",
              backgroundColor: "#f8a845",
              borderRadius: "50px",
            }}
          />
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Your Profile
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <img
              src={userData?.image}
              alt={userData?.fullName}
              className="rounded-full mb-4 sm:mb-0 sm:mr-6 border-4 border-[#f8a845] w-38 aspect-square object-cover"
            />
            <div>
              <h3 className="text-xl font-medium text-gray-800">
                {userData?.fullName}
              </h3>
              <p className="text-gray-600 mb-2">
                {userData?.age} years, {userData?.height} cm,
                {userData?.profession}
              </p>
              <p className="text-gray-600 mb-4">{userData?.education}</p>
              <button className="bg-[#cb8734] text-white px-4 py-2 rounded-full transition-colors duration-200">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Profile Recommendations */}
      <div className="lg:w-5/6 m-2 md:m-5 bg-white shadow-lg rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Recommended Profiles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recomendations.map((profile) => (
            <div
              key={profile.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <Image
                  src={profile.image}
                  alt={profile.fullName}
                  width={64}
                  height={64}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium text-lg text-gray-800">
                    {profile.fullName}
                  </h4>
                  <p className="text-gray-600">
                    {profile.age} years, {profile.profession}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {profile.height} cm, {profile.education}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CiStar className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-gray-600">85% Match</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={async (event) => {
                      const btn = event.currentTarget;
                      btn.disabled = true;

                      const res = await handleMatchingRequest(
                        profile.id,
                        "Accepted"
                      );

                      if (res) {
                        Swal.fire({
                          icon: "success",
                          title: "Request Sent",
                          text: "Your matching request was successfully sent.",
                        });
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "Error",
                          text: "There was an error sending your matching request.",
                        });
                      }

                      btn.disabled = false;
                    }}
                    className="bg-pink-100 text-pink-600 p-2 rounded-full hover:bg-pink-200 transition-colors duration-200"
                  >
                    <LuThumbsUp className="w-5 h-5" />
                  </button>
                  <button className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
                    <IoMdClose className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-pink-500 hover:text-pink-600 transition-colors duration-200 font-medium"
          >
            View More Recommendations
          </a>
        </div>
      </div>
    </div>
  );
}
