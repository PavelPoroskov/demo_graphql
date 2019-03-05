import gql from 'graphql-tag'

import netclient from '../App/netclient'

import {FEED_QUERY} from '../components/LinkList'

import {LINKS_PER_PAGE} from '../utils'

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
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
`

function commit( url, description ) {
  return netclient.client.mutate({
    mutation: POST_MUTATION,
    variables: {
      url,
      description,
    },
    update: (store, result) => {
      //console.log('CreateLink, update, start')   
      // must be: order of variables in query === here
      const variables = {
        orderBy: 'createdAt_DESC',
        first: LINKS_PER_PAGE,
        skip: 0,
      }   
      const data = store.readQuery({ query: FEED_QUERY, variables })
      //-- get erros without variables for pagination {skip, first}

      data.feed.links.unshift(result.data.post)
      //data.feed.links.push(result.data.post)

      store.writeQuery({ query: FEED_QUERY, data, variables })
    }
  })
  // .then( () => {
    
  // })
  // .catch( (error) => {
  //   onError(error)
  // })
}

const wrapErrorAsync = async ( ...rest) => {
  let result = {}

  try {
    result = await commit.apply( null, rest )
  } catch (e) {
    result['errors'] = e
  }

  return result
}

export default {
  commit: wrapErrorAsync
}