import React, { useState } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import LinkListView from '../LinkList/View'


const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

function Search(props) {

  const [links, setLinks] = useState([])
  const [filter, setFilter] = useState('')

  const executeSearch = async () => {
    try {
      const result = await props.client.query({
        query: FEED_SEARCH_QUERY,
        variables: { filter },
      })
      if (result.errors) {
        console.log(result.errors)
        return      
      }

      const links = result.data.feed.links
      setLinks( links )
    } catch (e) {
      console.log(e)      
    }
  }

  return (
    <div>
      <div>
        Search
        <input
          type='text'
          onChange={e => setFilter(e.target.value)}
        />
        <button onClick={executeSearch}>OK</button>
      </div>
      <LinkListView data={links} />
    </div>
  )
}

export default withApollo(Search)