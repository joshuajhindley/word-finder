import { rootReducer } from '../src/reducers'
import actionTypes from '../src/actions'

describe('tests reducers correctly update state', () => {
  it('returns correct default values', () => {
    const resp = rootReducer({}, { type: 'FAKE_ACTION' })
    expect(resp).toEqual({
      darkMode: true,
      isFresh: true,
      results: [],
      showHelp: false
    })
  })

  it('returns correct values for FIND_RESULTS', () => {
    const resp = rootReducer({}, { type: actionTypes.FIND_RESULTS })
    expect(resp).toEqual({
      darkMode: true,
      isFresh: false,
      results: [],
      showHelp: false
    })
  })

  it('returns correct values for UPDATE_RESULTS', () => {
    const resp = rootReducer(
      {},
      { type: actionTypes.UPDATE_RESULTS, payload: { results: ['TESTS', 'VALUE', 'WORKS'] } }
    )
    expect(resp).toEqual({
      darkMode: true,
      isFresh: true,
      results: ['TESTS', 'VALUE', 'WORKS'],
      showHelp: false
    })
  })

  it('returns correct values for RESET_RESULTS', () => {
    const resp = rootReducer({}, { type: actionTypes.RESET_RESULTS })
    expect(resp).toEqual({
      darkMode: true,
      isFresh: true,
      results: [],
      showHelp: false
    })
  })

  it('returns correct values for INVERT_COLOR_MODE', () => {
    const resp = rootReducer({}, { type: actionTypes.INVERT_COLOR_MODE })
    expect(resp).toEqual({
      darkMode: false,
      isFresh: true,
      results: [],
      showHelp: false
    })
  })

  it('returns correct values for TOGGLE_HELP', () => {
    const resp = rootReducer({}, { type: actionTypes.TOGGLE_HELP, value: true })
    expect(resp).toEqual({
      darkMode: true,
      isFresh: true,
      results: [],
      showHelp: true
    })
  })
})
