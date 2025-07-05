import { builder } from '../builder';

builder.queryType({
  fields: (t) => ({
    // GET ALL TASKS AND FILTER BY NAME
    tasks: t.prismaField({
      type: ['Task'],
      args: {
        search: t.arg.string()
      },
      resolve: (query, _parent, args, context) => {
        return context.prisma.task.findMany({
          where: args.search ? { title: { contains: args.search } } : undefined, //SEARCH AND "FILTER BY NAME"
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
        return context.prisma.task.findUnique({
          where: { id: args.id },
          ...query
        });
      }
    })
  })
});
