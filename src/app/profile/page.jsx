"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  createOrUpdateProfile,
  getUserProfile,
  updateuserprofilepic,
} from "./server";
import { auth } from "@/auth";
import { PiPencil, PiSpinnerLight } from "react-icons/pi";
import { UploadClient } from "@uploadcare/upload-client";

const ProfilePage = () => {
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [dateofbirth, setDateofbirth] = useState(new Date());
  const [gender, setGender] = useState("Male");
  const [motherTongue, setmotherTongue] = useState("Hindi");
  const [religion, setReligion] = useState("Hindu");
  const [caste, setCaste] = useState("Brahmin");
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");
  const [income, setIncome] = useState(0);
  const [profilePic, setProfilePic] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserProfile().then((data) => {
      setLoading(false);
      if (data) {
        setData(data);
        setName(data.fullName || "");
        setDateofbirth(new Date(data.dateOfBirth) || new Date());
        setGender(data.gender || "Male");
        setReligion(data.religion || "Hindu");
        setCaste(data.caste || "Brahmin");
        setmotherTongue(data.motherTongue || "Hindi");
        setEducation(data.education || "");
        setProfession(data.profession || "");
        setIncome(data.income || 0);
        setProfilePic(data.profilePic || null);
      }
    });
    console.log(data);
  }, []);

  const client = new UploadClient({ publicKey: "83f044eb917deb6811d5" });
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const onProgress = ({ isComputable, value }) => {
          console.log(isComputable, value);
        };

        client.uploadFile(file, { onProgress }).then((file) => {
          setProfilePic(
            `https://ucarecdn.com/${file.uuid}/-/scale_crop/550x550/center/`
          );
          updateuserprofilepic(profilePic);
        });
      };
      reader.readAsDataURL(file);
    }
  }

  if (loading) {
    return (
      <>
        <div className="m-auto w-full">
          <PiSpinnerLight size={40} className="animate-spin w-full h-98" />
        </div>
      </>
    );
  } else {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          {name ? "Profile" : "Complete Your Profile"}
        </h1>

        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={profilePic || "https://via.placeholder.com/150"}
              alt="User Avatar"
              className="rounded-full w-32 h-32 mb-4"
            />
            <label
              htmlFor="profilePic"
              className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-1"
            >
              <PiPencil size={20} className="text-white" />
            </label>
          </div>
        </div>

        <input
          type="file"
          id="profilePic"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            placeholder="Enter your name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex w-full gap-2">
            <div className="md:w-1/2">
              <label
                htmlFor="dateofbirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="date"
                value={new Intl.DateTimeFormat("en-CA").format(
                  new Date(dateofbirth)
                )}
                id="dateofbirth"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => {
                  setDateofbirth(e.target.value);
                }}
              />
            </div>
            <div className="w-full md:w-1/2">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                }}
                id="gender"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="flex-col md:flex-row flex w-full gap-2">
            <div className="md:w-1/3">
              <label
                htmlFor="motherTongue"
                className="block text-sm font-medium text-gray-700"
              >
                Mother Tongue
              </label>
              <select
                value={motherTongue}
                onChange={(e) => {
                  setmotherTongue(e.target.value);
                }}
                id="motherTongue"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="md:w-1/3">
              <label
                htmlFor="religion"
                className="block text-sm font-medium text-gray-700"
              >
                Religion
              </label>
              <select
                value={religion}
                onChange={(e) => {
                  setReligion(e.target.value);
                }}
                id="religion"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Jain">Jain</option>
                <option value="Sikh">Sikh</option>
                <option value="Parsi">Parsi</option>
              </select>
            </div>

            <div className="md:w-1/3">
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
                    <option value="none">none</option>
                    <option value="Shia">Shia</option>
                    <option value="Syed">Syed</option>
                    <option value="Shaikh">Shaikh</option>
                    <option value="Mughal">Mughal</option>
                    <option value="Pathan">Pathan</option>
                    <option value="Ansari">Ansari</option>
                  </>
                ) : (
                  <>
                    <option value="Not Applicable">Not Applicable</option>
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
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label
                htmlFor="education"
                className="block text-sm font-medium text-gray-700"
              >
                Education
              </label>
              <input
                value={education}
                type="text"
                id="education"
                placeholder="Enter your education"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setEducation(e.target.value)}
              />
            </div>

            <div className="w-1/2">
              <label
                htmlFor="profession"
                className="block text-sm font-medium text-gray-700"
              >
                Profession
              </label>
              <input
                type="text"
                value={profession}
                id="profession"
                placeholder="Enter your profession"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setProfession(e.target.value)}
              />
            </div>
          </div>

          <label
            htmlFor="income"
            className="block text-sm font-medium text-gray-700"
          >
            Income
          </label>
          <input
            type="number"
            value={income}
            id="income"
            placeholder="Enter your income"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            let awd = {
              fullName: name,
              dateOfBirth: new Date(dateofbirth).toISOString(),
              gender: gender,
              motherTongue: motherTongue,
              religion: religion,
              caste: caste,
              education: education,
              profession: profession,
              income: Number(income),
            };

            console.log(awd);
            createOrUpdateProfile(awd);
          }}
          type="submit"
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    );
  }
};

export default ProfilePage;
