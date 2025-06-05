'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, ArrowLeft, Heart, Clock, Users, ChefHat } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"

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

interface RecipeCardProps {
  recipe: Recipe
  isSaved: boolean
  onSaveToggle: (id: string) => void
}

export default function RecipeCard({ recipe, isSaved, onSaveToggle }: RecipeCardProps) {
  const { data: session } = useSession()
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => setIsFlipped(!isFlipped)

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!session?.user?.id) {
      alert("You must be logged in to save/unsave.")
      return
    }
    onSaveToggle(recipe.id)
  }

  return (
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
            onClick={handleSaveClick}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>

        <CardHeader className="mx-auto flex flex-col gap-y-4 items-center justify-center mt-8">
          <CardTitle className="text-2xl text-center">{recipe.name}</CardTitle>
          <CardDescription className="text-center">{recipe.description}</CardDescription>
          <div className="flex gap-x-4">
            <CardDescription className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Total Time: {recipe.total_time} min</span>
            </CardDescription>
            <CardDescription className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Serves: {recipe.servings}</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Separator />
          <div className="max-h-[280px] overflow-y-auto">
            <h3 className="uppercase mt-5 font-bold mb-2">Ingredients:</h3>
            <ul className="text-sm text-gray-700">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  <span className="mr-2">•</span> {ing.name}: {ing.amount}
                </li>
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
              <Clock className="w-4 h-4" />
              <span>Prep: {recipe.prep_time} min</span>
            </CardDescription>
            <CardDescription className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span>Cook: {recipe.cook_time} min</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />
          <div className="max-h-[460px] overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Step-by-Step</h3>
            <ol className="text-sm text-gray-700 space-y-3">
              {recipe.directions.map((dir, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                    {idx + 1}
                  </span>
                  {dir}
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
