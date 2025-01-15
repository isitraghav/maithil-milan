"use server";
import { prisma } from "@/prisma";
import { getuserdata, getUserProfile } from "../profile/server";

export async function getRecomendations() {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await getUserProfile();
      if (!data) {
        console.log("No data found");
        return resolve([]);
      }

      const age = Math.floor(
        (new Date().getTime() - new Date(data.dateOfBirth).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      );

      const recommendations = await prisma.profile.findMany({
        where: {
          maritalStatus: "Unmarried",
          NOT: {
            email: data.email,
          },
          age:
            data.gender === "Male"
              ? { gte: age - 5 }
              : { gte: age - 5, lte: age + 5 },
          religion: data.religion,
          gender: data.gender === "Male" ? "Female" : "Male",
          height: { gte: data.height - 25, lte: data.height + 15 },
        },
      });

      resolve(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      resolve([]);
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
        "caste",
        "motherTongue",
        "education",
        "profession",
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
