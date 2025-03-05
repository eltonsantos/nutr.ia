import { NextRequest, NextResponse } from "next/server";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }
    
    const { name, email, password } = body;
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName: name });
    
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      user: { id: user.uid, name, email }
    });
  } catch (error: unknown) {
    console.error("Signup error:", error);
    
    if (error instanceof Error) {
      if ("code" in error && error.code === 'auth/email-already-in-use') {
        return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
      }
    }
    
    return NextResponse.json({ error: "Erro ao cadastrar usuário" }, { status: 500 });
  }
}