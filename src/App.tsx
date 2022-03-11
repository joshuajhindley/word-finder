import React, { SyntheticEvent } from 'react'
import logo from './logo.svg'
import './App.css'
import { Field, Form } from 'react-final-form'

class App extends React.Component {
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

  handleKeyUp = (event: SyntheticEvent, prev: number) => {
    if (
      !(event.nativeEvent.target as HTMLInputElement).value &&
      ['Backspace', 'Delete'].includes((event.nativeEvent as KeyboardEvent).key)
    ) {
      this.ref[prev].current?.focus()
    }
  }

  handleInput = (event: SyntheticEvent, pos: number) => {
    console.log(event)
    if ((event.nativeEvent as InputEvent).data === null) {
      if (pos - 1 >= 0) {
        this.ref[pos - 1].current?.focus()
      }
    } else if (pos + 1 < this.ref.length) {
      this.ref[pos + 1].current?.focus()
    }
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header>
        <Form
          onSubmit={(values: any, form: any) => {
            console.log(values)
            console.log(form)
          }}
        >
          {props => (
            <form onSubmit={props.handleSubmit}>
              <Field
                name='letter1'
                component='input'
                maxLength='1'
                ref={this.ref[0]}
                onFocus={this.handleFocus}
                onInput={(e: SyntheticEvent) => this.handleInput(e, 0)}
              />
              <Field
                name='letter2'
                component='input'
                maxLength='1'
                ref={this.ref[1]}
                onFocus={this.handleFocus}
                onKeyUp={(e: SyntheticEvent) => this.handleKeyUp(e, 0)}
                onInput={(e: SyntheticEvent) => this.handleInput(e, 1)}
              />
              <Field
                name='letter3'
                component='input'
                maxLength='1'
                ref={this.ref[2]}
                onFocus={this.handleFocus}
                onKeyUp={(e: SyntheticEvent<HTMLInputElement, KeyboardEvent>) =>
                  this.handleKeyUp(e, 1)
                }
                onInput={(e: SyntheticEvent) => this.handleInput(e, 2)}
              />
              <Field
                name='letter4'
                component='input'
                maxLength='1'
                ref={this.ref[3]}
                onFocus={this.handleFocus}
                onKeyUp={(e: SyntheticEvent<HTMLInputElement, KeyboardEvent>) =>
                  this.handleKeyUp(e, 2)
                }
                onInput={(e: SyntheticEvent) => this.handleInput(e, 3)}
              />
              <Field
                name='letter5'
                component='input'
                maxLength='1'
                ref={this.ref[4]}
                onFocus={this.handleFocus}
                onKeyUp={(e: SyntheticEvent<HTMLInputElement, KeyboardEvent>) =>
                  this.handleKeyUp(e, 3)
                }
                onInput={(e: SyntheticEvent) => this.handleInput(e, 4)}
              />
              <button type='submit' style={{ display: 'none' }} />
            </form>
          )}
        </Form>
      </div>
    )
  }
}

export default App
