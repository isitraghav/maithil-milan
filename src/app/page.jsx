"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css";
import { CiLock, CiSquareCheck } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import GoogleLoginButton from "@/components/googleLoginButton";

const SliderSection = () => {
  const sliderRef = useRef(null);
  const [slider, setSlider] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      location.href = "/dashboard";
    }
  }, [session]);

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
      <div className={`relative ${!modalOpened ? "hidden" : ""}`}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-filter backdrop-blur-sm md:backdrop-blur-xl text-white">
          <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:items-center lg:px-8">
            <div className="flex items-center justify-center flex-col text-center ltr:sm:text-left rtl:sm:text-right w-full">
              <div className="w-full flex flex-col items-center justify-center">
                <div className="border border-white/30 rounded-xl p-4">
                  <h1 className="text-xl font-extrabold pb-2">
                    Let's find your match
                  </h1>
                  <div>
                    <label htmlFor="gender" className="block text-lg text-left">
                      Looking for:
                    </label>
                    <select
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      name="Gender"
                      id="gender"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="mt-4 flex gap-1">
                    <div className="w-1/2">
                      <label htmlFor="age" className="block text-lg text-left">
                        From Age:
                      </label>
                      <select
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        name="Age"
                        id="age"
                      >
                        {Array.from({ length: 51 }, (_, index) => (
                          <option key={index} value={index + 20}>
                            {index + 20}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="age" className="block text-lg text-left">
                        To:
                      </label>
                      <select
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        name="Age"
                        id="age"
                      >
                        {Array.from({ length: 51 }, (_, index) => (
                          <option key={index} value={index + 20}>
                            {index + 20}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-rose-700 w-full text-white px-4 py-2 rounded-md mt-4"
                      onClick={async () => {
                        await signIn("google", {
                          callbackUrl: "/profile",
                        });
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>
                <button
                  className="absolute font-bold font-serif top-0 right-0 p-2"
                  onClick={() => setModalOpened(false)}
                >
                  <IoMdClose size={32} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        style={{
          background: "url('/img/bnr.webp')",
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

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => {
                    setModalOpened(true);
                  }}
                  className="block w-full rounded-lg bg-rose-700 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-800 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="md:h-[70vh] flex items-center justify-center">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
            <div>
              <div className="max-w-lg md:max-w-none">
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                  <CiSquareCheck className="inline-block pb-2" size={40} />A
                  matrimony that delivers.
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
                src="/img/bride.webp"
                className="rounded-xl object-cover h-[300px]"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      <section className="md:h-[70vh] flex items-center justify-center">
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

      <section className="s">
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

      <div className="w-full flex center-all">
        <div className="bg-white md:mx-4 md:w-11/12 w-full rounded-lg mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Trusted by Thousands
            </h2>

            <p className="mt-4 text-gray-500 sm:text-xl">
              Maithil Milan is a trusted platform for thousands of people
              worldwide. Our platform is designed to provide a seamless and
              efficient way to find your perfect match, with features such as
              automated matching, messaging, and relationship management.
            </p>
          </div>

          <dl className="mt-6 flex flex-wrap center-all gap-4 sm:mt-8">
            <div className="flex flex-col w-full md:w-1/4 rounded-lg bg-gray-100 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">
                Users
              </dt>

              <dd className="text-4xl font-extrabold text-[#be123c] md:text-5xl">
                18,000
              </dd>
            </div>

            <div className="flex flex-col w-full md:w-1/4 rounded-lg bg-gray-100 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">
                Users Matched
              </dt>

              <dd className="text-4xl font-extrabold text-[#be123c] md:text-5xl">
                11,000
              </dd>
            </div>

            <div className="flex flex-col w-full md:w-1/4 rounded-lg bg-gray-100 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">
                Website visits
              </dt>

              <dd className="text-4xl font-extrabold text-[#be123c] md:text-5xl">
                19,000
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="w-full px-2 md:px-0 flex center-all">
        <section className="w-full md:w-11/12 mx-auto">
          <div className="py-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-[#f9a949] p-8 md:p-12 lg:px-16 lg:py-24 flex center-all rounded-xl">
                <div className="mx-auto max-w-xl text-center">
                  <h2 className="text-2xl md:text-4xl font-bold text-white">
                    Get started today
                  </h2>

                  <p className="hidden text-white/90 sm:mt-4 sm:block">
                    Find your perfect match with Maithil Milan.
                  </p>

                  <div className="mt-4 md:mt-8">
                    <div className="inline-block rounded px-12 py-3 text-sm font-medium transition hover:bg-transparent hover:text-white focus:outline-none focus:ring focus:ring-yellow-400">
                      <GoogleLoginButton />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1621274790572-7c32596bc67f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=654&q=80"
                  className="h-40 rounded-xl w-full object-cover sm:h-56 md:h-full"
                />

                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                  className="h-40 rounded-xl block md:hidden lg:block w-full object-cover sm:h-56 md:h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SliderSection;
