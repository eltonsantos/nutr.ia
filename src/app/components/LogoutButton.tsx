"use client"

import { signOut } from "next-auth/react"
import { FiLogOut } from "react-icons/fi"

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-gray-500 hover:text-red-500 p-2 rounded-md transition-colors"
      title="Sair"
    >
      <FiLogOut size={18} />
    </button>
  )
}