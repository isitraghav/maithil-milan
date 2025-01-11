import Link from "next/link";
import { useState, useEffect } from "react";
import { LuShieldCheck } from "react-icons/lu";
import Swal from "sweetalert2";
import { handleMatchingRequest } from "./server";

export default function CardSearch({ result, mode }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isSlideshowRunning, setIsSlideshowRunning] = useState(false);

  useEffect(() => {
    if (isSlideshowRunning) {
      console.log("running");
      const interval = setInterval(() => {
        setCurrentPhotoIndex(
          (prevIndex) => (prevIndex + 1) % result.photos.length
        );
      }, 1200);

      return () => clearInterval(interval);
    }
  }, [isSlideshowRunning, result.photos.length]);

  const handleMouseEnter = () => {
    setIsSlideshowRunning(true);
  };

  const handleMouseLeave = () => {
    setIsSlideshowRunning(false);
    setCurrentPhotoIndex(0);
  };

  const handleClick = () => {
    setIsSlideshowRunning(!isSlideshowRunning);
  };

  return (
    <div
      className="group w-full md:w-1/2 min-h-[55vh] rounded-lg relative block bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="absolute inset-0 h-full w-full">
        <div className="h-full w-full flex items-center justify-center">
          <div className="relative h-full w-full">
            <img
              alt=""
              className="absolute rounded-lg inset-0 h-full w-full object-cover transition-opacity opacity-50"
              src={result.photos[currentPhotoIndex]}
            />
          </div>
        </div>
      </div>
      <div className="min-h-[55vh] relative rounded-lg">
        <p className="text-md w-8 h-8 center-all text-green-300 bg-black bg-opacity-10 text-center backdrop-filter backdrop-blur-sm rounded-lg ">
          {result.isverifed && (
            <>
              <LuShieldCheck size={22} className="inline-block" />
            </>
          )}
        </p>
        <div className="m-auto"></div>
        <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-30 backdrop-filter backdrop-blur-md rounded">
          <div className="px-3 py-1.5">
            <p className="text-sm text-white flex items-center gap-2">
              <span className="text-sm md:text-lg">{result.fullName},</span>
              <span className="text-sm">{result.age}</span>
            </p>
            {result.education && result.profession && (
              <p>
                <span className="text-white/70 text-sm">
                  {result.education}, {result.profession}
                </span>
              </p>
            )}

            <div className="flex">
              {mode == "approval" && (
                <>
                  <button
                    onClick={async () => {
                      await handleMatchingRequest(result.id, "Accepted").then(
                        (res) => {
                          console.log(res);
                          if (res) {
                            Swal.fire({
                              icon: "success",
                              title: "Match Accepted",
                              text:
                                "The match request has been accepted from " +
                                result.fullName,
                            }).then((result) => {
                              if (result.isConfirmed) {
                                window.location.reload();
                              }
                            });
                          }
                        }
                      );
                    }}
                    className="text-sm mr-auto bg-[#b0772b] rounded-lg mb-1 mt-2 px-2 text-white flex items-center gap-2"
                  >
                    Match
                  </button>
                </>
              )}
              <Link href={`/profile/${result.id}`}>
                <button className="text-sm bg-[#b0772b] rounded-lg mb-1 mt-2 px-2 text-white flex items-center gap-2">
                  View Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
