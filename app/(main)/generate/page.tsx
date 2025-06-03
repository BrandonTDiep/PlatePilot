'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, ArrowLeft, Heart, Clock, Users, ChefHat } from "lucide-react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react" // useSession() React Hook in the NextAuth.js client is the easiest way to check if someone is signed in

interface Ingredient {
  name: string,
  amount: string
}

interface Recipe {
  id: string,
  name: string, 
  description: string,
  prep_time: number,
  cook_time: number, 
  total_time: number, 
  servings: string, 
  ingredients: Ingredient[], 
  directions: string[]
}

const Recipes = () => {
  const { data: session, status } = useSession()

  const [ingredients, setIngredients] = useState("")
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (recipe && recipe.id) {
      checkRecipeSaved(recipe.id);
    }

  }, [recipe])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const checkRecipeSaved = async(recipeId: string) => {
    if (!session || !session.user.id || !recipeId) {
      return
    }

    try {
      const res = await fetch('/api/recipes/check', {
          method: 'POST',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify({ recipeId: recipeId }),
      })

      const data = await res.json()

      if (data.exists) {
        setIsSaved(true)
      } 
      else {
        setIsSaved(false)
      }

      if (data.error) {
        console.log(data.error)
      }
    } catch (error) {
        console.log(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const handleSave = async(e: React.MouseEvent) => {
    e.stopPropagation() // prevent card flip when trying to save

    if (!session || !session.user.id) {
      alert('You must be logged in to save a recipe.')
      return
    }

    if(!recipe) {
      return
    }

    try {
      if(isSaved) {
        const res = await fetch('/api/recipes', {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify({ recipeId: recipe.id }),
        })

        const data = await res.json()

        if (data.success) {
          setIsSaved(false)
        } 
        else {
          throw new Error(data.error || 'Failed to delete recipe')
        }
      }
      else {
        const res = await fetch('/api/recipes', {
          method: 'POST',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify({
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            prep_time: recipe.prep_time,
            cook_time: recipe.cook_time,
            total_time: recipe.total_time,
            servings: recipe.servings,
            ingredients: recipe.ingredients,
            directions: recipe.directions,
          }),
        })

        const data = await res.json()

        if (data.success) {
          setIsSaved(true)
        } 
        else {
          throw new Error(data.error || 'Failed to save recipe')
        }  
      }
    } catch (error) {
      alert('Failed to save recipe. Please try again.')
    } finally {
      setLoading(false)
    }
  }


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
    <div className='container mx-auto py-8'>
      <form id="ingredient" onSubmit={handleSubmit} className="mt-20 flex w-full max-w-sm items-center space-x-2 mx-auto">
        <Input 
          placeholder="Ingredients" 
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <Button type="submit">Generate</Button>
      </form>
      
      {recipe ? 
          <div className='w-full max-w-sm mx-auto justify-center mt-14'>
            <div
              className={`relative w-full h-[600px] transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={handleFlip}
            >
              {/* Front Side */}
              <Card className="absolute inset-0 shadow-md overflow-hidden backface-hidden w-full h-full">
                <div className="absolute top-3 right-3 z-10">
                  <Button
                    
                    size="icon"
                    variant="secondary"
                    className={`w-8 h-8 rounded-full shadow-md transition-colors ${
                      isSaved ? "bg-red-100 hover:bg-red-200 text-red-600" : "bg-white/90 hover:bg-white text-gray-600"
                    }`}
                    onClick={handleSave}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                  </Button>
                </div>
                
                <CardHeader className='mx-auto flex flex-col gap-y-4 items-center justify-center mt-8'> 
                  <CardTitle className="text-2xl text-center">{recipe.name}</CardTitle>
                  <CardDescription className="text-center">{recipe.description}</CardDescription>
                  
                  <div className="flex gap-x-4">
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="w-4 h-4"/> 
                      <span>Total Time: {recipe.total_time} min</span>
                    </CardDescription>
                    <CardDescription className="flex items-center gap-1">
                      <Users className="w-4 h-4"/> 
                      <span>Serves: {recipe.servings}</span>
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent>
                  <Separator />
                  <div className="max-h-[280px] overflow-y-auto"> 
                    <h3 className="uppercase mt-5 font-bold mb-2">Ingredients:</h3>
                    <ul className="text-sm text-gray-700">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}><span className="mr-2">•</span> {ingredient.name}: {ingredient.amount}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

               <div className="absolute bottom-3 right-3">
                  <Badge variant="outline" className="bg-white/90 text-gray-800 border-gray-300">
                    <RotateCcw className="w-3 h-3 mr-1" />Flip for directions
                  </Badge>
                </div>
              </Card>

              {/* Back Side */}
              <Card className="absolute inset-0 shadow-md mx-auto overflow-hidden backface-hidden rotate-y-180 w-full h-full">          
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900 uppercase">Directions</h2>  
                    <Badge variant="outline" className="bg-white/90 text-gray-800 border-gray-300">
                      <ArrowLeft className="w-3 h-3 mr-1" />Flip back
                    </Badge>
                  </div>
                  
                  <div className="flex gap-x-4">
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="w-4 h-4"/> 
                      <span>Prep: {recipe.prep_time} min</span>
                    </CardDescription>
                    <CardDescription className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4"/> 
                      <span>Cook: {recipe.cook_time} min</span>
                    </CardDescription>
                  </div>
         
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />
                  <div className="max-h-[460px] overflow-y-auto"> 
                    <h3 className="font-semibold text-gray-900 mb-3">Step-by-Step</h3>
                    <ol className="text-sm text-gray-700 space-y-3">
                      {recipe.directions.map((direction, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                            {index + 1} 
                          </span>
                          {direction}
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                </CardContent>
                
              </Card>
            </div>
          </div>
        : 
        <span className="text-center block mt-20">{error}</span>
      }
    </div>
  )
}

export default Recipes