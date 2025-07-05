// src/schema/mutation.ts
import { builder } from '../builder';
import { ApolloError } from 'apollo-server-errors';
import { validateArgs } from '../middleware/zodValidate';
import {
  addTaskSchema,
  toggleTaskSchema,
  deleteTaskSchema,
  deleteTasksSchema
} from '../validation/task';

builder.mutationType({
  fields: (t) => ({
    // ADD NEW TASK
    addTask: t.prismaField({
      type: 'Task',
      args: {
        title: t.arg.string({ required: true })
      },
      resolve: (query, _parent, args, context) => {
        const validatedArgs = validateArgs(addTaskSchema, args);
        return context.prisma.task.create({
          data: { title: args.title },
          ...query
        });
      }
    }),

    // TOGGLE (UPDATE) TASK
    toggleTask: t.prismaField({
      type: 'Task',
      args: {
        id: t.arg.string({ required: true }),
        title: t.arg.string(),
        completed: t.arg.boolean()
      },
      resolve: async (query, _parent, args, context) => {
        const validatedArgs = validateArgs(toggleTaskSchema, args);
        const existing = await context.prisma.task.findUnique({
          where: { id: args.id }
        });

        if (!existing) {
          throw new ApolloError(`Error, id: ${args.id} not found`, 'NOT_FOUND');
        }

        const data: { title?: string; completed?: boolean } = {};
        if (typeof args.title === 'string') data.title = args.title;
        if (typeof args.completed === 'boolean')
          data.completed = args.completed;

        return context.prisma.task.update({
          where: { id: args.id },
          data,
          ...query
        });
      }
    }),

    // DELETE TASK
    deleteTask: t.prismaField({
      type: 'Task',
      args: {
        id: t.arg.string({ required: true })
      },
      resolve: async (query, _parent, args, context) => {
        const validatedArgs = validateArgs(deleteTaskSchema, args);
        const existing = await context.prisma.task.findUnique({
          where: { id: args.id }
        });

        if (!existing) {
          throw new ApolloError(`Error, id: ${args.id} not found`, 'NOT_FOUND');
        }

        return context.prisma.task.delete({
          where: { id: args.id },
          ...query
        });
      }
    })
  })
});

//DELETE MANY TASKS
builder.mutationField('deleteTasks', (t) =>
  t.prismaField({
    type: ['Task'],
    args: {
      ids: t.arg.stringList({ required: true })
    },
    resolve: async (query, _parent, args, context) => {
      const validatedArgs = validateArgs(deleteTasksSchema, args);
      const tasksToDelete = await context.prisma.task.findMany({
        where: { id: { in: args.ids } },
        ...query
      });

      if (!tasksToDelete) {
        throw new ApolloError(`Error, ids: ${args.ids} not found`, 'NOT_FOUND');
      }
      // Step 2: Delete the tasks
      await context.prisma.task.deleteMany({
        where: { id: { in: args.ids } }
      });

      return tasksToDelete;
    }
  })
);