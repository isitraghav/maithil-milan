import { useEffect, useState } from "react";
import { getMatches } from "./adminrender";
import Link from "next/link";

export default function Minimatch({ match, userid }) {
  const [matchdata, setMatchdata] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMatches(match.userId, match.matchedUserId, userid);
      setMatchdata(data);
    };
    fetchData();
  }, []);

  return (
    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <img
        src={matchdata.image}
        alt={matchdata.name}
        className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
      />

      <div className="flex-1 ml-4 min-w-0">
        <div className="flex justify-between items-center">
          <div className="truncate">
            <h3 className="font-semibold text-gray-800 truncate">
              {matchdata.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">{matchdata.email}</p>
          </div>

          <div className="flex items-center text-sm text-gray-500 ml-4">
            <Link
              href={`/admin/${matchdata.id}`}
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
