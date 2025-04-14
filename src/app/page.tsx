import { Suspense } from "react";
import LoginForm from "./components/LoginForm";
import LoginGoogle from "./components/LoginGoogle";
import { FiCheckCircle } from "react-icons/fi";

function LoginFormFallback() {
  return <div className="animate-pulse bg-gray-200 h-40 w-full rounded-lg"></div>
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Hero Section / Left Side */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 md:p-16 flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
        <div className="max-w-xl">
          <h1 className="font-bold text-4xl md:text-5xl text-green-600 mb-4">
            Nutr<span className="text-green-800">.IA</span>
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Transforme sua alimentação com planos nutricionais personalizados criados pela inteligência artificial.
          </p>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <FiCheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-gray-700">Planos personalizados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <FiCheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-gray-700">Baseado em IA</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <FiCheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-gray-700">Fácil de seguir</span>
            </div>
          </div>
          <div className="h-40 md:h-60 w-full rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-green-200 to-green-300 flex items-center justify-center">
            <div className="text-green-800 text-lg font-medium">Alimentação saudável e balanceada</div>
          </div>
        </div>
      </div>
      
      {/* Login Section / Right Side */}
      <div className="bg-white p-8 md:p-16 flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
          <h2 className="font-bold text-2xl mb-8 text-center text-gray-800">
            Entre na sua conta
          </h2>
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OU</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <LoginGoogle />
        </div>
      </div>
    </main>
  );
}