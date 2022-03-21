import { actionTypes, updateResults } from '../actions'
import words from '../constants'

const findResults = (store, action) => {
  const values = action.values
  let searchTerm = ''
  const regex = '[A-Z]'
  for (let i = 1; i < 6; i++) {
    const val = values['letter' + i]
    searchTerm += val && val !== ' ' ? val : regex
  }

  let exclusion = ''
  let n = 1
  while (true) {
    const letter = values['notLetter' + n]
    if (letter === undefined) {
      break
    }
    exclusion += letter
    n++
  }
  exclusion = exclusion.length === 0 ? '["]' : '[' + exclusion + ']'

  const results = words.filter(word => word.match(searchTerm) && !word.match(exclusion)).slice(0, 500)
  store.dispatch(updateResults(results))
}

export const middleware = store => next => action => {
  next(action)

  switch (action.type) {
    case actionTypes.FIND_RESULTS:
      findResults(store, action)
      break
    default:
      break
  }
}
