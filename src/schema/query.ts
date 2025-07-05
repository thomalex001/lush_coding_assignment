import { builder } from '../builder';
import { getTaskByIdSchema, getTasksSchema } from '../validation/task';
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
