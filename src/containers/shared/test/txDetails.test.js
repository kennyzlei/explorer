import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../i18n/testConfig'
import EnableAmendment from '../../Transactions/test/mock_data/EnableAmendment.json'
import { TxDetails } from '../components/TxDetails'
import { formatSingleTransaction } from '../../../rippled/transactions'

describe('TxDetails', () => {
  const createWrapper = (tx) =>
    mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <TxDetails
            t={(s) => s}
            language="en-US"
            instructions={
              formatSingleTransaction(tx.result).summary.instructions
            }
            type={tx.result.TransactionType}
          />
        </I18nextProvider>
      </Router>,
    )

  it('renders EnableAmendment without crashing', () => {
    const wrapper = createWrapper(EnableAmendment)
    wrapper.unmount()
  })
})
