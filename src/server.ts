import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from '../src/graphql/schema'
import { resolvers } from './graphql/resolvers'


// APOLLO SERVER
const server = new ApolloServer({
  typeDefs,
  resolvers
});

async function start() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });
  console.log(`🚀 Server ready at ${url}`);
}

start();
