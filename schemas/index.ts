import * as z from 'zod';

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: 'Password is required!',
      path: ['password'],
    },
  );

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

export const SignUpSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(8, {
    message: 'Minimum 8 characers required',
  }),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: 'Minimum 8 characers required',
  }),
});

// LLM organizer plan schema
export const OrganizerPlanSchema = z.object({
  createFolders: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().optional().nullable(),
        parentName: z.string().optional().nullable(),
      }),
    )
    .default([]),
  renameFolders: z
    .array(
      z.object({
        from: z.string().min(1),
        to: z.string().min(1),
      }),
    )
    .default([]),
  assignRecipes: z
    .array(
      z.object({
        recipeId: z.string().min(1),
        folderName: z.string().nullable(), // null removes from folder
      }),
    )
    .default([]),
});

export type OrganizerPlan = z.infer<typeof OrganizerPlanSchema>;

// Recipe schema used to validate LLM-generated recipes
export const RecipeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  prep_time: z.number().nonnegative(),
  cook_time: z.number().nonnegative(),
  total_time: z.number().nonnegative(),
  servings: z.string().min(1),
  ingredients: z
    .array(z.object({ name: z.string().min(1), amount: z.string().min(1) }))
    .default([]),
  directions: z.array(z.string()).default([]),
});

export type Recipe = z.infer<typeof RecipeSchema>;
