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

      console.log(`Current age: ${age}`);

      const searchRadii = [5, 10, 50, 100, 200, 500, 1000, 5000, 10000, 20000]; // Expanding radius
      let recommendations = [];
      let nearMatches = [];
      let otherMatches = [];

      for (let radius of searchRadii) {
        console.log(`Searching for matches within ${radius} km.`);
        const results = await prisma.$queryRaw`
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
          ORDER BY RAND()
          LIMIT 10;
        `;

        if (results.length > 0) {
          nearMatches = results.slice(0, 2);
          otherMatches = results.slice(2, 5);
        }

        if (nearMatches.length >= 2 && otherMatches.length >= 3) {
          break; // Stop searching when at least 5 matches are found
        }
      }

      // If we still don't have enough matches, relax some criteria
      if (nearMatches.length + otherMatches.length < 5) {
        console.log("Relaxing criteria to find more matches.");
        const relaxedResults = await prisma.$queryRaw`
          SELECT p.*, 
            (6371 * ACOS(
              COS(RADIANS(${data.latitude})) * COS(RADIANS(p.latitude)) *
              COS(RADIANS(p.longitude) - RADIANS(${data.longitude})) +
              SIN(RADIANS(${data.latitude})) * SIN(RADIANS(p.latitude))
            )) AS distance
          FROM Profile p
          JOIN User u ON p.id = u.id
          WHERE p.maritalStatus IN ('Unmarried', 'Divorced')
            AND p.email != ${data.email}
            AND p.age BETWEEN ${age - 7} AND ${age + 7}
            AND p.gender = ${data.gender === "Male" ? "Female" : "Male"}
            AND p.latitude IS NOT NULL
            AND p.longitude IS NOT NULL
          HAVING distance <= 20000
          ORDER BY RAND()
          LIMIT ${5 - (nearMatches.length + otherMatches.length)};
        `;
        otherMatches = otherMatches.concat(relaxedResults);
      }

      recommendations = [...nearMatches, ...otherMatches].slice(0, 5);
      resolve(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      resolve([]);
    }
  });
}

export async function getCityFromCoordinates(lat, lon, ip = false) {
  try {
    console.log("Fetching city from coordinates:", lat, lon);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${Number(
        lat
      )}&lon=${Number(lon)}&format=json`
    );
    const data = await response.json();
    console.log(data);
    if (ip) {
      return data.address.state;
    } else {
      return (
        data.address.city ||
        data.address.county ||
        data.address.state_district ||
        data.address.state ||
        data.address.country
      );
    }
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
        "phone",
        "caste",
        "motherTongue",
        "education",
        "profession",
        "city",
        "height",
        "maritalStatus",
      ];
      let completedProperties = 0;

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
