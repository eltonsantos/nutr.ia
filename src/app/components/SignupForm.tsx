"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { toast } from "react-toastify"
import { FiUser, FiMail, FiLock } from "react-icons/fi"
import { z } from "zod"

// Esquema de validação para o formulário
const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando o usuário começa a digitar
    if (errors[name as keyof SignupFormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof SignupFormData];
        return newErrors;
      });
    }
  }
  
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    
    // Validar o formulário
    try {
      signupSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Partial<SignupFormData> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as keyof SignupFormData] = err.message;
          }
        });
        setErrors(formattedErrors);
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.error || "Erro ao cadastrar");
        return;
      }
      
      router.push("/");
      toast.success("Cadastro realizado com sucesso! Faça login.");
      
    } catch (error) {
      toast.error("Erro ao cadastrar usuário");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <div className="input-icon-container">
          <div className="input-icon">
            <FiUser className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            name="name"
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Seu nome completo" 
            className={`with-icon w-full ${errors.name ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="input-icon-container">
          <div className="input-icon">
            <FiMail className="w-5 h-5" />
          </div>
          <input 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange} 
            placeholder="seu.email@exemplo.com" 
            className={`with-icon w-full ${errors.email ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <div className="input-icon-container">
          <div className="input-icon">
            <FiLock className="w-5 h-5" />
          </div>
          <input 
            type="password" 
            name="password"
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Crie uma senha forte" 
            className={`with-icon w-full ${errors.password ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>
      
      <button 
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full flex items-center justify-center h-12 mt-6"
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin text-white text-xl" />
        ) : (
          "Criar conta"
        )}
      </button>
    </form>
  )
}