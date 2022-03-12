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

  // TODO there is a bug where deleting from a field will go to the field two before if the previous field is empty
  handleKeyUp = (event: SyntheticEvent, prev: number) => {
    if (
      prev > -1 &&
      !(event.nativeEvent.target as HTMLInputElement).value &&
      ['Backspace', 'Delete'].includes((event.nativeEvent as KeyboardEvent).key)
    ) {
      this.ref[prev].current?.focus()
    }
  }

  handleInput = (event: SyntheticEvent, pos: number) => {
    if ((event.nativeEvent as InputEvent).data === null) {
      if (pos - 1 >= 0) {
        this.ref[pos - 1].current?.focus()
      }
    } else if (pos + 1 < this.ref.length) {
      this.ref[pos + 1].current?.focus()
    }
  }

  handleSubmit = (values: object, form: any) => {
    const { findResults } = this.props
    findResults(values)
  }

  render() {
    const { results, isFresh } = this.props

    return (
      <div className='App'>
        <div className='search'>
          <Form onSubmit={this.handleSubmit}>
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                {/* TODO this can be done using a loop */}
                <Field
                  name='letter1'
                  component='input'
                  maxLength='1'
                  ref={this.ref[0]}
                  parse={(value) => (value ? value.toUpperCase() : '')}
                  onFocus={this.handleFocus}
                  onInput={(e: SyntheticEvent) => this.handleInput(e, 0)}
                />
                <Field
                  name='letter2'
                  component='input'
                  maxLength='1'
                  ref={this.ref[1]}
                  parse={(value) => (value ? value.toUpperCase() : '')}
                  onFocus={this.handleFocus}
                  onKeyUp={(e: SyntheticEvent) => this.handleKeyUp(e, 0)}
                  onInput={(e: SyntheticEvent) => this.handleInput(e, 1)}
                />
                <Field
                  name='letter3'
                  component='input'
                  maxLength='1'
                  ref={this.ref[2]}
                  parse={(value) => (value ? value.toUpperCase() : '')}
                  onFocus={this.handleFocus}
                  onKeyUp={(e: SyntheticEvent) => this.handleKeyUp(e, 1)}
                  onInput={(e: SyntheticEvent) => this.handleInput(e, 2)}
                />
                <Field
                  name='letter4'
                  component='input'
                  maxLength='1'
                  ref={this.ref[3]}
                  parse={(value) => (value ? value.toUpperCase() : '')}
                  onFocus={this.handleFocus}
                  onKeyUp={(e: SyntheticEvent) => this.handleKeyUp(e, 2)}
                  onInput={(e: SyntheticEvent) => this.handleInput(e, 3)}
                />
                <Field
                  name='letter5'
                  component='input'
                  maxLength='1'
                  ref={this.ref[4]}
                  parse={(value) => (value ? value.toUpperCase() : '')}
                  onFocus={this.handleFocus}
                  onKeyUp={(e: SyntheticEvent) => this.handleKeyUp(e, 3)}
                  onInput={(e: SyntheticEvent) => this.handleInput(e, 4)}
                />
                <br />
                <button type='submit'>Search</button>
              </form>
            )}
          </Form>
        </div>
        <div className='results'>
          {/* TODO separate this into a method */}
          {results.length === 0 && !isFresh && (
            <div className='no-result'>
              <label>There are no matching words.</label>
            </div>
          )}
          {results.length > 0 && (
            <div className='matches'>
              <label>
                Showing {pluralize('matching word', results.length, true)}
              </label>
            </div>
          )}
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
