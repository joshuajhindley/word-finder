import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import createStore from './store'
import { Provider } from 'react-redux'
import FinderUI from './ui/FinderUI'

const store = createStore()

ReactDOM.render(
  <Provider store={store}>
    <FinderUI />
  </Provider>,
  document.getElementById('root')
)
