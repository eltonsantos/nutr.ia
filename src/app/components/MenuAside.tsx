export function MenuAside() {
  return (
    <aside className="w-44 bg-green-500 text-white p-6">
      <h2 className="text-2xl font-bold ">Nutr.IA</h2>
      <nav className="mt-6">
        <ul>
          <li className="py-2 text-white hover:text-green-600 cursor-pointer">Home</li>
          <li className="py-2 text-white hover:text-green-600 cursor-pointer">Faça sua dieta</li>
          <li className="py-2 text-white hover:text-green-600 cursor-pointer">Histórico</li>
        </ul>
      </nav>
    </aside>
  )
}