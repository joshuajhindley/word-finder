import React from 'react'
import FinderContainer from '../containers/finderContainer'
import Finder from './Finder'
import HelpModal from './HelpModal'

const FinderUI = (props: any) => {
  return (
    <FinderContainer {...props}>
      <HelpModal {...props} />
      <Finder {...props} />
    </FinderContainer>
  )
}

export default FinderUI
