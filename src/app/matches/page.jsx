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
        let modifiedMatches = [];
        data.matches.forEach((match) => {
          modifiedMatches = [
            ...modifiedMatches,
            {
              id: match.user.id,
              ...match.user.profile,
            },
          ];
        });
        console.log("modifiedMatches: ", modifiedMatches);
        setMatchDetails(modifiedMatches);
      }
    });
  }, []);

  return (
    <>
      <div className="p-8 pr-0.5 pl-2 md:pr-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Your Matches</h1>

        {matchDetails.map((match) => (
          <div key={Math.random()}>
            <AcceptedMatchCard result={match} />
          </div>
        ))}
        {matchDetails.length === 0 && (
          <p className="text-gray-500">No matches found</p>
        )}
      </div>
    </>
  );
}
