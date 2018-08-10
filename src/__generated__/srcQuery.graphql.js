/**
 * @flow
 * @relayHash 33255235c79be8193ac6937cf400dbb9
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type srcQueryVariables = {||};
export type srcQueryResponse = {|
  +users: ?$ReadOnlyArray<?{|
    +id: ?string
  |}>
|};
export type srcQuery = {|
  variables: srcQueryVariables,
  response: srcQueryResponse,
|};
*/


/*
query srcQuery {
  users {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "users",
    "storageKey": null,
    "args": null,
    "concreteType": "User",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "id",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "srcQuery",
  "id": null,
  "text": "query srcQuery {\n  users {\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "srcQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "srcQuery",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'f1ccf60aa0de652fcf0cecc5e9cc7c10';
module.exports = node;
