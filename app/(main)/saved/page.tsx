'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import RecipeCard from "@/components/recipes/recipe-card"

interface Recipe {
  id: string
  name: string
  description: string
  prep_time: number
  cook_time: number
  total_time: number
  servings: string
  ingredients: { name: string; amount: string }[]
  directions: string[]
}

export default function SavedRecipes() {
  const { data: session } = useSession()
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) {
      return
    }

    getSavedRecipes()
  }, [session])

  const getSavedRecipes = async() => {
    try {
      await fetch('/api/recipes').
        then(res => res.json()). 
        then(data => {
        setSavedRecipes(data.recipes || [])
      })
    } catch (error) {
        console.log(error instanceof Error ? error.message : 'An error occurred')
    }
    finally{
      setLoading(false)
    }
  }

  const handleToggleSave = async (recipeId: string) => {
    try {
      const res = await fetch('/api/recipes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      })
      const data = await res.json()
      if (data.success) {
        setSavedRecipes(prev => prev.filter(r => r.id !== recipeId))
      }
    } catch {
      alert("Failed to unsave. Try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4.1rem)] flex justify-center items-center overflow-hidden">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground"/>
      </div>
    )
    
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-10">Your Saved Recipes</h1>

      {savedRecipes.length === 0 ? (
        <p className="text-center">No saved recipes yet.</p>
      ) : (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className='w-full max-w-sm mx-auto'>
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSaved={true} // always true in Saved page
                  onSaveToggle={handleToggleSave}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
