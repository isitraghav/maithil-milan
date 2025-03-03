"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getUserProfile, sendMatchingRequest } from "./server";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { PiSpinnerLight, PiStarFill } from "react-icons/pi";
import jsPDF from "jspdf";
import { getreceivedmatches } from "@/app/receivedmatches/server";
import { handleMatchingRequest } from "@/components/server";
import Swal from "sweetalert2";
import { getAcceptedMatches } from "@/app/matches/server";

export default function UserProfilePage({ params }) {
  const [userid, setUserId] = useState();
  const [userData, setUserData] = useState({});
  const [userAlreadyInteracted, setUserAlreadyInteracted] = useState(false);
  const [usermatchingdata, setUsermatchingdata] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { slug } = await params;
      setUserId(slug);
      const data = await getUserProfile(slug);
      console.log("User data fetched:", data);
      setUserData(data);

      getreceivedmatches().then(async (data) => {
        if (data) {
          console.log("Received matches:", data);
          for (const res in data.matches) {
            console.log(data.matches[res]);
            if (data.matches[res].user.id === slug) {
              console.log("User has already interacted with the other user");
              setUserAlreadyInteracted(true);
              setUsermatchingdata(data.matches[res]);
              break; // Exit the loop if the user has already interacted with the other user
            }
          }
        }
      });

      getAcceptedMatches().then(async (data) => {
        if (data) {
          console.log("Accepted matches:", data);
          for (const res in data.matches) {
            console.log(data.matches[res]);
            if (data.matches[res].user.id === slug) {
              console.log("User has already interacted with the other user");
              setUserAlreadyInteracted(true);
              setUsermatchingdata(data.matches[res]);
              break; // Exit the loop if the user has already interacted with the other user
            }
          }
        }
      });
    };
    fetchData();
  }, []);

  const exportToPDF = async () => {
    const doc = new jsPDF();
    const primaryColor = "#3F51B5"; // Indigo color
    const margin = 15;
    let yPosition = margin;

    // Add header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, doc.internal.pageSize.width, 20, "F");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(`${userData.fullName}'s Profile`, margin, 15);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Create layout columns
    const col1 = margin;
    const col2 = doc.internal.pageSize.width / 2;

    // Add profile image
    if (userData.image) {
      try {
        const dataUrl = await getDataUrl(userData.image);
        doc.addImage(dataUrl, "JPEG", col1, 25, 50, 50);
        yPosition = 80; // Position below image
      } catch (error) {
        console.error("Error loading image:", error);
        yPosition = 30;
      }
    }

    // Add details section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Personal Details:", col1, yPosition);
    yPosition += 7;

    // Create details array with icons (using text symbols)
    const details = [
      {
        label: "Name",
        value: `${userData.fullName} ${userData.surname || ""}`,
      },
      { label: "Age", value: `${calculateAge(userData.dateOfBirth)} years` },
      {
        label: "Religion",
        value: `${userData.religion || "N/A"}`,
      },
      {
        label: "Gotra",
        value: userData.gotra || "N/A",
      },
      { label: "Education", value: userData.education || "N/A" },
      { label: "Profession", value: userData.professionDetails || "N/A" },
      {
        label: "Height",
        value: `${convertHeightToFeetInches(userData.height)}`,
      },
      { label: "Marital Status", value: userData.maritalStatus || "N/A" },
    ];
    if (userData.professionSector) {
      details.push({ label: "Sector", value: userData.professionSector });
    }
    if (userData.annualIncome) {
      details.push({
        label: "Annual Income",
        value: `${userData.annualIncome} per annum`,
      });
    }

    // Add details in two columns
    const half = Math.ceil(details.length / 2);
    details.forEach(({ label, value }, index) => {
      const x = index < half ? col1 : col2;
      const lineY = yPosition + (index % half) * 10;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor);
      doc.text(`${label}:`, x, lineY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(value, x + 35, lineY);
    });

    yPosition += half * 10 + 10;

    // Add section separator
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(
      margin,
      yPosition,
      doc.internal.pageSize.width - margin,
      yPosition
    );
    yPosition += 10;

    // Add additional sections (example: Family Info)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("Additional Information:", margin, yPosition);
    yPosition += 7;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const additionalInfo = [];
    if (userData.familyType) {
      additionalInfo.push(`Family Details:`);
      additionalInfo.push(`  Family Type: ${userData.familyType}`);
      if (userData.fatherName) {
        additionalInfo.push(`  Father's Name: ${userData.fatherName}`);
      }
      if (userData.fatherOccupation) {
        additionalInfo.push(
          `  Father's Occupation: ${userData.fatherOccupation}`
        );
      }
      if (userData.motherName) {
        additionalInfo.push(`  Mother's Name: ${userData.motherName}`);
      }
      if (userData.motherOccupation) {
        additionalInfo.push(
          `  Mother's Occupation: ${userData.motherOccupation}`
        );
      }
      if (userData.siblings) {
        additionalInfo.push(`  Siblings: ${userData.siblings}`);
      }
      additionalInfo.push(``);
    }
    if (
      userData.prefferedProfession ||
      userData.prefferedEducation ||
      userData.prefferedHeight ||
      userData.professionSector ||
      userData.annualIncome
    ) {
      additionalInfo.push(`Partner Preferences:`);
      if (userData.prefferedProfession) {
        additionalInfo.push(`  Profession: ${userData.prefferedProfession}`);
      }
      if (userData.prefferedEducation) {
        additionalInfo.push(`  Education: ${userData.prefferedEducation}`);
      }
      if (userData.prefferedHeight) {
        additionalInfo.push(
          `  Height: ${convertHeightToFeetInches(userData.prefferedHeight)}`
        );
      }
    }

    additionalInfo.forEach((info) => {
      doc.text(info, margin, yPosition);
      yPosition += 10;
    });

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by MaithilMilan.com • ${new Date().toLocaleDateString()}`,
      margin,
      doc.internal.pageSize.height - 10
    );

    // Save PDF
    doc.save(`${userData.fullName}_profile.pdf`);
  };

  const getDataUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const convertHeightToFeetInches = (height) => {
    const feet = Math.floor(height * 0.032808);
    const inches = Math.round((height * 0.032808 - feet) * 12);
    return `${feet} ft ${inches} inch`;
  };

  const [emblaRef, elembaApi] = useEmblaCarousel({ loop: false }, [
    Autoplay({ delay: 2000 }),
  ]);

  return (
    <div className="min-h-screen py-4 md:py-8 px-1 md:px-4 sm:px-6 lg:px-8">
      {userData.id ? (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-600 p-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <img
                src={userData.image}
                alt={userData.fullName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">
                  {userData.fullName} {userData.surname}
                </h1>
                <p className="text-indigo-100 mt-1">
                  {userData.age} years • {userData.city}, {userData.state}
                </p>
                <div className="mt-2 flex gap-2 flex-wrap justify-center sm:justify-start">
                  <span className="px-3 py-1 bg-indigo-700 rounded-full text-sm text-white">
                    {userData.gender}
                  </span>
                  <span className="px-3 py-1 bg-indigo-700 rounded-full text-sm text-white">
                    {userData.religion}
                  </span>
                  <span className="px-3 py-1 bg-indigo-700 rounded-full text-sm text-white">
                    {userData.maritalStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-2 md:p-6 grid gap-6 md:grid-cols-2">
            {/* Personal Details */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Personal Details
              </h2>
              <dl className="space-y-3">
                <DetailItem label="Gotra">{userData.gotra || "N/A"}</DetailItem>
                <DetailItem label="Height">
                  {convertHeightToFeetInches(userData.height)}
                </DetailItem>
                <DetailItem label="Date of Birth">
                  {new Date(userData.dateOfBirth).toLocaleDateString()}
                </DetailItem>
                <DetailItem label="Education">
                  {userData.education || "N/A"}
                </DetailItem>
                <DetailItem label="Profession">
                  {userData.professionDetails}
                </DetailItem>
                <DetailItem label="Annual Income">
                  ₹{userData.annualIncome?.toLocaleString() || "N/A"}
                </DetailItem>
              </dl>
            </section>

            {/* Family Details */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Family Information
              </h2>
              <dl className="space-y-3">
                <DetailItem label="Father's Name">
                  {userData.fatherName}
                </DetailItem>
                <DetailItem label="Father's Occupation">
                  {userData.fatherOccupation}
                </DetailItem>
                <DetailItem label="Mother's Name">
                  {userData.motherName}
                </DetailItem>
                <DetailItem label="Mother's Occupation">
                  {userData.motherOccupation}
                </DetailItem>
                <DetailItem label="Family Type">
                  {userData.familyType}
                </DetailItem>
                <DetailItem label="Siblings">{userData.siblings}</DetailItem>
              </dl>
            </section>

            {/* Partner Preferences */}
            {(userData.prefferedProfession ||
              userData.prefferedEducation ||
              userData.prefferedHeight) && (
              <section className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Partner Preferences
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <PreferenceCard
                    title="Profession"
                    value={userData.prefferedProfession}
                  />
                  <PreferenceCard
                    title="Education"
                    value={userData.prefferedEducation}
                  />
                  <PreferenceCard
                    title="Height"
                    value={convertHeightToFeetInches(userData.prefferedHeight)}
                  />
                </div>
              </section>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 flex flex-wrap gap-4 justify-center">
            {userAlreadyInteracted ? (
              <MatchStatusButtons userData={usermatchingdata} />
            ) : (
              <button
                onClick={async (e) => {
                  let btn = e.target;
                  btn.textContent = "Sending Request...";
                  await sendMatchingRequest(userid).then((e) => {
                    if (e == 0) {
                      btn.textContent = "Request Sent";
                    } else if (e == 2) {
                      btn.textContent = "Request Already Sent";
                    } else {
                      btn.textContent = "Can't Send Request to youself.";
                      // btn.textContent = "Error Sending Request";
                    }
                  });
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg text-white font-semibold hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2"
              >
                <PiStarFill className="text-xl" />
                Send Matching Request
                <PiStarFill className="text-xl" />
              </button>
            )}
            <button
              onClick={exportToPDF}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg text-white font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all"
            >
              Export as PDF
            </button>
          </div>

          {/* Photo Gallery */}
          {userData.photos?.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <div className="embla rounded-xl overflow-hidden" ref={emblaRef}>
                <div className="embla__container">
                  {userData.photos.map((photo, index) => (
                    <div key={index} className="embla__slide">
                      <img
                        src={photo}
                        className="object-cover h-64 w-full rounded-lg"
                        alt={`${userData.fullName}'s photo ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="embla__arrows mt-4 flex justify-center gap-4">
                  <button
                    className="embla__button p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
                    onClick={() => elembaApi?.scrollPrev()}
                  >
                    <IoMdArrowBack className="h-6 w-6 text-gray-700" />
                  </button>
                  <button
                    className="embla__button p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
                    onClick={() => elembaApi?.scrollNext()}
                  >
                    <IoMdArrowForward className="h-6 w-6 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-96">
          <PiSpinnerLight className="animate-spin text-indigo-600 h-16 w-16" />
        </div>
      )}
    </div>
  );
}

// Reusable Detail Item Component
const DetailItem = ({ label, children }) => (
  <div className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
    <dt className="font-medium text-gray-600">{label}</dt>
    <dd className="text-gray-800">{children}</dd>
  </div>
);

// Reusable Preference Card Component
const PreferenceCard = ({ title, value }) => (
  <div className="bg-indigo-50 p-4 rounded-lg">
    <h3 className="text-sm font-semibold text-indigo-600 mb-1">{title}</h3>
    <p className="text-gray-800">{value || "Not specified"}</p>
  </div>
);

// Match Status Buttons Component
const MatchStatusButtons = ({ userData }) => {
  console.log("Match Status Buttons:", userData);
  return (
    <div className="flex items-center gap-4">
      {userData.status === "Accepted" && (
        <span className="px-6 py-3 bg-green-100 text-green-800 rounded-lg font-semibold">
          ✓ Match Accepted
        </span>
      )}
      {userData.status === "Declined" && (
        <span className="px-6 py-3 bg-red-100 text-red-800 rounded-lg font-semibold">
          ✗ Match Declined
        </span>
      )}
      {userData.status === "Pending" && (
        <>
          <button
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "Accept this match?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, accept it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleMatchingRequest(userData.userId, "Accepted");
                  Swal.fire(
                    "Accepted!",
                    "The match has been accepted.",
                    "success"
                  );
                  window.location.reload();
                }
              });
            }}
            className="px-6 py-3 bg-green-100 text-green-800 rounded-lg font-semibold hover:bg-green-200 transition-colors"
          >
            Accept Match
          </button>
          <button
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "Decline this match?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, decline it!",
              })
                .then((result) => {
                  if (result.isConfirmed) {
                    handleMatchingRequest(userData.userId, "Declined");
                    Swal.fire(
                      "Declined!",
                      "The match has been declined.",
                      "success"
                    );
                    window.location.reload();
                  }
                })
                .catch((error) => {
                  Swal.fire("Error!", error.message, "error");
                });
            }}
            className="px-6 py-3 bg-red-100 text-red-800 rounded-lg font-semibold hover:bg-red-200 transition-colors"
          >
            Decline Match
          </button>
        </>
      )}
    </div>
  );
};
