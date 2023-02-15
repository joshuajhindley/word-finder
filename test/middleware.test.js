import { middleware } from '../src/middleware'
import actionTypes from '../src/actions'

describe('tests middleware', () => {
  let results = []
  const store = {
    dispatch: jest.fn(obj => {
      if (obj.type === actionTypes.UPDATE_RESULTS) {
        results = obj.payload.results
      }
    }),
    getState: jest.fn(() => {
      return {
        notInPositions: false
      }
    })
  }
  const next = jest.fn()

  beforeEach(() => {
    results = []
    store.dispatch.mockClear()
  })

  it('does nothing if action is not FIND_RESULTS', () => {
    const action = {
      type: 'NOT_FIND_RESULTS',
      values: {}
    }
    middleware(store)(next)(action)
    expect(store.dispatch).not.toHaveBeenCalled()
    expect(results.length).toEqual(0)
  })

  it('calls findResults with results if action is FIND_RESULTS', () => {
    const action = {
      type: actionTypes.FIND_RESULTS,
      values: {}
    }
    middleware(store)(next)(action)
    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(results.length).toEqual(500)
  })

  it('filters results if values are set', () => {
    const action = {
      type: actionTypes.FIND_RESULTS,
      values: {
        letter1: 'A',
        letter2: 'B',
        anyPosLetter1: 'S',
        anyPosLetter2: 'E',
        notLetter1: 'T',
        notLetter2: 'I',
        notLetter3: 'L'
      }
    }
    middleware(store)(next)(action)
    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(results.length).toEqual(5)
    expect(results).toContain('ABASE')
    expect(results).toContain('ABUSE')
  })

  
  it('filters results with notInPositions set to true', () => {
    const action = {
      type: actionTypes.FIND_RESULTS,
      values: {
        letter1: 'H',
        anyPosLetter2: 'E',
        anyPosLetter3: 'A',
        anyPosLetter4: 'R',
      }
    }
    middleware(store)(next)(action)
    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(results.length).toEqual(15)
    expect(results).toContain('HEART')
    expect(results).toContain('HEARD')

    store.getState = jest.fn(() => {return {notInPositions: true}})
    middleware(store)(next)(action)
    expect(store.dispatch).toHaveBeenCalledTimes(2)
    expect(results.length).toEqual(8)
    expect(results).not.toContain('HEART')
    expect(results).not.toContain('HEARD')
  })

  it('finds word if only one option', () => {
    const action = {
      type: actionTypes.FIND_RESULTS,
      values: {
        letter1: 'C',
        letter2: 'O',
        letter3: 'I',
        letter4: 'N'
      }
    }
    middleware(store)(next)(action)
    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(results.length).toEqual(1)
    expect(results[0]).toEqual('COINS')
  })

  it('calls updateResults with empty array if no valid words', () => {
    const action = {
      type: actionTypes.FIND_RESULTS,
      values: {
        letter1: 'A',
        notLetter1: 'A'
      }
    }
    middleware(store)(next)(action)
    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(results.length).toEqual(0)
  })
})
