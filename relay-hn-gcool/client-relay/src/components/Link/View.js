import React, { Component } from 'react'
import { fetchQuery } from 'relay-runtime'
import graphql from "babel-plugin-relay/macro"

//import { GC_USER_ID } from '../../constants'
import { timeDifferenceForDate } from '../../utils'
import CreateVoteMutation from '../../mutations/CreateVoteMutation'


export default 
class Link extends Component {

  render() {
//    const userId = localStorage.getItem(GC_USER_ID)
    const userId = this.props.userId

    return (
      <div className='flex mt2 items-start'>
        <div className='flex items-center'>
          <span className='gray'>{this.props.index + 1}.</span>
          {userId && <div className='ml1 gray f11' onClick={() => this._voteForLink()}>▲</div>}
        </div>
        <div className='ml1'>
          <div>{this.props.link.description} ({this.props.link.url})</div>
          <div className='f6 lh-copy gray'>{this.props.link.votes.count} votes | by {this.props.link.postedBy ? this.props.link.postedBy.name : 'Unknown'} {timeDifferenceForDate(this.props.link.createdAt)}</div>
        </div>
      </div>
    )
  }

  _voteForLink = async () => {
    //const userId = localStorage.getItem(GC_USER_ID)
    const userId = this.props.userId
    if (!userId) {
      console.log(`Can't vote without user ID`)
      return
    }

    const linkId = this.props.link.id

    const canUserVoteOnLink = await this._userCanVoteOnLink(userId, linkId)
    if (canUserVoteOnLink) {
      CreateVoteMutation.commit(userId, linkId)
    } else {
      console.log(`Current already voted for that link`)
    }
  }

  _userCanVoteOnLink = async (userId, linkId) => {

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
    const result = await fetchQuery( this.props.relay.environment, query, variables )
    //console.log('_userCanVoteOnLink')
    //console.log(result)
    return result.viewer.allVotes.edges.length === 0
  }
}
