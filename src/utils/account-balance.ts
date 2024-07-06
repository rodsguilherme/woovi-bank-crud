import type { Ledger } from "@/types";

/**
 * Calculates the balance of an account based on the ledger entries.
 * @param ledger - The ledger entries containing the value, date, and type ('revenue' or 'expense').
 * @returns The calculated account balance.
 */
export function getAccountBalance(ledger?: Ledger | null): number {
  if (!ledger?.length) return 0;

  return ledger.reduce((acc, entry) => {
    if (entry.type === "revenue") {
      return acc + entry.value;
    }

    return acc - entry.value;
  }, 0);
}
