import logger from './lib/logger'
import { formatAccountInfo } from './lib/utils'
import { getBalances, getAccountInfo, getServerInfo } from './lib/rippled'

const log = logger({ name: 'iou' })

export interface TokenData {
  name: string
  balance: string
  reserve: number
  sequence: number
  gravatar: string
  rate?: number
  obligations?: string
  domain?: string
  emailHash?: string
  previousLedger: number
  previousTxn: string
  flags: string[]
}

const getToken = async (
  currencyCode,
  issuer,
  rippledSocket,
): Promise<TokenData> => {
  try {
    log.info('fetching account info from rippled')
    const accountInfo = await getAccountInfo(rippledSocket, issuer)
    const serverInfo = await getServerInfo(rippledSocket)

    log.info('fetching gateway_balances from rippled')
    const balances = await getBalances(rippledSocket, issuer)
    const obligations =
      balances?.obligations && balances.obligations[currencyCode.toUpperCase()]
    if (!obligations) {
      throw new Error('Currency not issued by account')
    }

    const {
      name,
      reserve,
      sequence,
      rate,
      domain,
      emailHash,
      balance,
      flags,
      gravatar,
      previousTxn,
      previousLedger,
    } = formatAccountInfo(accountInfo, serverInfo.info.validated_ledger)

    return {
      name,
      reserve,
      sequence,
      rate,
      domain,
      emailHash,
      balance,
      flags,
      gravatar,
      obligations,
      previousTxn,
      previousLedger,
    }
  } catch (error) {
    if (error) {
      log.error(error.toString())
    }
    throw error
  }
}

export default getToken
