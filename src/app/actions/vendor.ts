'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Upgrade user to VENDOR role and create empty VendorProfile
export async function becomeVendor() {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'You must be logged in.' };
    }

    const userId = parseInt(session.user.id);

    try {
        // Check if already a vendor
        const existingProfile = await prisma.vendorProfile.findUnique({
            where: { userId },
        });

        if (existingProfile) {
            return { error: 'You are already registered as a vendor.' };
        }

        // Get VENDOR role
        const vendorRole = await prisma.masterRole.findUnique({
            where: { roleName: 'VENDOR' },
        });

        if (!vendorRole) {
            return { error: 'System error: Vendor role not found.' };
        }

        // Update user role and create vendor profile in a transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { roleId: vendorRole.id },
            }),
            prisma.vendorProfile.create({
                data: {
                    userId,
                },
            }),
        ]);

        revalidatePath('/');
    } catch (error) {
        console.error('Become vendor error:', error);
        return { error: 'Something went wrong. Please try again.' };
    }

    redirect('/vendor/onboarding');
}

// Generate a unique slug from business name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Update basic business info
export async function updateVendorBasicInfo(data: {
    businessName: string;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'You must be logged in.' };
    }

    const userId = parseInt(session.user.id);

    try {
        // Generate a unique slug
        let baseSlug = generateSlug(data.businessName);
        let slug = baseSlug;
        let counter = 1;

        // Check for existing slugs and make unique
        while (true) {
            const existing = await prisma.vendorProfile.findUnique({
                where: { slug },
            });
            if (!existing || existing.userId === userId) break;
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        await prisma.vendorProfile.update({
            where: { userId },
            data: {
                businessName: data.businessName,
                slug,
            },
        });

        revalidatePath('/vendor/onboarding');
        return { success: true };
    } catch (error) {
        console.error('Update vendor basic info error:', error);
        return { error: 'Failed to update. Please try again.' };
    }
}

// Update category
export async function updateVendorCategory(data: {
    categoryId: number;
    subCategoryId?: number;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'You must be logged in.' };
    }

    const userId = parseInt(session.user.id);

    try {
        await prisma.vendorProfile.update({
            where: { userId },
            data: {
                categoryId: data.categoryId,
                subCategoryId: data.subCategoryId || null,
            },
        });

        revalidatePath('/vendor/onboarding');
        return { success: true };
    } catch (error) {
        console.error('Update vendor category error:', error);
        return { error: 'Failed to update. Please try again.' };
    }
}

// Update location
export async function updateVendorLocation(data: {
    cityId: number;
    areaId?: number;
    landmark?: string;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'You must be logged in.' };
    }

    const userId = parseInt(session.user.id);

    try {
        await prisma.vendorProfile.update({
            where: { userId },
            data: {
                cityId: data.cityId,
                areaId: data.areaId || null,
                landmark: data.landmark || null,
            },
        });

        revalidatePath('/vendor/onboarding');
        return { success: true };
    } catch (error) {
        console.error('Update vendor location error:', error);
        return { error: 'Failed to update. Please try again.' };
    }
}

// Update amenities (replace all)
export async function updateVendorAmenities(amenityIds: number[]) {
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

        // Delete existing and create new mappings
        await prisma.$transaction([
            prisma.vendorAmenityMapping.deleteMany({
                where: { vendorId: profile.id },
            }),
            prisma.vendorAmenityMapping.createMany({
                data: amenityIds.map((amenityId) => ({
                    vendorId: profile.id,
                    amenityId,
                })),
            }),
        ]);

        revalidatePath('/vendor/onboarding');
        return { success: true };
    } catch (error) {
        console.error('Update vendor amenities error:', error);
        return { error: 'Failed to update. Please try again.' };
    }
}

// Update occasions (replace all)
export async function updateVendorOccasions(occasionIds: number[]) {
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

        // Delete existing and create new mappings
        await prisma.$transaction([
            prisma.vendorOccasionMapping.deleteMany({
                where: { vendorId: profile.id },
            }),
            prisma.vendorOccasionMapping.createMany({
                data: occasionIds.map((occasionId) => ({
                    vendorId: profile.id,
                    occasionId,
                })),
            }),
        ]);

        revalidatePath('/vendor/onboarding');
        return { success: true };
    } catch (error) {
        console.error('Update vendor occasions error:', error);
        return { error: 'Failed to update. Please try again.' };
    }
}

// Complete onboarding
export async function completeOnboarding() {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'You must be logged in.' };
    }

    // Just redirect to dashboard - profile is already saved incrementally
    redirect('/vendor/dashboard');
}
