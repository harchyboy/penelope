import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      typescript: true,
    })
  }
  return _stripe
}

// Product/Price configuration
// These should match your Stripe Dashboard products
export const PLANS = {
  one_time: {
    name: 'Single Persona Unlock',
    description: 'Unlock one persona with full insights',
    priceId: process.env.STRIPE_PRICE_ONE_TIME || '',
    mode: 'payment' as const,
    personas: 1,
  },
  monthly: {
    name: 'Penelope Pro',
    description: 'Unlimited persona generation and unlocks',
    priceId: process.env.STRIPE_PRICE_MONTHLY || '',
    mode: 'subscription' as const,
    personas: -1, // unlimited
  },
} as const

export type PlanType = keyof typeof PLANS
