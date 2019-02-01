//import React, { useState } from 'react'
//import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { compose, withHandlers } from 'recompose'

import CreateLinkView from './View'


const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

// export default
// function CreateLinkView(props)  {

//   const [description, setDescription] = useState('')
//   const [url, setUrl] = useState('')

//   return (
//     <div>
//       <div className='flex flex-column mt3'>
//         <input
//           className='mb2'
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           type='text'
//           placeholder='A description for the link'
//         />
//         <input
//           className='mb2'
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           type='text'
//           placeholder='The URL for the link'
//         />
//       </div>
//       <Mutation mutation={POST_MUTATION} variables={{ description, url }}>
//         {postMutation => <button onClick={postMutation}>Submit</button>}
//       </Mutation>      
//     </div>
//   )
// }

export default compose(
  graphql(POST_MUTATION),
  withHandlers({
    createLink: (props) => async (url, description) => {
        return props.mutate({
            variables: {
              url,
              description
            },
          }).then((data: string) => {
          //console.log(data, 'Return value');
        }).catch((e: Object) => {
          //console.error(e, 'Error');
        });
      }
  })
)(CreateLinkView);
