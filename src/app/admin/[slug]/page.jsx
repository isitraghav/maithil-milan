"use client";
import React from "react";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { PiSpinnerLight } from "react-icons/pi";
import Swal from "sweetalert2";
import { getCoreInfo } from "../server";
import moment from "moment";
import { getMatches } from "./adminrender";
import Minimatch from "./minimatch";
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
      const data = await getCoreInfo(slug);
      setUserData(data);
      console.log("User data fetched:", data);
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center">
      {userData.id ? (
        <div className="flex flex-col items-center justify-center p-4 space-y-2 mb-10">
          <img
            src={userData.image}
            alt={userData.profile.fullName}
            className="w-40 object-cover aspect-square h-40 rounded-full mb-4"
          />
          <div className="flow-root w-full">
            <dl className="-my-3 divide-y divide-gray-100 text-sm">
              <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 pl-2">Name</dt>
                <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                  {userData.profile.fullName} {userData.profile.surname}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 pl-2">Age</dt>
                <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                  {userData.profile.dateOfBirth
                    ? moment(userData.profile.dateOfBirth).fromNow(true)
                    : "-"}
                  years old
                </dd>
              </div>
              {userData.profile.religion && (
                <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900 pl-2">Religion</dt>
                  <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                    {userData.profile.religion}, {userData.profile.gotra}
                  </dd>
                </div>
              )}
              {userData.profile.education && (
                <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900 pl-2">Education</dt>
                  <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                    {userData.profile.education}
                  </dd>
                </div>
              )}
              {userData.profile.profession && (
                <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900 pl-2">Profession</dt>
                  <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                    {userData.profile.profession}
                  </dd>
                </div>
              )}
              <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 pl-2">Height</dt>
                <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                  {Math.floor(userData.profile.height * 0.032808)} ft{" "}
                  {Math.round(
                    (userData.profile.height * 0.032808 -
                      Math.floor(userData.profile.height * 0.032808)) *
                      12
                  )}
                  in
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 pl-2">
                  Marital Status
                </dt>
                <dd className="text-gray-700 sm:col-span-2 pl-2 md:pl-0">
                  {userData.profile.maritalStatus}
                </dd>
              </div>

              {userData.matches && userData.matches.length > 0 && (
                <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900 pl-2">Matches</dt>
                  <br />
                  <dd className="text-gray-700 ml-2 sm:col-span-2 pl-2 md:pl-0 flex flex-col justify-center gap-3">
                    {userData.matches.map((match, index) => (
                      <Minimatch key={index} match={match} userid={userid} />
                    ))}
                  </dd>
                </div>
              )}

              {userData.matchedWith && userData.matchedWith.length > 0 && (
                <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900 pl-2">
                    Matched With
                  </dt>
                  <br />
                  <dd className="text-gray-700 ml-2 sm:col-span-2 pl-2 md:pl-0">
                    {userData.matchedWith.map((match, index) => {
                      console.log("match: ", match);
                      return (
                        <Minimatch key={index} match={match} userid={userid} />
                      );
                    })}
                  </dd>
                </div>
              )}

              {userData?.photos?.length > 0 && (
                <div className="embla rounded-md" ref={emblaRef}>
                  <div className="embla__container">
                    {userData?.photos?.map((photo, index) => (
                      <div key={index} className="embla__slide mr-2">
                        <img
                          src={photo}
                          className="object-cover h-[30vh] w-64 rounded-xl"
                          alt={userData.profile.fullName}
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
