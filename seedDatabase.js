const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  // Create 4 users with associated clerk IDs
  for (let i = 0; i < 4; i++) {
    const user = await prisma.user.create({
      data: {
        clerkId: faker.string.uuid(), // Simulating a Clerk ID
        businessName: faker.company.name(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        subscribed: faker.datatype.boolean(),
      },
    });

    // Create 1-3 customers for each user
    const customerCount = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < customerCount; j++) {
      await prisma.customer.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          ssn: faker.number.int({ min: 100000000, max: 999999999 }).toString(),
          dateOfBirth: faker.date.past(),
          licenseNumber: faker.number
            .int({ min: 10000000, max: 99999999 })
            .toString(),
          userId: user.id,
        },
      });
    }

    // Create 1-5 inventory items for each user
    const inventoryCount = faker.number.int({ min: 1, max: 5 });
    for (let k = 0; k < inventoryCount; k++) {
      const inventoryItem = await prisma.inventoryItem.create({
        data: {
          make: faker.vehicle.manufacturer(),
          model: faker.vehicle.model(),
          year: faker.number.int({ min: 2000, max: 2023 }),
          price: parseFloat(faker.commerce.price({ min: 5000, max: 50000 })),
          description: faker.vehicle.type(),
          status: faker.helpers.arrayElement([
            "AVAILABLE",
            "SOLD",
            "LEASED",
            "RESERVED",
          ]),
          vin: faker.vehicle.vin(),
          userId: user.id,
        },
      });

      // Create 0-2 transactions for each inventory item
      const transactionCount = faker.number.int({ min: 0, max: 2 });
      for (let l = 0; l < transactionCount; l++) {
        const customer = await prisma.customer.findFirst({
          where: { userId: user.id },
        });

        if (customer) {
          const transaction = await prisma.transaction.create({
            data: {
              type: faker.helpers.arrayElement(["SALE", "LEASE", "BROKER"]),
              amount: inventoryItem.price,
              commission: faker.number.float({ multipleOf: 0.01 }),
              date: faker.date.past(),
              notes: faker.lorem.sentence(),
              userId: user.id,
              customerId: customer.id,
              inventoryItemId: inventoryItem.id,
            },
          });

          // Create financial details for the transaction
          await prisma.financialDetails.create({
            data: {
              downPayment: faker.number.float({ multipleOf: 0.01 }),
              monthlyPayment: faker.number.float({ multipleOf: 0.01 }),
              leaseTerm: faker.number.int({ min: 12, max: 72 }),
              interestRate: faker.number.float({
                min: 1,
                max: 10,
                precision: 0.1,
              }),
              totalLeaseCost: faker.number.float({ multipleOf: 0.01 }),
              residualValue: faker.number.float({ multipleOf: 0.01 }),
              transactionId: transaction.id,
            },
          });
        }
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
