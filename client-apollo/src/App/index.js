import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { ApolloProvider } from "react-apollo";

import { AppContext, useProvideAuthContext } from "./context";
import netclient from "./netclient";

import PrivateRoute from "../components/PrivateRoute";
import ErrorBoundary from "../components/ErrorBoundary";

import Header from "../components/Header";
import LinkList from "../components/LinkList";
import Search from "../components/Search";
import Login from "../components/Login";
import CreateLink from "../components/CreateLink";

import "./App.css";

// export default
// React.memo()

export default function App() {
  const contextAuth = useProvideAuthContext();
  //          <ErrorBoundary othererrors={errors}>

  return (
    <AppContext.Provider value={contextAuth}>
      <ApolloProvider client={netclient.client}>
        <BrowserRouter>
          <div className="center w85">
            <Header />
            <div className="ph3 pv1 background-gray">
              <ErrorBoundary>
                <Switch>
                  <Route exact path="/" component={LinkList} />
                  {/*
                <Route exact path='/top' component={LinkList}/>
                */}
                  <Route exact path="/search" component={Search} />
                  <Route exact path="/login" component={Login} />
                  <PrivateRoute exact path="/create" component={CreateLink} />
                  {/*
                <Route exact path='/page/:page' component={LinkList}/>
                <Redirect to='/page/1'/>
                */}
                  <Redirect to="/" />
                </Switch>
              </ErrorBoundary>
            </div>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    </AppContext.Provider>
  );
}
