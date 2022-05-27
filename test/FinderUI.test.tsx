import FinderUI from '../src/ui/FinderUI'
import createStore from '../src/store'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { shallow } from 'enzyme'

const store = createStore()

describe('tests the FinderUI component', () => {
  it('matches the snapshot', () => {
    const wrapper = shallow(<FinderUI />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
      <Provider store={store}>
        <FinderUI />
      </Provider>,
      div
    )
    ReactDOM.unmountComponentAtNode(div)
  })
})
