import actionTypes, { actionCreators } from '../actions'
import words from '../constants'

const findCorrectPosLetters = values => {
  // letters in the correct position
  let searchTerm = ''
  const regex = '[A-Z]'
  for (let i = 1; i < 6; i++) {
    const val = values['letter' + i]
    searchTerm += val ? val : regex
  }
  return searchTerm
}

const findAnyPosLetters = values => {
  // letters in any position
  let allLetters = []
  for (let i = 1; i < 6; i++) {
    const val = values['anyPosLetter' + i]
    if (val) allLetters.push(val)
  }
  return allLetters
}

const findExclusionLetters = values => {
  // letters not in the solution
  let exclusion = ''
  Object.getOwnPropertyNames(values)
    .filter(value => value.startsWith('notLetter'))
    .forEach(value => {
      exclusion += values[value]
    })
  return exclusion.length === 0 ? '["]' : '[' + exclusion + ']'
}

const findResults = (store, action) => {
  const values = action.values

  const searchTerm = findCorrectPosLetters(values)
  const allLetters = findAnyPosLetters(values)
  const exclusion = findExclusionLetters(values)

  const results = words
    .filter(
      word =>
        word.match(searchTerm) &&
        !word.match(exclusion) &&
        !allLetters.map(letter => word.includes(letter)).includes(false)
    )
    .slice(0, 500)

  store.dispatch(actionCreators.updateResults(results))
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
