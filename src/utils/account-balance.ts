import type { Ledger } from '@/types'

export function getAccountBalance(ledger?: Ledger | null): number {
  if (!ledger?.length) return 0

  return ledger.reduce((acc, entry) => {
    if (entry.type === 'revenue') {
      return acc + entry.value
    }

    return acc - entry.value
  }, 0)
}
