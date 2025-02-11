"use client";
import { useEffect, useState } from "react";
import { getsentmatches } from "./server";
import CardSearch from "@/components/CardSearch";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getsentmatches().then(async (data) => {
      let modifiedMatches = [];
      data.matches.forEach((match) => {
        console.log("match analysis: ", match);
        modifiedMatches = [
          ...modifiedMatches,
          {
            id: match.matchedUserId,
            ...match.matchedUser.profile,
          },
        ];
      });
      setMatches(modifiedMatches);
      console.log("modifiedMatches: ", modifiedMatches);
    });
  }, []);

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="p-2 w-full md:w-2/3 md:p-0 mx-auto">
          <h1 className="text-3xl font-bold mb-4">Your Sent Matches</h1>

          <div className="flex flex-wrap ">
            {matches.map((match) => (
              <div className="w-full md:w-1/2" key={Math.random()}>
                <CardSearch mode="view" result={match} />
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

