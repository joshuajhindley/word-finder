export const actionTypes = {
  FIND_RESULTS: 'FIND_RESULTS',
  UPDATE_RESULTS: 'UPDATE_RESULTS'
}

export const findResults = (values) => ({
  type: actionTypes.FIND_RESULTS,
  values
})

export const updateResults = (results) => {
  return {
    type: actionTypes.UPDATE_RESULTS,
    payload: {
      results
    }
  }
}
