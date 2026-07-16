import { z } from "zod";

export const loanFormSchema = z.object({
  principal: z.number({ invalid_type_error: "Enter a loan amount" }).positive("Must be greater than 0"),
  annualRate: z
    .number({ invalid_type_error: "Enter an interest rate" })
    .min(0, "Can't be negative")
    .max(100, "That's an unusually high rate — double check it"),
  termYears: z
    .number({ invalid_type_error: "Enter a loan term" })
    .positive("Must be greater than 0")
    .max(50, "That's a long term — double check it"),
});

export type LoanFormValues = z.infer<typeof loanFormSchema>;
