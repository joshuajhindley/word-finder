import { combineReducers } from '@reduxjs/toolkit'

const isTrue = (state, action) => {
  switch (action) {
    default:
      return true
  }
}

const reducers = {
  isTrue
}

export const rootReducer = combineReducers(reducers)
