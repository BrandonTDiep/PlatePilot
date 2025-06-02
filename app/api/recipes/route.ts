import { db } from "@/lib/db"
import { getUserById } from "@/services/user"
import { auth } from "@/auth"


export async function POST(req: Request) {

  try {
    const session = await auth()

    if(!session || !session.user?.id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Please log in' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { id, name, description, prep_time, cook_time, total_time, servings, ingredients, directions } = await req.json()

    const existingUser = await getUserById(session.user.id)

    if (!existingUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
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
        userId: session.user.id
      }
    })

    return new Response(JSON.stringify({ success: true, recipe }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: 'Failed to save recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
    
  }
}

