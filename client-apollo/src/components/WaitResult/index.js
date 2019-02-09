import React from 'react'
import { branch, compose, renderComponent, //withProps 
} from 'recompose'

import ErrorComponent from './Error'
import LoadingComponent from './Loading'


export default compose(
  branch(
    props => props.data.loading,
    renderComponent(() => <LoadingComponent size="large" />)
  ),
  branch(
    props => props.data.error,
    renderComponent(props => <ErrorComponent {...props} />)
  ),
  // withProps(({ data }) => {
  //   return data
  // })
)