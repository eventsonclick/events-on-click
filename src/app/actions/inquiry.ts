'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getInquiryNotificationEmail, sendEmail } from '@/lib/email';

const InquirySchema = z.object({
    vendorId: z.number(),
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional().nullable(),
    eventDate: z.string().optional().nullable(),
    occasionId: z.number().optional().nullable(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitInquiry(data: any) {
    console.log('Inquiry data received:', JSON.stringify(data, null, 2));

    const validation = InquirySchema.safeParse(data);

    if (!validation.success) {
        console.error('Validation errors:', JSON.stringify(validation.error.flatten(), null, 2));
        return { error: 'Invalid data', details: validation.error.flatten().fieldErrors };
    }

    const { vendorId, name, email, phone, eventDate, occasionId, message } = validation.data;

    try {
        // Get current user if logged in
        const session = await auth();
        const userId = session?.user?.id ? parseInt(session.user.id) : null;

        // Get vendor info for email notification
        const vendor = await prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            include: {
                user: { select: { email: true } },
            },
        });

        // Get occasion name if provided
        const occasion = occasionId
            ? await prisma.masterOccasion.findUnique({ where: { id: occasionId } })
            : null;

        await prisma.inquiry.create({
            data: {
                vendorId,
                userId,
                eventDate: eventDate ? new Date(eventDate) : null,
                occasionId: occasionId || null,
                message: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\n${message}`,
                status: 'NEW',
            },
        });

        // Send email notification to vendor
        if (vendor?.user?.email) {
            const emailTemplate = getInquiryNotificationEmail({
                vendorName: vendor.businessName || 'Vendor',
                customerName: name,
                customerEmail: email,
                occasion: occasion?.name || 'General Inquiry',
                eventDate: eventDate || null,
                message: message,
            });
            emailTemplate.to = vendor.user.email;
            await sendEmail(emailTemplate);
        }

        revalidatePath(`/vendors`);
        return { success: 'Inquiry sent successfully! The vendor will contact you soon.' };
    } catch (error) {
        console.error('Submit inquiry error:', error);
        return { error: 'Failed to send inquiry. Please try again.' };
    }
}

// Update inquiry status
export async function updateInquiryStatus(inquiryId: number, status: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'You must be logged in.' };
    }

    const userId = parseInt(session.user.id);

    try {
        // Get vendor profile
        const profile = await prisma.vendorProfile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return { error: 'Vendor profile not found.' };
        }

        // Verify inquiry belongs to this vendor
        const inquiry = await prisma.inquiry.findFirst({
            where: { id: inquiryId, vendorId: profile.id },
        });

        if (!inquiry) {
            return { error: 'Inquiry not found.' };
        }

        await prisma.inquiry.update({
            where: { id: inquiryId },
            data: { status },
        });

        revalidatePath('/vendor/inquiries');
        return { success: true };
    } catch (error) {
        console.error('Update inquiry status error:', error);
        return { error: 'Failed to update. Please try again.' };
    }
}

