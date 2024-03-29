import React from 'react'
import '../styles/Finder.scss'
import ReactModal from 'react-modal'
import classNames from 'classnames'

export default class HelpModal extends React.Component<any, any> {
  render() {
    const { darkMode, showHelp, actions } = this.props

    const colorDiv = classNames({
      dark: darkMode,
    })

    return (
      <ReactModal
        isOpen={showHelp}
        onRequestClose={() => actions.toggleHelp(false)}
        ariaHideApp={false}
        overlayClassName='modal-overlay'
        className={`help-modal ${colorDiv}`}
      >
        <div className='modal-content'>
          <div className='help-modal-header'>
            <div className='help-modal-header-title'>
              <h1>Help</h1>
            </div>
            <div
              className='help-modal-header-close'
              onClick={() => actions.toggleHelp(false)}
            >
              <h1>x</h1>
            </div>
          </div>
          <div className='help-modal-body'>{this.renderMessage()}</div>
        </div>
      </ReactModal>
    )
  }

  renderMessage() {
    return (
      <p>
        This is a simple tool to help you find the correct word in a Wordle
        game.
        <br />
        <br />
        There are three rows of input boxes.
        <br />
        {this.renderFirstRowInfo()}
        {this.renderSecondRowInfo()}
        {this.renderThirdRowInfo()}
        You can use the &apos;search&apos; button to find the first 500 words
        that match the letters you&apos;ve entered and can reset the input boxes
        by tapping the &apos;reset&apos; button.
      </p>
    )
  }

  renderFirstRowInfo() {
    return (
      <>
        The first row are letters in the correct position.
        <br />
        These are the green letters in your Wordle game.
        <br />
        <br />
      </>
    )
  }

  renderSecondRowInfo() {
    return (
      <>
        The second row are letters that are in the final word, in any position.
        <br />
        These are the yellow letters in your Wordle game.
        <br />
        <br />
        If all of the letters are in the wrong position, you can click the
        &quot;Letters are not in the above positions&quot; checkbox and only
        words that contain those letters not in those positions will be returned
        by the search.
        <br />
        <br />
      </>
    )
  }

  renderThirdRowInfo() {
    return (
      <>
        The third row are letters that are not in the word.
        <br />
        These are the grey letters in your Wordle game.
        <br />
        New input boxes are added to this row automatically as you add letters.
        <br />
        <br />
      </>
    )
  }
}
