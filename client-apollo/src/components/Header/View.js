import React from 'react'
import { Link } from 'react-router-dom'

export default
function HeaderView(props) {

  return (
    <div className='flex pa1 justify-between nowrap orange'>
      <div className='flex flex-fixed black'>
        
        <Link to='/' className='ml1 no-underline black'>
          <div className='fw7 mr1'>Hacker News</div>
        </Link>
        <Link to="/" className="ml1 no-underline black">
          all
        </Link>        
        <div className="ml1">|</div>
        <Link to="/search" className="ml1 no-underline black">
          search
        </Link>        
        {props.userId &&
        <div className='flex'>
          <div className='ml1'>|</div>
          <Link to='/create' className='ml1 no-underline black'>add</Link>
        </div>
        }
      </div>
      <div className='flex flex-fixed'>
        {props.userId ?
          <div className='ml1 pointer black' onClick={props.logout}>logout</div>
          :
          <Link to='/login' className='ml1 no-underline black'>login</Link>
        }
      </div>
    </div>
  )
}

