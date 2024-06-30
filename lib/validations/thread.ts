import * as z from 'zod';

export const Threadvalidation = z.object({
    thread: z.string().nonempty().min(3, { message: 'Thread must be at least 3 characters long' }),
    accountId: z.string(),
})

export const Commentvalidation = z.object({
    thread: z.string().nonempty().min(3, { message: 'Thread must be at least 3 characters long' }),
})