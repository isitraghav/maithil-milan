import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const users = [];

  for (let i = 0; i < 1000; i++) {
    const userId = uuidv4().replace(/-/g, "");
    const email = faker.internet.email();
    const gender = faker.helpers.arrayElement(["Male", "Female"]);
    const fullName =
      gender === "Male"
        ? faker.person.firstName("male") + " " + faker.person.lastName()
        : faker.person.firstName("female") + " " + faker.person.lastName();

    const dateOfBirth = faker.date.birthdate({ min: 18, max: 50, mode: "age" });
    const age = new Date().getFullYear() - dateOfBirth.getFullYear();

    const indianCities = [
      {
        city: "Mumbai",
        state: "Maharashtra",
        latitude: 19.076,
        longitude: 72.8777,
      },
      { city: "Delhi", state: "Delhi", latitude: 28.7041, longitude: 77.1025 },
      {
        city: "Bangalore",
        state: "Karnataka",
        latitude: 12.9716,
        longitude: 77.5946,
      },
      {
        city: "Hyderabad",
        state: "Telangana",
        latitude: 17.385,
        longitude: 78.4867,
      },
      {
        city: "Chennai",
        state: "Tamil Nadu",
        latitude: 13.0827,
        longitude: 80.2707,
      },
      {
        city: "Kolkata",
        state: "West Bengal",
        latitude: 22.5726,
        longitude: 88.3639,
      },
      {
        city: "Pune",
        state: "Maharashtra",
        latitude: 18.5204,
        longitude: 73.8567,
      },
      {
        city: "Ahmedabad",
        state: "Gujarat",
        latitude: 23.0225,
        longitude: 72.5714,
      },
    ];
    const { city, latitude, longitude, state } =
      faker.helpers.arrayElement(indianCities);

    const education = faker.helpers.arrayElement([
      "B.Tech",
      "M.Tech",
      "MBA",
      "MBBS",
      "B.Sc",
      "M.Sc",
      "PhD",
    ]);
    const profession = faker.helpers.arrayElement([
      "Software Engineer",
      "Doctor",
      "Teacher",
      "Banker",
      "Lawyer",
      "Businessman",
    ]);
    const phone = faker.phone.number("+91 ##########");
    const religionOptions = [
      "Hindu",
      "Muslim",
      "Christian",
      "Buddhist",
      "Jain",
      "Sikh",
      "Parsi",
    ];
    const religion = faker.helpers.arrayElement(religionOptions);
    const casteOptions = [
      "Sandilya",
      "Vatsya",
      "Kashyap",
      "Bharadwaj",
      "Prasar",
      "Katyan",
      "Gautam",
      "Krishnaye",
      "Garge",
      "Vishnubridhi",
      "Sayannee",
      "Kaushik",
      "Vasishta",
      "Moudal",
      "Kaundliya",
    ];
    const caste = faker.helpers.arrayElement(casteOptions);
    const maritalStatus = faker.helpers.arrayElement([
      "Unmarried",
      "Divorced",
      "Widowed",
    ]);

    const user = await prisma.user.create({
      data: {
        id: userId,
        name: fullName,
        email,
        emailVerified: new Date(),
        image: faker.image.avatar(),
        profile: {
          create: {
            email,
            fullName,
            dateOfBirth,
            gender,
            age,
            religion,
            caste,
            motherTongue: faker.helpers.arrayElement([
              "Maithili",
              "Hindi",
              "Nepali",
              "Bhojpuri",
              "Magahi",
              "English",
            ]),
            phone,
            latitude,
            longitude,
            state,
            city,
            education,
            profession,
            height: faker.number.int({ min: 150, max: 190 }),
            maritalStatus,
            bio: faker.lorem.sentence(),
            photos: [faker.image.avatar(), faker.image.avatar()],
          },
        },
      },
    });
    users.push(user);
  }

  // Randomly match some users
  for (let i = 0; i < users.length / 2; i++) {
    const user1 = faker.helpers.arrayElement(users);
    let user2 = faker.helpers.arrayElement(users);

    while (user1.id === user2.id) {
      user2 = faker.helpers.arrayElement(users);
    }

    await prisma.match.create({
      data: {
        userId: user1.id,
        matchedUserId: user2.id,
        status: faker.helpers.arrayElement(["Pending", "Accepted", "Declined"]),
      },
    });
  }

  console.log("Users and some matches created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
