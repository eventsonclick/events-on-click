import { z } from 'zod';

export const SignupSchema = z.object({
    fullName: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
    mobileNumber: z.string().regex(/^\d{10}$/, { message: 'Mobile number must be 10 digits.' }).optional().or(z.literal('')),
});

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
});
