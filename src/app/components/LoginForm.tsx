"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { toast } from "react-toastify"
import { FiMail, FiLock } from "react-icons/fi"

function LoginFormContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const data = {
      email: formData.get("email"),
      password: formData.get("password")
    }

    try {
      const result = await signIn('credentials', {
        ...data,
        redirect: false
      })
      
      if (result?.error) {
        toast.error("Credenciais inválidas")
      } else {
        router.push("/dashboard")
        toast.success("Login realizado com sucesso!")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={login} className="space-y-4">
      <div className="space-y-2">
        <div className="input-icon-container">
          <div className="input-icon">
            <FiMail className="w-5 h-5" />
          </div>
          <input 
            type="email" 
            name="email" 
            placeholder="Digite seu email" 
            className="with-icon w-full" 
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="input-icon-container">
          <div className="input-icon">
            <FiLock className="w-5 h-5" />
          </div>
          <input 
            type="password" 
            name="password" 
            placeholder="Digite sua senha" 
            className="with-icon w-full" 
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Link href="#" className="text-sm text-green-600 hover:underline">
          Esqueceu a senha?
        </Link>
      </div>
      
      <button
        type="submit"
        className="btn btn-primary w-full flex items-center justify-center h-12"
        disabled={loading}
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin text-white text-xl" />
        ) : (
          "Entrar"
        )}
      </button>

      {error === "CredentialsSignin" && (
        <div className="text-red-500 text-sm text-center mt-2">
          Email ou senha incorretos
        </div>
      )}
    </form>
  )
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-40 w-full rounded-lg"></div>}>
      <LoginFormContent />
    </Suspense>
  )
}