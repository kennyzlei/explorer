import { BaseTransaction } from 'xrpl/dist/npm/models/transactions/common'

export interface UNLModify extends BaseTransaction {
  UNLModifyDisabling: 0 | 1
  UNLModifyValidator: string
}
