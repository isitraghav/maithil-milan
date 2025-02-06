"use client";
import { useEffect, useState } from "react";
import { searchMatch } from "./server";
import CardSearch from "@/components/CardSearch";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";

function Pagination({ context }) {
  const {
    page,
    setPage,
    searchResults,
    setSearchResults,
    reqOptions,
    setReqOptions,
  } = context;
  if (searchResults.length === 0) return null;
  return (
    <div className="flex justify-center p-2">
      {page !== 1 && (
        <button
          onClick={async () => {
            let awd = reqOptions;
            awd.page = page - 1;
            setPage(page - 1);
            setReqOptions(awd);

            console.log("searching with", awd);

            await searchMatch(awd).then((data) => {
              setSearchResults(data);
            });
          }}
          className="p-2 center-all gap-2 bg-[#ffffff] border-2 border-[#dce1e6] rounded-lg"
        >
          <IoMdArrowBack /> Back
        </button>
      )}
      <div className={`m-auto ${page !== 1 ? "" : "pl-[77px]"}`}>
        <p className="p-2 center-all gap-2 bg-[#ffffff] border-2 border-[#dce1e6] rounded-lg">
          Page {page}
        </p>
      </div>
      <button
        onClick={async (e) => {
          let awd = reqOptions;
          awd.page = page + 1;

          let btn = e.target;
          btn.disabled = true;

          console.log("searching with", awd);

          await searchMatch(awd).then((data) => {
            if (data.length > 0) {
              setPage(page + 1);
              setReqOptions(awd);
              setSearchResults(data);
            } else {
              btn.textContent = "No more results";
              btn.disabled = true;
              setTimeout(() => {
                btn.textContent = "Forward";
                btn.disabled = false;
              }, 2500);
            }
            btn.disabled = false;
          });
        }}
        className="p-2 center-all gap-2 bg-[#ffffff] border-2 border-[#dce1e6] rounded-lg"
      >
        Forward
        <IoMdArrowForward />
      </button>
    </div>
  );
}

export default function Search() {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.size > 0) {
      let awd = {
        name: searchParams.get("name") || "",
        age: searchParams.get("age"),
        age2: searchParams.get("age2"),
        gender: searchParams.get("gender"),
        religion: searchParams.get("religion") || "Hindu",
        caste: searchParams.get("caste") || "Vatsya",
      };
      setReqOptions(awd);
      setAge(awd.age);
      setAge2(awd.age2);
      setCaste(awd.caste);
      setName(awd.name);
      setGender(awd.gender);
      setReligion(awd.religion);
      searchMatch(awd)
        .then((val) => {
          console.log("results", val);
          setSearchResults(val || []);
        })
        .catch((err) => {
          console.error("Error searching", err);
        });
    }
  }, []);

  const [reqOptions, setReqOptions] = useState({});
  const [age, setAge] = useState(22);
  const [age2, setAge2] = useState(25);
  const [religion, setReligion] = useState("Hindu");
  const [caste, setCaste] = useState("Vatsya");
  const [maritalStatus, setMaritalStatus] = useState("Unmarried");
  const [height, setHeight] = useState(160);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");

  return (
    <div className="flex justify-center items-center">
      <div className="sm:w-full md:w-2/3 mt-3">
        <div className="text-2xl p-2 pb-0">Find Your Perfect Match</div>
        <div className="text-sm text-gray-500 p-2 pt-1">
          Find your perfect match based on your preferences
        </div>

        {searchResults.length !== 0 && (
          <div className="pl-2">
            <button
              onClick={async () => {
                setSearchResults([]);
              }}
              className="mt-4 p-2 font-bold text-white bg-[#007bff] rounded-lg hover:bg-[#0056b3] transition duration-150 ease-in-out"
            >
              Search Again
            </button>
          </div>
        )}
        <Pagination
          context={{
            page,
            setPage,
            searchResults,
            setSearchResults,
            reqOptions,
            setReqOptions,
          }}
        />

        {searchResults.length > 0 ? (
          <div
            className={
              searchResults.length > 1
                ? "columns-1 sm:columns-2 gap-4 space-y-4 p-4"
                : "columns-1 gap-4 space-y-4 p-4"
            }
          >
            {searchResults.map((result) => {
              result.photos = [result.image, ...result.photos];
              return (
                <div key={result.id}>
                  <CardSearch key={result.id} result={result} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full p-2">
            <div className="flex flex-col items-center p-4 bg-[#ffffff] border-2 border-[#dce1e6] rounded-lg">
              <div className="flex gap-2 w-full justify-center items-center">
                <span className="text-xl">Age:</span>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="h-10 w-16 rounded border-gray-200 text-center sm:text-sm"
                />
                <span className="text-xl">to</span>
                <input
                  type="number"
                  value={age2}
                  onChange={(e) => setAge2(Number(e.target.value))}
                  className="h-10 w-16 rounded border-gray-200 text-center sm:text-sm"
                />
              </div>
              <div className="mt-2 w-full">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Search by name"
                />
              </div>
              <div className="flex gap-2 w-full">
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
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
                {(religion === "Hindu" || religion === "Muslim") && (
                  <div className="mt-2 w-full">
                    <label
                      htmlFor="caste"
                      className="block mb-2 text-sm font-medium text-gray-700"
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
                          <option value="Sandilya">Sandilya</option>
                          <option value="Vatsya">Vatsya</option>
                          <option value="Kashyap">Kashyap</option>
                          <option value="Bharadwaj">Bharadwaj</option>
                          <option value="Prasar">Prasar</option>
                          <option value="Katyan">Katyan</option>
                          <option value="Gautam">Gautam</option>
                          <option value="Krishnaye">Krishnaye</option>
                          <option value="Garge">Garge</option>
                          <option value="Vishnubridhi">Vishnubridhi</option>
                          <option value="Sayannee">Sayannee</option>
                          <option value="Kaushik">Kaushik</option>
                          <option value="Vasishta">Vasishta</option>
                          <option value="Moudal">Moudal</option>
                          <option value="Kaundliya">Kaundliya</option>
                        </>
                      )}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-2 w-full">
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
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
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
                        name,
                        age,
                        age2,
                        religion,
                        caste,
                        maritalStatus,
                        height,
                        page,
                        pageSize,
                        gender,
                      };

                      setReqOptions(awd);
                      console.log("searching with", reqOptions);
                      btn.textContent = "Searching...";
                      setTimeout(() => {
                        btn.textContent = "Search";
                      }, 2000);
                      await searchMatch(awd).then((data) => {
                        setSearchResults(data);
                        if (data.length === 0) {
                          Swal.fire({
                            icon: "error",
                            title: "No results found",
                            text: "Try changing your search criteria",
                          });
                        }
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
        <Pagination
          context={{
            page,
            setPage,
            searchResults,
            setSearchResults,
            reqOptions,
            setReqOptions,
          }}
        />
      </div>
    </div>
  );
}
