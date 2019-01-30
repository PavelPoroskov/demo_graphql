import React from 'react'

import Link from '../Link'


export default (props) => (
  <div>{props.list.map(obj => <Link key={obj.id} link={obj} />)}</div>
)
