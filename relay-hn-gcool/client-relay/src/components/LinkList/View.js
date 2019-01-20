import React from 'react'

import Link from '../Link'

export default
function LinkListView(props) {

  return (
    <div>
      <div>
        {props.list.map( ( obj, index) => (
          <Link key={obj.key} link={obj.link} index={index}/>
        ))}
      </div>
      <div className='flex ml4 mv3 gray'>
        <div className='pointer' onClick={props.loadMore}>More</div>
      </div>
    </div>
}
