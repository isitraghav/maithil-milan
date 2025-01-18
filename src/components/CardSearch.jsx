import Link from "next/link";
import { useState, useEffect } from "react";
import { LuCross, LuShieldCheck, LuThumbsUp } from "react-icons/lu";
import Swal from "sweetalert2";
import { handleMatchingRequest } from "./server";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

export default function CardSearch({ result, mode }) {
  console.log("rendering: ", result);
  return (
    <div
      key={result.id}
      className="border bg-white border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center mb-4">
        <Image
          src={result.image}
          alt={result.fullName}
          width={64}
          height={64}
          className="rounded-full mr-4"
        />
        <div>
          <h4 className="font-medium text-lg text-gray-800">
            {result.fullName}
          </h4>
          <p className="text-gray-600 wrap-text">
            {result.age} years, {result.profession}
          </p>
        </div>
      </div>
      <p className="text-gray-600 mb-4">
        {result.height} cm, {result.education}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {mode == "approval" && (
            <>
              <button
                onClick={async (event) => {
                  const btn = event.currentTarget;
                  btn.disabled = true;

                  try {
                    Swal.fire({
                      title: "Accept match from " + result.fullName,
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes",
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        const res = await handleMatchingRequest(
                          result.id,
                          "Accepted"
                        );
                        console.log(res);
                        if (res) {
                          Swal.fire({
                            icon: "success",
                            title: "Match Accepted",
                            text: "The match request has been accepted",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              window.location.reload();
                            }
                          });
                        }
                      }
                    });
                  } finally {
                    btn.disabled = false;
                  }
                }}
                className="bg-pink-100 text-pink-600 p-2 rounded-l-full hover:bg-pink-200 transition-colors duration-200"
              >
                <LuThumbsUp className="w-5 h-5" />
              </button>

              <button
                onClick={async (event) => {
                  const btn = event.currentTarget;
                  btn.disabled = true;
                  try {
                    const res = await handleMatchingRequest(
                      result.id,
                      "Declined"
                    );
                    console.log(res);
                    if (res) {
                      Swal.fire({
                        icon: "success",
                        title: "Match Declined",
                        text:
                          "The match request has been declined from " +
                          result.fullName,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          window.location.reload();
                        }
                      });
                    }
                  } finally {
                    btn.disabled = false;
                  }
                }}
                className="bg-gray-100 text-black p-2 rounded-r-full transition-colors duration-200"
              >
                <IoMdClose className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
        <div className="flex space-x-2">
          <Link href={`/profile/${result.id}`}>
            <button className="bg-gray-100 py-1 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
              View Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
