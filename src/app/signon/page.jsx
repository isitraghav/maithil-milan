
import { prisma } from "@/prisma";

async function handleSignon() {
  await prisma.$connect().then(async () => {
    console.log("Connected to database");
  });
}

handleSignon();
export default function Signon() {
  return <>signon</>;
}
