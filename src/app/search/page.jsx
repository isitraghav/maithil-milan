"use client";
import { useState } from "react";
import { searchMatch } from "./server";
import CardSearch from "@/components/CardSearch";

export default function Search() {
  const [age, setAge] = useState(22);
  const [age2, setAge2] = useState(25);
  const [religion, setReligion] = useState("Hindu");
  const [caste, setCaste] = useState("Brahmin");
  const [maritalStatus, setMaritalStatus] = useState("Unmarried");
  const [height, setHeight] = useState(160);
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="flex justify-center items-center">
      <div className="md:w-1/2 w-full mt-3 h-screen">
        <div className="text-2xl font-bold p-2">Find Your Perfect Match</div>
        {searchResults.length > 0 ? (
          <div className="m-2">
            {searchResults.map((result) => (
              <div key={result.id}>
                <CardSearch key={result.id} result={result} />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full p-2">
            <div className="flex flex-col items-center p-4 bg-[#ffffff] border-2 border-[#dce1e6] rounded-lg">
              <div className="flex gap-2 w-full justify-center items-center">
                <span className="text-xl">Age:</span>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-10 w-16 rounded border-gray-200 text-center sm:text-sm"
                />
                <span className="text-xl">to</span>
                <input
                  type="number"
                  value={age2}
                  onChange={(e) => setAge2(e.target.value)}
                  className="h-10 w-16 rounded border-gray-200 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <div className="mt-2 w-full">
                <label
                  htmlFor="religion"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Religion
                </label>
                <select
                  id="religion"
                  value={religion}
                  onChange={(e) => {
                    setReligion(e.target.value);
                    if (e.target.value == "Any") {
                      setCaste("Any");
                    }
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="Any">Any</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Jain">Jain</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Parsi">Parsi</option>
                </select>
              </div>
              {(religion === "Hindu" ||
                religion === "Muslim" ||
                religion !== "Any") && (
                <div className="mt-2 w-full">
                  <label
                    htmlFor="caste"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {religion === "Muslim" ? "Caste/Community" : "Caste"}
                  </label>
                  <select
                    value={caste}
                    onChange={(e) => {
                      setCaste(e.target.value);
                    }}
                    id="caste"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {religion === "Muslim" ? (
                      <>
                        <option value="Any">Any</option>
                        <option value="Shia">Shia</option>
                        <option value="Syed">Syed</option>
                        <option value="Shaikh">Shaikh</option>
                        <option value="Mughal">Mughal</option>
                        <option value="Pathan">Pathan</option>
                        <option value="Ansari">Ansari</option>
                      </>
                    ) : (
                      <>
                        <option value="Any">Any</option>
                        <option value="Brahmin">Brahmin</option>
                        <option value="Baniya">Baniya</option>
                        <option value="Kshatriya">Kshatriya</option>
                        <option value="Vaishya">Vaishya</option>
                        <option value="Shudra">Shudra</option>
                        <option value="Sindhi">Sindhi</option>
                      </>
                    )}
                  </select>
                </div>
              )}
              <div className="mt-2 w-full">
                <label
                  htmlFor="maritalStatus"
                  className="block text-sm font-medium text-gray-700"
                >
                  Marital Status
                </label>
                <select
                  id="maritalStatus"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Unmarried">Unmarried</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div className="mt-2 w-full">
                <label
                  htmlFor="height"
                  className="block text-sm font-medium text-gray-700"
                >
                  Minimium Height (in cm)
                </label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Height in cm"
                />
                <div>
                  {height && (
                    <p className="text-xs text-gray-500">
                      Height in feet: {Math.floor(height / 30.48)}'
                      {Math.round(((height / 30.48) % 1) * 12)}"
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className="">
                  <button
                    onClick={async (e) => {
                      let btn = e.target;
                      let awd = {
                        age,
                        age2,
                        religion,
                        caste,
                        maritalStatus,
                        height,
                      };

                      console.log("searching with", awd);

                      btn.textContent = "Searching...";
                      setTimeout(() => {
                        btn.textContent = "Search";
                      }, 2000);
                      await searchMatch(awd).then((data) => {
                        setSearchResults(data);
                        console.log(data);
                        btn.textContent = "Search";
                      });
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl"
                  >
                    Search
                  </button>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
