import z from "zod";
import { PaymentMethod } from "./transaction.interface";

// Common fields across all transactions
export const transactionZodSchema = {
  amount: z.number().int().nonnegative(),
  fee: z.number().nonnegative().optional(),
  senderBalanceBefore: z.number().optional(),
  senderBalanceAfter: z.number().optional(),
  receiverBalanceBefore: z.number().optional(),
  receiverBalanceAfter: z.number().optional(),
  description: z.string().optional(),
};
export const addMoneyZodSchema = z.object({
  ...transactionZodSchema,
  amount: z.number().min(1, "Amount must be at least ৳1"),
  paymentMethod: z.enum(Object.values(PaymentMethod)),
});

export const withdrawMoneyZodSchema = z.object({
  ...transactionZodSchema,
  amount: z.number().min(1, "Amount must be at least ৳1"),
  paymentMethod: z.enum(Object.values(PaymentMethod)),
});

export const sendMoneyZodSchema = z.object({
  ...transactionZodSchema,
  amount: z.number().min(1, "Amount must be at least ৳1"),
  receiverEmail: z.email({ message: "Invalid email address format." }),
});

export const cashInOutZodSchema = z.object({
  ...transactionZodSchema,
  amount: z.number().min(1, "Amount must be at least ৳1"),
  receiverEmail: z.email({ message: "Invalid email address format." }),
});

