import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Check if user can create persona based on their status
export function canCreatePersona(
  user: { free_persona_used: boolean; role: string } | null,
  subscription: { status: string; personas_remaining: number } | null
): { allowed: boolean; reason?: string } {
  // Admin can always create
  if (user?.role === 'admin') {
    return { allowed: true }
  }

  // No user - can create preview only
  if (!user) {
    return { allowed: true }  // Will be a preview
  }

  // User hasn't used free persona
  if (!user.free_persona_used) {
    return { allowed: true }
  }

  // Check subscription
  if (subscription?.status === 'active' && subscription.personas_remaining > 0) {
    return { allowed: true }
  }

  return {
    allowed: false,
    reason: 'You have used your free persona. Please subscribe to create more.',
  }
}

// Determine what content should be visible
export function getVisibleSections(
  isUnlocked: boolean,
  userRole?: string
): string[] {
  const previewSections = [
    'name',
    'age',
    'gender',
    'location',
    'occupation',
    'motivations_and_values',
  ]

  const allSections = [
    'name',
    'age',
    'gender',
    'location',
    'occupation',
    'income_level',
    'education',
    'marital_status',
    'motivations_and_values',
    'psychographic_traits',
    'emotional_cultural_drivers',
    'brand_expectations',
    'pain_points',
    'preferred_channels',
    'buying_journey',
    'loyalty_triggers',
    'personality_typing',
    'brand_alignment',
    'internal_monologue',
    'psychological_depth',
  ]

  // Admin sees everything
  if (userRole === 'admin') {
    return allSections
  }

  return isUnlocked ? allSections : previewSections
}
