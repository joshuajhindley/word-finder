export const actionTypes = {
  FIND_RESULTS: 'FIND_RESULTS',
  UPDATE_RESULTS: 'UPDATE_RESULTS',
  RESET_RESULTS: 'RESET_RESULTS'
}

export const findResults = values => {
  return {
    type: actionTypes.FIND_RESULTS,
    values
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
