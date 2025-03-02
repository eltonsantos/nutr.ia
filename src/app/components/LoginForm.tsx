"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export default function LoginForm() {
  const searchParams = useSearchParams()

  const error = searchParams.get("error")

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const data = {
      email: formData.get("email"),
      password: formData.get("password")
    }
    
    signIn('credentials', {
      ...data,
      callbackUrl: '/dashboard'
    })
  }

  return (
    <form onSubmit={login} className="flex flex-col gap-2 w-full justify-center items-center">
      <h2 className="font-bold text-lg mb-3 text-slate-600">Faça seu login</h2>
      <input type="email" name="email" placeholder="Digite seu email" className="rounded-md p-2 w-full bg-white" />
      <input type="password" name="password" placeholder="Digite seu password" className="rounded-md p-2 w-full bg-white" />
      <button type="submit" className="font-bold bg-green-600 hover:bg-green-700 rounded-md p-2 w-full text-white cursor-pointer">Login</button>

      {error === "CredentialsSignin" && (
        <div className="text-red-500">Erro no login</div>
      )}
    </form>
  )
}