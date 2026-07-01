import mongoose from "mongoose";
import dotenv from "dotenv";
import ClientModel from "@/models/client.model";   // adjust path to match your project structure
import ProjectModel from "@/models/project.model"; // adjust path to match your project structure
import InvoiceModel from "@/models/invoice.model"; // adjust path to match your project structure

dotenv.config();

const MONGODB_URI = process.env.MONGO_URL as string;
const USER_ID = new mongoose.Types.ObjectId("6a2e037519f38adc62ab9100");

// ---------- helpers ----------
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randItem<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}
// daysFromNow: offset from today in days (negative = past). spread: +/- random jitter in days.
function randDate(daysFromNow: number, spread: number) {
  const base = Date.now() + daysFromNow * 24 * 60 * 60 * 1000;
  const offset = randInt(-spread, spread) * 24 * 60 * 60 * 1000;
  return new Date(base + offset);
}

// ---------- static data pools ----------
const companies = [
  "Bluewave Digital", "Nimbus Studios", "Craftify Labs", "Solstice Media",
  "Northgate Ventures", "Pixel & Co", "Vertex Retail", "Harborline Logistics",
  "Cedar & Finch", "Orbitcore Tech",
];

const firstNames = ["Aditi", "Rahul", "Meera", "Kabir", "Ananya", "Vikram", "Sneha", "Rohan", "Isha", "Arjun"];
const lastNames = ["Sharma", "Verma", "Nair", "Kapoor", "Iyer", "Reddy", "Joshi", "Mehta", "Bose", "Chauhan"];

const projectTitles = [
  "Company Website Redesign", "Brand Identity Package", "E-commerce Storefront Build",
  "Mobile App UI/UX", "Marketing Landing Page", "Internal Dashboard Tool",
  "SEO & Content Overhaul", "Product Launch Microsite", "CRM Integration",
  "Social Media Campaign Assets", "Inventory Management System", "API Integration Project",
];

const lineItemDescriptions = [
  "UI Design", "Frontend Development", "Backend Development", "API Integration",
  "Content Writing", "SEO Optimization", "QA Testing", "Deployment & Setup",
  "Consultation Hours", "Revision Round",
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // ---------- delete previous records ----------
  const deletedClients = await ClientModel.deleteMany({ userId: USER_ID });
  const deletedProjects = await ProjectModel.deleteMany({ userId: USER_ID });
  const deletedInvoices = await InvoiceModel.deleteMany({ userId: USER_ID });
  console.log(
    `Cleared previous data — clients: ${deletedClients.deletedCount}, projects: ${deletedProjects.deletedCount}, invoices: ${deletedInvoices.deletedCount}`
  );

  // invoiceNumber is generated the same way your /api/invoices POST route does it:
  // a running count of this user's invoices, incremented by 1 for each new one.
  let invoiceCounter = await InvoiceModel.countDocuments({ userId: USER_ID });

  for (let i = 0; i < 10; i++) {
    const first = randItem(firstNames);
    const last = randItem(lastNames);
    const name = `${first} ${last}`;
    const company = companies[i];
    const domain = company.toLowerCase().replace(/[^a-z]/g, "");

    const client = await ClientModel.create({
      name,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@${domain}.com`,
      phone: `9${randInt(100000000, 999999999)}`,
      company,
      status: Math.random() < 0.85 ? "active" : "inactive",
      userId: USER_ID,
      description: `Primary contact at ${company}.`,
    });

    const numProjects = randInt(3, 4);

    for (let p = 0; p < numProjects; p++) {
      const isStarted = Math.random() < 0.6;
      const status: "open" | "in progress" | "completed" = isStarted ? "in progress" : "open";

      const project = await ProjectModel.create({
        clientId: client._id,
        client: client.name,
        title: randItem(projectTitles),
        description: `Scope of work agreed with ${client.company} covering design, development, and delivery.`,
        budget: randInt(15000, 150000),
        deadline: randDate(30, 15),
        status,
        userId: USER_ID,
        isStarted,
        StartedAt: isStarted ? randDate(-15, 10) : undefined,
      });

      const numInvoices = randInt(3, 4);

      for (let inv = 0; inv < numInvoices; inv++) {
        const numLineItems = randInt(1, 3);
        const lineItems = Array.from({ length: numLineItems }, () => ({
          description: randItem(lineItemDescriptions),
          quantity: randInt(1, 5),
          price: randInt(1000, 8000),
        }));

        const statusRoll = Math.random();
        let invStatus: "pending" | "paid" | "overdue";
        let paidAt: Date | undefined;
        const dueDate = randDate(20, 15);

        if (statusRoll < 0.4) {
          invStatus = "paid";
          paidAt = randDate(-10, 8);
        } else if (statusRoll < 0.7) {
          invStatus = "pending";
        } else {
          invStatus = "overdue";
        }

        // Matches the logic in your POST /api/invoices route
        const amount = lineItems.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );
        invoiceCounter += 1;

        await InvoiceModel.create({
          userId: USER_ID,
          projectId: project._id,
          clientId: client._id,
          client: client.name,
          amount,
          invoiceNumber: invoiceCounter,
          dueDate,
          status: invStatus,
          lineItems,
          paidAt,
        });
      }
    }

    console.log(`Seeded client ${i + 1}/10: ${client.name} (${numProjects} projects)`);
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});