import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync("1234", salt);
  
  const companies = [
    {
      companyName: "Tech Innovators",
      companyBranch: [
        { companyBranchName: "Tech Innovators - New York" },
        { companyBranchName: "Tech Innovators - San Francisco" },
      ],
    },
    {
      companyName: "Health Solutions",
      companyBranch: [
        { companyBranchName: "Health Solutions - Boston" },
        { companyBranchName: "Health Solutions - Los Angeles" },
      ],
    },
    {
      companyName: "Global Finance",
      companyBranch: [
        { companyBranchName: "Global Finance - London" },
        { companyBranchName: "Global Finance - Dubai" },
      ],
    },
  ];

  const departmentNames = [
    { departmentName: "HR" },
    { departmentName: "IT" },
    { departmentName: "HR" },
  ];

  const processes = [
    {
      pc_bluePrintNo: "BP001",
      pc_imageBluePrint: "image_bp001.png",
      pc_totalProcess: 5,
      pc_userId: "A002", // Replace with an existing userId
    },
    {
      pc_bluePrintNo: "BP002",
      pc_imageBluePrint: "image_bp002.png",
      pc_totalProcess: 7,
      pc_userId: "A002", // Replace with an existing userId
    },
    {
      pc_bluePrintNo: "BP003",
      pc_imageBluePrint: "image_bp003.png",
      pc_totalProcess: 4,
      pc_userId: "A002", // Replace with an existing userId
    },
  ];
  await prisma.$transaction(async (prisma) => {
    await prisma.user.create({
      data: {
        userId: "A001",
        firstName: "Fallon",
        lastName: "Erica",
        password: hash,
        companyId: null,
        companyBranchId: null,
        departmentId: null,
        role: "Admin",
        updatedAt: new Date(),
        deletedAt: null,
      },
    });

    await prisma.user.create({
      data: {
        userId: "A002",
        firstName: "Worker",
        lastName: "Erica",
        password: hash,
        companyId: null,
        companyBranchId: null,
        departmentId: null,
        role: "User",
        updatedAt: new Date(),
        deletedAt: null,
      },
    });

    for (const company of companies) {
      await prisma.company.create({
        data: {
          companyName: company.companyName,
          companyBranch: {
            create: company.companyBranch.map((branch) => ({
              companyBranchName: branch.companyBranchName,
            })),
          },
        },
      });
    }

    await prisma.department.createMany({
      data: departmentNames.map((names) => ({
        departmentName: names.departmentName,
      })),
    });

    for (const process of processes) {
      await prisma.process.create({
        data: {
          pc_bluePrintNo: process.pc_bluePrintNo,
          pc_imageBluePrint: process.pc_imageBluePrint,
          pc_totalProcess: process.pc_totalProcess,
          pc_userId: process.pc_userId,
        },
      });
    }
  });
}




seed()
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
