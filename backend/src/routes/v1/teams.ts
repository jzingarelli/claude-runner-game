import { z } from 'zod';
import { buildCrudRouter } from '../../utils/crudRouter';
import { TeamModel } from '../../models/Team';

const createSchema = z.object({
  name: z.string().min(1),
  organizationId: z.string().length(24),
  memberIds: z.array(z.string().length(24)).default([]),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  memberIds: z.array(z.string().length(24)).optional(),
});

export const teamsRouter = buildCrudRouter({
  model: TeamModel,
  resourceName: 'team',
  createSchema,
  updateSchema,
});
