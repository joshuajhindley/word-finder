import { ActionCreatorsMapObject, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators } from '../actions'
import Children from '../ui/Children'

const mapStateToProps = (state: any) => {
  const { darkMode, isFresh, results, showHelp } = state

  return {
    darkMode,
    isFresh,
    results,
    showHelp
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actionCreators as ActionCreatorsMapObject, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Children)
