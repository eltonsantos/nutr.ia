
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import LogoutButton from "./LogoutButton";
import Image from "next/image"

export async function MenuHeader() {
  const session = await getServerSession()

  if(!session){
    redirect("/")
  }

  return (
    <header className="w-full bg-green-300 p-2 flex justify-between items-center shadow-md">
      <div></div>
      <div className="flex items-center gap-4">
        <Image
          src={session?.user?.image || "https://github.com/eltonsantos.png"}
          alt="Avatar"
          width={50}
          height={50}
          className="w-10 h-10 rounded-full border"
        />
        <div className="text-right">
          <span className="text-lg font-bold mr-2">{session?.user?.name}</span>
          <span className="text-sm text-gray-600">({session?.user?.email})</span>
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}