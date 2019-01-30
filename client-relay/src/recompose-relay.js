import {
  createFragmentContainer as createFragmentContainer0,
  createPaginationContainer as createPaginationContainer0,
  createRefetchContainer as createRefetchContainer0,
} from 'react-relay';

export const createFragmentContainer = (fragmentQuery) => (
  BaseComponent,
) => createFragmentContainer0(BaseComponent, fragmentQuery);

export const createPaginationContainer = (
  fragmentQuery,
  options,
) => (BaseComponent) =>
  createPaginationContainer0(BaseComponent, fragmentQuery, options);

export const createRefetchContainer = (
  fragmentQuery,
  query,
) => (BaseComponent) =>
  createRefetchContainer0(BaseComponent, fragmentQuery, query);