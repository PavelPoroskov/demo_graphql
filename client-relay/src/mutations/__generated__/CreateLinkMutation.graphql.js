/**
 * @flow
 * @relayHash acbdb3507df3d45c16846370fe45c654
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateLinkInput = {|
  description?: ?string,
  url: string,
  postedById?: ?string,
  postedBy?: ?LinkpostedByUser,
  votesIds?: ?$ReadOnlyArray<string>,
  votes?: ?$ReadOnlyArray<LinkvotesVote>,
  clientMutationId: string,
|};
export type LinkpostedByUser = {|
  email: string,
  name: string,
  password: string,
  linksIds?: ?$ReadOnlyArray<string>,
  links?: ?$ReadOnlyArray<UserlinksLink>,
  votesIds?: ?$ReadOnlyArray<string>,
  votes?: ?$ReadOnlyArray<UservotesVote>,
|};
export type UserlinksLink = {|
  description?: ?string,
  url: string,
  votesIds?: ?$ReadOnlyArray<string>,
  votes?: ?$ReadOnlyArray<LinkvotesVote>,
|};
export type LinkvotesVote = {|
  userId?: ?string,
  user?: ?VoteuserUser,
|};
export type VoteuserUser = {|
  email: string,
  name: string,
  password: string,
  linksIds?: ?$ReadOnlyArray<string>,
  links?: ?$ReadOnlyArray<UserlinksLink>,
  votesIds?: ?$ReadOnlyArray<string>,
  votes?: ?$ReadOnlyArray<UservotesVote>,
|};
export type UservotesVote = {|
  linkId?: ?string,
  link?: ?VotelinkLink,
|};
export type VotelinkLink = {|
  description?: ?string,
  url: string,
  postedById?: ?string,
  postedBy?: ?LinkpostedByUser,
  votesIds?: ?$ReadOnlyArray<string>,
  votes?: ?$ReadOnlyArray<LinkvotesVote>,
|};
export type CreateLinkMutationVariables = {|
  input: CreateLinkInput
|};
export type CreateLinkMutationResponse = {|
  +createLink: ?{|
    +link: ?{|
      +id: string,
      +url: string,
      +description: ?string,
      +postedBy: ?{|
        +id: string,
        +name: string,
      |},
    |}
  |}
|};
export type CreateLinkMutation = {|
  variables: CreateLinkMutationVariables,
  response: CreateLinkMutationResponse,
|};
*/


/*
mutation CreateLinkMutation(
  $input: CreateLinkInput!
) {
  createLink(input: $input) {
    link {
      id
      url
      description
      postedBy {
        id
        name
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreateLinkInput!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "createLink",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreateLinkPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "link",
        "storageKey": null,
        "args": null,
        "concreteType": "Link",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "url",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "description",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "postedBy",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "CreateLinkMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v2/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "CreateLinkMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v2/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "CreateLinkMutation",
    "id": null,
    "text": "mutation CreateLinkMutation(\n  $input: CreateLinkInput!\n) {\n  createLink(input: $input) {\n    link {\n      id\n      url\n      description\n      postedBy {\n        id\n        name\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e87a5970e50ec1de488e91647ae8724b';
module.exports = node;
