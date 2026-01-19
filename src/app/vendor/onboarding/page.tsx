import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getCategories, getCities, getAmenities, getOccasions, getVendorProfile } from '@/lib/data';
import OnboardingWizard from './OnboardingWizard';

export default async function OnboardingPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const userId = parseInt(session.user.id);

    // Check if user has a vendor profile
    const existingProfile = await getVendorProfile(userId);

    if (!existingProfile) {
        // Not a vendor yet, redirect to become-vendor page
        redirect('/become-vendor');
    }

    // Fetch all master data for the wizard
    const [categories, cities, amenities, occasions] = await Promise.all([
        getCategories(),
        getCities(),
        getAmenities(),
        getOccasions(),
    ]);

    return (
        <OnboardingWizard
            categories={categories}
            cities={cities}
            amenities={amenities}
            occasions={occasions}
            existingProfile={existingProfile}
        />
    );
}
