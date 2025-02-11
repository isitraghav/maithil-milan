"use client";
import { useEffect, useState } from "react";
import { deleteRequest, getsentmatches } from "./server";
import CardSearch from "@/components/CardSearch";
import Link from "next/link";
import { LuUser, LuUserRound } from "react-icons/lu";
import { PiPhoneCall } from "react-icons/pi";
import Swal from "sweetalert2";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getsentmatches().then(async (data) => {
      let modifiedMatches = [];
      data.matches.forEach((match) => {
        modifiedMatches = [
          ...modifiedMatches,
          {
            uid: match.id,
            ...match.matchedUser.profile,
          },
        ];
      });
      setMatches(modifiedMatches);
    });
  }, []);

  const handleDeleteMatch = (uid) => {
    setMatches((prev) => prev.filter((match) => match.uid !== uid));
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="p-2 w-full md:w-2/3 md:p-0 mx-auto">
          <h1 className="text-3xl font-bold mb-4">Your Sent Matches</h1>
          <div className="flex gap-2 flex-wrap flex-col ">
            {matches.map((match) => (
              <div className="w-full" key={match.uid}>
                <MatchCard result={match} onDelete={handleDeleteMatch} />
              </div>
            ))}
          </div>
          {matches.length === 0 && (
            <div className="text-gray-500">No matches sent.</div>
          )}
        </div>
      </div>
    </>
  );
}

function MatchCard({ result, onDelete }) {
  return (
    <div>
      <div className="rounded-xl shadow-lg w-full bg-white p-2 flex flex-col md:flex-row gap-2">
        <div>
          <img
            src={result.image}
            className="w-full md:w-16 object-cover aspect-square rounded-lg"
            alt=""
          />
        </div>
        <div className="flex flex-col">
          <div>{result.fullName}</div>
          <div className="text-sm text-gray-500">
            {result.age} year old from {result.city}
          </div>
          <div>
            <span className="text-xs text-gray-500">
              Profession: {result.profession}
            </span>
          </div>
        </div>
        <div className="ml-0 md:ml-auto flex justify-center gap-2 items-center">
          <Link
            href={`/profile/${result.userId}`}
            className="bg-[#007bff] flex gap-2 center-all text-white px-2.5 py-1 rounded-lg"
          >
            <LuUserRound size={20} /> Profile
          </Link>
          <button
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
                preConfirm: async () => {
                  const success = await deleteRequest(result.uid);
                  if (success) {
                    onDelete(result.uid);
                    Swal.fire(
                      "Deleted!",
                      "Your request has been deleted.",
                      "success"
                    );
                  } else {
                    Swal.fire(
                      "Error!",
                      "There was an error deleting your request.",
                      "error"
                    );
                  }
                },
              });
            }}
            className="bg-red-500 flex gap-2 center-all text-white px-2.5 py-1 rounded-lg"
          >
            Delete Request
          </button>
        </div>
      </div>
    </div>
  );
}
