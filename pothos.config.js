import { json } from 'stream/consumers';

module.exports = {
  plugins: ['prisma'],
  schema: './src/graphql/schema.ts',
  prisma: {
    clientImportPath: '@prisma/client', // make sure it's not a wrong path
  },
  output: {
    schema: './src/graphql/schema.graphql',
    typegen: './src/graphql/generated.ts',
  },
};