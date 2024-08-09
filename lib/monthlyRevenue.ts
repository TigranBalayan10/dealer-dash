import { Transaction } from "@prisma/client";

function calculateMonthlyRevenue(transactions: Transaction[]) {
  return transactions.reduce((acc, transaction) => {
    return acc + transaction.amount;
  }, 0);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}


export { calculateMonthlyRevenue, formatCurrency };