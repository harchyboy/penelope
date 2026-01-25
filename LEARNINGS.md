# Project Learnings

## Codebase Patterns

### Color System
- Brand colors are defined in `tailwind.config.ts`
- `brand-blue` is `#4A90E2` (Hartz Sky Blue) - used for primary CTAs and accents
- `brand-orange` is `#E88B4D` - used for secondary/accent elements
- CSS variables in `globals.css` provide shadcn/ui compatibility

### Component Library
- UI components live in `src/components/ui/`
- Export through `src/components/ui/index.ts`
- Components: Button, Input, Textarea, Card, Select, LoadingSpinner, ErrorMessage
- All components support className prop for customization

### Form Patterns
- Use GET forms with `action="/route"` to pass data via query params
- Target pages read params via `useSearchParams()` hook
- Requires `'use client'` directive and Suspense boundary for searchParams

---

## UI-001 - 2026-01-25

**Area:** Landing page hero section

**Pattern discovered:** Use inline SVG data URI for noise texture to avoid external dependencies. The SVG uses `feTurbulence` filter for fractal noise.

**Gotcha:** Form action with GET method passes params as query strings. The `/create` page must read them with `useSearchParams()` and prefill the form state on initial render.

**Implementation notes:**
- Two-column grid layout uses `lg:grid-cols-2` for responsive stacking
- Tight letter-spacing achieved with inline `style={{ letterSpacing: '-0.05em' }}`
- 40px border-radius on persona card uses inline style (Tailwind doesn't have this value by default)
- Hairline progress bars use `h-px` (1px height)

**Files involved:**
- `src/app/page.tsx` - Hero section with PersonaPreviewCard component
- `src/app/create/page.tsx` - Added business_name and industry query param reading
- `src/app/globals.css` - Added `.noise-overlay` CSS class
- `tailwind.config.ts` - No changes needed (brand-blue already #4A90E2)

---

## UI-001 Update - 2026-01-25

**Area:** Landing page hero section - Animated persona visualization

**Pattern discovered:** Use CSS transitions with conditional classes + inline `style={{ transitionDelay }}` for sequenced animations. This is cleaner than using multiple JS timers for each element and provides smooth, GPU-accelerated animations.

**Animation sequence pattern:**
```tsx
const [isAnimated, setIsAnimated] = useState(false)
useEffect(() => {
  const timer = setTimeout(() => setIsAnimated(true), 400)
  return () => clearTimeout(timer)
}, [])

// Then in JSX:
<div
  className={`transition-all duration-500 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}
  style={{ transitionDelay: '200ms' }}
>
```

**Gotcha:**
- The `'use client'` directive is required when using `useState`, `useEffect`, and `useRouter` hooks
- The global `Header` component is rendered via `layout.tsx`, so landing page shouldn't duplicate it
- Use Hartz brand color classes (`hartz-sky-blue`, `hartz-growth-green`, etc.) for consistency
- 40px border-radius still requires inline style as Tailwind doesn't have this value by default

**Icons used from lucide-react:**
- `Star`, `TrendingUp`, `Clock`, `Users` - for trait tags
- `Brain`, `Heart` - for progress bar icons

**Files modified:**
- `src/app/page.tsx` - Added `PersonaVisualization` component with animated elements
