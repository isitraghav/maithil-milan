"use client";
import { useEffect, useState } from "react";
import { getAcceptedMatches } from "./server";
import CardSearch from "@/components/CardSearch";
import AcceptedMatchCard from "@/components/acceptedMatchCard";

export default function MatchesPage() {
  const [matchDetails, setMatchDetails] = useState([]);

  useEffect(() => {
    getAcceptedMatches().then(async (data) => {
      if (data) {
        console.log("data", data);
        let modifiedMatches = [];
        data.matches.forEach((match) => {
          if (match.user.id == data.id) {
            modifiedMatches = [
              ...modifiedMatches,
              {
                id: match.matchedUser.id,
                ...match.matchedUser.profile,
              },
            ];
          } else if (match.matchedUser.id == data.id) {
            modifiedMatches = [
              ...modifiedMatches,
              {
                id: match.user.id,
                ...match.user.profile,
              },
            ];
          }
        });
        console.log("modifiedMatches: ", modifiedMatches);
        setMatchDetails(modifiedMatches);
      }
    });
  }, []);

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="p-2 w-full md:w-2/3 md:p-0 mx-auto">
          <h1 className="text-3xl font-bold mb-4">Your Matches</h1>

          <div className="flex flex-col gap-2">
            {matchDetails.map((match) => (
              <div key={Math.random()}>
                <AcceptedMatchCard result={match} />
              </div>
            ))}
          </div>
          {matchDetails.length === 0 && (
            <p className="text-gray-500">No matches found</p>
          )}
        </div>
      </div>
    </>
  );
}
