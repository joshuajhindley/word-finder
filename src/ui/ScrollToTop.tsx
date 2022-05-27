import React, { useEffect, useState } from 'react'
import { BiArrowFromBottom } from 'react-icons/bi'
import classNames from 'classnames'

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

class ScrollIcon extends React.Component<any, any> {
  render() {
    return (
      <div className={this.props.className} onClick={scrollToTop}>
        <BiArrowFromBottom />
      </div>
    )
  }
}

export default function ScrollToTop(props: any) {
  const { darkMode } = props
  const [isVisible, setVisisble] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setVisisble(true)
    } else {
      setVisisble(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const className = classNames('scroll-to-top', { dark: darkMode, visible: isVisible })
  const iconProps = { toggleVisibility, className }

  return <ScrollIcon {...iconProps} />
}
