import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { CHAT_SYSTEM_PROMPT } from '@/lib/prompts'
import { PENELOPE_SYSTEM_PROMPT } from '@/lib/prompts/penelope-system-prompt'

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

    // Build the chat-specific system prompt with persona context
    const chatContext = CHAT_SYSTEM_PROMPT.replace(
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

    // Call Claude API with prompt caching and extended thinking
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8096,
      thinking: {
        type: 'enabled',
        budget_tokens: 16000,
      },
      system: [
        {
          type: 'text',
          text: PENELOPE_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: chatContext,
        },
      ],
      messages,
    })

    // Extract only text blocks, filtering out thinking blocks
    const responseText = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

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
