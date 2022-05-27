import { combineReducers } from '@reduxjs/toolkit'
import actionTypes from '../actions'

const isFresh = (state = true, action) => {
  switch (action.type) {
    case actionTypes.FIND_RESULTS:
      return false
    case actionTypes.RESET_RESULTS:
      return true
    default:
      return state
  }
}

const results = (state = [], action) => {
  switch (action.type) {
    case actionTypes.UPDATE_RESULTS:
      return action.payload.results
    case actionTypes.RESET_RESULTS:
      return []
    default:
      return state
  }
}

const darkMode = (state = true, action) => {
  switch (action.type) {
    case actionTypes.INVERT_COLOR_MODE:
      return !state
    default:
      return state
  }
}

const showHelp = (state = false, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_HELP:
      return action.value
    default:
      return state
  }
}

const reducers = {
  darkMode,
  isFresh,
  results,
  showHelp
}

export const rootReducer = combineReducers(reducers)
