const { gql } = require('apollo-server')

const typeDefs = gql`
    input Pagination {
        page: Int!
        items: Int!
    }
    input UserFilter {
        employeeId: Int
        firstName: String
        lastName: String
    }
    type User {
        employeeId: Int!
        firstName: String!
        lastName: String!
        password: String!
        email: String!
        company: String!
    }
    type AuthPayload {
        token: String!
        user: User!
    }
    type Query {
        getUserList(search:UserFilter, pagination:Pagination, sort:String): [User]
    }
    type Mutation {
        registerUser(firstName: String!, lastName: String!, employeeId: Int!, email: String!, password: String!, company: String!): AuthPayload!
        login (email: String!, password: String!): AuthPayload!
    }
`

module.exports = typeDefs