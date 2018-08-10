import { 
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'
import firebase from 'firebase'

import * as db from './firebase'
console.log('VJ', 'firebase', db)

function fetchUsers() {
  return db.usersColl.get().then(querySnapshot => {
    let ret = []
    querySnapshot.forEach(doc => {
      console.log('VJ', 'fetchPeople', { id: doc.id, ...doc.data() })
      //ret.push({ id: doc.id, ...doc.data() })
      ret.push({ id: doc.id })
    })
    return ret
  })
}
function fetchPersonByURL() {
}

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all queries',
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve: fetchUsers // Fetch the index of people from the REST API,
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Somebody that you used to know',
  fields: () => ({
    email: {type: GraphQLString},
    id: {type: GraphQLString},
    displayName: {type: GraphQLString},
  })
})

export default new GraphQLSchema({
  query: QueryType
})
