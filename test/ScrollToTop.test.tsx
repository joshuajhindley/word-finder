import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import ScrollToTop from '../src/ui/ScrollToTop'

describe('tests the ScrollToTop component', () => {
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn().mockImplementation(values => {
      global.scrollY = values.top
    })
  })

  it('matches the snapshot', () => {
    const wrapper = mount(<ScrollToTop />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders without crashing', () => {
    const wrapper = mount(<ScrollToTop />)
    expect(wrapper.find('.scroll-to-top').length).toBe(2)
  })

  it('does not render the scroll to top button when the window is at or near the top', async () => {
    const wrapper = mount(<ScrollToTop />)
    expect(wrapper.find('.scroll-to-top').length).toBe(2)
    expect(wrapper.find('.visible').length).toBe(0)
    global.scrollTo({ top: 50 })
    expect(global.scrollY).toEqual(50)

    const toggleVisibility = wrapper.find('ScrollIcon').prop('toggleVisibility') as Function
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve))
      toggleVisibility()
      wrapper.update()
    })

    expect(wrapper.find('.scroll-to-top').length).toBe(2)
    expect(wrapper.find('.visible').length).toBe(0)
  })

  it('renders the scroll to top button when the window is not near the top', async () => {
    const wrapper = mount(<ScrollToTop />)
    global.scrollTo({ top: 200 })
    expect(global.scrollY).toEqual(200)

    const toggleVisibility = wrapper.find('ScrollIcon').prop('toggleVisibility') as Function
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve))
      toggleVisibility()
      wrapper.update()
    })

    expect(wrapper.find('.scroll-to-top').length).toBe(2)
    expect(wrapper.find('.visible').length).toBe(2)
  })

  it('scrolls to the top when the scroll to top button is clicked', async () => {
    const wrapper = mount(<ScrollToTop />)
    global.scrollTo({ top: 200 })
    expect(global.scrollY).toEqual(200)

    wrapper.find('.scroll-to-top').at(1).simulate('click')
    const toggleVisibility = wrapper.find('ScrollIcon').prop('toggleVisibility') as Function
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve))
      toggleVisibility()
      wrapper.update()
    })

    expect(global.scrollY).toEqual(0)
    expect(wrapper.find('.visible').length).toBe(0)
  })
})
