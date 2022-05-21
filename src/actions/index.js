export const actionTypes = {
  FIND_RESULTS: 'FIND_RESULTS',
  UPDATE_RESULTS: 'UPDATE_RESULTS',
  RESET_RESULTS: 'RESET_RESULTS',
  INVERT_COLOR_MODE: 'INVERT_COLOR_MODE',
  TOGGLE_HELP: 'TOGGLE_HELP'
}

export const findResults = values => {
  return {
    type: actionTypes.FIND_RESULTS,
    values
  }
}

export const invertColorMode = () => {
  return {
    type: actionTypes.INVERT_COLOR_MODE
  }
}

export const updateResults = results => {
  return {
    type: actionTypes.UPDATE_RESULTS,
    payload: {
      results
    }
  }
}

export const resetResults = () => {
  return {
    type: actionTypes.RESET_RESULTS
  }
}

export const toggleHelp = value => {
  return {
    type: actionTypes.TOGGLE_HELP,
    value
  }
}
