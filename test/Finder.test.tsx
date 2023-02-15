import React from 'react'
import Finder from '../src/ui/Finder'
import { mount } from 'enzyme'
import userEvent from '@testing-library/user-event'

describe('tests the FinderUI component', () => {
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn().mockImplementation((values) => {
      global.scrollY = values.top
    }),
  })

  const props = {
    actions: {
      resetResults: jest.fn(),
      findResults: jest.fn(),
      invertColorMode: jest.fn(),
      toggleHelp: jest.fn(),
      toggleInPosition: jest.fn(),
    },
    results: [],
    isFresh: true,
    notInPositions: true,
    darkMode: true,
  }

  beforeEach(() => {
    props.actions.resetResults.mockClear()
    props.actions.findResults.mockClear()
    props.actions.invertColorMode.mockClear()
    props.actions.toggleHelp.mockClear()
    props.actions.toggleInPosition.mockClear()

    document.body.innerHTML = '<div id="root"></div>'
  })

  it('matches the snapshot', () => {
    const wrapper = mount(<Finder {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders in dark mode without crashing', () => {
    const wrapper = mount(<Finder {...props} />)
    expect(wrapper.find('.app').length).toBe(1)
    expect(wrapper.find('.header').length).toBe(1)
    expect(wrapper.find('.body').length).toBe(1)
    expect(wrapper.find('input').length).toBe(12)
    expect(wrapper.find('.results').length).toBe(1)
    expect(wrapper.find('.no-result').length).toBe(0)
    expect(wrapper.find('.result').length).toBe(0)
    expect(wrapper.find('.dark').length).toBe(3)
  })

  it('renders in light mode without crashing', () => {
    const wrapper = mount(<Finder {...props} darkMode={false} />)
    expect(wrapper.find('.app').length).toBe(1)
    expect(wrapper.find('.header').length).toBe(1)
    expect(wrapper.find('.body').length).toBe(1)
    expect(wrapper.find('input').length).toBe(12)
    expect(wrapper.find('.results').length).toBe(1)
    expect(wrapper.find('.no-result').length).toBe(0)
    expect(wrapper.find('.result').length).toBe(0)
    expect(wrapper.find('.dark').length).toBe(0)
  })

  it('calls the toggleHelp action when the help button is clicked', () => {
    const wrapper = mount(<Finder {...props} />)
    wrapper.find('.help-message').simulate('click')
    expect(props.actions.toggleHelp).toHaveBeenCalledTimes(1)
  })

  it('calls the toggleInPosition action when the checkbox is clicked', () => {
    const wrapper = mount(<Finder {...props} />)
    wrapper.find('.checkbox').simulate('click')
    expect(props.actions.toggleInPosition).toHaveBeenCalledTimes(1)
  })

  it('renders a no result message when no results are found', () => {
    const wrapper = mount(<Finder {...props} />)
    wrapper.find('.search-button').simulate('submit')
    expect(props.actions.findResults).toHaveBeenCalledTimes(1)
    expect(props.actions.findResults).toHaveBeenCalledWith({})
    wrapper.setProps({ results: [], isFresh: false })
    expect(wrapper.find('.no-result').length).toBe(1)
    expect(wrapper.find('.result').length).toBe(0)
  })

  it('renders a result message when results are found', () => {
    const wrapper = mount(<Finder {...props} />)
    wrapper.find('.color').simulate('click')
    expect(props.actions.invertColorMode).toHaveBeenCalledTimes(1)
  })

  it('renders a result message when results are found', () => {
    const wrapper = mount(<Finder {...props} />)
    wrapper.find('.search-button').simulate('submit')
    expect(props.actions.findResults).toHaveBeenCalledTimes(1)
    expect(props.actions.findResults).toHaveBeenCalledWith({})
    wrapper.setProps({
      results: ['WORDS', 'COINS', 'TESTS', 'VALUE', 'WORKS'],
      isFresh: false,
    })
    expect(wrapper.find('.no-result').length).toBe(0)
    expect(wrapper.find('.result').length).toBe(5)
    expect(wrapper.find('.matches').text()).toBe('Showing 5 matching words.')

    wrapper.find('.search-button').simulate('submit')
    expect(props.actions.findResults).toHaveBeenCalledTimes(2)
    expect(props.actions.findResults).toHaveBeenCalledWith({})
    wrapper.setProps({ results: ['WORDS'], isFresh: false })
    expect(wrapper.find('.no-result').length).toBe(0)
    expect(wrapper.find('.result').length).toBe(1)
    expect(wrapper.find('.matches').text()).toBe('Showing 1 matching word.')

    wrapper.find('.search-button').simulate('submit')
    expect(props.actions.findResults).toHaveBeenCalledTimes(3)
    expect(props.actions.findResults).toHaveBeenCalledWith({})
    wrapper.setProps({ results: [...Array(500)], isFresh: false })
    expect(wrapper.find('.no-result').length).toBe(0)
    expect(wrapper.find('.result').length).toBe(500)
    expect(wrapper.find('.matches').text()).toBe(
      'Showing first 500 matching words.'
    )
  })

  it('resets the results when the reset button is clicked', () => {
    const wrapper = mount(<Finder {...props} />)
    wrapper.find('.search-button').simulate('submit')
    expect(props.actions.findResults).toHaveBeenCalledTimes(1)
    expect(props.actions.findResults).toHaveBeenCalledWith({})
    wrapper.setProps({
      results: ['WORDS', 'COINS', 'TESTS', 'VALUE', 'WORKS'],
      isFresh: false,
    })
    expect(wrapper.find('.no-result').length).toBe(0)
    expect(wrapper.find('.result').length).toBe(5)
    wrapper.find('.reset-button').simulate('click')
    expect(props.actions.resetResults).toHaveBeenCalledTimes(1)
    wrapper.setProps({ results: [], isFresh: true })
    expect(wrapper.find('.no-result').length).toBe(0)
    expect(wrapper.find('.result').length).toBe(0)
  })

  it('scrolls to the input section of the page when an input is selected', () => {
    const wrapper = mount(<Finder {...props} />)
    const letter1 = wrapper.find('ForwardRef(Field)').first()
    expect(global.scrollY).toBe(0)
    letter1.simulate('focus')
    expect(global.scrollY).toBe(100)
  })

  it('navigates to different elements when navigation keys are pressed', () => {
    const wrapper = mount(<Finder {...props} />, {
      attachTo: document.getElementById('root'),
    })

    const letter1 = wrapper
      .find('ForwardRef(Field)')
      .at(0)
      .getDOMNode() as HTMLInputElement
    const letter2 = wrapper
      .find('ForwardRef(Field)')
      .at(1)
      .getDOMNode() as HTMLInputElement
    const letter3 = wrapper
      .find('ForwardRef(Field)')
      .at(2)
      .getDOMNode() as HTMLInputElement
    const letter4 = wrapper
      .find('ForwardRef(Field)')
      .at(3)
      .getDOMNode() as HTMLInputElement
    const letter5 = wrapper
      .find('ForwardRef(Field)')
      .at(4)
      .getDOMNode() as HTMLInputElement
    const input1 = wrapper.find('input').at(0)
    const input2 = wrapper.find('input').at(1)
    const input3 = wrapper.find('input').at(2)
    const input4 = wrapper.find('input').at(3)
    const input5 = wrapper.find('input').at(4)

    letter1.focus()
    expect(letter1).toHaveFocus()

    input1.simulate('keyup', { nativeEvent: { key: 'ArrowLeft' } })
    expect(letter1).toHaveFocus()
    input1.simulate('keyup', { nativeEvent: { key: 'ArrowRight' } })
    expect(letter2).toHaveFocus()
    input2.simulate('keyup', { nativeEvent: { key: 'ArrowRight' } })
    expect(letter3).toHaveFocus()
    input3.simulate('keyup', { nativeEvent: { key: 'ArrowRight' } })
    expect(letter4).toHaveFocus()
    input4.simulate('keyup', { nativeEvent: { key: 'ArrowRight' } })
    expect(letter5).toHaveFocus()
    input5.simulate('keyup', { nativeEvent: { key: 'ArrowRight' } })
    expect(letter5).toHaveFocus()
    input5.simulate('keyup', { nativeEvent: { key: 'ArrowLeft' } })
    input4.simulate('keyup', { nativeEvent: { key: 'Delete' } })
    input3.simulate('keyup', { nativeEvent: { key: 'Backspace' } })
    expect(letter2).toHaveFocus()
  })

  it('handles input correctly for the correct position inputs', (done) => {
    const wrapper = mount(<Finder {...props} />, {
      attachTo: document.getElementById('root'),
    })
    const letter1 = wrapper
      .find('ForwardRef(Field)')
      .at(0)
      .getDOMNode() as HTMLInputElement
    const letter2 = wrapper
      .find('ForwardRef(Field)')
      .at(1)
      .getDOMNode() as HTMLInputElement
    const letter5 = wrapper
      .find('ForwardRef(Field)')
      .at(4)
      .getDOMNode() as HTMLInputElement

    letter1.focus()

    expect(letter1).toHaveFocus()
    userEvent.keyboard('a')
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('input').at(0).prop('value')).toBe('A')
      expect(letter2).toHaveFocus()

      userEvent.keyboard('[[')
      wrapper.update()
      expect(wrapper.find('input').at(1).prop('value')).toBe('')
      expect(letter2).toHaveFocus()
      userEvent.keyboard(' ')
      wrapper.update()
      expect(wrapper.find('input').at(1).prop('value')).toBe('')
      expect(letter2).toHaveFocus()
      userEvent.keyboard('1')
      wrapper.update()
      expect(wrapper.find('input').at(1).prop('value')).toBe('')
      expect(letter2).toHaveFocus()

      letter5.focus()
      userEvent.keyboard('z')
      setTimeout(() => {
        wrapper.update()
        expect(wrapper.find('input').at(4).prop('value')).toBe('Z')
        expect(letter5).toHaveFocus()
        done()
      }, 10)
    }, 0)
  })

  it('handles input correctly for the anyPos inputs', (done) => {
    const wrapper = mount(<Finder {...props} />, {
      attachTo: document.getElementById('root'),
    })

    const letter1 = wrapper
      .find('ForwardRef(Field)')
      .at(5)
      .getDOMNode() as HTMLInputElement
    const letter2 = wrapper
      .find('ForwardRef(Field)')
      .at(6)
      .getDOMNode() as HTMLInputElement
    const letter5 = wrapper
      .find('ForwardRef(Field)')
      .at(9)
      .getDOMNode() as HTMLInputElement
    const input1 = wrapper.find('input').at(5)
    const input2 = wrapper.find('input').at(6)

    letter1.focus()
    expect(letter1).toHaveFocus()

    input1.simulate('keyup', { nativeEvent: { key: 'ArrowLeft' } })
    expect(letter1).toHaveFocus()
    input1.simulate('keyup', { nativeEvent: { key: 'ArrowRight' } })
    expect(letter2).toHaveFocus()
    input2.simulate('keyup', { nativeEvent: { key: 'Delete' } })
    expect(letter1).toHaveFocus()

    userEvent.keyboard('a')
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('input').at(5).prop('value')).toBe('A')
      expect(letter2).toHaveFocus()

      userEvent.keyboard(' ')
      wrapper.update()
      expect(wrapper.find('input').at(6).prop('value')).toBe('')
      expect(letter2).toHaveFocus()

      letter5.focus()
      userEvent.keyboard('z')
      setTimeout(() => {
        wrapper.update()
        expect(wrapper.find('input').at(9).prop('value')).toBe('Z')
        expect(letter5).toHaveFocus()
        done()
      }, 10)
    }, 0)
  })

  it('adds a new notLetter input when a letter is typed', (done) => {
    const wrapper = mount(<Finder {...props} />, {
      attachTo: document.getElementById('root'),
    })

    const letter1 = wrapper
      .find('ForwardRef(Field)')
      .at(11)
      .getDOMNode() as HTMLInputElement
    const input1 = wrapper.find('input').at(11)

    letter1.focus()
    expect(wrapper.find('input').length).toBe(12)
    expect(wrapper.find('ForwardRef(Field)').at(11).getDOMNode()).toHaveFocus()
    expect(letter1).toHaveFocus()
    expect(wrapper.find({ name: 'notLetter1' }).length).toBe(2)
    expect(wrapper.find({ name: 'notLetter2' }).length).toBe(0)
    input1.simulate('keyup', { nativeEvent: { key: 'ArrowLeft' } })
    expect(letter1).toHaveFocus()
    userEvent.keyboard('z')
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('input').at(11).prop('value')).toBe('Z')
      expect(wrapper.find('input').length).toBe(13)
      expect(wrapper.find({ name: 'notLetter1' }).length).toBe(2)
      expect(wrapper.find({ name: 'notLetter2' }).length).toBe(2)

      const letter2 = wrapper
        .find('ForwardRef(Field)')
        .at(12)
        .getDOMNode() as HTMLInputElement
      const input2 = wrapper.find('input').at(12)

      expect(letter2).toHaveFocus()

      userEvent.keyboard('z')
      setTimeout(() => {
        expect(letter2).toHaveFocus()
        expect(wrapper.find('input').at(12).prop('value')).toBe('')
        expect(wrapper.find('input').length).toBe(13)

        input2.simulate('keyup', { nativeEvent: { key: 'ArrowLeft' } })
        expect(letter1).toHaveFocus()
        input1.simulate('keyup', { nativeEvent: { key: 'ArrowLeft' } })
        expect(letter1).toHaveFocus()
        input1.simulate('keyup', { nativeEvent: { key: 'ArrowRight' } })
        expect(letter2).toHaveFocus()
        input2.simulate('keyup', { nativeEvent: { key: 'Backspace' } })
        expect(letter1).toHaveFocus()
        input1.simulate('keyup', { nativeEvent: { key: 'Delete' } })
        expect(letter2).toHaveFocus()
        expect(wrapper.find('input').length).toBe(12)
        expect(wrapper.find({ name: 'notLetter1' }).length).toBe(0)
        expect(wrapper.find({ name: 'notLetter2' }).length).toBe(2)

        userEvent.keyboard(' ')
        wrapper.update()
        expect(wrapper.find('input').at(11).prop('value')).toBe('')
        expect(letter2).toHaveFocus()

        done()
      }, 10)
    }, 10)
  })
})
