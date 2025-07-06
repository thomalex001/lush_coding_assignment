import { PrismaClient } from '../generated/prisma';
import { ApolloError } from 'apollo-server';
const prisma = new PrismaClient();

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
    task: async (_parent: any, args: { id: string }) => {
      return prisma.task.findUnique({
        where: { id: args.id }
      });
    }
  },

  Mutation: {
    addTask: async (_: any, args: { title: string }) => {
      return prisma.task.create({
        data: {
          title: args.title
        }
      });
    },

    toggleTask: async (
      _: any,
      args: { id: string; title?: string; completed?: boolean }
    ) => {
      const existing = await prisma.task.findUnique({
        where: { id: args.id }
      });
      if (!existing) {
        throw new ApolloError(`Error, id: ${args.id} not found`, 'NOT FOUND');
      }

      const data: { title?: string; completed?: boolean } = {};
      if (typeof args.title === 'string') {
        data.title = args.title;
      }
      if (typeof args.completed === 'boolean') {
        data.completed = args.completed;
      }

      return prisma.task.update({
        where: { id: args.id },
        data
      });
    },

    deleteTask: async (_parent: any, args: { id: string }) => {
      const existing = await prisma.task.findUnique({
        where: { id: args.id }
      });

      if (!existing) {
        throw new ApolloError(`Error, id: ${args.id} not found`, 'NOT FOUND');
      }
      return prisma.task.delete({
        where: { id: args.id }
      });
    }
  }
};
