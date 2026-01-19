'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { SignupSchema } from '@/lib/definitions';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function registerUser(formData: z.infer<typeof SignupSchema>) {
    const validatedFields = SignupSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { error: 'Invalid fields', details: validatedFields.error.flatten().fieldErrors };
    }

    const { fullName, email, password, mobileNumber } = validatedFields.data;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: 'User with this email already exists.' };
        }

        if (mobileNumber) {
            const existingPhone = await prisma.user.findUnique({
                where: { mobileNumber },
            });
            if (existingPhone) {
                return { error: 'User with this mobile number already exists.' };
            }
        }

        // Get USER role
        const userRole = await prisma.masterRole.findUnique({
            where: { roleName: 'USER' },
        });

        if (!userRole) {
            return { error: 'System error: Default role not found.' };
        }

        const hashedPassword = await hashPassword(password);

        await prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash: hashedPassword,
                mobileNumber: mobileNumber || null,
                roleId: userRole.id,
            },
        });

        return { success: 'Account created successfully!' };
    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Something went wrong. Please try again.' };
    }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }

    // Redirect on success
    redirect('/');
}
