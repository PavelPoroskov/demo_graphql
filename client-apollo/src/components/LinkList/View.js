import React from 'react'

import Link from '../Link'


const LinkListView = (props) => {

  // console.log(`LinkListView`)
  // console.log(props)

  return (
    <div>{props.data.map( (obj, index) => <Link key={obj.id} data={obj} index={index}/>)}</div>
  )
}

export default LinkListView