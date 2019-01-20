import React, { Component } from 'react'
import { fetchQuery } from 'relay-runtime'
import graphql from "babel-plugin-relay/macro"

import React, { useContext, useMemo } from 'react'

import CreateVoteMutation from '../../mutations/CreateVoteMutation'
import {AppContext} from '../../context';

import LinkView from './View0'


const userCanVoteOnLink = async (userId, linkId, relayEnvironment) => {

  const variables = {
    filter: {
      user: { id: userId },
      link: { id: linkId }
    }
  }

  const query = graphql`
    query ViewCheckVoteQuery($filter: VoteFilter!) {
      viewer {
        allVotes(filter: $filter) {
          edges {
            node {
              id
            }
          }
        }
      }
    }`
  const result = await fetchQuery( relayEnvironment, query, variables )
  //console.log('_userCanVoteOnLink')
  //console.log(result)
  return result.viewer.allVotes.edges.length === 0
}


export default 
function Link(props) {

  const context = useContext(AppContext)
  const voteForLink = useCallback( async () => {
      //const userId = localStorage.getItem(GC_USER_ID)
      const userId = context.loggedUserId
      if (!userId) {
        console.log(`Can't vote without user ID`)
        return
      }

      const linkId = props.link.id

      const canUserVoteOnLink = await userCanVoteOnLink(userId, linkId, props.relay.environment )
      if (canUserVoteOnLink) {
        CreateVoteMutation.commit(userId, linkId)
      } else {
        console.log(`Current already voted for that link`)
      }
    }
  }), [context.loggedUserId, props.link])

  const memoizedProps = useMemo(() => ({
    index: props.index + 1,
    url: props.link.url,
    description: props.link.description,
    votes: props.link.votes.count,
    postedByName: props.link.postedBy && props.link.postedBy.name,
  }), [props.link]);

  return <LinkView userId={context.loggedUserId} voteForLink={voteForLink} {...memoizedProps} />
}
