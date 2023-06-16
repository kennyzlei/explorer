import { mount } from 'enzyme'
import TxToken from '../TxToken'
import createMock from '../Transaction/AMMCreate/test/mock_data/amm_create.json'
import summarizeTransaction from '../../../../rippled/lib/txSummary'

describe('<TxToken>', () => {
  it('renders with XRP and another currency', () => {
    const wrapper = mount(
      <TxToken tx={summarizeTransaction(createMock, true)} />,
    )
    expect(wrapper).toHaveText('XRP and USD')
  })
})
