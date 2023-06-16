import type { Transaction } from 'xrpl'
import type { BaseTransaction } from 'xrpl/dist/npm/models/transactions/common'
import type { TransactionMetadata } from 'xrpl/dist/npm/models/transactions'
import logger from './lib/logger'
import { formatTransaction } from './lib/utils'
import { getTransaction as getRippledTransaction } from './lib/rippled'
import summarizeTransaction from './lib/txSummary'

const log = logger({ name: 'transactions' })

export interface TransactionSummary<T = any> {
  hash: string
  type: string
  result: string
  account: string
  index: number
  fee: number
  sequence: number
  ticketSequence: number
  date: string
  instructions?: T
}

export interface TxResponseWithMeta<
  T extends BaseTransaction = BaseTransaction,
> {
  result: {
    /** The SHA-512 hash of the transaction. */
    hash: string
    /** The ledger index of the ledger that includes this transaction. */
    ledger_index?: number
    /** Transaction metadata, which describes the results of the transaction. */
    meta?: TransactionMetadata
    /**
     * If true, this data comes from a validated ledger version; if omitted or.
     * Set to false, this data is not final.
     */
    validated?: boolean
    /**
     * This number measures the number of seconds since the "Ripple Epoch" of January 1, 2000 (00:00 UTC)
     */
    date?: number
  } & T
}

export function formatSingleTransaction<
  T extends BaseTransaction = Transaction,
>(
  result: TxResponseWithMeta<T>['result'],
): {
  raw: TxResponseWithMeta<T>['result']
  summary: TransactionSummary
} {
  const summary = summarizeTransaction(formatTransaction(result), true)
  return {
    summary: { ...summary, instructions: summary.details?.instructions },
    raw: result,
  }
}

const getTransaction = (
  transactionId,
  rippledSocket,
): Promise<{
  raw: TxResponseWithMeta['result']
  summary: TransactionSummary
}> => {
  log.info(`get tx: ${transactionId}`)
  return getRippledTransaction(rippledSocket, transactionId)
    .then((response: TxResponseWithMeta['result']) => {
      const summary = summarizeTransaction(formatTransaction(response), true)
      return {
        summary: { ...summary, instructions: summary.details?.instructions },
        raw: response,
      }
    })
    .catch((error) => {
      log.error(error.toString())
      throw error
    })
}

export default getTransaction
