"use server";
import { prisma } from "@/prisma";
import { getuserdata, getUserProfile } from "../profile/server";

export async function getRecommendations() {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await getUserProfile();
      if (!data || !data.latitude || !data.longitude) {
        console.log("No data found or location missing");
        return resolve([]);
      }

      const age = Math.floor(
        (new Date().getTime() - new Date(data.dateOfBirth).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      );

      const searchRadii = [5, 10, 50, 100, 200, 500, 1000, 5000]; // Expanding radius
      let recommendations = [];

      for (let radius of searchRadii) {
        recommendations = await prisma.$queryRaw`
          SELECT p.*, 
            (6371 * ACOS(
              COS(RADIANS(${data.latitude})) * COS(RADIANS(p.latitude)) *
              COS(RADIANS(p.longitude) - RADIANS(${data.longitude})) +
              SIN(RADIANS(${data.latitude})) * SIN(RADIANS(p.latitude))
            )) AS distance
          FROM Profile p
          JOIN User u ON p.id = u.id
          WHERE p.maritalStatus = 'Unmarried'
            AND p.email != ${data.email}
            AND p.age BETWEEN ${age - 5} AND ${
          data.gender === "Male" ? "999" : age + 5
        }
            AND p.religion = ${data.religion}
            AND p.gender = ${data.gender === "Male" ? "Female" : "Male"}
            AND p.height BETWEEN ${data.height - 25} AND ${data.height + 15}
            AND p.latitude IS NOT NULL
            AND p.longitude IS NOT NULL
          HAVING distance <= ${radius}
          ORDER BY distance ASC;
        `;

        if (recommendations.length > 0) {
          console.log(
            `Found ${recommendations.length} matches within ${radius} km.`
          );
          break; // Stop searching when matches are found
        }
      }

      resolve(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      resolve([]);
    }
  });
}

export async function getCityFromCoordinates(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    console.log(data);
    return (
      data.address.city ||
      data.address.county ||
      data.address.state_district ||
      data.address.state ||
      data.address.country
    );
  } catch (error) {
    console.error("Error fetching city:", error);
    return "Unknown City";
  }
}

export async function checkProfileCompletion() {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await getUserProfile();

      const requiredProperties = [
        "fullName",
        "dateOfBirth",
        "gender",
        "image",
        "religion",
        "caste",
        "motherTongue",
        "education",
        "profession",
        "city",
        "height",
        "maritalStatus",
      ];
      let completedProperties = 0;

      console.log("Checking profile completion for:", data?.email);

      requiredProperties.forEach((property) => {
        if (
          data?.hasOwnProperty(property) &&
          data[property] !== null &&
          data[property] !== ""
        ) {
          completedProperties++;
        }
      });

      const completionPercentage = Math.floor(
        (completedProperties / requiredProperties.length) * 100
      );

      console.log(
        `Profile completion percentage for ${
          data?.email || "unknown"
        } is ${completionPercentage}%`
      );

      resolve({
        data: data,
        completionPercentage: completionPercentage,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
