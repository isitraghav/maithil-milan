"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getUserProfile, sendMatchingRequest } from "./server";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { PiSpinnerLight, PiStarFill } from "react-icons/pi";
import Swal from "sweetalert2";
export default function UserProfilePage({ params }) {
  const [emblaRef, elembaApi] = useEmblaCarousel({ loop: false }, [
    Autoplay({ delay: 2000 }),
  ]);
  const [userid, setUserId] = useState();

  const [userData, setUserData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const { slug } = await params;
      setUserId(slug);
      const data = await getUserProfile(slug);
      console.log("User data fetched:", data);
      setUserData(data);
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center">
      {userData.id ? (
        <div className="flex flex-col items-center justify-center p-4 space-y-2 mb-10">
          <img
            src={userData.image}
            alt={userData.fullName}
            className="w-40 object-cover aspect-square h-40 rounded-full mb-4"
          />
          <div className="flow-root w-full">
            <dl className="-my-3 divide-y divide-gray-100 text-sm">
              <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 pl-2">Name</dt>
                <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                  {userData.fullName}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 pl-2">Age</dt>
                <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                  {userData.dateOfBirth
                    ? Math.floor(
                        (new Date().getTime() -
                          new Date(userData.dateOfBirth).getTime()) /
                          (1000 * 60 * 60 * 24 * 365.25)
                      )
                    : "-"}{" "}
                  years old
                </dd>
              </div>
              {userData.religion && (
                <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900 pl-2">Religion</dt>
                  <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                    {userData.religion}, {userData.caste}
                  </dd>
                </div>
              )}
              {userData.education && (
                <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900 pl-2">Education</dt>
                  <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                    {userData.education}
                  </dd>
                </div>
              )}
              {userData.profession && (
                <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900 pl-2">Profession</dt>
                  <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                    {userData.profession}
                  </dd>
                </div>
              )}
              <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 pl-2">Height</dt>
                <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                  {Math.floor(userData.height * 0.032808)} ft{" "}
                  {Math.round(
                    (userData.height * 0.032808 -
                      Math.floor(userData.height * 0.032808)) *
                      12
                  )}
                  in ( {userData.height} cm )
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 pl-2">
                  Marital Status
                </dt>
                <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                  {userData.maritalStatus}
                </dd>
              </div>

              <div className="flex my-4 center-all mt-2">
                {userData?.matches ? (
                  <>
                    <div className="flex items-center gap-2">
                      {userData.matches.status === "Accepted" && (
                        <span className="text-green-500 font-bold">
                          Match Accepted
                        </span>
                      )}
                      {userData.matches.status === "Declined" && (
                        <span className="text-red-500 font-bold">
                          Match Declined
                        </span>
                      )}
                      {userData.matches.status === "Pending" && (
                        <>
                          <button
                            className="p-2 flex gap-2 font-bold text-white bg-[#219742] rounded-lg hover:bg-[#186c30] transition duration-150 ease-in-out"
                            onClick={async (e) => {
                              Swal.fire({
                                title: "Accept Match?",
                                text:
                                  "This will accept the match between you and " +
                                  userData.fullName,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, accept it!",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                }
                              });
                            }}
                          >
                            Accept Match
                          </button>
                          <button
                            onClick={async (e) => {
                              Swal.fire({
                                title: "Decline Match?",
                                text:
                                  "This will decline the match between you and " +
                                  userData.fullName,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, decline it!",
                              });
                            }}
                            className="p-2 flex gap-2 font-bold text-white bg-[#b02b36] rounded-lg hover:bg-[#7f1f27] transition duration-150 ease-in-out"
                          >
                            Decline Match
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={async (e) => {
                      let btn = e.target;
                      btn.textContent = "Sending Request...";
                      await sendMatchingRequest(userid).then((e) => {
                        if (e == 0) {
                          btn.textContent = "Request Sent";
                        } else if (e == 2) {
                          btn.textContent = "Request Already Sent";
                        } else {
                          btn.textContent = "Error Sending Request";
                        }
                      });
                    }}
                    className="p-2 flex gap-2 font-bold text-white bg-[#b0772b] rounded-lg hover:bg-[#9c632a] transition duration-150 ease-in-out"
                  >
                    <PiStarFill size={20} aria-hidden="true" />
                    Send Matching Request
                    <PiStarFill size={20} aria-hidden="true" />
                  </button>
                )}
              </div>

              {userData?.photos?.length > 0 && (
                <div className="embla rounded-md" ref={emblaRef}>
                  <div className="embla__container">
                    {userData?.photos?.map((photo, index) => (
                      <div key={index} className="embla__slide mr-2">
                        <img
                          src={photo}
                          className="object-cover h-[30vh] w-64 rounded-xl"
                          alt={userData.fullName}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="embla__arrows mt-2 flex items-center justify-center space-x-2">
                    <button
                      className="embla__button embla__button--prev p-1 rounded-full bg-white shadow-md"
                      onClick={() => elembaApi?.scrollPrev()}
                    >
                      <IoMdArrowBack className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <button
                      className="embla__button embla__button--next p-1 rounded-full bg-white shadow-md"
                      onClick={() => elembaApi?.scrollNext()}
                    >
                      <IoMdArrowForward
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>
      ) : (
        <div className="m-auto h-full w-full">
          <PiSpinnerLight size={40} className="animate-spin w-full h-98" />
        </div>
      )}
    </div>
  );
}
