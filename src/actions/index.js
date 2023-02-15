const actionTypes = {
  FIND_RESULTS: 'FIND_RESULTS',
  UPDATE_RESULTS: 'UPDATE_RESULTS',
  RESET_RESULTS: 'RESET_RESULTS',
  INVERT_COLOR_MODE: 'INVERT_COLOR_MODE',
  TOGGLE_HELP: 'TOGGLE_HELP',
  TOGGLE_IN_POSITION: 'TOGGLE_IN_POSITION'
}

export const actionCreators = {
  findResults: values => {
    return {
      type: actionTypes.FIND_RESULTS,
      values
    }
  },
  invertColorMode: () => {
    return {
      type: actionTypes.INVERT_COLOR_MODE
    }
  },
  updateResults: results => {
    return {
      type: actionTypes.UPDATE_RESULTS,
      payload: {
        results
      }
    }
  },
  resetResults: () => {
    return {
      type: actionTypes.RESET_RESULTS
    }
  },
  toggleHelp: value => {
    return {
      type: actionTypes.TOGGLE_HELP,
      value
    }
  },
  toggleInPosition: () => {
    return {
      type: actionTypes.TOGGLE_IN_POSITION
    }
  }
}

export default actionTypes
