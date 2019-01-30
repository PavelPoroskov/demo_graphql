import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import Link from '../Link'


// export default
// function LinkList(props) {
//   return (
//     <div>{props.links.map(link => <Link key={link.id} link={link} />)}</div>
//   )
// }

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`

export default (props) => (
  <Query query={FEED_QUERY}>
    {({ loading, error, data }) => {
      if (loading) return <div>Fetching</div>
      if (error) return <div>Error</div>

      const links = data.feed.links

      return (
        <div>
          {links.map(link => <Link key={link.id} link={link} />)}
        </div>
      )
    }}
  </Query>
)
