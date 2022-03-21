import React, { createRef, SyntheticEvent } from 'react'
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
  correct: React.MutableRefObject<Array<HTMLInputElement>>
  incorrect: React.MutableRefObject<Array<HTMLInputElement>>
  notBoxes: number
  show: Array<boolean>

  constructor(props: any) {
    super(props)
    this.correct = createRef() as React.MutableRefObject<Array<HTMLInputElement>>
    this.correct.current = []
    this.incorrect = createRef() as React.MutableRefObject<Array<HTMLInputElement>>
    this.incorrect.current = []
    this.show = new Array(true)
    this.notBoxes = 1
  }

  handleFocus = (event: SyntheticEvent) => (event.target as HTMLInputElement).select()

  handleKeyUp = (event: SyntheticEvent, pos: number) => {
    const key = (event.nativeEvent as KeyboardEvent).key
    if (pos > 0 && ['Backspace', 'Delete', 'ArrowLeft'].includes(key)) {
      this.correct.current[pos - 1].focus()
    } else if (pos < this.correct.current.length && key === 'ArrowRight') {
      this.correct.current[pos + 1].focus()
    }
  }

  findNextHigher = (pos: number) => {
    const posInSlice = this.show.slice(pos + 1).indexOf(true)
    return posInSlice === -1 ? posInSlice : posInSlice + pos + 1
  }

  findNextLower = (pos: number) => {
    return this.show.slice(0, pos).lastIndexOf(true)
  }

  handleNotKeyUp = (event: SyntheticEvent, pos: number) => {
    const key = (event.nativeEvent as KeyboardEvent).key
    const lower = this.findNextLower(pos)
    const higher = this.findNextHigher(pos)

    // do nothing if there is only one visible input
    if (lower === higher && higher === -1) {
      return
    }

    switch (key) {
      case 'ArrowLeft':
        if (lower !== -1) {
          this.incorrect.current[lower].focus()
        }
        break
      case 'ArrowRight':
        if (higher !== -1) {
          this.incorrect.current[higher].focus()
        }
        break
      case 'Delete':
      case 'Backspace':
        this.incorrect.current[lower !== -1 ? lower : higher].focus()
        if (higher !== -1) {
          this.show[pos] = false
          this.forceUpdate()
        }
        break
      default:
        break
    }
  }

  handleInput = (event: SyntheticEvent, pos: number) => {
    // only allow letters
    if (!/^[A-Za-z]$/.test(this.correct.current[pos].value)) {
      this.correct.current[pos].value = ''
    } else if (pos + 1 < this.correct.current.length) {
      this.correct.current[pos + 1].focus()
    }
  }

  handleNotInput = (event: SyntheticEvent, pos: number) => {
    //only allow letters
    //TODO maybe disallow already entered letters?
    if (!/^[A-Za-z]$/.test(this.incorrect.current[pos].value)) {
      this.incorrect.current[pos].value = ''
      return
    }

    if (this.findNextHigher(pos) === -1) {
      this.show[this.notBoxes] = true
      this.notBoxes++
      this.forceUpdate()
    }
    setTimeout(() => {
      this.incorrect.current[this.findNextHigher(pos)].focus()
    }, 1)
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
        <label>Showing {pluralize('matching word', results.length, true)}.</label>
      </div>
    )
  }

  render() {
    const { results, isFresh } = this.props

    return (
      <div className='App'>
        <div className='search'>
          <Form onSubmit={this.handleSubmit}>
            {props => (
              <form onSubmit={props.handleSubmit}>
                <h2>Word Finder for Wordle</h2>
                {[...Array(5)].map((e, i) => (
                  <Field
                    name={'letter' + (i + 1)}
                    component='input'
                    maxLength='1'
                    key={i}
                    ref={(el: HTMLInputElement) => (this.correct.current[i] = el)}
                    parse={value => (value ? value.toUpperCase() : '')}
                    onFocus={this.handleFocus}
                    onKeyUp={(e: SyntheticEvent) => this.handleKeyUp(e, i)}
                    onInput={(e: SyntheticEvent) => this.handleInput(e, i)}
                  />
                ))}
                <br />
                <br />
                {/* TODO add labels explaining */}
                {[...Array(this.notBoxes)].map((e, i) => {
                  return !this.show[i] ? null : (
                    <Field
                      name={'notLetter' + (i + 1)}
                      component='input'
                      maxLength='1'
                      key={i}
                      ref={(el: HTMLInputElement) => (this.incorrect.current[i] = el)}
                      parse={value => (value ? value.toUpperCase() : '')}
                      onFocus={this.handleFocus}
                      onKeyUp={(e: SyntheticEvent) => this.handleNotKeyUp(e, i)}
                      onInput={(e: SyntheticEvent) => this.handleNotInput(e, i)}
                    />
                  )
                })}
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
