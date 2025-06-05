import { db } from "@/lib/db"
import { auth } from "@/auth"
// not needed anymore but good to check if recipe is there
export async function POST(req: Request) {
    try {
        const session = await auth()

        if(!session || !session.user?.id) {
            return new Response(JSON.stringify({ error: 'Unauthorized: Please log in' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { recipeId } = await req.json()

        if (!recipeId) {
        return new Response(JSON.stringify({ error: 'Recipe ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
        }

        const recipe = await db.recipe.findFirst({
            where: {
                id: recipeId,
                userId: session.user.id
            }
        })


        // '!!' convert value to boolean equivalent
        return new Response(JSON.stringify({ exists: !!recipe, recipeId: recipe?.id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {

        console.log(error instanceof Error ? error.message : 'An error occurred')
    }
    
}