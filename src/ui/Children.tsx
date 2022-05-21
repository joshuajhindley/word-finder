import React from 'react'
import { omit } from 'lodash'

export default function Children(props: any) {
  const propsToPass = omit(props, ['children'])
  const childrenWithProps = React.Children.map(props.children, (child: any) => {
    const finalProps = { ...child.props, ...propsToPass }
    finalProps.actions = { ...child.props.actions, ...propsToPass.actions }
    return React.cloneElement(child, finalProps)
  })
  return <>{childrenWithProps}</>
}
