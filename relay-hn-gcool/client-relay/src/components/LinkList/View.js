import React, { Component } from 'react'
import Link from '../Link'


export default
class LinkList extends Component {

  render() {

    return (
      <div>
        {this.props.viewer.allLinks.edges.map( ({node}) => (
          <Link key={node.__id} link={node}/>
        ))}
      </div>
    )
  }

}
