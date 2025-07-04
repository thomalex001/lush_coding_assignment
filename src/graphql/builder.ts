// src/graphql/builder.ts
import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

export const builder = new SchemaBuilder({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
})

builder.queryType({})
