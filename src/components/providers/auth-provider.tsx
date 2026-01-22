'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  supabaseUser: SupabaseUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  // Fetch user profile from public.users table
  const fetchUserProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data as User
  }, [supabase])

  // Refresh user data from database
  const refreshUser = useCallback(async () => {
    if (!supabaseUser) return
    const userProfile = await fetchUserProfile(supabaseUser.id)
    setUser(userProfile)
  }, [supabaseUser, fetchUserProfile])

  // Sign out function
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
    // State will be cleared by onAuthStateChange listener
  }, [supabase])

  // Initialize auth state and subscribe to changes
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()

        setSession(initialSession)
        setSupabaseUser(initialSession?.user ?? null)

        if (initialSession?.user) {
          const userProfile = await fetchUserProfile(initialSession.user.id)
          setUser(userProfile)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession)
        setSupabaseUser(newSession?.user ?? null)

        if (newSession?.user) {
          const userProfile = await fetchUserProfile(newSession.user.id)
          setUser(userProfile)
        } else {
          setUser(null)
        }

        // If sign out event, ensure loading is false
        if (event === 'SIGNED_OUT') {
          setIsLoading(false)
        }
      }
    )

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchUserProfile])

  const value: AuthContextValue = {
    user,
    supabaseUser,
    session,
    isLoading,
    isAuthenticated: !!supabaseUser && !!session,
    signOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
