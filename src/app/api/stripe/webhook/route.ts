import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

// Use service role client for webhook — no user session available
function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(supabase, session)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(supabase, subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(supabase, subscription)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(supabase, invoice)
        break
      }

      default:
        // Unhandled event type — log but don't error
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`Error handling ${event.type}:`, error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutComplete(
  supabase: ReturnType<typeof createServiceClient>,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.supabase_user_id
  const plan = session.metadata?.plan as 'one_time' | 'monthly'
  const personaId = session.metadata?.persona_id

  if (!userId || !plan) {
    console.error('Missing metadata in checkout session:', session.id)
    return
  }

  const now = new Date().toISOString()

  if (plan === 'monthly') {
    // Subscription — store subscription record
    const stripeSubscriptionId = session.subscription as string

    // Fetch subscription details for period dates
    const stripeSub = await getStripe().subscriptions.retrieve(stripeSubscriptionId)

    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: stripeSubscriptionId,
        plan: 'monthly',
        status: 'active',
        personas_remaining: -1, // unlimited for monthly
        period_start: new Date(stripeSub.current_period_start * 1000).toISOString(),
        period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
        created_at: now,
      }, {
        onConflict: 'user_id',
      })

    if (error) {
      console.error('Failed to upsert subscription:', error)
      throw error
    }
  } else {
    // One-time payment — give user 1 persona unlock credit
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('personas_remaining')
      .eq('user_id', userId)
      .single()

    const currentRemaining = existing?.personas_remaining ?? 0
    const newRemaining = currentRemaining === -1 ? -1 : currentRemaining + 1

    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: null,
        plan: 'one_time',
        status: 'active',
        personas_remaining: newRemaining,
        period_start: now,
        period_end: now, // one-time has no period
        created_at: now,
      }, {
        onConflict: 'user_id',
      })

    if (error) {
      console.error('Failed to upsert one-time subscription:', error)
      throw error
    }
  }

  // If a persona was specified, auto-unlock it
  if (personaId) {
    await unlockPersona(supabase, userId, personaId)
  }
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createServiceClient>,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string

  // Find user by Stripe customer ID
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!sub) {
    console.error('No subscription found for customer:', customerId)
    return
  }

  const status = mapStripeStatus(subscription.status)

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status,
      period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Failed to update subscription:', error)
    throw error
  }
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createServiceClient>,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      personas_remaining: 0,
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Failed to cancel subscription:', error)
    throw error
  }
}

async function handlePaymentFailed(
  supabase: ReturnType<typeof createServiceClient>,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Failed to update subscription status:', error)
  }
}

async function unlockPersona(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
  personaId: string
) {
  // Verify ownership
  const { data: persona } = await supabase
    .from('personas')
    .select('user_id, is_unlocked')
    .eq('id', personaId)
    .single()

  if (!persona || persona.user_id !== userId || persona.is_unlocked) {
    return
  }

  const { error } = await supabase
    .from('personas')
    .update({ is_unlocked: true, updated_at: new Date().toISOString() })
    .eq('id', personaId)

  if (error) {
    console.error('Failed to unlock persona after payment:', error)
  }
}

function mapStripeStatus(status: Stripe.Subscription.Status): string {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'active'
    case 'past_due':
      return 'past_due'
    case 'canceled':
    case 'unpaid':
      return 'cancelled'
    case 'incomplete':
    case 'incomplete_expired':
      return 'incomplete'
    default:
      return 'cancelled'
  }
}
