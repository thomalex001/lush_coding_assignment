import { builder } from '../builder';
import { getTaskByIdSchema, getTasksSchema, getTaskByDateRangeSchema } from '../validation/task';
import { validateArgs } from '../middleware/zodValidate';

builder.queryType({
  fields: (t) => ({
    // GET ALL TASKS AND FILTER BY NAME
    tasks: t.prismaField({
      type: ['Task'],
      args: {
        search: t.arg.string()
      },
      resolve: async (query, _parent, args, context) => {
        // Validating input with Zod through a middleware
        // In this case: "No special characters allowed"
        const validatedArgs = validateArgs(getTasksSchema, args);
        return context.prisma.task.findMany({
          where: validatedArgs.search
            ? { title: { contains: validatedArgs.search } } // Filter by name
            : undefined,
          orderBy: { createdAt: 'desc' },
          ...query
        });
      }
    }),

    // GET SINGLE TASK BY ID
    task: t.prismaField({
      type: 'Task',
      nullable: true,
      args: {
        id: t.arg.string({ required: true })
      },
      resolve: (query, _parent, args, context) => {
        const validatedArgs = validateArgs(getTaskByIdSchema, args);

        return context.prisma.task.findUnique({
          where: { id: args.id },
          ...query
        });
      }
    })
  })
});

// GET TASKS BY DATE RANGE
builder.queryField('tasksByDateRange', (t) =>
  t.prismaField({
    type: ['Task'],
    args: {
      from: t.arg({ type: 'DateTime', required: true }),
      to: t.arg({ type: 'DateTime', required: true })
    },
    resolve: async (query, _parent, args, ctx) => {
      const validatedArgs = validateArgs(getTaskByDateRangeSchema, args);

      return ctx.prisma.task.findMany({
        where: {
          createdAt: {
            gte: args.from,
            lte: args.to
          }
        },
        ...query
      });
    }
  })
);