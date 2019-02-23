import React from 'react'

import Link from '../Link'


const LinkListView = (props) => {

  // console.log(`LinkListView`)
  // console.log(props)
  let nPage = props.nPage || 1
  let iPage = nPage - 1

  return (
    <div>{props.data.map( (obj, index) => <Link key={obj.id} data={obj} index={iPage + index}/>)}</div>
  )
}

export default LinkListView