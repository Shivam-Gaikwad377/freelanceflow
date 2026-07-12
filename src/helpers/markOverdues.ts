
import Invoice from "@/models/invoice.model";
export const markOverdueInvoices = async (userId: string) => {
  await Invoice.updateMany(
    {
      userId,
      dueDate: { $lt: new Date() },
      status: { $nin: ["Paid", "overdue"] },
    },
    { $set: { status: "overdue" } }
  );
};
