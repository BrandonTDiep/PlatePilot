export interface Recipe {
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

export interface RecipeCardProps {
  recipe: Recipe
  isSaved: boolean
  onSaveToggle: (id: string) => void
}

 