import { useTranslation, Trans } from 'react-i18next'
import type { OfferCreate } from 'xrpl'
import { localizeDate } from '../../../utils'
import {
  DATE_OPTIONS,
  CURRENCY_ORDER,
  RIPPLE_EPOCH,
  XRP_BASE,
  normalizeAmount,
} from '../../../transactionUtils'
import { Account } from '../../Account'
import {
  TransactionDescriptionComponent,
  TransactionDescriptionProps,
} from '../types'

const normalize = (amount: any) => amount.value || amount / XRP_BASE

const Description: TransactionDescriptionComponent<OfferCreate> = (
  props: TransactionDescriptionProps<OfferCreate>,
) => {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage
  const { data } = props
  const paysCurrency =
    typeof data.TakerPays !== 'string' && 'currency' in data.TakerPays
      ? data.TakerPays.currency
      : 'XRP'
  const getsCurrency =
    typeof data.TakerGets !== 'string' && 'currency' in data.TakerGets
      ? data.TakerGets.currency
      : 'XRP'
  const paysValue = normalize(data.TakerPays)
  const getsValue = normalize(data.TakerGets)
  const invert =
    CURRENCY_ORDER.indexOf(getsCurrency) > CURRENCY_ORDER.indexOf(paysCurrency)

  let rate = getsValue / paysValue
  let pair

  if (invert) {
    rate = 1 / rate
    pair = `${getsCurrency}/${paysCurrency}`
  } else {
    pair = `${paysCurrency}/${getsCurrency}`
  }

  const renderLine4 = (expiration: number) => {
    const unixT = (expiration + RIPPLE_EPOCH) * 1000
    const today = new Date()
    const transString =
      unixT - today.getTime() > 0
        ? 'offer_will_expire_desc'
        : 'offer_did_expire_desc'
    const date = `${localizeDate(unixT, language, DATE_OPTIONS)} ${
      DATE_OPTIONS.timeZone
    }`

    return (
      <Trans key="line4" i18nKey={transString}>
        The offer expires
        <span className="time">{date}</span>
        unless cancelled before
      </Trans>
    )
  }

  return (
    <>
      <div key="line1">
        <Trans i18nKey="offer_create_desc_line_1">
          The account
          <Account account={data.Account} />
          offered to pay
          <b>
            {normalizeAmount(data.TakerGets, language)}
            <small>{getsCurrency}</small>
          </b>
          in order to receive
          <b>
            {normalizeAmount(data.TakerPays, language)}
            <small>{paysCurrency}</small>
          </b>
        </Trans>
      </div>
      <div key="line2">
        {t('offer_create_desc_line_2')}
        <b>
          <span> {rate.toPrecision(5)}</span>
          <small>{pair}</small>
        </b>
      </div>
      {data.OfferSequence && (
        <div key="line3">
          {t('offer_create_desc_line_3')}
          <b> {data.OfferSequence}</b>
        </div>
      )}
      {data.Expiration && renderLine4(data.Expiration)}
    </>
  )
}

export { Description }
