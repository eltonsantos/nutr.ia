import { Suspense } from "react";
import LoginForm from "./components/LoginForm";
import LoginGoogle from "./components/LoginGoogle";

function LoginFormFallback() {
  return <div>Carregando formulário...</div>
}

export default function Home() {
  return (
    <main className="bg-gray-100 h-screen flex flex-col justify-center items-center px-5">
      <h1 className="font-bold text-4xl mb-5 text-green-600 text-center">Nutr.IA</h1>

      <div className="bg-green-300 p-12 rounded-lg w-96 max-w-full flex justify-center items-center flex-col gap-2">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
        <LoginGoogle />
      </div>
    </main>
  );
}