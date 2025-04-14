import { Suspense } from "react";
import SignupForm from "../components/SignupForm";
import Link from "next/link";
import { FiClock } from "react-icons/fi";

function SignupFormFallback() {
  return <div className="animate-pulse bg-gray-200 h-52 w-full rounded-lg"></div>;
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Hero Section / Left Side */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 md:p-16 flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
        <div className="max-w-xl">
          <h1 className="font-bold text-4xl md:text-5xl text-green-600 mb-4">
            Junte-se a <span className="text-green-800">Nutr.IA</span>
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Crie sua conta para acessar planos nutricionais personalizados baseados em IA.
          </p>
          <div className="h-40 md:h-60 w-full rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-green-300 to-green-200 flex items-center justify-center">
            <div className="text-center p-6">
              <FiClock className="w-12 h-12 text-green-700 mx-auto mb-2" />
              <div className="text-green-800 text-lg font-medium">
                Economize tempo com planos alimentares personalizados
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Signup Section / Right Side */}
      <div className="bg-white p-8 md:p-16 flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
          <h2 className="font-bold text-2xl mb-8 text-center text-gray-800">
            Crie sua conta
          </h2>
          <Suspense fallback={<SignupFormFallback />}>
            <SignupForm />
          </Suspense>
          <p className="mt-6 text-sm text-center">
            Já tem uma conta?{" "}
            <Link href="/" className="text-green-600 hover:underline font-semibold">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}