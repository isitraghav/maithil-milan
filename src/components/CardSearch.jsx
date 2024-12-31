import { useState, useEffect } from "react";
import { LuShieldCheck } from "react-icons/lu";

export default function CardSearch({ result }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isSlideshowRunning, setIsSlideshowRunning] = useState(false);

  useEffect(() => {
    if (isSlideshowRunning) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex(
          (prevIndex) => (prevIndex + 1) % result.photos.length
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isSlideshowRunning, result.photos.length]);

  const handleMouseEnter = () => {
    setIsSlideshowRunning(true);
  };

  const handleMouseLeave = () => {
    setIsSlideshowRunning(false);
  };

  const handleClick = () => {
    setIsSlideshowRunning(!isSlideshowRunning);
  };

  console.log(result);
  return (
    <div
      className="group rounded-lg w-1/2 relative block bg-black"
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
      <div className="relative rounded-lg">
        <p className="text-md w-8 h-8 center-all text-green-300 bg-black bg-opacity-10 text-center backdrop-filter backdrop-blur-sm rounded-lg ">
          {!result.isverifed && (
            <>
              <LuShieldCheck size={22} className="inline-block" />
            </>
          )}
        </p>
        <div className="mt-32 bg-black bg-opacity-30 backdrop-filter backdrop-blur-md rounded sm:mt-48 lg:mt-64">
          <div className="transform  transition-all px-3 py-1.5 translate-y-0  opacity-100">
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
          </div>
        </div>
      </div>
    </div>
  );
}
