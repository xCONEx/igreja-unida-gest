import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserService, ApplicationUser } from '../integrations/supabase/services/userService'
import { OrganizationService, Organization } from '../integrations/supabase/services/organizationService'
import { supabase } from '../integrations/supabase/client'

interface AuthContextType {
  user: ApplicationUser | null
  organization: Organization | null
  isAdminMaster: boolean
  isLoading: boolean
  login: (email: string, password?: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ApplicationUser | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminMaster, setIsAdminMaster] = useState(false)

  // Verificar se é admin master (email específico)
  const checkAdminMaster = (email: string) => {
    const adminEmails = ['yuriadrskt@gmail.com', 'admin@igrejaunida.com', 'master@igrejaunida.com']
    return adminEmails.includes(email.toLowerCase())
  }

  const login = async (email: string, password?: string) => {
    try {
      setIsLoading(true)
      
      // Buscar usuário por email
      const userData = await UserService.getUserByEmail(email)
      
      if (!userData) {
        throw new Error('Usuário não encontrado. Entre em contato com o administrador.')
      }

      // Se for login com senha, verificar se a senha está correta
      if (password && password !== '') {
        // Aqui você pode implementar verificação de senha se necessário
        // Por enquanto, vamos aceitar qualquer senha para usuários existentes
        console.log('Login com senha para:', email)
      }

      // Verificar se é admin master
      const isMaster = checkAdminMaster(email)
      setIsAdminMaster(isMaster)

      if (isMaster) {
        // Admin master não precisa de organização
        setUser(userData)
        setOrganization(null)
        
        // Salvar dados no localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('isAdminMaster', JSON.stringify(isMaster))
      } else {
        // Usuário normal precisa ter organização
        if (!userData.organization_id) {
          throw new Error('Usuário não está associado a uma organização')
        }

        const orgData = await OrganizationService.getOrganizationById(userData.organization_id)
        if (!orgData) {
          throw new Error('Organização não encontrada')
        }

        setUser(userData)
        setOrganization(orgData)
        
        // Salvar dados no localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('organization', JSON.stringify(orgData))
        localStorage.setItem('isAdminMaster', JSON.stringify(isMaster))
      }

    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true)
      
      // Iniciar login com Google via Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      // O redirecionamento será tratado no callback
      console.log('Login com Google iniciado:', data)

    } catch (error) {
      console.error('Erro no login com Google:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setOrganization(null)
    setIsAdminMaster(false)
    localStorage.removeItem('user')
    localStorage.removeItem('organization')
    localStorage.removeItem('isAdminMaster')
  }

  const refreshUser = async () => {
    try {
      const savedUser = localStorage.getItem('user')
      const savedOrg = localStorage.getItem('organization')
      const savedIsMaster = localStorage.getItem('isAdminMaster')

      if (savedUser) {
        const userData = JSON.parse(savedUser)
        const isMaster = savedIsMaster ? JSON.parse(savedIsMaster) : false

        setUser(userData)
        setIsAdminMaster(isMaster)

        if (!isMaster && savedOrg) {
          const orgData = JSON.parse(savedOrg)
          setOrganization(orgData)
        } else {
          setOrganization(null)
        }
      }
    } catch (error) {
      console.error('Erro ao recarregar usuário:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value: AuthContextType = {
    user,
    organization,
    isAdminMaster,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 