"use server";
import { prisma } from "@/prisma";
import { getuserdata, getUserProfile } from "../profile/server";
import { getUserId } from "@/components/server";

export async function getRecommendations() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Fetching recommendations");
      const data = await getUserProfile();
      if (!data) {
        resolve([]);
        return;
      }
      const age = Math.floor(
        (new Date().getTime() - new Date(data.dateOfBirth).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      );

      console.log(`Current age: ${age}`);

      const results = await prisma.$queryRaw`
        SELECT *
        FROM profile
        WHERE maritalStatus = 'Unmarried'
        AND email != ${data.email}
        AND age >= ${age - 5} AND age <= ${
        data.gender === "Male" ? 999 : age + 5
      }
        AND religion = ${data.religion}
        AND gender = ${data.gender === "Male" ? "Female" : "Male"}
        AND height > ${data.height}
        ORDER BY RAND()
        LIMIT 3
      `;

      const commonCityResults = await prisma.$queryRaw`
        SELECT *
        FROM profile
        WHERE maritalStatus = 'Unmarried'
        AND email != ${data.email}
        AND age >= ${age - 5} AND age <= ${
        data.gender === "Male" ? 999 : age + 5
      }
        AND religion = ${data.religion}
        AND gender = ${data.gender === "Male" ? "Female" : "Male"}
        AND height > ${data.height}
        AND city = ${data.city}
        ORDER BY RAND()
        LIMIT 3
      `;

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
