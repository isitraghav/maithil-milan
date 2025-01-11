import Link from "next/link";

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
            {result.age} year old {result.profession}
          </div>
        </div>
        <div></div>
        <div className="ml-auto flex justify-center items-center">
          <Link
            href={`/profile/${result.id}`}
            className="bg-[#007bff] text-white px-2.5 py-1 rounded-lg"
          >
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
