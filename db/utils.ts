export async function withRetry<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 1000
): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === retries - 1) throw error;
            console.warn(`Database operation failed, attempt ${i + 1} of ${retries}:`, error);
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
        }
    }
    throw new Error('Retry failed'); // TypeScript requires this
} 