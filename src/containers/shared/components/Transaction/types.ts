import { FC } from 'react'
import type { BaseTransaction } from 'xrpl/dist/npm/models/transactions/common'
import { Memo } from '../../types'
import type { TxResponseWithMeta } from '../../../../rippled/transactions'

export enum TransactionCategory {
  DEX = 'DEX',
  ACCOUNT = 'ACCOUNT',
  PAYMENT = 'PAYMENT',
  NFT = 'NFT',
  XCHAIN = 'XCHAIN',
  PSEUDO = 'PSUEDO',
  UNKNOWN = 'UNKNOWN',
}

export enum TransactionAction {
  CREATE = 'CREATE',
  CANCEL = 'CANCEL',
  FINISH = 'FINISH',
  MODIFY = 'MODIFY',
  SEND = 'SEND',
  UNKNOWN = 'UNKNOWN',
}

export interface TransactionTableDetailProps<I = any> {
  instructions: I
}
export type TransactionTableDetailComponent = FC<TransactionTableDetailProps>

export interface TransactionDescriptionProps<T extends BaseTransaction> {
  data: TxResponseWithMeta<T>['result']
}

export type TransactionDescriptionComponent<T extends BaseTransaction> = (
  props: TransactionDescriptionProps<T>,
) => JSX.Element

export interface TransactionSimpleProps<I = any> {
  data: {
    instructions?: I
  }
}
export type TransactionSimpleComponent = FC<TransactionSimpleProps>
export type TransactionParser<T = any, I = any> = (tx: T, meta: any) => I

export interface TransactionMapping<
  T extends BaseTransaction = BaseTransaction,
> {
  Description?: TransactionDescriptionComponent<T>
  Simple: TransactionSimpleComponent
  TableDetail?: TransactionTableDetailComponent
  parser: TransactionParser
  action: TransactionAction
  category: TransactionCategory
}

export interface TransactionCommonFields {
  date: string
  Account: string
  TransactionType: string
  Fee: string
  Sequence: number
  AccountTxnID?: string
  Flags?: number
  LastLedgerSequence?: number
  Memos?: Memo[]
  Signers?: object[]
  SourceTag?: number
  SignerPubKey?: string
  TicketSequence?: number
  TxnSignature?: string
}
