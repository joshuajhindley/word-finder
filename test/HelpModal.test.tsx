import React from 'react'
import { mount, shallow } from 'enzyme'
import HelpModal from '../src/ui/HelpModal'

describe('tests the HelpModal component', () => {
  const actions = { toggleHelp: jest.fn() }
  const props = { actions, showHelp: true, darkMode: false }

  beforeEach(() => {
    actions.toggleHelp.mockClear()
  })

  it('matches the snapshot', () => {
    const wrapper = shallow(<HelpModal />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders without crashing', () => {
    const wrapper = shallow(<HelpModal {...props} />)
    expect(wrapper.find('.help-modal').length).toBe(1)
    expect(wrapper.getElement().props.isOpen).toBeTruthy()
  })

  it('does not render the help modal when showHelp is false', () => {
    const currProps = { ...props, showHelp: false }
    const wrapper = shallow(<HelpModal {...currProps} />)
    expect(wrapper.find('.help-modal').length).toBe(1)
    expect(wrapper.getElement().props.isOpen).toBeFalsy()
  })

  it('closes the modal when the escape key is pressed', () => {
    const wrapper = mount(<HelpModal {...props} />)
    const elem = wrapper.find('.ReactModal__Content')
    elem.getElement().props.onKeyDown({ keyCode: 27, stopPropagation: jest.fn() })
    expect(actions.toggleHelp).toHaveBeenCalledTimes(1)
  })

  it('closes the modal when the close button is clicked', () => {
    const wrapper = shallow(<HelpModal {...props} />)
    wrapper.find('.help-modal-header-close').simulate('click')
    expect(actions.toggleHelp).toHaveBeenCalledTimes(1)
  })
})
