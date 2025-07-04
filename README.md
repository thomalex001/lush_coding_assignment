# lush_coding_assignment

Created Git Repo with a `README` file

Initialize NodeJS with `package.json`:
```
npm init 
```

Installed TypeScript and created a `tsconfig.json` file:
```
npm install --save-dev typescript @types/node
npx tsc --init
```

Setup tsconfig.json file:
```json
outDir: dist	// Keeps compiled files separate
```

Installed Prisma:
``` 
npx prisma@latest init --db 
```

Following this command, Prisma created an initial `schema.prisma` file and a `.env` file 
with a `DATABASE_URL` environment variable already set

Installed Prisma VS Code Extension

Added `SQLite` as a provider for simplicity as per *Note* in assignment instructions:
```prisma
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
```prisma
model Task {
  id         String   @id @default(uuid())       // Prisma's built-in UUID 
  title      String                             
  completed  Boolean  @default(false)            // Defaults to false
  createdAt  DateTime @default(now())            // Auto-generated timestamp
  updatedAt  DateTime @updatedAt                 // Auto-updates on every change
}
```

Used Schema Description (comments to clarify my code)

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

Installed Pothos and Apollo Server and GraphQL:
```
npm install --save @pothos/core 
npm install @apollo/server graphql
```

npm install @apollo/server graphql @pothos/core @pothos/plugin-prisma @prisma/client
npm install @types/node tsx --save-dev
