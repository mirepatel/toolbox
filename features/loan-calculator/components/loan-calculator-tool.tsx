"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { Input } from "@/components/ui/input";
import { calculateLoan } from "@/features/loan-calculator/lib/calculate";
import { loanFormSchema, type LoanFormValues } from "@/features/loan-calculator/lib/schema";

const DEFAULTS: LoanFormValues = { principal: 25000, annualRate: 6.5, termYears: 5 };

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function LoanCalculatorTool() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  const values = watch();
  const isValid = Object.keys(errors).length === 0;
  const result =
    isValid &&
    typeof values.principal === "number" &&
    typeof values.annualRate === "number" &&
    typeof values.termYears === "number"
      ? calculateLoan(values.principal, values.annualRate, values.termYears)
      : null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ToolPanel>
        <div className="space-y-4">
          <div>
            <ToolLabel>Loan amount ($)</ToolLabel>
            <Input type="number" step="0.01" {...register("principal", { valueAsNumber: true })} />
            {errors.principal && <p className="mt-1 text-xs text-red-500">{errors.principal.message}</p>}
          </div>
          <div>
            <ToolLabel>Annual interest rate (%)</ToolLabel>
            <Input type="number" step="0.01" {...register("annualRate", { valueAsNumber: true })} />
            {errors.annualRate && <p className="mt-1 text-xs text-red-500">{errors.annualRate.message}</p>}
          </div>
          <div>
            <ToolLabel>Term (years)</ToolLabel>
            <Input type="number" step="1" {...register("termYears", { valueAsNumber: true })} />
            {errors.termYears && <p className="mt-1 text-xs text-red-500">{errors.termYears.message}</p>}
          </div>
        </div>
      </ToolPanel>

      <ToolPanel>
        {result ? (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground">Monthly payment</div>
              <div className="text-3xl font-semibold tracking-tight">{currency.format(result.monthlyPayment)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-muted px-3.5 py-3">
                <div className="text-xs text-muted-foreground">Total payment</div>
                <div className="mt-0.5 font-mono text-sm">{currency.format(result.totalPayment)}</div>
              </div>
              <div className="rounded-lg bg-muted px-3.5 py-3">
                <div className="text-xs text-muted-foreground">Total interest</div>
                <div className="mt-0.5 font-mono text-sm">{currency.format(result.totalInterest)}</div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Fix the highlighted fields to see your monthly payment.</p>
        )}
      </ToolPanel>
    </div>
  );
}