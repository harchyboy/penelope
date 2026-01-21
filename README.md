# Penelope - AI Customer Persona Expert

🌐 **Penelope** is an AI-powered customer persona creation tool built by Hartz AI. It helps businesses deeply understand their customers through detailed, psychologically-rich personas.

## Features

- **B2C Buyer Personas**: Create detailed individual customer profiles with demographics, psychographics, emotional drivers, and psychological insights
- **B2B Company Profiles**: Generate ideal company profiles with linked buyer personas
- **Chat with Penelope**: Ask follow-up questions and dive deeper into any aspect of your persona
- **PDF Export**: Download professional PDF reports (coming soon)
- **Multiple Persona Types**: Support for both B2C individuals and B2B company+buyer combinations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **Database**: Supabase (PostgreSQL) - coming in Phase 2
- **Payments**: Stripe - coming in Phase 2
- **PDF Generation**: React-PDF - coming in Phase 4
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Anthropic API key

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd penelope-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Then edit \`.env.local\` and add your Anthropic API key:
   \`\`\`
   ANTHROPIC_API_KEY=your_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Project Structure

\`\`\`
penelope-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── generate-persona/
│   │   │   └── chat/
│   │   ├── create/            # Persona creation wizard
│   │   ├── persona/[id]/      # Persona display page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── wizard/           # Wizard components (coming)
│   │   ├── chat/             # Chat components (coming)
│   │   └── persona/          # Persona display components (coming)
│   ├── lib/
│   │   ├── prompts.ts        # Penelope system prompts
│   │   └── utils.ts          # Utility functions
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── hooks/                # Custom React hooks (coming)
│   └── store/                # State management (coming)
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
├── next.config.js            # Next.js configuration
└── package.json
\`\`\`

## Development Roadmap

### Phase 1: MVP (Current) ✅
- [x] Landing page
- [x] B2C persona wizard
- [x] Penelope AI generation
- [x] Persona display with sections
- [x] Preview/blur for locked content
- [x] Chat with Penelope

### Phase 2: Authentication & Payments
- [ ] Supabase authentication
- [ ] User registration/login
- [ ] Free persona unlock on registration
- [ ] Stripe integration
- [ ] One-time purchase (£20)
- [ ] Monthly subscription (£20/month, 3 personas, 3-month minimum)

### Phase 3: B2B & Advanced Features
- [ ] B2B company profiles
- [ ] Linked buyer personas
- [ ] Admin dashboard
- [ ] Internal/client reports

### Phase 4: Polish
- [ ] PDF generation with branding
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Chat history storage (for subscribers)

## API Routes

### POST /api/generate-persona
Generate a new persona based on business context.

**Request:**
\`\`\`json
{
  "type": "b2c_individual" | "b2b_company" | "b2b_buyer",
  "business_context": {
    "business_name": "string",
    "business_sector": "string",
    "price_point": "higher" | "lower" | "similar",
    "target_location": "string",
    "problem_solved": "string",
    "unique_selling_point": "string"
  }
}
\`\`\`

### GET /api/generate-persona?id={id}
Retrieve a persona by ID.

### POST /api/chat
Chat with Penelope about a persona.

**Request:**
\`\`\`json
{
  "message": "string",
  "persona_data": { ... },
  "history": [{ "role": "user" | "assistant", "content": "string" }]
}
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

\`\`\`
ANTHROPIC_API_KEY=your_production_api_key
NEXT_PUBLIC_APP_URL=https://personas.hartzai.com
\`\`\`

## Contributing

This is a private project for Hartz AI. Contact the team for contribution guidelines.

## License

Copyright © 2024 Hartz AI. All rights reserved.

---

Built with 🌐 by [Hartz AI](https://hartzai.com)
