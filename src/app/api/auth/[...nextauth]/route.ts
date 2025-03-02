import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  pages: {
    signIn: "/"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" }
      },
      async authorize(credentials) {
        if(!credentials) {
          return null
        }

        if(credentials.email === "elton@elton.com" && credentials.password === "123") {
          return {
            id: "1",
            name: "Elton",
            email: "elton@elton.com"
          }
        }

        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ]
})

export { handler as GET, handler as POST }