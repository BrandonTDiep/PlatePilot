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
    } = await req.json();

    const existingUser = await getUserById(session.user.id);

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // save the recipe
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

    if (!recipeId) {
      return NextResponse.json(
        { error: 'Recipe ID is required' },
        { status: 400 },
      );
    }

    await db.recipe.delete({
      where: {
        id: recipeId,
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found or not authorized' },
        { status: 404 },
      );
    }

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
