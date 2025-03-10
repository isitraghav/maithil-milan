"use server";
import { prisma } from "@/prisma";
import { getuserdata, getUserProfile } from "../profile/server";
import { getUserId } from "@/components/server";
import moment from "moment";

export async function getRecommendations() {
  try {
    console.log("Fetching recommendations");
    const data = await getUserProfile();
    if (!data) return [];

    const age = moment().diff(moment(data.dateOfBirth), "years");

    console.log(`Current age: ${age}`);

    // Fetch all matching profiles from the dataset
    const results = await prisma.profile.findMany({
      where: {
        maritalStatus: "Unmarried",
        email: { not: data.email },
        age: { gte: age - 5, lte: data.gender === "Male" ? 999 : age + 5 },
        religion: data.religion,
        gender: data.gender === "Male" ? "Female" : "Male",
        height: { gt: data.height },
      },
    });

    // Fetch profiles that also share the same city
    const commonCityResults = await prisma.profile.findMany({
      where: {
        maritalStatus: "Unmarried",
        email: { not: data.email },
        age: { gte: age - 5, lte: data.gender === "Male" ? 999 : age + 5 },
        religion: data.religion,
        gender: data.gender === "Male" ? "Female" : "Male",
        height: { gt: data.height },
        city: data.city,
      },
    });

    // Combine both result sets and filter out duplicates
    const allResults = [...results, ...commonCityResults];
    const uniqueResults = allResults.filter(
      (profile, index, self) =>
        self.findIndex((t) => t.id === profile.id) === index
    );

    // Shuffle the entire dataset randomly
    const shuffledResults = uniqueResults.sort(() => Math.random() - 0.5);

    return shuffledResults.slice(0, 8);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}

export async function getCoordinatesFromCity(city, ip = false) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Fetching coordinates from city:", city);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          city
        )}&format=json&limit=1`
      );
      const data = await response.json();
      console.log(data);
      if (data.length > 0) {
        if (ip) {
          resolve({
            lat: data[0].lat,
            lon: data[0].lon,
          });
        } else {
          resolve({
            lat: Number(data[0].lat),
            lon: Number(data[0].lon),
          });
        }
      } else {
        resolve({
          lat: null,
          lon: null,
        });
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      reject({
        lat: null,
        lon: null,
      });
    }
  });
}

export async function getUserMatchStatus() {
  return new Promise(async (resolve, reject) => {
    const user_id = await getUserId();
    const data = await prisma.match.findMany({
      where: {
        OR: [
          {
            userId: user_id,
          },
          {
            matchedUserId: user_id,
          },
        ],
      },
    });

    let result = {
      Pending: 0,
      Accepted: 0,
      Declined: 0,
    };
    console.log(data);
    data.forEach((match) => {
      result[match.status] = result[match.status]
        ? result[match.status] + 1
        : 1;
    });
    resolve(result);
  });
}

export async function checkProfileCompletion() {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await getUserProfile();
      if (!data) {
        resolve({
          data: null,
          completionPercentage: 0,
        });
        return;
      }
      const requiredProperties = [
        "fullName",
        "dateOfBirth",
        "gender",
        "image",
        "religion",
        "phone",
        "gotra",
        "motherTongue",
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
