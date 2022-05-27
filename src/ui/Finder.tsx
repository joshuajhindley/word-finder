import React, { createRef, SyntheticEvent } from 'react'
import '../styles/Finder.scss'
import { Field, Form, FormRenderProps } from 'react-final-form'
import pluralize from 'pluralize'
import classNames from 'classnames'
import { BsFillQuestionSquareFill } from 'react-icons/bs'

class Finder extends React.Component<any, any> {
  correct: React.MutableRefObject<Array<HTMLInputElement>>
  anyPos: React.MutableRefObject<Array<HTMLInputElement>>
  incorrect: React.MutableRefObject<Array<HTMLInputElement>>
  notBoxes: number
  show: Array<boolean>

  constructor(props: any) {
    super(props)
    this.correct = createRef() as React.MutableRefObject<Array<HTMLInputElement>>
    this.correct.current = []
    this.anyPos = createRef() as React.MutableRefObject<Array<HTMLInputElement>>
    this.anyPos.current = []
    this.incorrect = createRef() as React.MutableRefObject<Array<HTMLInputElement>>
    this.incorrect.current = []
    this.show = new Array(true)
    this.notBoxes = 1
  }

  reset = (formProps: FormRenderProps<object, object>) => {
    const { actions } = this.props

    this.correct.current = []
    this.anyPos.current = []
    this.incorrect.current = []
    this.show = new Array(true)
    this.notBoxes = 1
    formProps.form.reset()
    actions.resetResults()
    this.forceUpdate()
  }

  handleFocus = (event: SyntheticEvent) => {
    ;(event.target as HTMLInputElement).select()
    window.scrollTo({ top: 100, behavior: 'smooth' })
  }

  handleKeyUp = (event: SyntheticEvent, pos: number, ref: 'correct' | 'anyPos' | 'incorrect') => {
    if (ref === 'incorrect') {
      this.handleNotKeyUp(event, pos)
      return
    }
    const key = (event.nativeEvent as KeyboardEvent).key
    if (pos > 0 && ['Backspace', 'Delete', 'ArrowLeft'].includes(key)) {
      this[ref].current[pos - 1].focus()
    } else if (pos + 1 < this[ref].current.length && key === 'ArrowRight') {
      this[ref].current[pos + 1].focus()
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

  handleInput = (event: SyntheticEvent, pos: number, ref: 'correct' | 'anyPos' | 'incorrect') => {
    if (ref === 'incorrect') {
      this.handleNotInput(event, pos)
      return
    }

    // only allow letters
    if (!/^[A-Za-z]$/.test(this[ref].current[pos].value)) {
      this[ref].current[pos].value = ''
    } else if (pos + 1 < this[ref].current.length) {
      this[ref].current[pos + 1].focus()
    } else {
      setTimeout(() => {
        this[ref].current[pos].blur()
        this[ref].current[pos].focus()
      }, 0)
    }
  }

  handleNotInput = (event: SyntheticEvent, pos: number) => {
    //only allow letters
    if (!/^[A-Za-z]$/.test(this.incorrect.current[pos].value)) {
      this.incorrect.current[pos].value = ''
      return
    }

    // do not add the letter if there is already the same letter in another box
    const found =
      this.correct.current
        .concat(this.anyPos.current)
        .find(input => input.value === this.incorrect.current[pos].value.toUpperCase()) ||
      this.incorrect.current.find((input, index) => {
        return this.show[index] && input.value === this.incorrect.current[pos].value.toUpperCase() && index !== pos
      })

    if (found) {
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
    const { actions } = this.props
    actions.findResults(values)
    this.incorrect.current[this.notBoxes - 1].blur()
  }

  handleColorChange = () => {
    const { actions } = this.props
    actions.invertColorMode()
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
          Showing {results.length === 500 ? 'first ' : ''}
          {pluralize('matching word', results.length, true)}.
        </label>
      </div>
    )
  }

  render() {
    const { darkMode } = this.props

    const colorDiv = classNames({
      dark: darkMode
    })

    return (
      <div className={`app ${colorDiv}`}>
        {this.renderHeader(colorDiv)}
        {this.renderBody()}
      </div>
    )
  }

  renderHeader(colorDiv: string) {
    const { actions } = this.props

    return (
      <div className='header'>
        <a href='/' tabIndex={-1}>
          <button tabIndex={-1}>{'< Home'}</button>
        </a>
        <div className={`help-message ${colorDiv}`} onClick={() => actions.toggleHelp(true)}>
          <BsFillQuestionSquareFill />
        </div>
        <div className={`color ${colorDiv}`} onClick={this.handleColorChange} tabIndex={1} />
      </div>
    )
  }

  renderBody() {
    const { results, isFresh } = this.props

    return (
      <div className='body'>
        <div className='search'>{this.renderForm()}</div>
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

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {formProps => (
          <form autoComplete='off' onSubmit={formProps.handleSubmit}>
            <h2>Word Finder for Wordle</h2>
            <h4>Letters in the correct position</h4>
            {[...Array(5)].map((e, i) => this.renderField('letter' + (i + 1), i, 'correct'))}
            <h4>Letters in any position</h4>
            {[...Array(5)].map((e, i) => this.renderField('anyPosLetter' + (i + 1), i, 'anyPos'))}
            <h4>Letters not in answer</h4>
            {[...Array(this.notBoxes)].map((e, i) => {
              return !this.show[i] ? null : this.renderField('notLetter' + (i + 1), i, 'incorrect')
            })}
            <br />
            <button type='submit' className='search-button'>
              Search
            </button>
            <br />
            <button onClick={() => this.reset(formProps)} type='button' className='reset-button'>
              Reset
            </button>
          </form>
        )}
      </Form>
    )
  }

  renderField(name: string, index: number, type: 'correct' | 'anyPos' | 'incorrect') {
    return (
      <Field
        name={name}
        component='input'
        maxLength='1'
        key={index}
        ref={(el: HTMLInputElement) => (this[type].current[index] = el)}
        parse={value => (value ? value.toUpperCase() : '')}
        onFocus={this.handleFocus}
        onKeyUp={(e: SyntheticEvent) => this.handleKeyUp(e, index, type)}
        onInput={(e: SyntheticEvent) => this.handleInput(e, index, type)}
      />
    )
  }
}

export default Finder
