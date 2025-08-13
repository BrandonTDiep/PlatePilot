import { auth } from '@/auth';
import SavedRecipesClient from '@/components/recipes/SavedRecipesClient';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

interface Recipe {
  id: string;
  name: string;
  description: string;
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: string;
  ingredients: { name: string; amount: string }[];
  directions: string[];
}

const getSavedRecipes = async (userId: string) => {
  const recipes = await db.recipe.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 3) Transform each record into exactly the shape our Client Component expects
  const savedRecipes: Recipe[] = recipes.map((r) => {
    // r.ingredients is typed as JsonValue by Prisma. We need to assert it’s our array shape.
    // If your data is stored correctly, this cast will work:
    const parsedIngredients = r.ingredients as {
      name: string;
      amount: string;
    }[];

    // r.directions should already be a string[], but Prisma types it as JsonValue too,
    // so we cast it here:
    const parsedDirections = r.directions as string[];

    return {
      id: r.id,
      name: r.name,
      description: r.description,
      prep_time: r.prep_time,
      cook_time: r.cook_time,
      total_time: r.total_time,
      servings: r.servings,
      ingredients: parsedIngredients,
      directions: parsedDirections,
    };
  });
  return savedRecipes;
};

export default async function SavedRecipes() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect('/login');
  }

  try {
    const userRecipes = await getSavedRecipes(session.user.id);

    return <SavedRecipesClient recipes={userRecipes} />;
  } catch (error) {
    console.log(error);
  }
}
