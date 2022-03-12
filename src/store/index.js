import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from '../reducers'
import { middleware } from '../middleware'

export default function createStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),
    preloadedState
  })
  return store
}
