import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getVendorProfile } from '@/lib/data';
import GalleryManager from './GalleryManager';

export default async function VendorGalleryPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const userId = parseInt(session.user.id);
    const profile = await getVendorProfile(userId);

    if (!profile) {
        redirect('/become-vendor');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
                        <p className="mt-1 text-gray-500">
                            Manage your photos and videos. {profile.gallery.length} items.
                        </p>
                    </div>
                </div>

                <GalleryManager gallery={profile.gallery} />
            </div>
        </div>
    );
}
