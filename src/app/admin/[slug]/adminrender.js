"use server";

import { prisma } from "@/prisma";

export async function getMatches(match, matchedfor, userid) {
  console.log(match);
  console.log(matchedfor);
  console.log(userid);
  let targetuser = userid == match ? matchedfor : match;
  return prisma.user.findUnique({
    where: {
      id: targetuser,
    },
  });
}
