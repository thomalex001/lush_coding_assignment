# lush_coding_assignment

## Objective
Build a basic GraphQL API server using NodeJS, TypeScript, Apollo Server, Prisma, and Pothos GraphQL to manage a simple list of tasks. This assignment aims to evaluate your understanding of GraphQL principles, schema design with Pothos, TypeScript usage, and general backend development practices.

## Getting Started/Code Installation
Ensure that you have cloned repositories onto your machine and follow these steps:

1. In the front-end CLI, run `npm i` on the root level to install dependencies.
2. Then run the command `npm start` to run program in your local environment.

### Dependencies
*   apollo-server
*   pothos/core
*   pothos/plugin-prisma
*   prisma/client
*   prisma/extension-accelerate
*   graphql
*   graphql-scalars


### Technologies Used
* NodeJS
* TypeScript
* GraphQL
* Visual Studio Code
* Apollo Server
* Git/GitHub
* Pothos
* Prisma

## Installation
Created Git Repo with a `README` file

Initialized NodeJS with `package.json`:
```
npm init 
```

Installed TypeScript and created a `tsconfig.json` file:
```
npm install --save-dev typescript @types/node
npx tsc --init
```

Setup `tsconfig.json` file:
```json
outDir: dist	// Keeps compiled files separate
```

Installed Prisma:
``` 
npx prisma@latest init --db 
```

* Following this command, Prisma created an initial `schema.prisma` file and a `.env` file 
with a `DATABASE_URL` environment variable already set

* Installed Prisma VS Code Extension


In `schema.prisma` I added `SQLite` as a provider for simplicity as per *Note* in assignment instructions:
```js
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")  //Automatically created and stored in .env
}
```
Also changed the `DATABASE_URL` path to reflect this:

```js
DATABASE_URL="file:./dev.db"
```

Created a Prisma Schema:
```js
model Task {
  id         String   @id @default(uuid())       // Prisma's built-in UUID 
  title      String                             
  completed  Boolean  @default(false)            // Defaults to false
  createdAt  DateTime @default(now())            // Auto-generated timestamp
  updatedAt  DateTime @updatedAt                 // Auto-updates on every change
}
```

Created `.gitignore` file and added the following:
```
node_modules
/src/generated/prisma
.env
```

Added boilerplate code taken from `Prisma /docs` to send queries with Prisma ORM:
```js
import { PrismaClient } from '../src/generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

async function main() {

  const task = await prisma.task.create({
    data: {
      id: "eqiofjeoqfjeioq",
      title: 'Save Planet',
      completed: false,
    },
  })
  console.log(task)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

Ran the commands below to test:
```
npx prisma migrate dev --name init
npx prisma generate
npx tsx src/index.ts   
```

## GraphQL & Apollo
As I was not familiar with Pothos I decided to first get GraphQL and Apollo working together.
I have left the GraphQL files in `src/graphql` however they are currently unused

Installed Pothos, Apollo Server and GraphQL:
```
npm install --save @pothos/core 
npm install @apollo/server graphql
```

Also installed Prisma Client in order to communicate with the database:
```
npm install prisma-client
@pothos/plugin-prisma 
```


Created a `src/server.ts` file and added code below to connect the Apollo Server:
```js
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
```

Created `src/graphql/schema.ts` and `resolvers.ts` files with my first 
*query* which was to return a list of all tasks:

```js
// THE SCHEMA or typeDefs TO DEFINE THE SHAPE OF THE DATA
export const typeDefs = gql`
  type Task {
    id: String!
    title: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
  }
```

```js
// THE FUNCTION WHICH RETURNS A LIST OF ALL TASKS
// NOTE THAT I AM USING PRISMA-CLIENT TO FETCH THE DATA FROM THE DATABASE
import { PrismaClient } from '../generated/prisma';

export const resolvers = {
  Query: {
    tasks: async (_: any, args: { search?: string }) => {
      const { search } = args;
      return prisma.task.findMany({
        where: search
          ? {
              title: {
                contains: search
              }
            }
          : undefined,
        orderBy: {
          createdAt: 'desc'
        }
      });
    },
  }
}
```

I then added all other *Queries/Mutations* and tested them on the Apollo Server (browser).
Once happy, I moved to migrating to Pothos.

## Pothos

Created `src/builder.ts` file to set up the schema builder:

```js
export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypesFromClient<typeof prisma>;
  Context: { prisma: PrismaClient };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});
```

Created `src/schema.ts` to match the `prisma.schema` file:

```js
import { builder } from './builder';

builder.prismaObject('Task', {
  fields: (t: any) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    completed: t.exposeBoolean('completed'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});
```
Then created `src/resolvers/tasks.ts` file with my first query to return a list
of all tasks:

```js
builder.queryType({
  fields: (t) => ({

    tasks: t.prismaField({
      type: ['Task'],
      args: {
        search: t.arg.string(),
      },
      resolve: (query, _parent, args, context) => {
        return context.prisma.task.findMany({
          where: args.search
            ? { title: { contains: args.search } }
            : undefined,
          orderBy: { createdAt: 'desc' },
          ...query,
        });
      },
    }),
  }),
});
```

As I had previously made all the queries and mutations on the Apollo Server with GraphQL, adding and testing each query with Pothos was straight forward.

Note: As GraphQL doesn’t have a built-in DateTime scalar type TypeScript was throwing an error, I had to install `graphql-scalars` and add these lines to the `builder.ts` file:

```js
export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  builder.addScalarType('DateTime', DateTimeResolver, {});
  ```