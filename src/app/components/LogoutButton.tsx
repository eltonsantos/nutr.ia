"use client"

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button className="cursor-pointer mt-1" onClick={() => signOut()}>Sair</button>
  )
}