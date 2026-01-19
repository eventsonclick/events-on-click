'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Helper to verify admin access
async function verifyAdmin() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized: Not logged in', isAdmin: false };
    }

    // @ts-ignore - roleId is added in session callback
    const roleId = session?.user?.roleId;
    if (roleId !== 1) {
        return { error: 'Unauthorized: Admin access required', isAdmin: false };
    }

    return { isAdmin: true, userId: parseInt(session.user.id) };
}

// Delete a user (soft delete or hard delete based on preference)
export async function deleteUser(userId: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { error: adminCheck.error };
    }

    // Prevent admin from deleting themselves
    if (adminCheck.userId === userId) {
        return { error: 'You cannot delete your own account.' };
    }

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true },
        });

        if (!user) {
            return { error: 'User not found.' };
        }

        // Prevent deleting other admins (optional safety)
        if (user.role?.roleName === 'ADMIN') {
            return { error: 'Cannot delete admin users.' };
        }

        // Delete related data in correct order (respecting foreign key constraints)
        await prisma.$transaction([
            // Delete vendor-related data if exists
            prisma.vendorGallery.deleteMany({ where: { vendor: { userId } } }),
            prisma.vendorAmenityMapping.deleteMany({ where: { vendor: { userId } } }),
            prisma.vendorOccasionMapping.deleteMany({ where: { vendor: { userId } } }),
            prisma.vendorSocialLink.deleteMany({ where: { vendor: { userId } } }),
            prisma.vendorOpeningHours.deleteMany({ where: { vendor: { userId } } }),
            prisma.inquiry.deleteMany({ where: { vendor: { userId } } }),
            prisma.vendorReview.deleteMany({ where: { vendor: { userId } } }),
            prisma.vendorProfile.deleteMany({ where: { userId } }),

            // Delete user's own reviews
            prisma.vendorReview.deleteMany({ where: { userId } }),

            // Finally delete the user
            prisma.user.delete({ where: { id: userId } }),
        ]);

        revalidatePath('/admin/users');
        return { success: 'User deleted successfully.' };
    } catch (error) {
        console.error('Delete user error:', error);
        return { error: 'Failed to delete user. Please try again.' };
    }
}

// Update user role
export async function updateUserRole(userId: number, newRoleId: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { error: adminCheck.error };
    }

    // Prevent changing own role
    if (adminCheck.userId === userId) {
        return { error: 'You cannot change your own role.' };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { roleId: newRoleId },
        });

        revalidatePath('/admin/users');
        return { success: 'User role updated successfully.' };
    } catch (error) {
        console.error('Update user role error:', error);
        return { error: 'Failed to update user role.' };
    }
}

// Delete a review
export async function deleteReview(reviewId: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { error: adminCheck.error };
    }

    try {
        // Get the review to update vendor stats
        const review = await prisma.vendorReview.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            return { error: 'Review not found.' };
        }

        // Delete the review
        await prisma.vendorReview.delete({
            where: { id: reviewId },
        });

        // Update vendor's average rating and review count
        const vendorStats = await prisma.vendorReview.aggregate({
            where: { vendorId: review.vendorId, isPublished: true },
            _avg: { rating: true },
            _count: { id: true },
        });

        await prisma.vendorProfile.update({
            where: { id: review.vendorId },
            data: {
                avgRating: vendorStats._avg.rating || 0,
                reviewCount: vendorStats._count.id || 0,
            },
        });

        revalidatePath('/admin/reviews');
        return { success: 'Review deleted successfully.' };
    } catch (error) {
        console.error('Delete review error:', error);
        return { error: 'Failed to delete review.' };
    }
}
