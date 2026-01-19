'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Add image to gallery
export async function uploadGalleryImage(data: {
    mediaUrl: string;
    mediaType?: string;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'You must be logged in.' };
    }

    const userId = parseInt(session.user.id);

    try {
        const profile = await prisma.vendorProfile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return { error: 'Vendor profile not found.' };
        }

        // Check if this is the first image (make it cover)
        const existingImages = await prisma.vendorGallery.count({
            where: { vendorId: profile.id },
        });

        await prisma.vendorGallery.create({
            data: {
                vendorId: profile.id,
                mediaUrl: data.mediaUrl,
                mediaType: data.mediaType || 'image',
                isCoverImage: existingImages === 0, // First image is cover
            },
        });

        revalidatePath('/vendor/gallery');
        revalidatePath('/vendor/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Upload gallery image error:', error);
        return { error: 'Failed to upload. Please try again.' };
    }
}

// Delete image from gallery
export async function deleteGalleryImage(imageId: number) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'You must be logged in.' };
    }

    const userId = parseInt(session.user.id);

    try {
        const profile = await prisma.vendorProfile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return { error: 'Vendor profile not found.' };
        }

        // Verify the image belongs to this vendor
        const image = await prisma.vendorGallery.findFirst({
            where: { id: imageId, vendorId: profile.id },
        });

        if (!image) {
            return { error: 'Image not found.' };
        }

        await prisma.vendorGallery.delete({
            where: { id: imageId },
        });

        // If deleted image was cover, set another as cover
        if (image.isCoverImage) {
            const firstImage = await prisma.vendorGallery.findFirst({
                where: { vendorId: profile.id },
                orderBy: { createdAt: 'asc' },
            });

            if (firstImage) {
                await prisma.vendorGallery.update({
                    where: { id: firstImage.id },
                    data: { isCoverImage: true },
                });
            }
        }

        revalidatePath('/vendor/gallery');
        revalidatePath('/vendor/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Delete gallery image error:', error);
        return { error: 'Failed to delete. Please try again.' };
    }
}

// Set image as cover
export async function setCoverImage(imageId: number) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'You must be logged in.' };
    }

    const userId = parseInt(session.user.id);

    try {
        const profile = await prisma.vendorProfile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return { error: 'Vendor profile not found.' };
        }

        // Verify the image belongs to this vendor
        const image = await prisma.vendorGallery.findFirst({
            where: { id: imageId, vendorId: profile.id },
        });

        if (!image) {
            return { error: 'Image not found.' };
        }

        // Remove cover from all, then set this one
        await prisma.$transaction([
            prisma.vendorGallery.updateMany({
                where: { vendorId: profile.id },
                data: { isCoverImage: false },
            }),
            prisma.vendorGallery.update({
                where: { id: imageId },
                data: { isCoverImage: true },
            }),
        ]);

        revalidatePath('/vendor/gallery');
        revalidatePath('/vendor/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Set cover image error:', error);
        return { error: 'Failed to update. Please try again.' };
    }
}
