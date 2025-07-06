import { PrismaClient } from '@prisma/client';
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma'; 
import { DateTimeResolver } from 'graphql-scalars'
import type { PrismaTypesFromClient } from '@pothos/plugin-prisma';

const prisma = new PrismaClient();

export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  PrismaTypes: PrismaTypesFromClient<typeof prisma>;
  Context: { prisma: PrismaClient };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});
// CUSTOM SCALAR TYPE DATETIME
builder.addScalarType('DateTime', DateTimeResolver, {});