"use client"

import { signIn } from "next-auth/react";

export default function LoginGoogle() {
  return (
    <>
      <h5 className="font-semibold text-slate-600">OU</h5>
      <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="font-bold bg-blue-500 hover:bg-blue-600 rounded-md p-2 w-full text-white cursor-pointer">Login com Google</button>
    </>
  )
}