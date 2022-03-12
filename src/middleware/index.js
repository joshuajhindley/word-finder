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

  const results = words.filter((word) => word.match(searchTerm)).slice(0, 500)
  store.dispatch(updateResults(results))
}

export const middleware = (store) => (next) => (action) => {
  switch (action.type) {
    case actionTypes.FIND_RESULTS:
      findResults(store, action)
      break
    default:
      next(action)
  }
}
