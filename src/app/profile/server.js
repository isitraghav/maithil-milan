"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";
import { v4 } from "uuid";

export async function createOrUpdateProfile(profileData = {}) {
  // Validation
  if (!profileData.dateOfBirth) {
    throw new Error("Date of birth is required");
  }

  if (!profileData.fullName) {
    throw new Error("Name is required");
  }

  if (!profileData.religion) {
    throw new Error("Religion is required");
  }

  if (profileData.dateOfBirth) {
    const age = Math.floor(
      (new Date().getTime() - new Date(profileData.dateOfBirth).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25)
    );
    if (age < 18) {
      throw new Error("You must be at least 18 years old to create a profile");
    }
  }
  const email = (await auth()).user.email;
  profileData["email"] = email;
  console.log("user data input: ", profileData);

  let userid;
  await prisma.user
    .findUnique({
      where: { email: email },
    })
    .then((user) => {
      userid = user.id;
      console.log("User ID:", userid);
    })
    .catch((error) => {
      console.error("Error fetching user:", error.message);
      throw error;
    });

  try {
    // Check if the user already has a profile
    const existingProfile = await prisma.profile.findUnique({
      where: { email: email },
    });
    console.log("Existing profile:", existingProfile);

    // If profile exists, update it; otherwise, create a new one
    let profile;
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { email: email },
        data: profileData,
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          ...profileData,
          user: {
            connect: {
              id: userid,
            },
          },
        },
      });
    }

    console.log("Profile successfully created/updated:", profile);
    return profile;
  } catch (error) {
    console.error("Error creating/updating profile:", error.message);
    throw error;
  }
}

export async function getUserProfile() {
  return new Promise(async (resolve, reject) => {
    const user = (await auth()).user;
    console.log("Fetching user profile:", user.email);

    let data;
    prisma.profile
      .findUnique({
        where: {
          email: user.email,
        },
      })
      .then((data) => {
        data = data;
        console.log("User profile fetched:", data);
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function getuserdata() {
  console.log("no user found, returning user's data for autofilling");
  return new Promise(async (accept, reject) => {
    const user = (await auth()).user;
    accept(user);
  });
}

export async function uploadFile(file) {
  const uploadDir = path.join(process.cwd(), "/uploads");

  // Ensure the upload directory exists
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  // Read the file buffer from the uploaded file
  const fileBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(fileBuffer);

  // Generate unique file name and path
  const fileName = `${v4()}.webp`;
  const filePath = path.join(uploadDir, fileName);

  try {
    await sharp(inputBuffer)
      .webp({ quality: 80 }) // Adjust quality as needed
      .toFile(filePath);

    return { filePath: `/api/uploads/${fileName}` }; // Return the public URL
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("File upload failed");
  }
}

