import actionTypes, { actionCreators } from '../src/actions'

describe('tests actionCreators', () => {
  test('findResults', () => {
    const action = actionCreators.findResults({})
    expect(action.type).toEqual(actionTypes.FIND_RESULTS)
    expect(action.values).toEqual({})
  })

  test('invertColorMode', () => {
    const action = actionCreators.invertColorMode()
    expect(action.type).toEqual(actionTypes.INVERT_COLOR_MODE)
  })

  test('updateResults', () => {
    const action = actionCreators.updateResults([])
    expect(action.type).toEqual(actionTypes.UPDATE_RESULTS)
    expect(action.payload.results).toEqual([])
  })

  test('resetResults', () => {
    const action = actionCreators.resetResults()
    expect(action.type).toEqual(actionTypes.RESET_RESULTS)
  })

  test('toggleHelp', () => {
    const action = actionCreators.toggleHelp(true)
    expect(action.type).toEqual(actionTypes.TOGGLE_HELP)
    expect(action.value).toEqual(true)
  })
})
