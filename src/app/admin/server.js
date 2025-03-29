"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";

const isAdmin = await isAdminServer();
export async function getDataServerAdmin() {
  return new Promise(async (resolve, reject) => {
    console.log("Is admin:", isAdmin);
    if (!isAdmin) {
      return reject(new Error("Not authorized"));
    }
    const userCount = await prisma.user.count();
    const matchCount = await prisma.match.count();
    const profileCount = await prisma.profile.count();
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });
    const genderStats = await prisma.profile.groupBy({
      by: ["gender"],
      _count: {
        gender: true,
      },
    });
    resolve({ userCount, matchCount, profileCount, newUsers, genderStats });
  });
}

export async function searchAdmin(q, page) {
  console.log("Searching for user with query:", q);
  const users = await prisma.user.findMany({
    where: {
      OR: [{ name: { contains: q } }, { email: { contains: q } }, { id: q }],
    },
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
    },
    skip: (page - 1) * 10,
    take: 9,
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

import info from "../../info.js";
export async function isAdminServer() {
  return new Promise(async (resolve, reject) => {
    let user = await auth();
    if (!user) {
      resolve(false);
      return;
    }
    user = user?.user;
    try {
      const isAdmin = info.admins.includes(user.email);
      resolve(isAdmin);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getAllUsers(page = 1, perPage = 10) {
  return new Promise(async (resolve, reject) => {
    const users = await prisma.user.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });
    resolve(users);
  });
}
