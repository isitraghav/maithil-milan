"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css";
import { CiLock, CiSquareCheck } from "react-icons/ci";

const SliderSection = () => {
  const sliderRef = useRef(null);
  const [slider, setSlider] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const keenSlider = new KeenSlider(sliderRef.current, {
        loop: true,
        slides: {
          origin: "center",
          perView: 1.25,
          spacing: 16,
        },
        breakpoints: {
          "(min-width: 1024px)": {
            slides: {
              origin: "auto",
              perView: 2.5,
              spacing: 32,
            },
          },
        },
      });

      setSlider(keenSlider);
      return () => keenSlider.destroy();
    }
  }, []);

  const handlePrevClick = () => {
    if (slider) {
      slider.prev();
    }
  };

  const handleNextClick = () => {
    if (slider) {
      slider.next();
    }
  };

  return (
    <>
      <section
        style={{
          background: "url('/img/bnr.jpg')",
        }}
        className="relative bg-cover bg-center bg-no-repeat"
      >
        <div className="bg-white/50">
          <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:items-center lg:px-8">
            <div className="flex items-center justify-center flex-col text-center ltr:sm:text-left rtl:sm:text-right w-full">
              <div className="w-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-extrabold sm:text-5xl">
                  Where there is love
                  <strong className="block font-extrabold text-rose-700">
                    There is life
                  </strong>
                </h1>

                <p className="mt-4 max-w-lg sm:text-xl/relaxed">
                  Start your search for your perfect match with Maithil Milan.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-center">
                <div className="rounded-lg bg-black backdrop-filter backdrop-blur-sm bg-opacity-70 px-4 py-6">
                  <form action="get" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid lg:flex grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                      <div>
                        <label className="block mb-2 text-white">
                          Looking for a
                        </label>
                        <select
                          className="bg-white border border-gray-300 rounded-lg px-3 py-2 w-full"
                          defaultValue="2"
                        >
                          <option value="1">Man</option>
                          <option value="2">Woman</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block mb-2 text-white">Age</label>
                            <select
                              className="bg-white border border-gray-300 rounded-lg px-3 py-2 w-full"
                              defaultValue="20"
                            >
                              {Array.from({ length: 54 }, (_, index) => (
                                <option key={index} value={index + 20}>
                                  {index + 20}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block mb-2 text-white">To</label>
                            <select
                              className="bg-white border border-gray-300 rounded-lg px-3 py-2 w-full"
                              defaultValue="23"
                            >
                              {Array.from({ length: 54 }, (_, index) => (
                                <option key={index} value={index + 20}>
                                  {index + 20}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 text-white">
                          Of Religion
                        </label>
                        <select
                          className="bg-white border border-gray-300 rounded-lg px-3 py-2 w-full"
                          defaultValue=""
                        >
                          <option value="">Select</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Muslim">Muslim</option>
                          <option value="Skih">Skih</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-2 text-white">
                          Mother tongue
                        </label>
                        <select
                          className="bg-white border border-gray-300 rounded-lg px-3 py-2 w-full"
                          defaultValue=""
                        >
                          <option value="">Select</option>
                          <option value="Hindi">Hindi</option>
                          <option value="English">English</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-2 d-block text-white">
                          &nbsp;
                        </label>
                        <button className="btn bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg w-full">
                          SEARCH
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="h-[70vh] flex items-center justify-center">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
            <div>
              <div className="max-w-lg md:max-w-none">
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                  <CiSquareCheck className="inline-block pb-2" size={40} />
                  A matrimony that delivers.
                </h2>

                <p className="mt-4 text-gray-700">
                  Maithil Milan is the world's largest online matrimony portal
                  exclusively for Maithils. We connect Maithils from around the
                  world, helping them find their perfect match and stay
                  connected to their roots.
                </p>
              </div>
            </div>

            <div>
              <Image
                width={500}
                height={200}
                src="/img/bride.jpg"
                className="rounded-xl object-cover h-[300px]"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      <section className="h-[70vh] flex items-center justify-center">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
            <div>
              <Image
                width={500}
                height={200}
                src="/img/wedding.avif"
                className="rounded-xl object-cover h-[300px]"
                alt=""
              />
            </div>
            <div>
              <div className="max-w-lg md:max-w-none">
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                  <CiLock className="inline-block pb-2" size={40} />
                  Privacy, our priority
                </h2>

                <p className="mt-4 text-gray-700">
                  At Maithil Milan, we prioritize the privacy and security of
                  our users. We use state-of-the-art encryption and other
                  measures to protect your personal information, including email
                  addresses and passwords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-[1340px] px-4 py-12 sm:px-6 lg:me-0 lg:py-16 lg:pe-0 lg:ps-8 xl:py-24">
          <div className="max-w-7xl items-end justify-between sm:flex sm:pe-6 lg:pe-8">
            <h2 className="max-w-xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Read trusted reviews from our users
            </h2>

            <div className="mt-8 flex gap-4 lg:mt-0">
              <button
                aria-label="Previous slide"
                onClick={handlePrevClick}
                className="rounded-full border border-rose-600 p-3 text-rose-600 transition hover:bg-rose-600 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 rtl:rotate-180"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <button
                aria-label="Next slide"
                onClick={handleNextClick}
                className="rounded-full border border-rose-600 p-3 text-rose-600 transition hover:bg-rose-600 hover:text-white"
              >
                <svg
                  className="size-5 rtl:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="-mx-6 mt-8 lg:col-span-2 lg:mx-0">
            <div ref={sliderRef} id="keen-slider" className="keen-slider">
              {[
                {
                  id: 1,
                  name: "Parikshit Jha",
                  review:
                    "Maithil Milan streamling platform has been a lifesaver for my family. It's so easy to find the perfect match for my son, and the communication is quick and efficient. Highly recommended! ",
                  header: "Exellent Service",
                },
                {
                  id: 2,
                  name: "Preeti Sharma",
                  review:
                    "I was skeptical about using a match making platform, but Maithil Milan exceeded my expectations. The process was smooth and the recommendations were spot on. Thank you! ",
                  header: "Smooth Experience",
                },
                {
                  id: 3,
                  name: "Rahul Pandey",
                  review:
                    "I was looking for a serious relationship and Maithil Milan helped me find my perfect match. The support team was also very helpful. ",
                  header: "Perfect Match",
                },
                {
                  id: 4,
                  name: "Sarita Jha",
                  review:
                    "Maithil Milan has changed the way I approach relationships. The platform is user friendly and the matches are genuine. I highly recommend it! ",
                  header: "Life Changing Experience",
                },
              ].map((_, index) => (
                <div key={index} className="keen-slider__slide">
                  <blockquote className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8 lg:p-12">
                    <div>
                      <div className="flex gap-0.5 text-[#fbbf24]">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="size-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <div className="mt-4">
                        <p className="text-2xl font-bold text-rose-600 sm:text-3xl">
                          {_.header}
                        </p>

                        <p className="mt-4 leading-relaxed text-gray-700">
                          {_.review}
                        </p>
                      </div>
                    </div>

                    <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
                      &mdash; {_.name}
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SliderSection;
