import React, { Component } from 'react'

import Link from '../Link'
import { GC_USER_ID } from '../../constants'
import NewVoteSubscription from '../../subscriptions/NewVoteSubscription'

export default
class LinkList extends Component {

  render() {
    const userId = localStorage.getItem(GC_USER_ID)

    return (
      <div>
        {this.props.viewer.allLinks.edges.map( ({node}, index) => (
          <Link key={node.__id} link={node} index={index} userId={userId}/>
        ))}
      </div>
    )
  }
  componentDidMount() {
    NewVoteSubscription.commit()
  }
}
