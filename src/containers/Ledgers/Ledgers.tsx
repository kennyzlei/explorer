import { useTranslation } from 'react-i18next'
import Tooltip from '../shared/components/Tooltip'
import './css/ledgers.scss'
import DomainLink from '../shared/components/DomainLink'
import { Loader } from '../shared/components/Loader'
import { useIsOnline } from '../shared/SocketContext'
import { Legend } from './Legend'
import { RouteLink } from '../shared/routing'
import { VALIDATOR_ROUTE } from '../App/routes'
import { LedgerListEntry } from './LedgerListEntry'
import { useSelectedValidator } from './useSelectedValidator'
import { useLanguage } from '../shared/hooks'
import { useTooltip } from './useTooltip'

export const Ledgers = ({
  ledgers = [],
  validators = {},
}: {
  ledgers: any[]
  validators: any
}) => {
  const { selectedValidator } = useSelectedValidator()
  const isOnline = useIsOnline()
  const language = useLanguage()
  const { tooltip } = useTooltip()
  const { t } = useTranslation()

  return (
    <div className="ledgers">
      {isOnline && ledgers.length > 0 ? (
        <>
          <Legend />
          <div className="control">
            {selectedValidator && (
              <div className="selected-validator">
                {validators[selectedValidator].domain && (
                  <DomainLink domain={validators[selectedValidator].domain} />
                )}
                <RouteLink
                  to={VALIDATOR_ROUTE}
                  params={{ identifier: selectedValidator }}
                  className="pubkey"
                >
                  {selectedValidator}
                </RouteLink>
              </div>
            )}
          </div>
          <div className="ledger-list">
            {ledgers.map((ledger) => (
              <LedgerListEntry ledger={ledger} key={ledger.ledger_index} />
            ))}{' '}
            <Tooltip t={t} language={language} data={tooltip} />
          </div>{' '}
        </>
      ) : (
        <Loader />
      )}
    </div>
  )
}
