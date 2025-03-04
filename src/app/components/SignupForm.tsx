"use client"

import { useState } from "react"
import { toast } from "react-toastify"

export default function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        toast.error(data.error || "Erro ao cadastrar")
        return
      }
      
      toast.success("Cadastro realizado com sucesso! Faça login.")
      setName("")
      setEmail("")
      setPassword("")
      
    } catch (error) {
      toast.error("Erro ao cadastrar usuário")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-2 w-full justify-center items-center">
      <h2 className="font-bold text-lg mb-3 text-slate-600">Crie sua conta</h2>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Seu nome" 
        className="rounded-md p-2 w-full bg-white" 
        required 
      />
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Seu email" 
        className="rounded-md p-2 w-full bg-white" 
        required 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Sua senha" 
        className="rounded-md p-2 w-full bg-white" 
        required 
      />
      <button 
        type="submit" 
        disabled={loading}
        className="font-bold bg-green-600 hover:bg-green-700 rounded-md p-2 w-full text-white cursor-pointer disabled:bg-green-400"
      >
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  )
}