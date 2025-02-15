"use client";
import React, { useState, useEffect } from "react";
import {
  createOrUpdateProfile,
  getuserdata,
  getUserProfile,
  updateuserprofilepic,
  uploadFile,
} from "./server";
import { PiPencil, PiSpinnerLight, PiWarningBold } from "react-icons/pi";
import { IoMdClose, IoIosCloseCircle } from "react-icons/io";
import { LuImagePlus } from "react-icons/lu";
import Swal from "sweetalert2";

let {
  getCitiesByStateAndCountry,
  getStatesByCountry,
} = require("xcountry-state-city");

const ProfilePage = () => {
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [dateofbirth, setDateofbirth] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [gender, setGender] = useState("Male");
  const [motherTongue, setmotherTongue] = useState("Maithili");
  const [religion, setReligion] = useState("Hindu");
  const [gotra, setGotra] = useState("Vatsya");
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");
  const [height, setHeight] = useState(168);
  const [maritalStatus, setMaritalStatus] = useState("Unmarried");
  const [profilePic, setProfilePic] = useState("/img/user.webp");
  const [userphotos, setuserphotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingPics, setUploadingPics] = useState(false);
  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState("");
  const [professionSector, setProfessionSector] = useState("");
  const [professionDetails, setProfessionDetails] = useState("");
  const [annualIncome, setAnnualIncome] = useState(0);
  const [surname, setSurname] = useState("");
  const [loading, setLoading] = useState(true);
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [familyType, setFamilyType] = useState("");
  const [siblings, setSiblings] = useState(0);
  const [status, setStatus] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [activeTab, setActiveTab] = useState("basic"); // Tab navigation state

  useEffect(() => {
    setLoading(true);
    getUserProfile().then(async (data) => {
      setLoading(false);
      if (data) {
        console.log(data);
        setData(data);
        setName(data.fullName || "");
        setDateofbirth(
          data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0]
        );
        setGender(data.gender || "Male");
        setReligion(data.religion || "Hindu");
        setGotra(data.gotra || "Vatsya");
        setmotherTongue(data.motherTongue || "Hindi");
        setEducation(data.education || "");
        setPhoneNumber(data.phone || "");
        setProfession(data.profession || "");
        setCoordinates({
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
        });
        setCity(data.city || "");
        setState(data.state || "");
        setHeight(data.height || 0);
        setMaritalStatus(data.maritalStatus || "Unmarried");
        setuserphotos(data.photos || []);
        setProfilePic(data.image || "/img/user.webp");
        setProfessionSector(data.professionSector || "");
        setProfessionDetails(data.professionDetails || "");
        setAnnualIncome(data.annualIncome || 0);
        setFatherName(data.fatherName || "");
        setMotherName(data.motherName || "");
        setFamilyType(data.familyType || "");
        setMotherOccupation(data.motherOccupation || "");
        setFatherOccupation(data.fatherOccupation || "");
        setStatus(data.status || "");
        setSiblings(data.siblings || 0);
      } else {
        console.log("no existing user profile was found");
        getuserdata().then((res) => {
          setName(res.name || "");
          setProfilePic(res.image || "/img/user.webp");
        });
      }
    });
    console.log(data);
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a file to upload.",
      });
      return;
    }
    setUploading(true);
    await uploadFile(file).then((res) => {
      console.log(res);
      setProfilePic(res.filePath);
      setUploading(false);
    });
    setUploading(false);
  };

  const handleDeleteProfilePic = () => {
    Swal.fire({
      title: "Remove Profile Picture?",
      text: "This will reset to default avatar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setProfilePic("/img/user.webp");
        Swal.fire(
          "Removed!",
          "Your profile picture has been reset.",
          "success"
        );
      }
    });
  };

  function handleuserphotoupload(e) {
    const files = e.target.files;
    const upload = async (files) => {
      if (files.length === 0) {
        setUploadingPics(false);
        return;
      }
      setUploadingPics(true);
      const file = files[0];
      await uploadFile(file)
        .then((res) => {
          console.log(res);
          setuserphotos((prev) => [...prev, res.filePath]);
        })
        .then(() => {
          upload(Array.from(files).slice(1));
        });
    };
    upload(Array.from(files));
  }

  if (loading) {
    return (
      <>
        <div className="m-auto h-full w-full">
          <PiSpinnerLight size={40} className="animate-spin w-full h-98" />
        </div>
      </>
    );
  } else {
    return (
      <div className="flex items-center justify-center">
        <div className="p-2 w-full md:w-2/3 md:p-0 mx-auto">
          <h1 className="text-3xl font-bold mb-4 mt-3">
            {name ? "Profile" : "Complete Your Profile"}
          </h1>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab("basic")}
              className={`pb-2 px-4 ${
                activeTab === "basic"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab("family")}
              className={`pb-2 px-4 ${
                activeTab === "family"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Family Details
            </button>
            <button
              onClick={() => setActiveTab("partner")}
              className={`pb-2 px-4 ${
                activeTab === "partner"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Partner Preferences
            </button>
            <button
              onClick={() => setActiveTab("occupation")}
              className={`pb-2 px-4 ${
                activeTab === "occupation"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Occupation
            </button>
          </div>

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              {uploading ? (
                <div className="grid place-items-center">
                  <PiSpinnerLight size={40} className="animate-spin" />
                  Uploading
                </div>
              ) : (
                <>
                  <img
                    src={profilePic || "/img/user.webp"}
                    alt="User Avatar"
                    className="rounded-full aspect-square object-cover w-32 h-32 mb-4 hover:opacity-90 transition-opacity"
                  />
                  <label
                    htmlFor="profilePic"
                    className="absolute bottom-2 right-2 bg-gray-800 rounded-full p-1 hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <PiPencil size={20} className="text-white" />
                  </label>
                  {profilePic !== "/img/user.webp" && (
                    <button
                      onClick={handleDeleteProfilePic}
                      className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <IoIosCloseCircle size={20} className="text-white" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            id="profilePic"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Tab Content */}
          <div className="flex flex-col gap-2">
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <>
                <div className="flex gap-2">
                  <div className="w-1/2">
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
                  </div>
                  <div className="w-1/2">
                    <label
                      htmlFor="surname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Surname
                    </label>
                    <select
                      id="surname"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Surname</option>
                      <option value="Yadav">Yadav</option>
                      <option value="Singh">Singh</option>
                      <option value="Sinha">Sinha</option>
                      <option value="Prasad">Prasad</option>
                      <option value="Kumar">Kumar</option>
                      <option value="Pandey">Pandey</option>
                      <option value="Mishra">Mishra</option>
                      <option value="Tiwari">Tiwari</option>
                      <option value="Chaturvedi">Chaturvedi</option>
                      <option value="Tripathi">Tripathi</option>
                      <option value="Dwivedi">Dwivedi</option>
                      <option value="Srivastava">Srivastava</option>
                      <option value="Shukla">Shukla</option>
                      <option value="Verma">Verma</option>
                      <option value="Sharma">Sharma</option>
                      <option value="Acharya">Acharya</option>
                      <option value="Thapa">Thapa</option>
                      <option value="Rai">Rai</option>
                      <option value="Gurung">Gurung</option>
                      <option value="Magar">Magar</option>
                      <option value="Lama">Lama</option>
                      <option value="Tamang">Tamang</option>
                      <option value="Karki">Karki</option>
                      <option value="Regmi">Regmi</option>
                      <option value="Shrestha">Shrestha</option>
                      <option value="Jha">Jha</option>
                      <option value="Mishra">Mishra</option>
                      <option value="Choudhary">Choudhary</option>
                      <option value="Pathak">Pathak</option>
                      {/* Add more options as needed */}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State
                    </label>
                    <select
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      {getStatesByCountry("IN").map((state) => (
                        <option key={state.state_code} value={state.state_code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <select
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      {getCitiesByStateAndCountry("IN", state).map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex w-full gap-2">
                  <div className="w-1/2 md:w-1/2">
                    <label
                      htmlFor="dateofbirth"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateofbirth}
                      id="dateofbirth"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => {
                        console.log(e.target.value);
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
                      <option value="Maithili">Maithili</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Nepali">Nepali</option>
                      <option value="Bhojpuri">Bhojpuri</option>
                      <option value="Magahi">Magahi</option>
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
                    </select>
                  </div>

                  <div className="md:w-1/3">
                    <label
                      htmlFor="gotra"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Non-Gotra
                    </label>
                    <select
                      value={gotra}
                      onChange={(e) => {
                        setGotra(e.target.value);
                      }}
                      id="gotra"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <>
                        <option value="Not Applicable">Not Applicable</option>
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
                    </select>
                  </div>
                </div>

                <div className="w-full flex gap-2">
                  <div className="w-1/2">
                    <label
                      htmlFor="height"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Height (in cm)
                    </label>
                    <input
                      type="number"
                      value={height}
                      id="height"
                      placeholder="Enter your height"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
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
                </div>
                <div>
                  <div className="w-full">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                {uploadingPics ? (
                  <div>
                    <div
                      htmlFor="addimage"
                      className="border-2 border-dashed rounded-lg  aspect-square m-2 mt-3 h-24 grid place-items-center"
                    >
                      <PiSpinnerLight size={40} className="animate-spin" />
                      <div className="text-xs text-center px-3">
                        Uploading Your Images
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="m-2">
                    <input
                      type="file"
                      name="addimage"
                      accept="image/*"
                      id="addimage"
                      className="hidden"
                      multiple={true}
                      onChange={(e) => {
                        handleuserphotoupload(e);
                      }}
                    />
                    <div className="flex gap-4 mt-3 overflow-y-scroll">
                      {userphotos.length > 0 && (
                        <div className="w-full flex gap-2 overflow-scroll">
                          <label
                            htmlFor="addimage"
                            className="border-2 border-dashed rounded-lg  aspect-square h-24 flex justify-center items-center"
                          >
                            <LuImagePlus size={34} />
                          </label>
                          {userphotos.map((pic, index) => (
                            <div key={index} className="aspect-square h-24">
                              <div className="relative">
                                <img
                                  src={pic}
                                  draggable="false"
                                  className="rounded-lg aspect-square h-24 w-24 object-cover"
                                  key={index}
                                  alt=""
                                />
                                <button
                                  type="button"
                                  className="absolute top-0 right-0 p-1 bg-black rounded-md text-white hover:text-gray-900"
                                  onClick={() => {
                                    setuserphotos(
                                      userphotos.filter((p, i) => i !== index)
                                    );
                                  }}
                                >
                                  <IoMdClose size={24} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {userphotos.length === 0 && (
                        <label
                          htmlFor="addimage"
                          className="h-24 w-full rounded-lg border-2 border-dashed mt-3 flex justify-center items-center text-md capitalize "
                        >
                          <div className="flex gap-2 justify-center items-center">
                            <LuImagePlus size={24} />
                            add more pictures
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Family Details Tab */}
            {activeTab === "family" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Family Information</h3>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Father's Name
                    </label>
                    <input
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mother's Name
                    </label>
                    <input
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Siblings
                    </label>
                    <input
                      value={siblings}
                      onChange={(e) => setSiblings(Number(e.target.value))}
                      type="number"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Family Type
                    </label>
                    <select
                      onChange={(e) => setFamilyType(e.target.value)}
                      value={familyType}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Joint">Joint Family</option>
                      <option value="Nuclear">Nuclear Family</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="flex space-x-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="status"
                          onChange={(e) => setStatus(e.target.value)}
                          value="Middle Class"
                          checked={status === "Middle Class"}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm font-medium text-gray-700">
                          Middle Class
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          onChange={(e) => setStatus(e.target.value)}
                          name="status"
                          value="Lower Middle Class"
                          checked={status === "Lower Middle Class"}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm font-medium text-gray-700">
                          Lower Middle Class
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          onChange={(e) => setStatus(e.target.value)}
                          name="status"
                          value="Rich"
                          checked={status === "Rich"}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm font-medium text-gray-700">
                          Rich
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mother's Occupation
                    </label>
                    <input
                      type="text"
                      value={motherOccupation}
                      onChange={(e) => setMotherOccupation(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Father's Occupation
                    </label>
                    <input
                      type="text"
                      value={fatherOccupation}
                      onChange={(e) => setFatherOccupation(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Partner Preferences Tab */}
            {activeTab === "partner" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Partner Preferences</h3>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Age Range
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Height
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Education
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Profession
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Occupation Tab */}
            {activeTab === "occupation" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Occupation Details</h3>
                <div className="flex md:flex-row flex-col gap-2">
                  <div className="flex gap-2 w-full md:w-2/3">
                    <div className="w-1/2">
                      <label
                        htmlFor="professionSector"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Profession Sector
                      </label>
                      <select
                        value={professionSector}
                        id="professionSector"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setProfessionSector(e.target.value)}
                      >
                        <option value="Farming">Farming</option>
                        <option value="Private">Private</option>
                        <option value="Government">Government</option>
                      </select>
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="professionDetails"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Profession Details
                      </label>
                      <input
                        value={professionDetails}
                        onChange={(e) => setProfessionDetails(e.target.value)}
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/3">
                    <label
                      htmlFor="annualIncome"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Annual Income
                    </label>
                    <input
                      type="number"
                      value={annualIncome}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setAnnualIncome(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Progress Warning */}
            {!(name && dateofbirth && gender && profilePic) && (
              <div className="text-center text-yellow-900 flex center-all">
                <PiWarningBold size={24} />
                Complete at least 30% profile to get matches
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={async (event) => {
                const btn = event.target;
                const errors = [];
                if (!name) errors.push("Full name");
                if (!gender) errors.push("Gender");
                if (!motherTongue) errors.push("Mother Tongue");
                if (!dateofbirth) errors.push("Date of birth");
                if (typeof name !== "string" || name.trim() === "")
                  errors.push("Full name");
                if (!["Male", "Female"].includes(gender)) errors.push("Gender");
                if (
                  typeof motherTongue !== "string" ||
                  motherTongue.trim() === ""
                )
                  errors.push("Mother Tongue");
                if (
                  typeof dateofbirth !== "string" ||
                  isNaN(Date.parse(dateofbirth))
                )
                  errors.push("Date of birth");
                if (typeof religion !== "string" || religion.trim() === "")
                  errors.push("Religion");
                if (typeof gotra !== "string" || gotra.trim() === "")
                  errors.push("Gotra");

                console.log(city);
                if (!city || city === "Unknown City") errors.push("City");

                if (errors.length) {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Please fill in your ${errors.join(
                      ", "
                    )} to save your profile.`,
                  });
                  return;
                }
                btn.textContent = "Saving...";
                btn.disabled = true;
                let awd = {
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                  city: city,
                  state: state,
                  fullName: name,
                  dateOfBirth: new Date(dateofbirth).toISOString(),
                  gender: gender,
                  motherTongue: motherTongue,
                  religion: religion,
                  gotra: gotra,
                  fatherName: fatherName,
                  motherName: motherName,
                  familyType: familyType,
                  education: education,
                  profession: profession,
                  motherOccupation: motherOccupation,
                  fatherOccupation: fatherOccupation,
                  status: status,
                  professionSector: professionSector,
                  professionDetails: professionDetails,
                  siblings: Number(siblings),
                  surname: surname || null,
                  height: Number(height),
                  annualIncome: Number(annualIncome),
                  maritalStatus: maritalStatus,
                  photos: userphotos,
                  phone: phoneNumber,
                  age: Math.floor(
                    (new Date().getTime() - new Date(dateofbirth).getTime()) /
                      (1000 * 60 * 60 * 24 * 365.25)
                  ),
                  image: profilePic,
                };
                if (awd.age < 21) {
                  Swal.fire({
                    icon: "error",
                    title: "Age Restriction",
                    text: "You must be at least 21 years old to create a profile.",
                  });
                  btn.textContent = "Save Profile";
                  btn.disabled = false;
                  return;
                }

                console.log(awd);
                try {
                  await createOrUpdateProfile(awd);
                } catch (error) {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.message,
                  });
                } finally {
                  btn.textContent = "Saved Changed!";

                  setTimeout(() => {
                    btn.textContent = "Save Profile";
                    btn.disabled = false;
                  }, 2300);
                }
              }}
              type="submit"
              className="mt-4 mb-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default ProfilePage;
