import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { useInfiniteQuery } from 'react-query'
import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'
import SocketContext from '../../shared/SocketContext'

import { getAccountTransactions } from '../../../rippled'
import { ANALYTIC_TYPES, analytics } from '../../shared/utils'

export interface AccountTransactionsTableProps {
  accountId: string
  currencySelected: string
}

export const AccountTransactionTable = ({
  accountId,
  currencySelected,
}: AccountTransactionsTableProps) => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const {
    data,
    error,
    isFetching: loading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<any, Error>(
    ['fetchTransactions', accountId],
    ({ pageParam = '' }) =>
      getAccountTransactions(
        accountId,
        undefined,
        pageParam,
        undefined,
        rippledSocket,
      ).catch((errorResponse) => {
        const errorLocation = `account transactions ${accountId} at ${pageParam}`
        // @ts-expect-error -- because utils isn't typed
        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `${errorLocation} --- ${JSON.stringify(
            errorResponse,
          )}`,
        })

        throw new Error('get_account_transactions_failed')
      }),
    {
      getNextPageParam: (lastPage) => lastPage.marker,
    },
  )

  const filterTransactions = () => {
    let processedTransactions = data?.pages
      ?.map((page: any) => page.transactions)
      .flat()

    if (currencySelected !== 'XRP') {
      processedTransactions = processedTransactions?.filter(
        (tx) =>
          !currencySelected ||
          (currencySelected &&
            JSON.stringify(tx).includes(
              `"currency":"${currencySelected.toUpperCase()}"`,
            )),
      )
    }
    return processedTransactions
  }

  const transactions = filterTransactions()
  const tryLoading = transactions?.length === 0 && data?.pages[0]?.transactions
  const emptyMessage = tryLoading
    ? 'get_account_transactions_try'
    : error?.message
  return (
    <TransactionTable
      transactions={transactions}
      loading={loading}
      emptyMessage={emptyMessage && t(emptyMessage)}
      onLoadMore={() => fetchNextPage()}
      hasAdditionalResults={hasNextPage}
    />
  )
}
