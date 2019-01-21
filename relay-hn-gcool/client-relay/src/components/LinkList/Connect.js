import React, {useEffect, useCallback, useMemo} from 'react'

import NewVoteSubscription from '../../subscriptions/NewVoteSubscription'
import LinkListView from './View'
import { ITEMS_PER_PAGE } from '../../constants'

export default
function LinkList(props) {
  
  useEffect( () => {
    NewVoteSubscription.commit()
  }, [] )

  const list = useMemo( () => {
    return props.viewer.allLinks.edges.map( o => ({link: o.node, key: o.node.__id}) )
  }, [props.viewer.allLinks] )

  const loadMore = useCallback( () => {
    if (!props.relay.hasMore()) {
      console.log(`Nothing more to load`)
      return
    } else if (props.relay.isLoading()) {
      console.log(`Request is already pending`)
      return
    }
      
    props.relay.loadMore(ITEMS_PER_PAGE)
  }, [props.relay] )


  return <LinkListView list={list} loadMore={loadMore} />
}
