"use server";
import { prisma } from "@/prisma";
import { getuserdata, getUserProfile } from "../profile/server";

export async function getRecomendations() {
  return new Promise(async (resolve, reject) => {
    getUserProfile().then(async (data) => {
      const recommendationInput = {
        id: "cm5nquh6m00016xdo1y7lf42h",
        email: "isitraghav@gmail.com",
        fullName: "Raghav Yadav",
        dateOfBirth: new Date("2003-01-07T00:00:00.000Z"),
        gender: "Male",
        image:
          "https://lh3.googleusercontent.com/a/ACg8ocKiq5oKtj9e0W9JE4htuR-apLB7s3WXvb5HXOAqjL2yM1z2CAk=s96-c",
        age: 22,
        religion: "Hindu",
        caste: "Brahmin",
        motherTongue: "Maithili",
        education: "",
        profession: "",
        height: 168,
        maritalStatus: "Unmarried",
        bio: null,
        photos: [],
      };

      const age = Math.floor(
        (new Date().getTime() - new Date(data.dateOfBirth).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      );
      await prisma.profile
        .findMany({
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
            // caste: data.caste,
            gender: data.gender === "Male" ? "Female" : "Male",
            height: { gte: data.height - 25, lte: data.height + 15 },
          },
        })
        .then((data) => {
          resolve(data);
        });
    });
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
      console.error(error);
      reject(error);
    }
  });
}
