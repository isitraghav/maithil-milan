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
import { UploadClient } from "@uploadcare/upload-client";
import { IoMdClose } from "react-icons/io";
import { LuImagePlus } from "react-icons/lu";
import Swal from "sweetalert2";
import axios from "axios";
import { getCityFromCoordinates } from "../dashboard/server";

const ProfilePage = () => {
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [dateofbirth, setDateofbirth] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [gender, setGender] = useState("Male");
  const [motherTongue, setmotherTongue] = useState("Maithili");
  const [religion, setReligion] = useState("Hindu");
  const [caste, setCaste] = useState("Brahmin");
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

  const [loading, setLoading] = useState(true);

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
        setCaste(data.caste || "Brahmin");
        setmotherTongue(data.motherTongue || "Hindi");
        setEducation(data.education || "");
        setPhoneNumber(data.phone || "");
        setProfession(data.profession || "");
        setCoordinates({
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
        });
        setCity(data.city || "");
        setHeight(data.height || 0);
        setMaritalStatus(data.maritalStatus || "Unmarried");
        setuserphotos(data.photos || []);
        setProfilePic(data.image || "/img/user.webp");
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
      <div className="p-8 pr-0.5 pl-2 md:pr-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          {name ? "Profile" : "Complete Your Profile"}
        </h1>

        <div className="flex flex-col items-center">
          <div className="relative">
            {uploading ? (
              <>
                <div className="grid place-items-center">
                  <PiSpinnerLight size={40} className="animate-spin " />{" "}
                  Uploading
                </div>
              </>
            ) : (
              <>
                <img
                  src={profilePic || "/img/user.webp"}
                  alt="User Avatar"
                  className="rounded-full aspect-square object-cover w-32 h-32 mb-4"
                />
                <label
                  htmlFor="profilePic"
                  className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-1"
                >
                  <PiPencil size={20} className="text-white" />
                </label>
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

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="w-full">
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
            <div className="w-1/2 lg:w-1/4 md:w-1/3">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <button
                type="button"
                id="city"
                className="mt-1 text-xs md:text-md w-full px-3 py-3 md:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-[#ffffff]"
                onClick={(event) => {
                  event.target.textContent = "Loading...";
                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      const { latitude, longitude } = position.coords;
                      setCoordinates({ latitude, longitude });
                      try {
                        const data = await getCityFromCoordinates(
                          latitude,
                          longitude
                        );
                        setCity(data);
                        event.target.textContent = data;
                      } catch (error) {
                        console.error("Error fetching city:", error);
                        event.target.textContent = "Error";
                      }
                    },
                    (error) => {
                      Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: error.message,
                      });
                      event.target.textContent = "Error";
                    }
                  );
                }}
              >
                {city || "Get city"}
              </button>
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
                    <option value="Not Applicable">Not Applicable</option>
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
        </div>
        {!(name && dateofbirth && gender && profilePic) && (
          <div className="text-center text-yellow-900 flex center-all">
            <PiWarningBold size={24} />
            Complete at least 30% profile to get matches
          </div>
        )}

        <button
          onClick={async (event) => {
            const btn = event.target;
            const errors = [];
            if (!name) errors.push("Full name");
            if (!gender) errors.push("Gender");
            if (!dateofbirth) errors.push("Date of birth");
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
            await axios.get("http://ip-api.com/json").then(async (res) => {
              console.log(res);
              let awd = {
                latitude: coordinates.latitude || res.data.lat,
                longitude: coordinates.longitude || res.data.lon,
                city: city || res.data.city,
                fullName: name,
                dateOfBirth: new Date(dateofbirth).toISOString(),
                gender: gender,
                motherTongue: motherTongue,
                religion: religion,
                caste: caste,
                education: education,
                profession: profession,
                height: Number(height),
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
            });
          }}
          type="submit"
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Profile
        </button>
      </div>
    );
  }
};

export default ProfilePage;
