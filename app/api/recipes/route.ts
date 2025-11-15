import { db } from '@/lib/db';
import { getUserById } from '@/services/user';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401 },
      );
    }

    const {
      id,
      name,
      description,
      prep_time,
      cook_time,
      total_time,
      servings,
      ingredients,
      directions,
      folderId,
    } = await req.json();

    const existingUser = await getUserById(session.user.id);

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // If a folderId was provided, validate ownership
    if (folderId) {
      const folder = await db.folder.findFirst({
        where: { id: folderId, userId: session.user.id },
      });
      if (!folder) {
        return NextResponse.json(
          {
            error: 'Invalid folderId or you are not authorized for that folder',
          },
          { status: 400 },
        );
      }
    }

    // save the recipe; folderId is optional and will be null if not provided
    const recipe = await db.recipe.create({
      data: {
        id,
        name,
        description,
        prep_time,
        cook_time,
        total_time,
        servings,
        ingredients,
        directions,
        userId: session.user.id,
        folderId: folderId ?? null,
      },
    });

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to save recipe' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401 },
      );
    }

    const { recipeId, folderId } = await req.json();

    if (!recipeId) {
      return NextResponse.json(
        { error: 'Recipe ID is required' },
        { status: 400 },
      );
    }

    // Verify recipe belongs to user
    const recipe = await db.recipe.findFirst({
      where: {
        id: recipeId,
        userId: session.user.id,
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found or not authorized' },
        { status: 404 },
      );
    }

    // If folderId is provided, validate ownership
    if (folderId !== null && folderId !== undefined) {
      const folder = await db.folder.findFirst({
        where: { id: folderId, userId: session.user.id },
      });
      if (!folder) {
        return NextResponse.json(
          {
            error: 'Invalid folderId or you are not authorized for that folder',
          },
          { status: 400 },
        );
      }
    }

    // Update the recipe's folderId
    const updatedRecipe = await db.recipe.update({
      where: { id: recipeId },
      data: {
        folderId: folderId === null || folderId === undefined ? null : folderId,
      },
    });

    return NextResponse.json({ success: true, recipe: updatedRecipe });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to update recipe folder' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401 },
      );
    }

    const { recipeId } = await req.json();

    if (!recipeId) {
      return new Response(JSON.stringify({ error: 'Recipe ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const recipe = await db.recipe.findFirst({
      where: {
        id: recipeId,
        userId: session.user.id,
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found or not authorized' },
        { status: 404 },
      );
    }

    await db.recipe.delete({ where: { id: recipeId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 },
    );
  }
}

// export async function GET(req: Request) {
//   try {
//     const session = await auth()

//     if(!session || !session.user?.id) {
//       return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 })
//     }

//     const userRecipes = await db.recipe.findMany({
//       where: {
//         userId: session.user.id
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     })
//     console.log(userRecipes)

//     return NextResponse.json({ success: true, recipes: userRecipes })

//   } catch (error) {
//     console.log(error)
//     return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 })
//   }
// }
