import { Trans, useTranslation } from 'react-i18next'
import type { Payment } from 'xrpl'
import { Account } from '../../Account'
import type {
  TransactionDescriptionComponent,
  TransactionDescriptionProps,
} from '../types'
import { isPartialPayment } from './parser'
import { Amount } from '../../Amount'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Description: TransactionDescriptionComponent<Payment> = ({
  data,
}: TransactionDescriptionProps<Payment>) => {
  const { t } = useTranslation()
  const partial = isPartialPayment(data.Flags)

  return (
    <>
      <div data-test="from-to-line">
        <Trans
          i18nKey="payment_desc_line_1"
          components={{
            source: <Account account={data.Account} />,
            destination: <Account account={data.Destination} />,
          }}
        />
      </div>
      {data.SourceTag != null && (
        <div data-test="source-tag-line">
          {t('the_source_tag_is')}
          <b>{data.SourceTag}</b>
        </div>
      )}
      {data.DestinationTag != null && (
        <div data-test="destination-tag-line">
          {t('the_destination_tag_is')} <b>{data.DestinationTag}</b>
        </div>
      )}
      <div data-test="amount-line">
        {`${t('payment_desc_line_4')}${partial ? ' up to' : ''}`}{' '}
        <b>
          <Amount value={formatAmount(data.Amount)} />
        </b>
        {data.SendMax && (
          <>
            <span> {t('payment_desc_line_5')}</span>{' '}
            <b>
              <Amount value={formatAmount(data.SendMax)} />
            </b>
          </>
        )}
      </div>
      {data?.meta?.delivered_amount && (
        <div data-test="delivered-line">
          {t('payment_desc_line_6')}{' '}
          <b>
            <Amount value={formatAmount(data.meta.delivered_amount)} />
          </b>
        </div>
      )}
    </>
  )
}
