'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getReviewNotificationEmail, sendEmail } from '@/lib/email';

const ReviewSchema = z.object({
    vendorId: z.number(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

export async function submitReview(data: z.infer<typeof ReviewSchema>) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'You must be logged in to leave a review.' };
    }

    const userId = parseInt(session.user.id);
    const validation = ReviewSchema.safeParse(data);

    if (!validation.success) {
        return { error: 'Invalid data' };
    }

    const { vendorId, rating, comment } = validation.data;

    try {
        // Check if user already reviewed this vendor
        const existingReview = await prisma.vendorReview.findFirst({
            where: { vendorId, userId },
        });

        if (existingReview) {
            return { error: 'You have already reviewed this vendor.' };
        }

        // Get vendor with user info for email notification
        const vendor = await prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            include: {
                user: { select: { email: true } },
            },
        });

        if (vendor?.userId === userId) {
            return { error: 'You cannot review your own business.' };
        }

        // Get reviewer name
        const reviewer = await prisma.user.findUnique({
            where: { id: userId },
            select: { fullName: true },
        });

        // Create review
        await prisma.vendorReview.create({
            data: {
                vendorId,
                userId,
                rating,
                reviewText: comment || null,
                isPublished: true, // Auto-publish for now
            },
        });

        // Update vendor's average rating
        const reviews = await prisma.vendorReview.findMany({
            where: { vendorId, isPublished: true },
            select: { rating: true },
        });

        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await prisma.vendorProfile.update({
            where: { id: vendorId },
            data: {
                avgRating,
                reviewCount: reviews.length,
            },
        });

        // Send email notification to vendor
        if (vendor?.user?.email) {
            const emailTemplate = getReviewNotificationEmail({
                vendorName: vendor.businessName || 'Vendor',
                reviewerName: reviewer?.fullName || 'A customer',
                rating: rating,
                comment: comment || null,
            });
            emailTemplate.to = vendor.user.email;
            await sendEmail(emailTemplate);
        }

        revalidatePath(`/vendors`);
        return { success: 'Review submitted successfully!' };
    } catch (error) {
        console.error('Submit review error:', error);
        return { error: 'Failed to submit review. Please try again.' };
    }
}
