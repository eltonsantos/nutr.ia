import { MenuAside } from "../components/MenuAside"
import { MenuHeader } from "../components/MenuHeader"

export default function Page() {
  
  return (
    <div className="flex min-h-screen bg-white">
      <MenuAside />
      <div className="flex-1 flex flex-col">
        
        <MenuHeader />
        
        <main className="flex-1 p-6">
          <p className="text-gray-700">Gerencie sua nutrição com facilidade.</p>
          
          <form className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4">Criar Dieta</h2>
            <input type="text" placeholder="Nome" className="w-full p-2 border rounded mb-2" />
            <input type="text" placeholder="Peso (kg)" className="w-full p-2 border rounded mb-2" />
            <input type="text" placeholder="Altura (cm)" className="w-full p-2 border rounded mb-2" />
            <input type="text" placeholder="Idade" className="w-full p-2 border rounded mb-2" />
            <select className="w-full p-2 border rounded mb-2">
              <option>Masculino</option>
              <option>Feminino</option>
            </select>
            <select className="w-full p-2 border rounded mb-2">
              <option>Emagrecimento</option>
              <option>Manutenção</option>
              <option>Ganho de Massa</option>
            </select>
            <select className="w-full p-2 border rounded mb-2">
              <option>Sedentário</option>
              <option>Leve</option>
              <option>Moderado</option>
              <option>Intenso</option>
            </select>
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded">Gerar Dieta</button>
          </form>
        </main>
      </div>

    </div>
  )
}