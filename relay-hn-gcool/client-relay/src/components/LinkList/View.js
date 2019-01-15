import React, { Component } from 'react'

import Link from '../Link'
import { ITEMS_PER_PAGE } from '../../constants'
import NewVoteSubscription from '../../subscriptions/NewVoteSubscription'

export default
class LinkList extends Component {

  render() {
    //const userId = localStorage.getItem(GC_USER_ID)

    return (
      <div>
        <div>
          {this.props.viewer.allLinks.edges.map( ({node}, index) => (
            <Link key={node.__id} link={node} index={index}/>
          ))}
        </div>
        <div className='flex ml4 mv3 gray'>
          <div className='pointer' onClick={this._loadMore}>More</div>
        </div>
      </div>
    )
  }
  componentDidMount() {
    NewVoteSubscription.commit()
  }

  _loadMore = () => {
    if (!this.props.relay.hasMore()) {
      console.log(`Nothing more to load`)
      return
    } else if (this.props.relay.isLoading()) {
      console.log(`Request is already pending`)
      return
    }
      
    this.props.relay.loadMore(ITEMS_PER_PAGE)
  }
}
