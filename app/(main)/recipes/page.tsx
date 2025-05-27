'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
const Recipes = () => {

  interface Ingredient {
    name: string,
    amount: string
  }

  interface Recipe {
    name: string, 
    prep_time: number,
    cook_time: number, 
    total_time: number, 
    servings: string, 
    ingredients: Ingredient[], 
    directions: []
  }

  const [ingredients, setIngredients] = useState("")
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setRecipe(null)

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ ingredients })
      })

      const data = await res.json()

      setRecipe(data.recipe);
      setIngredients('')

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false)
      
    }

  }

  return (
    <div className='mx-auto max-w-7xl px-6 py-20 lg:flex lg:items-center lg:gap-x-10 lg:px-8 justify-center'>
      <form  onSubmit={handleSubmit} className="mt-20 flex w-full max-w-sm items-center space-x-2 mx-auto">
        <Input 
          placeholder="Ingredients" 
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <Button type="submit">Generate</Button>
      </form>

      <p>{recipe ? recipe.name : error}</p>
    </div>
  )
}

export default Recipes