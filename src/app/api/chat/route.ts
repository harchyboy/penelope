import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { CHAT_SYSTEM_PROMPT } from '@/lib/prompts'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, persona_data, history = [] } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build the system prompt with persona context
    const systemPrompt = CHAT_SYSTEM_PROMPT.replace(
      '{persona_data}',
      JSON.stringify(persona_data, null, 2)
    )

    // Convert history to Anthropic format
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...history.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ]

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    })

    // Extract the text response
    const responseText = response.content[0].type === 'text' 
      ? response.content[0].text 
      : ''

    return NextResponse.json({
      success: true,
      response: responseText,
    })
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
