import Link from "next/link";
import Image from "next/image";
import {
  LuThumbsUp,
  LuRuler,
  LuGraduationCap,
  LuBriefcase,
  LuMapPin,
} from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import { handleMatchingRequest } from "./server";
import moment from "moment";

export default function CardSearch({ result, mode }) {
  const formatAge = (dob) => {
    if (!dob) return "N/A";
    let date = new Date(dob);
    let year = date.getFullYear();
    return new Date().getFullYear() - year;
  };

  const simpleHeight = (cm) => {
    const feet = Math.floor(cm * 0.0328084);
    const inches = Math.round((cm * 0.0328084 - feet) * 12);
    return `${feet}'${inches}"`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-all duration-200 group">
      {/* Image and Basic Info */}
      <div className="flex flex-col items-center mb-3">
        <div className="relative w-20 h-20 mb-3">
          <Image
            src={result.image}
            alt={result.fullName}
            fill
            className="rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 text-center">
          {result.fullName}, {formatAge(result.dateOfBirth)}
        </h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <LuMapPin className="w-4 h-4 mr-1" />
          {result.city}
        </div>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div className="flex items-center text-gray-600">
          <LuBriefcase className="w-4 h-4 mr-2 text-gray-400" />
          {result.professionDetails || "Professional"}
        </div>
        <div className="flex items-center text-gray-600">
          <LuGraduationCap className="w-4 h-4 mr-2 text-gray-400" />
          {result.education || "Graduate"}
        </div>
        <div className="flex items-center text-gray-600">
          <LuRuler className="w-4 h-4 mr-2 text-gray-400" />
          {simpleHeight(result.height)}
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">⛪</span>
          {result.religion}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t pt-3">
        {mode === "approval" && (
          <div className="flex gap-2">
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
                  }).then(async (result_) => {
                    console.log(result);
                    if (result_.isConfirmed) {
                      const res = await handleMatchingRequest(
                        result.userId,
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
                            window.location.href = "/matches";
                          }
                        });
                      }
                    }
                  });
                } finally {
                  btn.disabled = false;
                }
              }}
              className="p-2 text-white bg-indigo-500 rounded-full hover:bg-indigo-600 transition-colors"
            >
              <LuThumbsUp className="w-5 h-5" />
            </button>
            <button
              onClick={async (event) => {
                const btn = event.currentTarget;
                btn.disabled = true;
                try {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "Decline match from " + result.fullName,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, decline",
                  }).then(async (result_) => {
                    if (result_.isConfirmed) {
                      const res = await handleMatchingRequest(
                        result.userId,
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
                            window.location.href = "/matches";
                          }
                        });
                      }
                    }
                  });
                } finally {
                  btn.disabled = false;
                }
              }}
              className="p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <IoMdClose className="w-5 h-5" />
            </button>
          </div>
        )}

        <Link
          href={`/profile/${result.userId}`}
          className="text-sm ml-auto text-indigo-500 hover:text-indigo-600 flex items-center"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}
