"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function createOrUpdateProfile(profileData = {}) {
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

export async function updateuserprofilepic(url) {
  console.log("Updating user profile picture:", url);
  const user = (await auth()).user;
  console.log("User email:", user.email);

  await prisma.user
    .update({
      where: {
        email: user.email,
      },
      data: {
        image: url,
      },
    })
    .then(() => {
      console.log("User profile picture updated successfully.");
    });
}

export async function getuserdata() {
  console.log("no user found, returning user's data for autofilling");
  return new Promise(async (accept, reject) => {
    const user = (await auth()).user;
    accept(user);
  });
}

export async function getuserprofilepic() {
  return new Promise(async (accept, reject) => {
    const user = (await auth()).user;
    console.log("Fetching user profile picture:", user.email);

    await prisma.user
      .findUnique({
        where: {
          email: user.email,
        },
      })
      .then((data) => {
        accept(data.image);
      });
  });
}
