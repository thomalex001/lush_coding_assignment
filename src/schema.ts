import { builder } from './builder';

builder.prismaObject('Task', {
  fields: (t: any) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    completed: t.exposeBoolean('completed'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});
