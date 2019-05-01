import React, { useCallback } from "react";
import CreateLinkView from "./View";

import CreateLinkMutation from "../../mutations/CreateLinkMutation";

//import {AppContext} from '../../context'

export default function CreateLin(props) {
  //const context = useContext(AppContext)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  
  const createLink = useCallback(
    (url, description) => {
      CreateLinkMutation.commit(
        //this.props.relay.environment,
        //postedById,
        url,
        description,
        () => {
          console.log(`Mutation completed`);

          props.history.push("/");
        }
        // (error) => {
        //   context.setErrors([error])
        // },
      );
    },
    [props.history]
  );

  return <CreateLinkView createLink={createLink} />;
}
