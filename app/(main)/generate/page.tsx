'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import RecipeCard from '@/components/recipes/recipe-card';

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

const Recipes = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleSave = async (recipeId: string) => {
    try {
      const res = await fetch('/api/recipes', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isSaved
            ? { recipeId }
            : {
                id: recipe?.id,
                name: recipe?.name,
                description: recipe?.description,
                prep_time: recipe?.prep_time,
                cook_time: recipe?.cook_time,
                total_time: recipe?.total_time,
                servings: recipe?.servings,
                ingredients: recipe?.ingredients,
                directions: recipe?.directions,
              },
        ),
      });

      const data = await res.json();

      if (data.success) {
        setIsSaved(!isSaved);
      } else {
        throw new Error(data.error || 'Failed to save recipe');
      }
    } catch (error) {
      alert('Failed to save recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecipe(null);
    setIsSaved(false);

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      const data = await res.json();

      setRecipe(data.recipe);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <form
        id="ingredient-form"
        onSubmit={handleSubmit}
        className="mt-16 w-full max-w-sm items-center space-x-2 mx-auto"
      >
        <div className="space-y-2">
          <Label htmlFor="ingredient">Enter Ingredients</Label>
          <div className="flex gap-2">
            <Input
              id="ingredient"
              placeholder="Ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />

            <Button type="submit">Generate</Button>
          </div>
        </div>
      </form>

      {recipe ? (
        <div className="w-full max-w-sm mx-auto justify-center mt-12">
          <RecipeCard
            recipe={recipe}
            isSaved={isSaved}
            onSaveToggle={handleToggleSave}
          />
        </div>
      ) : (
        <span className="text-center block mt-20">{error}</span>
      )}
    </div>
  );
};

export default Recipes;

// useEffect(() => {
//   // only want to run if there is a recipe and logged in user
//   if (recipe?.id && session?.user?.id) {
//     checkRecipeSaved(recipe.id)
//   }
// }, [recipe, session])

// const checkRecipeSaved = async(recipeId: string) => {
//   try {
//     const res = await fetch('/api/recipes/check', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json',},
//         body: JSON.stringify({ recipeId: recipeId }),
//     })

//     const data = await res.json()

//     setIsSaved(data.exists || false)
//     // if (data.error) {
//     //   console.log(data.error)
//     // }
//   } catch (error) {
//       console.log(error instanceof Error ? error.message : 'An error occurred')
//   }
// }
