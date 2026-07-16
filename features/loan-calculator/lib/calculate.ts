export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export function calculateLoan(principal: number, annualRatePercent: number, termYears: number): LoanResult {
  const monthlyRate = annualRatePercent / 100 / 12;
  const numPayments = termYears * 12;

  const monthlyPayment =
    monthlyRate === 0
      ? principal / numPayments
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = totalPayment - principal;

  return { monthlyPayment, totalPayment, totalInterest };
}
