import { MenuAside } from "../components/MenuAside"
import { MenuHeader } from "../components/MenuHeader"
import { NutritionForm } from "../components/NutritionForm"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <MenuAside />
      <div className="flex-1 flex flex-col">
        <MenuHeader />
        <div className="p-6 lg:p-8 flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Plano Nutricional</h1>
              <p className="text-gray-600">
                Crie seu plano personalizado com base em seus objetivos e características físicas.
              </p>
            </header>
            <NutritionForm />
          </div>
        </div>
      </div>
    </div>
  )
}