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

export default compose(
  graphql(POST_MUTATION),
  withHandlers({
    createLink: (props) => async (url, description) => {
        props.mutate({
            variables: {
              url,
              description
            },
        }).then((data: string) => {
          props.history.push('/')
        }).catch((e: Object) => {
          //console.error(e, 'Error');
        });
      }
  })
)(CreateLinkView);
