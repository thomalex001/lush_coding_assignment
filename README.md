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
Installed Prisma VS Code Extension

Added sqlite as a provider as per *Note* in assignment instructions:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")  //Automatically created and stored in .env
}
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


