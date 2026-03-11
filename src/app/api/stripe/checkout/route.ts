import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS, type PlanType } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to purchase' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { plan, personaId } = body as { plan: PlanType; personaId?: string }

    if (!plan || !PLANS[plan]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    const selectedPlan = PLANS[plan]

    if (!selectedPlan.priceId) {
      return NextResponse.json(
        { error: 'This plan is not yet configured. Please contact support.' },
        { status: 500 }
      )
    }

    // Check if user already has a Stripe customer ID
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let customerId = existingSub?.stripe_customer_id

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Build success URL with persona context if provided
    const successUrl = personaId
      ? `${appUrl}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}&persona_id=${personaId}`
      : `${appUrl}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: selectedPlan.mode,
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: `${appUrl}/pricing?cancelled=true`,
      metadata: {
        supabase_user_id: user.id,
        plan,
        persona_id: personaId || '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
