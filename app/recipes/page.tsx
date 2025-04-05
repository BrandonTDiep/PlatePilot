import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Recipes = () => {
  return (
    <div className='mx-auto max-w-7xl px-6 py-20 lg:flex lg:items-center lg:gap-x-10 lg:px-8 justify-center'>
      <div className="mt-20 flex w-full max-w-sm items-center space-x-2">
        <Input placeholder="Ingredients" />
        <Button type="submit">Generate</Button>
      </div>

    </div>
  )
}

export default Recipes