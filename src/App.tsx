import React, { SyntheticEvent } from 'react'
import './App.css'
import { Field, Form } from 'react-final-form'
import pluralize from 'pluralize'
import * as actions from './actions'
import { connect } from 'react-redux'

interface IAppProps {
  findResults: Function
  results: Array<string>
  isFresh: boolean
}

interface IAppState {}

class App extends React.Component<IAppProps, IAppState> {
  ref: Array<React.RefObject<HTMLInputElement>>

  constructor(props: any) {
    super(props)
    this.ref = []
    for (let i = 0; i < 5; i++) {
      this.ref.push(React.createRef())
    }
  }

  handleFocus = (event: SyntheticEvent) =>
    (event.target as HTMLInputElement).select()

  handleKeyUp = (event: SyntheticEvent, pos: number) => {
    const key = (event.nativeEvent as KeyboardEvent).key
    if (pos > 0 && ['Backspace', 'Delete', 'ArrowLeft'].includes(key)) {
      this.ref[pos - 1].current?.focus()
    } else if (pos < this.ref.length && key === 'ArrowRight') {
      this.ref[pos + 1].current?.focus()
    }
  }

  handleInput = (event: SyntheticEvent, pos: number) => {
    if (
      (event.nativeEvent as InputEvent).data !== null &&
      pos + 1 < this.ref.length
    ) {
      this.ref[pos + 1].current?.focus()
    }
  }

  handleSubmit = (values: object, form: any) => {
    const { findResults } = this.props
    findResults(values)
  }

  getNumberOfResults = () => {
    const { results } = this.props

    if (results.length === 0) {
      return (
        <div className='no-result'>
          <label>There are no matching words.</label>
        </div>
      )
    }

    return (
      <div className='matches'>
        <label>
          Showing {pluralize('matching word', results.length, true)}.
        </label>
      </div>
    )
  }

  render() {
    const { results, isFresh } = this.props

    return (
      <div className='App'>
        <div className='search'>
          <Form onSubmit={this.handleSubmit}>
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                {[...Array(5)].map((e, i) => (
                  <Field
                    name={'letter' + (i + 1)}
                    component='input'
                    maxLength='1'
                    key={i}
                    ref={this.ref[i]}
                    parse={(value) => (value ? value.toUpperCase() : '')}
                    onFocus={this.handleFocus}
                    onKeyUp={(e: SyntheticEvent) => this.handleKeyUp(e, i)}
                    onInput={(e: SyntheticEvent) => this.handleInput(e, i)}
                  />
                ))}
                <br />
                <button type='submit'>Search</button>
              </form>
            )}
          </Form>
        </div>
        <div className='results'>
          {!isFresh && this.getNumberOfResults()}
          {results.map((result: string, index: number) => (
            <div className='result' key={index}>
              <label key={index}>{result}</label>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

const { actionTypes, ...action } = actions
const mapStateToProps = (state: any) => {
  return {
    isFresh: state.isFresh,
    results: state.results
  }
}

export default connect(mapStateToProps, action)(App)
