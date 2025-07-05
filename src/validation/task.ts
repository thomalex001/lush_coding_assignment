import { z } from 'zod';

//QUERIES
//FILTER TASK BY NAME
export const getTasksSchema = z.object({
  search: z
  .string()
  .regex(/^[a-zA-Z0-9\s]*$/, "No special characters allowed")
  .optional()
});
//GET TASK BY ID
export const getTaskByIdSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

//MUTATIONS
//ADD TASK
export const addTaskSchema = z.object({
  title: z
  .string()
  .min(1, 'Title is required')
  .max(30, 'Title must be at most 30 characters')
  .regex(/^[a-zA-Z0-9 ]+$/, 'Title must not contain special characters'),
});
//TOGGLE/UPDATE TASK
export const toggleTaskSchema = z.object({
  id: z.string().uuid("Invalid task Id"),
  completed: z.boolean().optional(),
});
//DELETE TASK
export const deleteTaskSchema = z.object({
  id: z.string().uuid("Invalid task Id"),
});
