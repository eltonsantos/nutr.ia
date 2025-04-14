"use client"

import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function LoginGoogle() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="w-full flex items-center justify-center gap-2 rounded-md bg-white border border-gray-300 py-3 px-4 text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
    >
      <FcGoogle className="w-5 h-5" />
      <span className="font-medium">Continuar com Google</span>
    </button>
  );
}