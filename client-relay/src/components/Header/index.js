import React, { useContext, useCallback } from "react";
import { withRouter } from "react-router";

import HeaderView from "./View";

import { AppContext } from "../../context";

//import { GC_USER_ID, GC_AUTH_TOKEN } from '../../constants'
// eslint-disable-next-line react-hooks/exhaustive-deps

function Header(props) {
  const context = useContext(AppContext);
  const onLogout = useCallback(() => {
    context.logout();
    props.history.push(`/`);
  }, [props.history, context]);

  return <HeaderView userId={context.loggedUserId} logout={onLogout} />;
}

export default withRouter(Header);
