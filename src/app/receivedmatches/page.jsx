"use client";
import { useEffect, useState } from "react";
import { getreceivedmatches } from "./server";
import CardSearch from "@/components/CardSearch";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getreceivedmatches().then(async (data) => {
      let modifiedMatches = [];
      data.matches.forEach((match) => {
        console.log("match analysis: ", match);
        modifiedMatches = [
          ...modifiedMatches,
          {
            id: match.user.id,
            ...match.user.profile,
          },
        ];
      });
      setMatches(modifiedMatches);
      console.log("modifiedMatches: ", modifiedMatches);
    });
  }, []);

  return (
    <>
      <div className="p-8 pr-0.5 pl-2 md:pr-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Your Matches</h1>

        {matches.map((match) => (
          <div key={match.id}>
            <CardSearch mode="approval" result={match} />
          </div>
        ))}
        {matches.length === 0 && (
          <div className="text-gray-500">No matches recieved.</div>
        )}
      </div>
    </>
  );
}
