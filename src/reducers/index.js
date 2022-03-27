import { combineReducers } from '@reduxjs/toolkit'
import { actionTypes } from '../actions'

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

const reducers = {
  isFresh,
  results
}

export const rootReducer = combineReducers(reducers)
