import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL format
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Fetch the website content
    let pageContent: string
    try {
      const response = await fetch(parsedUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PenelopeBot/1.0)',
          'Accept': 'text/html',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        return NextResponse.json(
          { error: `Could not access website (${response.status})` },
          { status: 422 }
        )
      }

      const html = await response.text()

      // Strip HTML tags, scripts, styles — keep just text content
      pageContent = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<header[\s\S]*?<\/header>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 8000) // Limit content sent to Claude
    } catch (fetchError) {
      return NextResponse.json(
        { error: 'Could not fetch website. Check the URL and try again.' },
        { status: 422 }
      )
    }

    if (pageContent.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract enough content from this website.' },
        { status: 422 }
      )
    }

    // Use Claude to extract business information
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: 'You extract business information from website content. Respond ONLY with valid JSON, no other text.',
      messages: [
        {
          role: 'user',
          content: `Extract business information from this website content. If you can't determine a field, use an empty string.

Website: ${parsedUrl.hostname}

Content:
${pageContent}

Respond with this exact JSON structure:
{
  "business_name": "The business/company name",
  "business_sector": "What the business does — their product or service described in 1-2 sentences",
  "target_location": "Where they operate or target (country/region)",
  "problem_solved": "The main problem or pain point they solve for customers",
  "unique_selling_point": "What makes them different from competitors"
}`,
        },
      ],
    })

    const responseText = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

    let extracted
    try {
      const cleanJson = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      extracted = JSON.parse(cleanJson)
    } catch {
      return NextResponse.json(
        { error: 'Could not parse business information from this website.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: extracted })
  } catch (error) {
    console.error('Extract business error:', error)
    return NextResponse.json(
      { error: 'Failed to extract business information' },
      { status: 500 }
    )
  }
}
