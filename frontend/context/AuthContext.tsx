"use client"

import { createContext, useEffect, useState, ReactNode } from "react"
import { loginOrg } from "@/services/orgs"


interface Org {
  id: string
  name: string
  email: string
  state: string
  city: string
  whatsapp: string
}

interface LoginResponse {
  token: string
  org: Org
}

interface AuthContextData {
  user: Org | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  logout: () => void
}


export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Org | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("@auth:org")
    const token = localStorage.getItem("@auth:token")

    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  async function signIn(email: string, password: string) {
    const { token, org } = await loginOrg({ email, password })

    localStorage.setItem("@auth:token", token)
    localStorage.setItem("@auth:org", JSON.stringify(org))

    setUser(org)
  }

  function logout() {
    localStorage.removeItem("@auth:token")
    localStorage.removeItem("@auth:org")

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signIn,
        logout,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  )
}
