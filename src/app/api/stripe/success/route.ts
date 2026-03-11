import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')
  const personaId = searchParams.get('persona_id')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (!sessionId) {
    return NextResponse.redirect(`${appUrl}/dashboard`)
  }

  try {
    // Verify the session is complete
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      // Redirect to the persona if we have one, otherwise dashboard
      if (personaId) {
        return NextResponse.redirect(`${appUrl}/persona/${personaId}?unlocked=true`)
      }
      return NextResponse.redirect(`${appUrl}/dashboard?subscribed=true`)
    }

    // Payment not complete — redirect to dashboard with error
    return NextResponse.redirect(`${appUrl}/dashboard?payment=incomplete`)
  } catch (error) {
    console.error('Error verifying checkout session:', error)
    return NextResponse.redirect(`${appUrl}/dashboard`)
  }
}
