'use server'

interface RegisterInput {
  email: string
  password: string
  name?: string
}

interface RegisterResult {
  success?: boolean
  error?: string
}

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  // Placeholder - full implementation in US-005
  // For now, return an error to indicate feature not complete
  console.log('Registration attempted for:', input.email)
  return {
    error: 'Registration is not yet implemented. Please check back soon.',
  }
}
