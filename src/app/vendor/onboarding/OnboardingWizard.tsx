'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    updateVendorBasicInfo,
    updateVendorCategory,
    updateVendorLocation,
    updateVendorAmenities,
    updateVendorOccasions,
} from '@/app/actions/vendor';

type Category = {
    id: number;
    name: string;
    slug: string;
    subCategories: { id: number; name: string; slug: string }[];
};

type City = {
    id: number;
    name: string;
    slug: string;
    state: { name: string };
    regions: { id: number; name: string; areas: { id: number; name: string }[] }[];
};

type Amenity = { id: number; name: string };
type Occasion = { id: number; name: string; groupName: string | null };

type Props = {
    categories: Category[];
    cities: City[];
    amenities: Amenity[];
    occasions: Occasion[];
    existingProfile: any;
};

const STEPS = [
    { id: 1, name: 'Business Info' },
    { id: 2, name: 'Category' },
    { id: 3, name: 'Location' },
    { id: 4, name: 'Features' },
    { id: 5, name: 'Review' },
];

export default function OnboardingWizard({ categories, cities, amenities, occasions, existingProfile }: Props) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [businessName, setBusinessName] = useState(existingProfile?.businessName || '');
    const [categoryId, setCategoryId] = useState<number | null>(existingProfile?.categoryId || null);
    const [subCategoryId, setSubCategoryId] = useState<number | null>(existingProfile?.subCategoryId || null);
    const [cityId, setCityId] = useState<number | null>(existingProfile?.cityId || null);
    const [areaId, setAreaId] = useState<number | null>(existingProfile?.areaId || null);
    const [regionId, setRegionId] = useState<number | null>(null);
    const [landmark, setLandmark] = useState(existingProfile?.landmark || '');
    const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
        existingProfile?.amenities?.map((a: any) => a.amenity.id) || []
    );
    const [selectedOccasions, setSelectedOccasions] = useState<number[]>(
        existingProfile?.occasions?.map((o: any) => o.occasion.id) || []
    );

    const selectedCategory = categories.find(c => c.id === categoryId);
    const selectedCity = cities.find(c => c.id === cityId);

    const handleNext = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            if (currentStep === 1) {
                if (!businessName.trim()) {
                    setError('Please enter your business name.');
                    setIsSubmitting(false);
                    return;
                }
                const result = await updateVendorBasicInfo({ businessName });
                if (result.error) {
                    setError(result.error);
                    setIsSubmitting(false);
                    return;
                }
            } else if (currentStep === 2) {
                if (!categoryId) {
                    setError('Please select a category.');
                    setIsSubmitting(false);
                    return;
                }
                const result = await updateVendorCategory({ categoryId, subCategoryId: subCategoryId || undefined });
                if (result.error) {
                    setError(result.error);
                    setIsSubmitting(false);
                    return;
                }
            } else if (currentStep === 3) {
                if (!cityId) {
                    setError('Please select a city.');
                    setIsSubmitting(false);
                    return;
                }
                const result = await updateVendorLocation({ cityId, areaId: areaId || undefined, landmark: landmark || undefined });
                if (result.error) {
                    setError(result.error);
                    setIsSubmitting(false);
                    return;
                }
            } else if (currentStep === 4) {
                await updateVendorAmenities(selectedAmenities);
                await updateVendorOccasions(selectedOccasions);
            } else if (currentStep === 5) {
                // Use client-side navigation to avoid redirect throwing error
                router.push('/vendor/dashboard');
                return;
            }

            setCurrentStep(prev => Math.min(prev + 1, 5));
        } catch (e) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        setError('');
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Progress */}
            <div className="border-b bg-white px-6 py-4">
                <div className="mx-auto max-w-4xl">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${currentStep >= step.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {currentStep > step.id ? '✓' : step.id}
                                </div>
                                <span className={`ml-2 hidden text-sm sm:block ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {step.name}
                                </span>
                                {index < STEPS.length - 1 && (
                                    <div className={`mx-4 h-0.5 w-8 sm:w-16 ${currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="mx-auto max-w-2xl px-6 py-12">
                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* Step 1: Business Info */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">What's your business name?</h2>
                            <p className="mt-2 text-gray-600">This is how customers will find you.</p>
                        </div>
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                                Business Name
                            </label>
                            <input
                                id="businessName"
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-purple-500"
                                placeholder="e.g., Royal Banquet Hall"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Category */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">What type of service do you offer?</h2>
                            <p className="mt-2 text-gray-600">Select the category that best describes your business.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => {
                                        setCategoryId(category.id);
                                        setSubCategoryId(null);
                                    }}
                                    className={`rounded-lg border-2 p-4 text-left transition ${categoryId === category.id
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                >
                                    <span className="font-medium text-gray-900">{category.name}</span>
                                </button>
                            ))}
                        </div>

                        {selectedCategory && selectedCategory.subCategories.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sub-Category (Optional)</label>
                                <select
                                    value={subCategoryId || ''}
                                    onChange={(e) => setSubCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                                >
                                    <option value="">Select Sub-Category</option>
                                    {selectedCategory.subCategories.map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Location */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Where is your business located?</h2>
                            <p className="mt-2 text-gray-600">Customers will search for vendors in their city.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <select
                                value={cityId || ''}
                                onChange={(e) => {
                                    setCityId(e.target.value ? parseInt(e.target.value) : null);
                                    setAreaId(null);
                                }}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}, {city.state.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedCity && selectedCity.regions.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Region (Optional)</label>
                                <select
                                    value={regionId || ''}
                                    onChange={(e) => {
                                        setRegionId(e.target.value ? parseInt(e.target.value) : null);
                                        setAreaId(null); // Reset area when region changes
                                    }}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                                >
                                    <option value="">Select Region</option>
                                    {selectedCity.regions.map((region) => (
                                        <option key={region.id} value={region.id}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {regionId && selectedCity && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Area (Optional)</label>
                                <select
                                    value={areaId || ''}
                                    onChange={(e) => setAreaId(e.target.value ? parseInt(e.target.value) : null)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                                >
                                    <option value="">Select Area</option>
                                    {selectedCity.regions
                                        .find((r) => r.id === regionId)
                                        ?.areas.map((area) => (
                                            <option key={area.id} value={area.id}>
                                                {area.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}

                        {/* Landmark Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Landmark / Address (Optional)
                            </label>
                            <input
                                type="text"
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                                placeholder="e.g., Near City Mall, MG Road"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Help customers find your location easily
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 4: Features */}
                {currentStep === 4 && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">What do you offer?</h2>
                            <p className="mt-2 text-gray-600">Select all that apply to your business.</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900">Amenities</h3>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {amenities.map((amenity) => (
                                    <button
                                        key={amenity.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAmenities(prev =>
                                                prev.includes(amenity.id)
                                                    ? prev.filter(id => id !== amenity.id)
                                                    : [...prev, amenity.id]
                                            );
                                        }}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedAmenities.includes(amenity.id)
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {amenity.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900">Occasions</h3>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {occasions.map((occasion) => (
                                    <button
                                        key={occasion.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedOccasions(prev =>
                                                prev.includes(occasion.id)
                                                    ? prev.filter(id => id !== occasion.id)
                                                    : [...prev, occasion.id]
                                            );
                                        }}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedOccasions.includes(occasion.id)
                                            ? 'bg-pink-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {occasion.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Review */}
                {currentStep === 5 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Review Your Profile</h2>
                            <p className="mt-2 text-gray-600">Make sure everything looks good before going live.</p>
                        </div>

                        <div className="rounded-lg border bg-white p-6 space-y-4">
                            <div>
                                <span className="text-sm text-gray-500">Business Name</span>
                                <p className="font-medium text-gray-900">{businessName || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Category</span>
                                <p className="font-medium text-gray-900">
                                    {selectedCategory?.name || '-'}
                                    {subCategoryId && selectedCategory?.subCategories.find(s => s.id === subCategoryId)?.name && (
                                        <span className="text-gray-500"> → {selectedCategory?.subCategories.find(s => s.id === subCategoryId)?.name}</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Location</span>
                                <p className="font-medium text-gray-900">
                                    {selectedCity ? `${selectedCity.name}, ${selectedCity.state.name}` : '-'}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Amenities</span>
                                <p className="font-medium text-gray-900">
                                    {selectedAmenities.length > 0
                                        ? amenities.filter(a => selectedAmenities.includes(a.id)).map(a => a.name).join(', ')
                                        : '-'}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Occasions</span>
                                <p className="font-medium text-gray-900">
                                    {selectedOccasions.length > 0
                                        ? occasions.filter(o => selectedOccasions.includes(o.id)).map(o => o.name).join(', ')
                                        : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-10 flex justify-between">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-500 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : currentStep === 5 ? 'Complete Setup' : 'Continue'}
                    </button>
                </div>
            </main>
        </div>
    );
}
