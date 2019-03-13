import React from 'react'

import Link from '../Link'


const LinkListView = (props) => {

  //console.log(`LinkListView`)
  // console.log(props)
  let iTotal = props.iTotal || 0

  return (
    <div>{props.data.map( (obj, index) => <Link key={obj.id} data={obj} index={iTotal + index}/>)}</div>
  )
}

export default LinkListView