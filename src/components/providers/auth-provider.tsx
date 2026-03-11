'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
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

  // Stable client ref — never changes across renders
  const supabaseRef = useRef<SupabaseClient>(null!)
  if (!supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current

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

  const refreshUser = useCallback(async () => {
    if (!supabaseUser) return
    const userProfile = await fetchUserProfile(supabaseUser.id)
    setUser(userProfile)
  }, [supabaseUser, fetchUserProfile])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }, [supabase])

  // Use onAuthStateChange as the single source of truth — no separate getSession call
  useEffect(() => {
    let isMounted = true

    // Safety timeout
    const timeout = setTimeout(() => {
      if (isMounted) setIsLoading(false)
    }, 5000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return

        setSession(newSession)
        setSupabaseUser(newSession?.user ?? null)

        if (newSession?.user) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', newSession.user.id)
            .single()

          if (isMounted) {
            if (data && !error) {
              setUser(data as User)
            } else {
              // Fallback: build user from Supabase auth metadata
              console.warn('Failed to fetch user profile, using auth metadata:', error?.message)
              setUser({
                id: newSession.user.id,
                email: newSession.user.email || '',
                name: newSession.user.user_metadata?.name || null,
                role: 'user',
                free_persona_used: false,
                created_at: newSession.user.created_at,
                updated_at: newSession.user.updated_at || newSession.user.created_at,
              } as User)
            }
          }
        } else {
          setUser(null)
        }

        if (isMounted) {
          setIsLoading(false)
          clearTimeout(timeout)
        }
      }
    )

    return () => {
      isMounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [supabase])

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
