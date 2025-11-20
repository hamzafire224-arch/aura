# Testing Examples for AURA

## Component Tests

### Sidebar Component Test

```typescript
// __tests__/components/EnhancedSidebar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { EnhancedSidebar } from '@/components/dashboard/EnhancedSidebar'

describe('EnhancedSidebar', () => {
  const mockCredits = {
    used: 245,
    total: 500,
    resetIn: 12,
  }

  it('renders user information', () => {
    render(
      <BrowserRouter>
        <EnhancedSidebar credits={mockCredits} />
      </BrowserRouter>
    )
    expect(screen.getByText(/245\/500/)).toBeInTheDocument()
  })

  it('shows correct credit progress', () => {
    render(
      <BrowserRouter>
        <EnhancedSidebar credits={mockCredits} />
      </BrowserRouter>
    )
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '49')
  })

  it('collapses when button clicked', () => {
    render(
      <BrowserRouter>
        <EnhancedSidebar credits={mockCredits} />
      </BrowserRouter>
    )
    const collapseButton = screen.getByRole('button', { name: /chevron/i })
    fireEvent.click(collapseButton)
    // Assert sidebar width is collapsed
  })

  it('highlights active route', () => {
    // Mock useLocation to return '/dashboard'
    render(
      <BrowserRouter>
        <EnhancedSidebar credits={mockCredits} />
      </BrowserRouter>
    )
    const overviewLink = screen.getByText('Overview').closest('a')
    expect(overviewLink).toHaveClass('bg-primary/10')
  })
})
```

### Business Wizard Test

```typescript
// __tests__/components/BusinessWizard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BusinessWizard } from '@/components/wizard/BusinessWizard'

describe('BusinessWizard', () => {
  const mockOnComplete = jest.fn()
  const mockOnCancel = jest.fn()

  it('renders choose path step initially', () => {
    render(<BusinessWizard onComplete={mockOnComplete} onCancel={mockOnCancel} />)
    expect(screen.getByText('Choose Your Path')).toBeInTheDocument()
  })

  it('progresses to next step when path selected', () => {
    render(<BusinessWizard onComplete={mockOnComplete} onCancel={mockOnCancel} />)
    const productIdeaCard = screen.getByText('I Have a Product Idea')
    fireEvent.click(productIdeaCard)
    expect(screen.getByText('Tell us about your product')).toBeInTheDocument()
  })

  it('shows progress bar', () => {
    render(<BusinessWizard onComplete={mockOnComplete} onCancel={mockOnCancel} />)
    expect(screen.getByText(/Step 1 of 4/)).toBeInTheDocument()
  })

  it('calls onComplete when wizard finishes', async () => {
    render(<BusinessWizard onComplete={mockOnComplete} onCancel={mockOnCancel} />)
    // Navigate through steps
    // ... trigger completion
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled()
    })
  })
})
```

## API Route Tests

### Business Creation API Test

```typescript
// __tests__/api/businesses/create.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}))

describe('/api/businesses/create', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates business successfully', async () => {
    // Mock user authentication
    // Mock credit check
    // Mock AI generation
    // Mock database insert

    const response = await fetch('/api/businesses/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Sustainable leather wallets for professionals',
        industry: 'fashion',
        targetAudience: ['men 25-45'],
        priceRange: [30, 80],
        path: 'product-idea',
      }),
    })

    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.business).toBeDefined()
  })

  it('returns error when unauthorized', async () => {
    // Mock no user
    const response = await fetch('/api/businesses/create', {
      method: 'POST',
    })

    expect(response.status).toBe(401)
  })

  it('validates input correctly', async () => {
    const response = await fetch('/api/businesses/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Too short',
      }),
    })

    expect(response.status).toBe(400)
  })

  it('returns error when insufficient credits', async () => {
    // Mock user with 0 credits
    const response = await fetch('/api/businesses/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Valid prompt that is long enough to pass validation',
        industry: 'fashion',
        targetAudience: ['men 25-45'],
        priceRange: [30, 80],
        path: 'product-idea',
      }),
    })

    expect(response.status).toBe(402)
    const data = await response.json()
    expect(data.code).toBe('INSUFFICIENT_CREDITS')
  })
})
```

## Integration Tests

### Business Creation Flow

```typescript
// __tests__/integration/business-creation.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import BusinessWizardPage from '@/pages/dashboard/BusinessWizardPage'

describe('Business Creation Flow', () => {
  it('completes full business creation flow', async () => {
    render(
      <BrowserRouter>
        <BusinessWizardPage />
      </BrowserRouter>
    )

    // Step 1: Choose path
    const productIdeaCard = screen.getByText('I Have a Product Idea')
    fireEvent.click(productIdeaCard)

    // Step 2: Fill details
    await waitFor(() => {
      expect(screen.getByText('Tell us about your product')).toBeInTheDocument()
    })

    const promptInput = screen.getByPlaceholderText(/minimalist leather wallets/)
    fireEvent.change(promptInput, {
      target: { value: 'I want to sell minimalist leather wallets for professionals' },
    })

    const continueButton = screen.getByText('Continue')
    fireEvent.click(continueButton)

    // Step 3: AI Generation
    await waitFor(() => {
      expect(screen.getByText(/Creating your business/)).toBeInTheDocument()
    })

    // Wait for generation to complete
    await waitFor(
      () => {
        expect(screen.getByText('Your business is ready!')).toBeInTheDocument()
      },
      { timeout: 10000 }
    )

    // Step 4: Customize
    await waitFor(() => {
      expect(screen.getByText('Customize Your Business')).toBeInTheDocument()
    })

    const launchButton = screen.getByText('Launch Business')
    fireEvent.click(launchButton)

    // Should navigate to businesses page
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard/businesses')
    })
  })
})
```

## E2E Tests (Playwright)

```typescript
// e2e/business-creation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Business Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button:has-text("Log in")')
    await page.waitForURL('/dashboard')
  })

  test('creates a new business', async ({ page }) => {
    // Navigate to business creation
    await page.click('text=New Business')
    await expect(page).toHaveURL('/dashboard/businesses/new')

    // Choose path
    await page.click('text=I Have a Product Idea')
    await expect(page.locator('text=Tell us about your product')).toBeVisible()

    // Fill form
    await page.fill('input[placeholder*="leather wallets"]', 'I want to sell minimalist leather wallets')
    await page.selectOption('select', 'fashion')
    await page.fill('input[placeholder*="Men 25-45"]', 'Men 25-45, Urban professionals')
    await page.click('button:has-text("Continue")')

    // Wait for generation
    await expect(page.locator('text=Creating your business')).toBeVisible()
    await expect(page.locator('text=Your business is ready!')).toBeVisible({ timeout: 30000 })

    // Customize and launch
    await page.click('button:has-text("Launch Business")')
    await expect(page).toHaveURL('/dashboard/businesses')
  })
})
```

## Utility Function Tests

```typescript
// __tests__/utils/format.test.ts
import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatRelativeTime,
  slugify,
  truncate,
} from '@/lib/utils/format'

describe('Format Utilities', () => {
  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235')
      expect(formatCurrency(0)).toBe('$0')
    })

    it('handles large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000')
    })
  })

  describe('formatNumber', () => {
    it('formats thousands', () => {
      expect(formatNumber(1500)).toBe('1.5K')
    })

    it('formats millions', () => {
      expect(formatNumber(2500000)).toBe('2.5M')
    })

    it('returns small numbers as-is', () => {
      expect(formatNumber(500)).toBe('500')
    })
  })

  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Test & Example!')).toBe('test-example')
    })

    it('handles special characters', () => {
      expect(slugify('A/B Test')).toBe('a-b-test')
    })
  })

  describe('truncate', () => {
    it('truncates long text', () => {
      expect(truncate('This is a long text', 10)).toBe('This is a...')
    })

    it('does not truncate short text', () => {
      expect(truncate('Short', 10)).toBe('Short')
    })
  })
})
```

## Validation Tests

```typescript
// __tests__/utils/validation.test.ts
import { describe, it, expect } from 'vitest'
import {
  emailSchema,
  passwordSchema,
  validateCreditCard,
  sanitizeFilename,
} from '@/lib/utils/validation'

describe('Validation Utilities', () => {
  describe('emailSchema', () => {
    it('validates correct emails', () => {
      expect(emailSchema.safeParse('test@example.com').success).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(emailSchema.safeParse('invalid').success).toBe(false)
    })
  })

  describe('passwordSchema', () => {
    it('validates strong passwords', () => {
      expect(passwordSchema.safeParse('Password123!').success).toBe(true)
    })

    it('rejects weak passwords', () => {
      expect(passwordSchema.safeParse('weak').success).toBe(false)
      expect(passwordSchema.safeParse('weak123').success).toBe(false)
    })
  })

  describe('validateCreditCard', () => {
    it('validates correct card numbers', () => {
      // Test with valid Luhn algorithm number
      expect(validateCreditCard('4532015112830366')).toBe(true)
    })

    it('rejects invalid card numbers', () => {
      expect(validateCreditCard('1234567890123456')).toBe(false)
    })
  })

  describe('sanitizeFilename', () => {
    it('sanitizes filenames', () => {
      expect(sanitizeFilename('My File (2024).pdf')).toBe('my_file__2024_.pdf')
    })

    it('handles special characters', () => {
      expect(sanitizeFilename('test@file#name')).toBe('test_file_name')
    })
  })
})
```

## Running Tests

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @playwright/test

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

