"use client";
import { useEffect, useState } from "react";
import { getMatchInfo, getUserMatches } from "./server";
import CardSearch from "@/components/CardSearch";

export default function MatchesPage() {
  const [matchDetails, setMatchDetails] = useState([]);

  useEffect(() => {
    getUserMatches().then(async (data) => {
      console.log(data);
      await data.matches.forEach(async (match) => {
        await getMatchInfo(match.id).then((matchDetails) => {
          console.log(matchDetails);
          if (matchDetails) {
            setMatchDetails((matchDetails_prev) => [
              ...matchDetails_prev,
              matchDetails,
            ]);
          }
        });
      });
    });
  }, []);

  return (
    <>
      <div className="p-8 pr-0.5 pl-2 md:pr-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Your Matches</h1>

        {matchDetails.forEach((match) => (
          <div key={match.id}>
            <CardSearch result={match} />
          </div>
        ))}
        {matchDetails.length === 0 && (
          <p className="text-gray-500">No matches found</p>
        )}
        
      </div>
    </>
  );
}
