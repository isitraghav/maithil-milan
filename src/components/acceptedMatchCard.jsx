import Link from "next/link";
import { LuUser, LuUserRound } from "react-icons/lu";
import { PiPhoneCall } from "react-icons/pi";

export default function AcceptedMatchCard({ result }) {
  console.log("result: ", result);
  return (
    <div>
      <div className="rounded-xl shadow-lg  w-full bg-white p-2 flex flex-col md:flex-row gap-2">
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
        <div></div>
        <div className="ml-0 md:ml-auto flex justify-center gap-2 items-center">
          {result.phone && (
            <a
              href={
                result.phone.startsWith("+")
                  ? `tel:${result.phone}`
                  : `tel:+91${result.phone}`
              }
              className="bg-[#007bff] flex gap-2 center-all text-white mr-auto px-2.5 py-1 rounded-lg"
            >
              <PiPhoneCall size={20} /> Call
            </a>
          )}
          <Link
            href={`/profile/${result.userId}`}
            className="bg-[#007bff] flex gap-2 center-all text-white px-2.5 py-1 rounded-lg"
          >
            <LuUserRound size={20} /> Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
