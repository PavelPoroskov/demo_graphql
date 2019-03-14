import gql from 'graphql-tag'

import netclient from '../App/netclient'

import {FEED_QUERY} from '../components/LinkList'

const MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

function commit( linkId ) {
  return netclient.client.mutate({
    mutation: MUTATION,
    variables: {
      linkId
    },
    update: (store, result) => {
      //console.log('CreateVote, update, start')
      const data = store.readQuery({ query: FEED_QUERY })

      //const votedLink = data.feed.links.find(link => link.id === linkId)
      //votedLink.votes = result.data.vote.link.votes
      
      const votedLink = data.feedConnection.edges.find(edge => edge.node.id === linkId)
      votedLink.node.votes = result.data.vote.link.votes

      store.writeQuery({ query: FEED_QUERY, data })
      //console.log(data)
      //console.log('CreateVote, update, end')
    }
  })
}

// const wrapErrorAsyncFn = (fnCommit) => async ( ...rest) => {
//   let result = {}

//   try {
// //    result = await commit(linkid)
//     result = await fnCommit.apply( null, rest )
//   } catch (e) {
//     result['errors'] = e
//   }

//   return result
// }
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