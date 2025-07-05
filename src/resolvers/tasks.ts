import { builder } from '../builder';

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