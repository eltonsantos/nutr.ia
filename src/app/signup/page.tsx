import { Suspense } from "react";
import SignupForm from "../components/SignupForm";
import Link from "next/link";

function SignupFormFallback() {
  return <div>Carregando formulário...</div>;
}

export default function SignupPage() {
  return (
    <main className="bg-gray-100 h-screen flex flex-col justify-center items-center px-5">
      <h1 className="font-bold text-4xl mb-5 text-green-600 text-center">Nutr.IA</h1>

      <div className="bg-green-300 p-12 rounded-lg w-96 max-w-full flex justify-center items-center flex-col gap-2">
        <Suspense fallback={<SignupFormFallback />}>
          <SignupForm />
        </Suspense>
      </div>
      <p className="mt-4 text-sm">
        Já tem uma conta?{" "}
        <Link href="/" className="text-green-700 hover:underline font-semibold">
          Voltar para o login
        </Link>
      </p>
    </main>
  );
}