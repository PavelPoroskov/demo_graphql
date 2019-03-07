//import LinkList, {FEED_QUERY} from './index0ComponentQuery'
//import LinkList from './index1Recompose'

// in this option dont rerender after store.writeQuery({ query: FEED_QUERY, data })
// need use <Query />
import LinkList, {FEED_QUERY} from './index3HooksPageConn.js'
//import LinkList, {FEED_QUERY} from './index2HooksPageNum.js'

export {
  FEED_QUERY
}
export default LinkList