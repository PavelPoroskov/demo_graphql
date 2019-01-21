import React from 'react'
import { timeDifferenceForDate } from '../../utils'

export default 
function LinkView(props) {
  const {userId, url, description, index, votes, postedByName, createdAt, voteForLink} = props

  return (
    <div className='flex mt2 items-start'>
      <div className='flex items-center'>
        <span className='gray'>{index}.</span>
        {userId && <div className='ml1 gray f11 btnVote' onClick={() => voteForLink()}>▲</div>}
      </div>
      <div className='ml1'>
        {/*<div>{description} ({url})</div>*/}
        <a href={url} target='new' className='link'>{description} ({url})</a>
        <div className='f6 lh-copy gray'>{votes} votes | by {postedByName || 'Unknown'} {timeDifferenceForDate(createdAt)}</div>
      </div>
    </div>
  )
}
