import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address')

export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')

export const urlSchema = z.string().url('Invalid URL')

export function validateCreditCard(number: string): boolean {
    // Luhn algorithm
    const digits = number.replace(/\D/g, '')
    let sum = 0
    let isEven = false

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i])

        if (isEven) {
            digit *= 2
            if (digit > 9) digit -= 9
        }

        sum += digit
        isEven = !isEven
    }

    return sum % 10 === 0
}

export function sanitizeFilename(filename: string): string {
    return filename
        .replace(/[^a-z0-9.-]/gi, '_')
        .toLowerCase()
}
