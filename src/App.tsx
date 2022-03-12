import React, { SyntheticEvent } from 'react'
import './App.css'
import { Field, Form } from 'react-final-form'
import pluralize from 'pluralize'
import words from './constants'

class App extends React.Component<
  {},
  { results: Array<string>; fresh: boolean }
> {
  ref: Array<React.RefObject<HTMLInputElement>>

  // TODO use redux

  constructor(props: any) {
    super(props)
    this.ref = []
    this.state = {
      results: [],
      fresh: true
    }

    for (let i = 0; i < 5; i++) {
      this.ref.push(React.createRef())
    }
  }

  handleFocus = (event: SyntheticEvent) =>
    (event.target as HTMLInputElement).select()

  // TODO there is a bug where deleting from a field will go to the field two before if the previous field is empty
  handleKeyUp = (event: SyntheticEvent, prev: number) => {
    if (
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
    let searchTerm = ''
    const regex = '[A-Z]'
    const name = 'letter'
    for (let i = 1; i < 6; i++) {
      const val = values[(name + i) as keyof typeof values]
      searchTerm += val ? val : regex
    }
    console.log(values)
    console.log(searchTerm)
    this.setState({
      results: words.filter((word) => word.match(searchTerm)).slice(0, 500),
      fresh: false
    })
    console.log(this.state.results)
  }

  render() {
    return (
      <div className='App'>
        <div className='search'>
          <Form onSubmit={this.handleSubmit}>
            {(props) => (
              <form onSubmit={props.handleSubmit}>
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
          {this.state.results.length === 0 && !this.state.fresh && (
            <div className='no-result'>
              <label>There are no matching words.</label>
            </div>
          )}
          {this.state.results.length > 0 && (
            <div className='matches'>
              <label>
                Showing{' '}
                {pluralize('matching word', this.state.results.length, true)}
              </label>
            </div>
          )}
          {this.state.results.map((result, index) => (
            <div className='result'>
              <label key={index}>{result}</label>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default App
