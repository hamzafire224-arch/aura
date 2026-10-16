export class AppError extends Error {
    public code: string
    public statusCode: number
    public userMessage?: string

    constructor(
        message: string,
        code: string,
        statusCode: number = 500,
        userMessage?: string
    ) {
        super(message)
        this.name = 'AppError'
        this.code = code
        this.statusCode = statusCode
        this.userMessage = userMessage
    }
}

export const ErrorCodes = {
    // Auth
    UNAUTHORIZED: 'UNAUTHORIZED',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

    // Subscription
    SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
    PLAN_LIMIT_REACHED: 'PLAN_LIMIT_REACHED',

    // AI
    AI_GENERATION_FAILED: 'AI_GENERATION_FAILED',
    INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

    // General
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR'
}

export function handleError(error: unknown) {
    if (error instanceof AppError) {
        return {
            error: error.userMessage || error.message,
            code: error.code,
            statusCode: error.statusCode
        }
    }

    console.error('[UNHANDLED_ERROR]', error)

    return {
        error: 'Something went wrong',
        code: ErrorCodes.SERVER_ERROR,
        statusCode: 500
    }
}

// User-friendly messages
export const ErrorMessages = {
    [ErrorCodes.INSUFFICIENT_CREDITS]: {
        title: "You're out of credits!",
        message: "Upgrade to Pro for 500 credits/month",
        action: "Upgrade Now"
    },
    [ErrorCodes.PLAN_LIMIT_REACHED]: {
        title: "Plan limit reached",
        message: "You've reached max businesses for your plan",
        action: "Upgrade Plan"
    }
}
