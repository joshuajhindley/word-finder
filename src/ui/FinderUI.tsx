import React from 'react'
import FinderContainer from '../containers/finderContainer'
import Finder from './Finder'
import HelpModal from './HelpModal'
import ScrollToTop from './ScrollToTop'

const FinderUI = (props: any) => {
  return (
    <FinderContainer {...props}>
      <HelpModal {...props} />
      <Finder {...props} />
      <ScrollToTop {...props} />
    </FinderContainer>
  )
}

export default FinderUI
