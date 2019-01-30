import React from 'react'

import Link from '../Link'


export default (props) => (
  <div>{props.data.map(obj => <Link key={obj.id} data={obj} />)}</div>
)
