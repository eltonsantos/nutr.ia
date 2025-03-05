"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { toast } from "react-toastify"

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
    <>
      <form onSubmit={login} className="flex flex-col gap-2 w-full justify-center items-center">
        <h2 className="font-bold text-lg mb-3 text-slate-600">Faça seu login</h2>
        <input type="email" name="email" placeholder="Digite seu email" className="rounded-md p-2 w-full bg-white" />
        <input type="password" name="password" placeholder="Digite seu password" className="rounded-md p-2 w-full bg-white" />
        <button
          type="submit"
          style={{ height: "40px" }}
          className="font-bold bg-green-600 hover:bg-green-700 rounded-md px-6 py-2 w-full text-white cursor-pointer justify-center align-middle items-center justify-items-center disabled:bg-green-700"
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-white text-xl justify-center align-middle items-center justify-items-center" />
          ) : (
            "Login"
          )}
        </button>

        {error === "CredentialsSignin" && (
          <div className="text-red-500">Erro no login</div>
        )}
      </form>
      <p className="mt-4 text-sm">
        Não tem uma conta?{" "}
        <Link href="/signup" className="text-green-700 hover:underline font-semibold">
          Cadastre-se
        </Link>
      </p>
    </>
  )
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginFormContent />
    </Suspense>
  )
}