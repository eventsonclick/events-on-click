'use server';

import { prisma } from '@/lib/prisma';

// Categories with sub-categories
export async function getCategories() {
    return await prisma.masterCategory.findMany({
        include: {
            subCategories: true,
        },
        orderBy: { name: 'asc' },
    });
}

// Cities with states
export async function getCities() {
    return await prisma.masterCity.findMany({
        include: {
            state: {
                include: {
                    country: true,
                },
            },
            regions: {
                include: {
                    areas: true,
                },
            },
        },
        orderBy: { name: 'asc' },
    });
}

// All amenities
export async function getAmenities() {
    return await prisma.masterAmenity.findMany({
        orderBy: { name: 'asc' },
    });
}

// All occasions
export async function getOccasions() {
    return await prisma.masterOccasion.findMany({
        orderBy: { name: 'asc' },
    });
}

// Get vendor profile by user ID
export async function getVendorProfile(userId: number) {
    return await prisma.vendorProfile.findUnique({
        where: { userId },
        include: {
            category: true,
            subCategory: true,
            city: {
                include: {
                    state: true,
                },
            },
            area: true,
            amenities: {
                include: {
                    amenity: true,
                },
            },
            occasions: {
                include: {
                    occasion: true,
                },
            },
            gallery: true,
            socialLinks: true,
            openingHours: true,
        },
    });
}

// Get vendor profile by profile ID
export async function getVendorProfileById(profileId: number) {
    return await prisma.vendorProfile.findUnique({
        where: { id: profileId },
        include: {
            user: {
                select: {
                    fullName: true,
                    email: true,
                    mobileNumber: true,
                },
            },
            category: true,
            subCategory: true,
            city: {
                include: {
                    state: true,
                },
            },
            area: true,
            amenities: {
                include: {
                    amenity: true,
                },
            },
            occasions: {
                include: {
                    occasion: true,
                },
            },
            gallery: true,
            reviews: {
                where: { isPublished: true },
                include: {
                    user: {
                        select: {
                            fullName: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
        },
    });
}

// Filters type for vendor search
export type VendorFilters = {
    citySlug?: string;
    categorySlug?: string;
    search?: string;
    amenityIds?: number[];
    occasionIds?: number[];
    page?: number;
    pageSize?: number;
};

// Get list of vendors with filters
export async function getVendors(filters: VendorFilters = {}) {
    const { citySlug, categorySlug, search, amenityIds, occasionIds, page = 1, pageSize = 12 } = filters;

    const where: any = {
        isDeleted: false,
        isVerified: true, // Only show verified vendors
        businessName: { not: null },
        categoryId: { not: null },
        cityId: { not: null },
    };

    // Filter by city
    if (citySlug) {
        where.city = { slug: citySlug };
    }

    // Filter by category
    if (categorySlug) {
        where.category = { slug: categorySlug };
    }

    // Filter by search query (business name)
    if (search) {
        where.businessName = { contains: search, mode: 'insensitive' };
    }

    // Filter by amenities (vendor must have ALL specified amenities)
    if (amenityIds && amenityIds.length > 0) {
        where.amenities = {
            some: {
                amenityId: { in: amenityIds },
            },
        };
    }

    // Filter by occasions
    if (occasionIds && occasionIds.length > 0) {
        where.occasions = {
            some: {
                occasionId: { in: occasionIds },
            },
        };
    }

    const [vendors, total] = await Promise.all([
        prisma.vendorProfile.findMany({
            where,
            include: {
                category: true,
                subCategory: true,
                city: {
                    include: {
                        state: true,
                    },
                },
                area: {
                    include: {
                        region: true,
                    },
                },
                gallery: {
                    take: 1,
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: [
                { isVerified: 'desc' },
                { avgRating: 'desc' },
                { createdAt: 'desc' },
            ],
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.vendorProfile.count({ where }),
    ]);

    return {
        vendors,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

// Get vendor by slug or ID for public profile
export async function getVendorBySlug(slugOrId: string) {
    // First try to find by slug
    let vendor = await prisma.vendorProfile.findFirst({
        where: { slug: slugOrId },
        include: {
            user: {
                select: {
                    fullName: true,
                    email: true,
                    mobileNumber: true,
                },
            },
            category: true,
            subCategory: true,
            city: {
                include: {
                    state: true,
                },
            },
            area: true,
            amenities: {
                include: {
                    amenity: true,
                },
            },
            occasions: {
                include: {
                    occasion: true,
                },
            },
            gallery: {
                orderBy: { createdAt: 'asc' },
            },
            socialLinks: true,
            openingHours: {
                orderBy: { dayOfWeek: 'asc' },
            },
            reviews: {
                where: { isPublished: true },
                include: {
                    user: {
                        select: {
                            fullName: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 20,
            },
        },
    });

    // If not found by slug, try by ID (for vendors without slugs yet)
    if (!vendor && !isNaN(parseInt(slugOrId))) {
        vendor = await prisma.vendorProfile.findUnique({
            where: { id: parseInt(slugOrId) },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                        mobileNumber: true,
                    },
                },
                category: true,
                subCategory: true,
                city: {
                    include: {
                        state: true,
                    },
                },
                area: true,
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
                occasions: {
                    include: {
                        occasion: true,
                    },
                },
                gallery: {
                    orderBy: { createdAt: 'asc' },
                },
                socialLinks: true,
                openingHours: {
                    orderBy: { dayOfWeek: 'asc' },
                },
                reviews: {
                    where: { isPublished: true },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
            },
        });
    }

    return vendor;
}

// Get vendor inquiries
export async function getVendorInquiries(vendorId: number, status?: string) {
    const where: any = { vendorId };

    if (status && status !== 'all') {
        where.status = status;
    }

    return await prisma.inquiry.findMany({
        where,
        include: {
            user: {
                select: {
                    fullName: true,
                    email: true,
                    mobileNumber: true,
                },
            },
            occasion: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}
