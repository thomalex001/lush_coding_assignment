import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// import { typeDefs } from '../src/graphql/schema' // GraphQL imports (unused)
// import { resolvers } from './graphql/resolvers' // GraphQL imports (unused)
import { PrismaClient } from '@prisma/client';
import { builder } from './builder';
import './schema/models/task';
import './schema/query'
import './schema/mutation'

const server = new ApolloServer({
  schema: builder.toSchema(),
});

startStandaloneServer(server, {
  context: async () => ({
    prisma: new PrismaClient(),
  }),
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});















// // APOLLO SERVER
// const server = new ApolloServer({
//   typeDefs,
//   resolvers
// });

// async function start() {
//   const { url } = await startStandaloneServer(server, {
//     listen: { port: 4000 }
//   });
//   console.log(`🚀 Server ready at ${url}`);
// }

// start();
