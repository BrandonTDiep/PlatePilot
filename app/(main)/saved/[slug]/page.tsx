import { auth } from '@/auth';
import SavedRecipesClient from '@/components/recipes/SavedRecipesClient';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import {
  getFoldersByUserId,
  getFolderByName,
} from '@/services/folder';

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

interface PageProps {
  params: {
    slug: string;
  };
}

const getSavedRecipes = async (userId: string, folderId?: string) => {
  const recipes = await db.recipe.findMany({
    where: {
      userId: userId,
      ...(folderId && { folderId: folderId }),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform each record into exactly the shape our Client Component expects
  const savedRecipes: Recipe[] = recipes.map((r) => {
    // r.ingredients is typed as JsonValue by Prisma. We need to assert it's our array shape.
    const parsedIngredients = r.ingredients as {
      name: string;
      amount: string;
    }[];

    // r.directions should already be a string[], but Prisma types it as JsonValue too,
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

export default async function FolderRecipes({ params }: PageProps) {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect('/login');
  }

  try {
    // Decode the slug to get the folder name
    const folderName = decodeURIComponent(params.slug);

    // Find the folder by name for this user
    const folder = await getFolderByName(folderName, session.user.id);

    // If folder doesn't exist, show 404
    if (!folder) {
      notFound();
    }

    // Get recipes for this folder and all folders in parallel
    const [userRecipes, folders] = await Promise.all([
      getSavedRecipes(session.user.id, folder.id),
      getFoldersByUserId(session.user.id),
    ]);

    return (
      <SavedRecipesClient
        recipes={userRecipes}
        folderName={folder.name}
        folders={folders}
      />
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}
