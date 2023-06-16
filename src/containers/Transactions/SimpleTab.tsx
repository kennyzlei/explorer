import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Transaction, TxResponse } from 'xrpl'
import type { BaseTransaction } from 'xrpl/dist/npm/models/transactions/common'
import { localizeDate, localizeNumber, BREAKPOINTS } from '../shared/utils'
import { Account } from '../shared/components/Account'
import { Sequence } from '../shared/components/Sequence'
import { Simple } from './Simple'

import { useLanguage } from '../shared/hooks'
import { CURRENCY_OPTIONS } from '../shared/transactionUtils'
import { SimpleRow } from '../shared/components/Transaction/SimpleRow'
import '../shared/css/simpleTab.scss'
import './simpleTab.scss'
import { TransactionSummary } from '../../rippled/transactions'

const TIME_ZONE = 'UTC'
const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: true,
  timeZone: TIME_ZONE,
}

export function SimpleTab<T extends BaseTransaction = Transaction>({
  data,
  width,
}: {
  data: { raw: TxResponse<T>['result']; summary: TransactionSummary }
  width: number
}) {
  const { t } = useTranslation()
  const language = useLanguage()

  const renderRowIndex = (
    time,
    ledgerIndex,
    fee,
    account,
    sequence,
    ticketSequence,
  ) => (
    <>
      <SimpleRow
        label={t('formatted_date', { timeZone: TIME_ZONE })}
        data-test="tx-date"
      >
        {time}
      </SimpleRow>
      <SimpleRow label={t('ledger_index')} data-test="ledger-index">
        <Link to={`/ledgers/${ledgerIndex}`}>{ledgerIndex}</Link>
      </SimpleRow>
      {account && (
        <SimpleRow label={t('account')} data-test="account">
          <Account account={account} />
        </SimpleRow>
      )}
      <SimpleRow label={t('sequence_number')} data-test="sequence">
        <Sequence
          sequence={sequence}
          ticketSequence={ticketSequence}
          account={account}
        />
      </SimpleRow>
      <SimpleRow label={t('transaction_cost')} data-test="tx-cost">
        {fee}
      </SimpleRow>
    </>
  )

  const { summary } = data
  const numberOptions = { ...CURRENCY_OPTIONS, currency: 'XRP' }
  const time = localizeDate(new Date(summary.date), language, DATE_OPTIONS)
  const ledgerIndex = data.raw.ledger_index
  const fee = summary.fee
    ? localizeNumber(summary.fee, language, numberOptions)
    : 0

  const rowIndex = renderRowIndex(
    time,
    ledgerIndex,
    fee,
    summary.account,
    summary.sequence,
    summary.ticketSequence,
  )

  return (
    <div className="simple-body simple-body-tx">
      <div className="rows">
        <Simple type={summary.type} data={data.summary} />
        {width < BREAKPOINTS.landscape && rowIndex}
      </div>
      {width >= BREAKPOINTS.landscape && (
        <div className="index">{rowIndex}</div>
      )}
      <div className="clear" />
    </div>
  )
}
