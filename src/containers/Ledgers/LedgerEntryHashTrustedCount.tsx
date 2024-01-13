import { useTranslation } from 'react-i18next'
import { useTooltip } from './useTooltip'

export const LedgerEntryHashTrustedCount = ({ hash }: any) => {
  const { t } = useTranslation()
  const { setTooltip } = useTooltip()
  // TODO: Fix UNL Count
  const unlCount = 0
  const className = hash.trusted_count < unlCount ? 'missed' : ''
  const missing =
    hash.trusted_count && className === 'missed'
      ? this.getMissingValidators(hash)
      : null

  const showTooltip = (mode, event, data) => {
    setTooltip({
      ...data,
      mode,
      x: event.currentTarget.offsetLeft,
      y: event.currentTarget.offsetTop,
    })
  }

  // getMissingValidators = (hash) => {
  //   const { validators } = this.props
  //   const unl = {}
  //
  //   Object.keys(validators).forEach((pubkey) => {
  //     if (validators[pubkey].unl) {
  //       unl[pubkey] = false
  //     }
  //   })
  //
  //   hash.validations.forEach((v) => {
  //     if (unl[v.pubkey] !== undefined) {
  //       delete unl[v.pubkey]
  //     }
  //   })
  //
  //   return Object.keys(unl).map((pubkey) => validators[pubkey])
  // }

  return hash.trusted_count ? (
    <span
      tabIndex={0}
      role="button"
      className={className}
      onMouseMove={(e) =>
        missing && missing.length && showTooltip('missing', e, { missing })
      }
      onFocus={(e) => {}}
      onKeyUp={(e) => {}}
      onMouseLeave={() => {
        setTooltip(undefined)
      }}
    >
      <div>{t('unl')}:</div>
      <b>
        {hash.trusted_count}/{unlCount}
      </b>
    </span>
  ) : null
}
