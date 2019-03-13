import {useState, useRef} from 'react'
import useEffectConnection from './useEffectConnection'


const useEffectPagination = ( client, query, variables={}, fnGetData, pageSize ) => {

  const [cursorAfter, setCursorAfter] = useState(null)
  //const [cursorBefore, setCursorBefore] = useState(null)
  const [isForward, setIsForward] = useState(true)

  const refPrevPageIndex = useRef(0)
  const refPageIndex = useRef(0)
  //const [refPageIndex.current, setPageIndex] = useState(0)
  const refPrevCursorAfter = useRef([null])

  //const nPage = parseInt(props.match.params.page, 10)
  let queryVariables = {
    ...variables,
    //orderBy: 'createdAt_DESC', //
    first: pageSize,
    after: cursorAfter
  }

  const propsLoading = useEffectConnection( client, query, 
    queryVariables, 
    fnGetData
  )

  const hasNextPage = () => {
    if (isForward && propsLoading.error) {
      return false
    }

    if (propsLoading.data) {
      const pgi = propsLoading.data.pageInfo
      if ((isForward && pgi.hasNextPage) || (refPageIndex.current < refPrevCursorAfter.current.length-1) ) {
        return true
      }
    }

    return false
  }
  const goNextPage = () => {
    if (!hasNextPage()) {
      return
    }

    setIsForward(true)
    refPrevPageIndex.current = refPageIndex.current
    refPageIndex.current = refPageIndex.current + 1

    if (refPrevCursorAfter.current.length <= refPageIndex.current ) {
      const pgi = propsLoading.data.pageInfo
      refPrevCursorAfter.current.push(pgi.endCursor)
    }
    setCursorAfter(refPrevCursorAfter.current[refPageIndex.current])
  }
  const hasPrevPage = () => {

    return (0 < refPageIndex.current)
  }
  const goPrevPage = () => {
    if (!hasPrevPage()) {
      return
    }

    setIsForward(false)

    refPrevPageIndex.current = refPageIndex.current
    refPageIndex.current = refPageIndex.current - 1
    setCursorAfter(refPrevCursorAfter.current[refPageIndex.current])
  }

  const getData = () => {

    if (propsLoading.error) {
      return null
    }

    if (propsLoading.data) {
      let newData = propsLoading.data.edges.map( o => o.node )
      // //incremental 
      // return newData
      
      //pages
      if (newData.length -1 < refPageIndex.current*pageSize) {
        newData = newData.slice( refPrevPageIndex.current*pageSize, (refPrevPageIndex.current + 1)*pageSize )
      }else{
        newData = newData.slice( refPageIndex.current*pageSize, (refPageIndex.current + 1)*pageSize )
      }

      return newData
    }
    return null
  }
  // async function asyncFunction() {

  // }

  // useEffect( () => {

  //   //console.log('react-apollo-hooks.js / useEffectApolloConnection')

  //   asyncFunction()

  // }, [] )

  return {
    loading: propsLoading.loading,
    error: propsLoading.error,
    data: getData(),
    hasPrevPage: hasPrevPage(), 
    goPrevPage, 
    hasNextPage: hasNextPage(), 
    goNextPage, 
    totalBefore: refPageIndex.current*pageSize
  }
}

export default useEffectPagination