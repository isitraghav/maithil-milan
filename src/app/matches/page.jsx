"use client";

import { useEffect, useState } from "react";
import { getUserMatches } from "./server";

export default function MatchesPage() {
  const [matchDetails, setMatchDetails] = useState([]);
  useEffect(() => {
    getUserMatches().then((data) => {
      console.log("data", data);
    });
  }, []);
  return (
    <div className="p-8 pr-0.5 pl-2 md:pr-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Matches</h1>
    </div>
  );
}
