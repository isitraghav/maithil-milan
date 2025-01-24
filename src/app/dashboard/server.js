"use server";
import { prisma } from "@/prisma";
import { getuserdata, getUserProfile } from "../profile/server";

export async function getRecommendations() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Fetching recommendations");
      const data = await getUserProfile();

      const age = Math.floor(
        (new Date().getTime() - new Date(data.dateOfBirth).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      );

      console.log(`Current age: ${age}`);

      const results = await prisma.profile.findMany({
        where: {
          maritalStatus: "Unmarried",
          email: { not: data.email },
          age: { gte: age - 5, lte: data.gender === "Male" ? 999 : age + 5 },
          religion: data.religion,
          gender: data.gender === "Male" ? "Female" : "Male",
          height: { gt: data.height },
        },
        take: 3,
        orderBy: { id: "desc" },
      });

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
        take: 3,
        orderBy: { id: "desc" },
      });

      const allResults = [...results, ...commonCityResults];
      const uniqueResults = allResults.filter(
        (value, index, self) =>
          self.findIndex((t) => t.id === value.id) === index
      );
      resolve([...uniqueResults]);

      resolve(results);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      resolve([]);
    }
  });
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
