import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import { GC_USER_ID, GC_AUTH_TOKEN } from '../../constants'

class Header extends Component {

  render() {
    //console.log('Header render withRouter()')

    const userId = localStorage.getItem(GC_USER_ID)
    return (
      <div className='flex pa1 justify-between nowrap orange'>
        <div className='flex flex-fixed black'>
          
          <Link to='/' className='ml1 no-underline black'>
            <div className='fw7 mr1'>Hacker News</div>
          </Link>
          {userId &&
          <div className='flex'>
            <div className='ml1'>|</div>
            <Link to='/create' className='ml1 no-underline black'>Add</Link>
          </div>
          }
        </div>
        <div className='flex flex-fixed'>
          {userId ?
            <div className='ml1 pointer black' onClick={this._logout}>logout</div>
            :
            <Link to='/login' className='ml1 no-underline black'>login</Link>
          }
        </div>
      </div>
    )
  }

  _logout = () => {
    localStorage.removeItem(GC_USER_ID)
    localStorage.removeItem(GC_AUTH_TOKEN)
    this.props.history.push(`/`)
  }
}

export default withRouter(Header)