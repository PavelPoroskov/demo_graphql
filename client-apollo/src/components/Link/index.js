import React, { useContext, /*useMemo,*/ useCallback } from 'react'
import { withApollo } from 'react-apollo'

import CreateVoteMutation from '../../mutations/CreateVote'
import {AppContext} from '../../App/context';

import LinkView from './View'

function Link(props, _context) {

  const context = useContext(AppContext)

  const voteForLink = useCallback( async () => {
    //const userId = localStorage.getItem(GC_USER_ID)
    const userId = context.loggedUserId
    if (!userId) {
      console.log(`Can't vote without user ID`)
      return
    }

    let result = await CreateVoteMutation.commit( props.client, props.data.id )
    if (result.errors) {
      // ui_callbackError(result.errors)
      // return
    }
  }, [context, props ])

  // const memoizedProps = useMemo(() => ({
  //   index: props.index + 1,
  //   url: props.data.url,
  //   description: props.data.description,
  //   votes: props.data.votes.length,
  //   postedByName: props.data.postedBy && props.data.postedBy.name,
  //   createdAt: props.data.createdAt,
  //   //linkId: props.link.id,
  // }), [props.data] );
  const memoizedProps = {
    index: props.index + 1,
    url: props.data.url,
    description: props.data.description,
    votes: props.data.votes.length,
    postedByName: props.data.postedBy && props.data.postedBy.name,
    createdAt: props.data.createdAt,
    //linkId: props.link.id,
  }
  // console.log(`Link`)
  // console.log(props.index + 1)
  // console.log(memoizedProps)
  // console.log(props.data.votes.length)

  return <LinkView userId={context.loggedUserId} voteForLink={voteForLink} data={memoizedProps} />
}

export default withApollo(Link)