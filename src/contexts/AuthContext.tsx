
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../integrations/supabase/client'
import { UserService, ApplicationUser } from '../integrations/supabase/services/userService'
import { OrganizationService, Organization } from '../integrations/supabase/services/organizationService'

interface AuthContextType {
  user: ApplicationUser | null
  supabaseUser: User | null
  organization: Organization | null
  isAdminMaster: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ApplicationUser | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminMaster, setIsAdminMaster] = useState(false)

  // Verificar se é admin master (email específico)
  const checkAdminMaster = (email: string) => {
    const adminEmails = ['yuriadrskt@gmail.com', 'admin@igrejaunida.com', 'master@igrejaunida.com']
    return adminEmails.includes(email.toLowerCase())
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      // Login via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data.user) {
        throw new Error('Usuário não encontrado')
      }

      // O resto será tratado pelo onAuthStateChange
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
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      console.log('Login com Google iniciado:', data)
    } catch (error) {
      console.error('Erro no login com Google:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSupabaseUser(null)
      setOrganization(null)
      setIsAdminMaster(false)
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  const loadUserData = async (supabaseUser: User) => {
    try {
      console.log('Carregando dados do usuário:', supabaseUser.email)
      
      // Verificar se é admin master
      const isMaster = checkAdminMaster(supabaseUser.email!)
      setIsAdminMaster(isMaster)

      if (isMaster) {
        // Admin master não precisa de dados na tabela application_users
        setUser({
          id: 0,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email!,
          organization_id: 0,
          is_admin: true,
          can_add_people: true,
          can_organize_events: true,
          can_manage_media: true,
          receive_cancel_event_notification: false,
          pending: false,
          phone_number: null,
          birth_date: null,
          country_dial_code: null,
          profile_url: supabaseUser.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as ApplicationUser)
        setOrganization(null)
      } else {
        // Usuário normal - buscar dados na tabela
        try {
          const userData = await UserService.getUserByEmail(supabaseUser.email!)
          
          if (!userData) {
            // Criar usuário automaticamente se não existe
            const newUser = await UserService.createUser({
              email: supabaseUser.email!,
              name: supabaseUser.user_metadata?.full_name || supabaseUser.email!,
              organization_id: 1, // Organização padrão - será ajustado
              profile_url: supabaseUser.user_metadata?.avatar_url || null,
              pending: true
            })
            setUser(newUser)
          } else {
            setUser(userData)
            
            // Carregar organização se o usuário tiver uma
            if (userData.organization_id) {
              const orgData = await OrganizationService.getOrganizationById(userData.organization_id)
              setOrganization(orgData)
            }
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error)
          // Se não conseguir carregar, criar usuário básico
          setUser({
            id: 0,
            email: supabaseUser.email!,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email!,
            organization_id: 0,
            is_admin: false,
            can_add_people: false,
            can_organize_events: false,
            can_manage_media: false,
            receive_cancel_event_notification: false,
            pending: true,
            phone_number: null,
            birth_date: null,
            country_dial_code: null,
            profile_url: supabaseUser.user_metadata?.avatar_url || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as ApplicationUser)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    }
  }

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserData(session.user)
      }
    } catch (error) {
      console.error('Erro ao recarregar usuário:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Configurar listener para mudanças de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSupabaseUser(session.user)
          await loadUserData(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setSupabaseUser(null)
          setOrganization(null)
          setIsAdminMaster(false)
        }
        
        setIsLoading(false)
      }
    )

    // Verificar sessão inicial
    refreshUser()

    return () => subscription.unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
    supabaseUser,
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
