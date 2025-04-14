import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import LogoutButton from "./LogoutButton";
import { FiBell, FiUser } from "react-icons/fi"

export async function MenuHeader() {
  const session = await getServerSession()

  if(!session){
    redirect("/")
  }

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6">
      <div className="flex justify-between items-center">
        {/* Left side - Logo for mobile */}
        <div className="lg:hidden">
          <span className="text-xl font-bold text-green-600">Nutr.IA</span>
        </div>
        
        {/* Right side - User info and actions */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Notification icon */}
          <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors relative">
            <FiBell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-green-600 rounded-full"></span>
          </button>
          
          {/* User profile */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-200 flex items-center justify-center">
              <FiUser className="text-gray-500" size={18} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{session?.user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500">{session?.user?.email || 'usuario@email.com'}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}