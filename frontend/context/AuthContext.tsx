"use client"

import { createContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { loginOrg, getMe, type Org } from "@/services/orgs"
import { petAPI } from "@/services/api"

interface AuthContextData {
  user: Org | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Org | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  async function loadUser() {
    try {
      const { org } = await getMe()
      setUser(org)
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    loadUser()
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const { org } = await loginOrg({ email, password })

      setUser(org)

      router.push('/dashboard')
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  async function logout() {
    try {
      await petAPI.post('/logout')

      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Erro no logout:', error)
      setUser(null)
      router.push('/login')
    }
  }

  async function refreshUser() {
    setIsLoading(true)
    await loadUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        logout,
        refreshUser,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  )
}