/**
 * FreelanceFlow seed script
 *
 * Dates/statuses are derived from each other so the data is internally
 * consistent (see comments below), and project/task/invoice text comes
 * from curated, realistic pools instead of faker's nonsense generators
 * (no more "Synergize B2B paradigms" project titles or "Hack the SQL
 * interface" task names).
 *
 * Assumptions (adjust if they don't match your project):
 * 1. Models are imported via the "@/models/X" path alias. Change the
 *    import paths below if your alias/folder layout differs.
 * 2. The ObjectId you pasted (6a2e037519f38adc62ab9100) is your
 *    existing dev/test User. The script does NOT create a User doc —
 *    it assumes that user already exists. Swap USER_ID if that's wrong.
 * 3. MONGODB_URI is read from .env.local via dotenv.
 *
 * Run with:
 *   npm i -D @faker-js/faker tsx dotenv
 *   npx tsx scripts/seed.ts
 */

import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";

import ClientModel from "@/models/client.model";
import ProjectModel from "@/models/project.model";
import InvoiceModel from "@/models/invoice.model";
import Task from "@/models/task.model";
import TimeLog from "@/models/timeLog.model";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGO_URL;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI not set — check your .env.local");
}

const USER_ID = new mongoose.Types.ObjectId("6a2e037519f38adc62ab9100");
const CLIENT_COUNT = 10;
const NOW = new Date();

// ---------- curated, realistic text pools ----------
const PROJECT_TYPES = [
  "Website Redesign",
  "E-commerce Platform Development",
  "Brand Identity & Logo Design",
  "Mobile App Development (iOS)",
  "Mobile App Development (Android)",
  "SEO Optimization Campaign",
  "Marketing Landing Page",
  "CRM Integration",
  "API Development & Integration",
  "Product Launch Website",
  "Internal Dashboard Build",
  "CMS Migration",
  "Social Media Marketing Campaign",
  "UI/UX Design Overhaul",
  "Payment Gateway Integration",
  "Portfolio Website",
  "Booking System Development",
  "Email Automation Setup",
  "Performance Optimization Audit",
  "Custom WordPress Theme Development",
];

const TASK_TITLES = [
  "Draft project proposal",
  "Kickoff call with client",
  "Gather requirements and scope",
  "Create wireframes",
  "Design homepage mockup",
  "Design mobile screens",
  "Set up development environment",
  "Set up staging server",
  "Implement authentication flow",
  "Build landing page",
  "Integrate payment gateway",
  "Write API documentation",
  "Fix responsive layout bugs",
  "Optimize page load performance",
  "Run QA testing pass",
  "Client review & feedback round",
  "Revise design based on feedback",
  "Set up analytics tracking",
  "Deploy to production",
  "Prepare handoff documentation",
  "Send progress update to client",
  "Finalize invoice for milestone",
  "Set up CI/CD pipeline",
  "Write unit tests",
  "Run security audit",
  "Onboard client to new system",
];

const INVOICE_LINE_ITEMS = [
  "Website design (homepage)",
  "Frontend development",
  "Backend development",
  "UI/UX design",
  "Logo design",
  "Brand style guide",
  "SEO audit & optimization",
  "Content writing",
  "Monthly retainer",
  "Hosting & domain setup",
  "Bug fixes & QA",
  "API integration",
  "Consulting hours",
  "Project management",
  "Revisions round",
  "Performance optimization",
  "Mobile app development",
  "Database setup",
  "Third-party integration",
  "Training & onboarding session",
];

const CLIENT_NOTES = [
  "Long-term retainer client, mostly ongoing design work.",
  "One-off project so far, may return for future work.",
  "Referred by an existing client.",
  "Found via portfolio site inquiry.",
  "Repeat client, usually books quarterly projects.",
  "Startup founder, budget-conscious but flexible on timeline.",
  "Enterprise client, requires formal contracts and NDAs.",
  "Small business owner, prefers async communication.",
];

// ---------- small date/random helpers ----------
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

/** Random date between from/to. Guarantees to > from so it never throws. */
const randomDateBetween = (from: Date, to: Date) => {
  const fromMs = from.getTime();
  const toMs = Math.max(to.getTime(), fromMs + 60_000); // at least 1 min span
  return new Date(fromMs + Math.random() * (toMs - fromMs));
};

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  console.log("Clearing existing data for this user...");
  await Promise.all([
    ClientModel.deleteMany({ userId: USER_ID }),
    ProjectModel.deleteMany({ userId: USER_ID }),
    InvoiceModel.deleteMany({ userId: USER_ID }),
    Task.deleteMany({ userId: USER_ID }),
    TimeLog.deleteMany({ userId: USER_ID }),
  ]);

  // ---------- Clients ----------
  const usedEmails = new Set<string>();
  const usedPhones = new Set<string>();

  const uniqueEmail = () => {
    let email = faker.internet.email().toLowerCase();
    while (usedEmails.has(email)) email = faker.internet.email().toLowerCase();
    usedEmails.add(email);
    return email;
  };
  const uniquePhone = () => {
    let phone = faker.phone.number();
    while (usedPhones.has(phone)) phone = faker.phone.number();
    usedPhones.add(phone);
    return phone;
  };

  const clientsToInsert = Array.from({ length: CLIENT_COUNT }, () => ({
    _id: new mongoose.Types.ObjectId(),
    name: faker.person.fullName(),
    email: uniqueEmail(),
    phone: uniquePhone(),
    company: faker.company.name(),
    status: faker.helpers.arrayElement(["active", "inactive"] as const),
    userId: USER_ID,
    description: faker.helpers.arrayElement(CLIENT_NOTES),
  }));

  const clients = await ClientModel.insertMany(clientsToInsert);
  console.log(`Inserted ${clients.length} clients`);

  // ---------- Projects ----------
  // Each project gets a coherent {status, StartedAt, deadline} triple:
  //   open         -> not started yet, deadline is a future target
  //   in progress  -> started in the past; deadline may already be
  //                   behind (running late) or still ahead
  //   completed    -> started and finished in the past (deadline < now)
  function buildProjectTimeline(clientStatus: "active" | "inactive") {
    const status = clientStatus === "inactive"
      ? "completed"
      : faker.helpers.weightedArrayElement([
          { weight: 2, value: "open" as const },
          { weight: 4, value: "in progress" as const },
          { weight: 3.5, value: "completed" as const },
        ]);

    if (status === "open") {
      return { status, isStarted: false, StartedAt: undefined, deadline: addDays(NOW, randInt(15, 90)) };
    }
    if (status === "in progress") {
      const StartedAt = addDays(NOW, -randInt(5, 60));
      const deadline = addDays(StartedAt, randInt(20, 90)); // may land before or after NOW
      return { status, isStarted: true, StartedAt, deadline };
    }
    // completed: deadline already passed, StartedAt before that
    const deadline = addDays(NOW, -randInt(1, 60));
    const StartedAt = addDays(deadline, -randInt(15, 90));
    return { status, isStarted: true, StartedAt, deadline };
  }

  const projectsToInsert: any[] = [];
  for (const client of clients) {
    const projectCount = randInt(4, 5);
    for (let p = 0; p < projectCount; p++) {
      const { status, isStarted, StartedAt, deadline } = buildProjectTimeline(client.status);
      const title = faker.helpers.arrayElement(PROJECT_TYPES);

      projectsToInsert.push({
        _id: new mongoose.Types.ObjectId(),
        clientId: client._id,
        client: client.name,
        title,
        description: `${title} engagement for ${client.company}.`,
        budget: faker.number.int({ min: 1000, max: 20000 }),
        deadline,
        status,
        userId: USER_ID,
        isStarted,
        StartedAt,
        hourlyRate: faker.number.int({ min: 20, max: 150 }),
      });
    }
  }

  const projects = await ProjectModel.insertMany(projectsToInsert);
  console.log(`Inserted ${projects.length} projects`);

  // ---------- Invoices, Tasks, TimeLogs ----------
  const taskPriorities = ["low", "medium", "high"] as const;

  const lastInvoice = await InvoiceModel.findOne()
    .sort({ invoiceNumber: -1 })
    .lean<{ invoiceNumber: number }>();
  let invoiceCounter = (lastInvoice?.invoiceNumber ?? 0) + 1;

  const invoicesToInsert: any[] = [];
  const tasksToInsert: any[] = [];
  const timeLogsToInsert: any[] = [];

  for (const project of projects) {
    const client = clients.find((c) => c._id.equals(project.clientId))!;
    const isCompleted = project.status === "completed";
    const isOpen = project.status === "open";
    // Work can only exist between when the project started and either
    // "now" (still ongoing) or its deadline (already wrapped up).
    const windowEnd = isCompleted ? project.deadline : NOW;

    // ----- Tasks -----
    const taskCount = randInt(4, 5);
    // Distinct titles per project — (userId, projectId, title) is uniquely
    // indexed on the Task model, so picking with replacement would
    // eventually collide (as it just did with "Deploy to production").
    const taskTitles = faker.helpers.arrayElements(TASK_TITLES, taskCount);
    for (let t = 0; t < taskCount; t++) {
      const title = taskTitles[t];

      if (isOpen) {
        // Nothing has started — only forward-looking planning tasks.
        tasksToInsert.push({
          userId: USER_ID,
          projectId: project._id,
          title,
          priority: faker.helpers.arrayElement(taskPriorities),
          dueDate: randomDateBetween(NOW, project.deadline),
          status: "pending",
          completedAt: undefined,
        });
        continue;
      }

      if (isCompleted) {
        // Finished project -> every task got done before the deadline.
        const dueDate = randomDateBetween(project.StartedAt!, project.deadline);
        tasksToInsert.push({
          userId: USER_ID,
          projectId: project._id,
          title,
          priority: faker.helpers.arrayElement(taskPriorities),
          dueDate,
          status: "completed",
          completedAt: randomDateBetween(dueDate, project.deadline),
        });
        continue;
      }

      // in progress -> a realistic mix
      const taskStatus = faker.helpers.weightedArrayElement([
        { weight: 4, value: "pending" as const },
        { weight: 3.5, value: "completed" as const },
        { weight: 2.5, value: "overdue" as const },
      ]);

      if (taskStatus === "pending") {
        tasksToInsert.push({
          userId: USER_ID,
          projectId: project._id,
          title,
          priority: faker.helpers.arrayElement(taskPriorities),
          dueDate: addDays(NOW, randInt(1, 20)), // not due yet
          status: "pending",
          completedAt: undefined,
        });
      } else if (taskStatus === "overdue") {
        tasksToInsert.push({
          userId: USER_ID,
          projectId: project._id,
          title,
          priority: faker.helpers.arrayElement(taskPriorities),
          dueDate: randomDateBetween(project.StartedAt!, NOW), // already past
          status: "overdue",
          completedAt: undefined,
        });
      } else {
        const dueDate = randomDateBetween(project.StartedAt!, NOW);
        tasksToInsert.push({
          userId: USER_ID,
          projectId: project._id,
          title,
          priority: faker.helpers.arrayElement(taskPriorities),
          dueDate,
          status: "completed",
          completedAt: randomDateBetween(dueDate, NOW),
        });
      }
    }

    if (isOpen) continue; // no invoices or time logs for un-started work

    // ----- Invoices -----
    const invoiceCount = randInt(4, 5);
    for (let i = 0; i < invoiceCount; i++) {
      const lineItems = Array.from({ length: randInt(1, 4) }, () => ({
        description: faker.helpers.arrayElement(INVOICE_LINE_ITEMS),
        quantity: randInt(1, 10),
        price: faker.number.int({ min: 50, max: 500 }),
      }));
      const amount = lineItems.reduce((sum, li) => sum + li.quantity * li.price, 0);

      const issueDate = randomDateBetween(project.StartedAt!, windowEnd);
      const dueDate = addDays(issueDate, randInt(14, 30));

      let status: "pending" | "Paid" | "overdue";
      let paidAt: Date | undefined;

      if (isCompleted) {
        // wrapped-up project -> everything's been invoiced already
        status = faker.helpers.weightedArrayElement([
          { weight: 3, value: "Paid" as const },
          { weight: 1, value: "overdue" as const },
        ]);
        paidAt = status === "Paid" ? randomDateBetween(issueDate, project.deadline) : undefined;
      } else if (dueDate > NOW) {
        status = "pending"; // not due yet
      } else {
        status = faker.helpers.weightedArrayElement([
          { weight: 3, value: "Paid" as const },
          { weight: 2, value: "overdue" as const },
        ]);
        paidAt = status === "Paid" ? randomDateBetween(issueDate, NOW) : undefined;
      }

      invoicesToInsert.push({
        invoiceNumber: invoiceCounter++,
        userId: USER_ID,
        projectId: project._id,
        project: project.title,
        amount,
        issueDate,
        dueDate,
        status,
        lineItems,
        clientId: client._id,
        client: client.name,
        paidAt,
      });
    }

    // ----- TimeLogs -----
    const timeLogCount = randInt(4, 5);
    for (let tl = 0; tl < timeLogCount; tl++) {
      const bufferedEnd = new Date(windowEnd.getTime() - 60 * 60 * 1000); // leave room for duration
      const startTime = randomDateBetween(project.StartedAt!, bufferedEnd);
      const maxDuration = Math.min(4 * 3600, Math.max(900, (windowEnd.getTime() - startTime.getTime()) / 1000));
      const durationSeconds = randInt(900, Math.max(900, maxDuration));
      const endTime = new Date(Math.min(startTime.getTime() + durationSeconds * 1000, windowEnd.getTime()));

      timeLogsToInsert.push({
        userId: USER_ID,
        projectId: project._id,
        startTime,
        endTime,
        duration: Math.round((endTime.getTime() - startTime.getTime()) / 1000),
        source: faker.helpers.arrayElement(["manual", "stopwatch"] as const),
        status: "completed", // app enforces one active timer per user globally
      });
    }
  }

  const invoices = await InvoiceModel.insertMany(invoicesToInsert);
  console.log(`Inserted ${invoices.length} invoices`);

  const tasks = await Task.insertMany(tasksToInsert);
  console.log(`Inserted ${tasks.length} tasks`);

  const timeLogs = await TimeLog.insertMany(timeLogsToInsert);
  console.log(`Inserted ${timeLogs.length} time logs`);

  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});