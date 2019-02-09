import React from 'react'

import Link from '../Link'


export default (props) => (
  <div>{props.data.map( (obj, index) => <Link key={obj.id} data={obj} index={index}/>)}</div>
)
