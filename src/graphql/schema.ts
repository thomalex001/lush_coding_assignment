import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Task {
    id: String!
    title: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    tasks(search: String): [Task!]!
    task(id: String!): Task
  }

  type Mutation {
    addTask(title: String!): Task!
    toggleTask(id: String!, title: String, completed: Boolean): Task
    deleteTask(id: String!): Task
  }
`;