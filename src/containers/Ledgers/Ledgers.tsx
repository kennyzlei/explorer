import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import './css/ledgers.scss'
import DomainLink from '../shared/components/DomainLink'
import { Loader } from '../shared/components/Loader'
import { useIsOnline } from '../shared/SocketContext'
import { Legend } from './Legend'
import { RouteLink } from '../shared/routing'
import { VALIDATOR_ROUTE } from '../App/routes'
import { LedgerListEntry } from './LedgerListEntry'
import { useSelectedValidator } from './useSelectedValidator'

export const Ledgers = ({
  // paused,
  ledgers = [],
  unlCount,
  validators = {},
}: {
  // paused: boolean
  ledgers: any[]
  unlCount?: number
  validators: any
}) => {
  const { selectedValidator } = useSelectedValidator()
  const isOnline = useIsOnline()
  const { tooltip } = useTooltip()

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
              <LedgerListEntry
                ledger={ledger}
                key={ledger.ledger_index}
                unlCount={unlCount}
                validators={validators}
              />
            ))}{' '}
            <Tooltip tooltip={tooltip} />
          </div>{' '}
        </>
      ) : (
        <Loader />
      )}
    </div>
  )
}
