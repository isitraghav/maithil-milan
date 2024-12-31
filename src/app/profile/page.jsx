"use client";
import React, { useState, useEffect } from "react";
import {
  createOrUpdateProfile,
  getuserdata,
  getUserProfile,
  getuserprofilepic,
  updateuserprofilepic,
} from "./server";
import { PiPencil, PiSpinnerLight, PiWarningBold } from "react-icons/pi";
import { UploadClient } from "@uploadcare/upload-client";
import { IoMdClose } from "react-icons/io";
import { LuImagePlus } from "react-icons/lu";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [dateofbirth, setDateofbirth] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [gender, setGender] = useState("Male");
  const [motherTongue, setmotherTongue] = useState("Hindi");
  const [religion, setReligion] = useState("Hindu");
  const [caste, setCaste] = useState("Brahmin");
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");
  const [height, setHeight] = useState(168);
  const [maritalStatus, setMaritalStatus] = useState("Unmarried");
  const [profilePic, setProfilePic] = useState(null);
  const [userphotos, setuserphotos] = useState([]);
  const [age, setAge] = useState(22);

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
        setProfession(data.profession || "");
        setHeight(data.height || 0);
        setMaritalStatus(data.maritalStatus || "Unmarried");
        setProfilePic(data.profilePic || null);
        setuserphotos(data.photos || []);
        setAge(data.age);
        getuserprofilepic().then((res) => {
          setProfilePic(res);
        });
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

  const client = new UploadClient({ publicKey: "83f044eb917deb6811d5" });
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const onProgress = ({ isComputable, value }) => {
          console.log(isComputable, value);
        };

        client.uploadFile(file, { onProgress }).then(async (file) => {
          const profilePicUrl = `https://ucarecdn.com/${file.uuid}/-/scale_crop/550x550/center/`;
          setProfilePic(profilePicUrl);
          await updateuserprofilepic(profilePicUrl);
        });
      };
      reader.readAsDataURL(file);
    }
  }

  const [photosLoading, setPhotosLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  function handleuserphotoupload(e) {
    console.log(e.target.files);

    const files = e.target.files;
    const onProgress = ({ isComputable, value }) => {
      setPhotosLoading(true);
      console.log(isComputable, Math.floor(value * 100));
      setProgress(Math.floor(value * 100));
      if (value == 1) {
        setPhotosLoading(false);
      }
    };

    Array.from(files).map(async (file) => {
      await client.uploadFile(file, { onProgress }).then((file) => {
        console.log(file);
        setuserphotos((prevPhotos) => [
          ...prevPhotos,
          `https://ucarecdn.com/${file.uuid}/`,
        ]);
      });
    });
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
              src={profilePic || "/img/user.webp"}
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
          <div className="flex gap-2">
            <div className="w-1/2 lg:w-3/4 md:w-2/3">
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
                htmlFor="age"
                className="block text-sm font-medium text-gray-700"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age || ""}
                placeholder="Enter your age"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => {
                  const today = new Date();
                  const birthYear =
                    today.getFullYear() - e.target.valueAsNumber;
                  const birthDate = new Date(
                    birthYear,
                    today.getMonth(),
                    today.getDate()
                  );
                  const formattedDate = birthDate.toISOString().split("T")[0];
                  setDateofbirth(formattedDate);
                  setAge(e.target.valueAsNumber);
                }}
              />
            </div>
          </div>

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

          {photosLoading ? (
            <div>
              <div>
                <span id="ProgressLabel" className="sr-only">
                  Loading
                </span>

                <span
                  role="progressbar"
                  aria-labelledby="ProgressLabel"
                  aria-valuenow={progress}
                  className="relative block rounded-full bg-gray-200"
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[10px]/4">
                    <span className="font-bold text-white"> {progress} </span>
                  </span>

                  <span
                    className="block h-4 rounded-full bg-indigo-600 text-center"
                    style={{ width: `${progress}%` }}
                  ></span>
                </span>
              </div>
            </div>
          ) : (
            <div className="m-2">
              {/* <label
              htmlFor="addimage"
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Upload Photots
            </label> */}
              <input
                type="file"
                name="addimage"
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
        {!(name && dateofbirth && gender && age && profilePic) && (
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
            if (!age) errors.push("Age");
            if (!gender) errors.push("Gender");

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
              age: Number(age),
            };

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
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Profile
        </button>
      </div>
    );
  }
};

export default ProfilePage;
