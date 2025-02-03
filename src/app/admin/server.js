"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { readFileSync } from "fs";
import path from "path";

export async function getDataServerAdmin() {
  return new Promise(async (resolve, reject) => {
    const userCount = await prisma.user.count();
    const matchCount = await prisma.match.count();
    const profileCount = await prisma.profile.count();
    resolve({ userCount, matchCount, profileCount });
  });
}

export async function searchAdmin(q) {
  console.log("Searching for user with query:", q);
  const users = await prisma.user.findMany({
    where: {
      OR: [{ name: { contains: q } }, { email: { contains: q } }],
    },
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
    },
  });
  console.log("Search results:", users);
  return users;
}

export async function handleDeleteUser(id) {
  if (!(await isAdminServer())) {
    return reject(new Error("Not authorized"));
  }

  return new Promise(async (resolve, reject) => {
    try {
      await prisma.user.delete({
        where: {
          id: id,
        },
      });
      resolve(true);
    } catch (error) {
      console.error("Error deleting user:", error.message);
      resolve(false);
    }
  });
}

export async function getCoreInfo(id) {
  if (!(await isAdminServer())) {
    return {
      status: 403,
      body: JSON.stringify({ error: "Not authorized" }),
    };
  }
  return new Promise(async (resolve, reject) => {
    await prisma.user
      .findUnique({
        where: {
          id: id,
        },
        include: {
          profile: true,
          matches: true,
          matchedWith: true,
        },
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("Error fetching matches:", error);
      });
  });
}

export async function isAdminServer() {
  return new Promise(async (resolve, reject) => {
    const infoPath = path.join(process.cwd(), "src", "info.json");
    const info = JSON.parse(readFileSync(infoPath, "utf8"));
    console.log("Admins:", info.admins);
    console.log(info.admins.includes((await auth()).user.email));
    resolve(info.admins.includes((await auth()).user.email));
  });
}
