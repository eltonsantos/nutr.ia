import { MenuAside } from "../components/MenuAside"
import { MenuHeader } from "../components/MenuHeader"
import { NutritionForm } from "../components/NutritionForm"

export default function Page() {
  
  return (
    <div className="flex min-h-screen bg-white">
      <MenuAside />
      <div className="flex-1 flex flex-col">
        <MenuHeader />
        <NutritionForm />
      </div>
    </div>
  )
}