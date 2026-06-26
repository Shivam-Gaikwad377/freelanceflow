
import Invoice from "@/models/invoice.model";
export const markOverdueInvoices = async (userId: string) => {
  await Invoice.updateMany(
    {
      userId,
      dueDate: { $lt: new Date() },
      status: { $nin: ["paid", "overdue"] },
    },
    { $set: { status: "overdue" } }
  );
};
