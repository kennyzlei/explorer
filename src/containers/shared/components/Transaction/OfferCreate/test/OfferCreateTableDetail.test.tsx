import { cleanup, screen } from '@testing-library/react'
import { TableDetail } from '../TableDetail'
import mockOfferCreateInvertedCurrencies from './mock_data/OfferCreateInvertedCurrencies.json'
import mockOfferCreateWithCancel from './mock_data/OfferCreateWithExpirationAndCancel.json'
import mockOfferCreate from './mock_data/OfferCreate.json'
import { createTableDetailRenderFactory } from '../../test'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('OfferCreate: TableDetail', () => {
  afterEach(cleanup)
  it('renders with an expiration and offer', () => {
    renderComponent(mockOfferCreateWithCancel)

    expect(screen.getByTestId('pair')).toHaveTextContent(
      'price:612.518 \uE900 XRP/CSC.rCSC',
    )
    expect(screen.getByTestId('cancel-id')).toHaveTextContent(
      'cancel_offer #44866443',
    )
    expect(screen.getByTestId('amount-buy')).toHaveTextContent(
      `\uE9001,764.293151 XRP`,
    )
    expect(screen.getByTestId('amount-sell')).toHaveTextContent(
      `1,080,661.95882 CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr`,
    )
  })

  it('renders', () => {
    renderComponent(mockOfferCreate)

    expect(screen.getByTestId('pair')).toHaveTextContent(
      'price:0.00207696 \uE900 XRP/BCH.rcyS',
    )
    expect(screen.getByTestId('offer-id')).not.toExist()
    expect(screen.getByTestId('amount-buy')).toHaveTextContent(
      `\uE90024,755.081083 XRP`,
    )
    expect(screen.getByTestId('amount-sell')).toHaveTextContent(
      `51.41523894 BCH.rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds`,
    )
  })

  it('renders inverted currencies', () => {
    renderComponent(mockOfferCreateInvertedCurrencies)

    expect(screen.getByTestId('pair')).toHaveTextContent(
      'price:0.346896 \uE900 XRP/USD.rvYA',
    )
  })
})
