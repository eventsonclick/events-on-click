'use client';

import { useState } from 'react';
import { uploadGalleryImage, deleteGalleryImage, setCoverImage } from '@/app/actions/gallery';

type GalleryImage = {
    id: number;
    mediaUrl: string | null;
    mediaType: string | null;
    isCoverImage: boolean;
    createdAt: Date;
};

type Props = {
    gallery: GalleryImage[];
};

export default function GalleryManager({ gallery }: Props) {
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleUpload = async () => {
        if (!imageUrl.trim()) {
            setError('Please enter an image URL');
            return;
        }

        setIsUploading(true);
        setError('');

        const result = await uploadGalleryImage({ mediaUrl: imageUrl });

        if (result.error) {
            setError(result.error);
        } else {
            setImageUrl('');
        }

        setIsUploading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setDeletingId(id);
        await deleteGalleryImage(id);
        setDeletingId(null);
    };

    const handleSetCover = async (id: number) => {
        await setCoverImage(id);
    };

    return (
        <div className="mt-8">
            {/* Upload Form */}
            <div className="rounded-xl border bg-white p-6">
                <h2 className="font-semibold text-gray-900">Add Image</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Enter an image URL to add it to your gallery.
                </p>

                {error && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="mt-4 flex gap-3">
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50"
                    >
                        {isUploading ? 'Adding...' : 'Add Image'}
                    </button>
                </div>
            </div>

            {/* Gallery Grid */}
            {gallery.length > 0 ? (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {gallery.map((image) => (
                        <div
                            key={image.id}
                            className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                        >
                            {image.mediaUrl ? (
                                <img
                                    src={image.mediaUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-4xl text-gray-300">
                                    📷
                                </div>
                            )}

                            {/* Cover Badge */}
                            {image.isCoverImage && (
                                <span className="absolute left-2 top-2 rounded-full bg-purple-600 px-2 py-1 text-xs font-medium text-white">
                                    Cover
                                </span>
                            )}

                            {/* Actions Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                                {!image.isCoverImage && (
                                    <button
                                        onClick={() => handleSetCover(image.id)}
                                        className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-100"
                                    >
                                        Set as Cover
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(image.id)}
                                    disabled={deletingId === image.id}
                                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
                                >
                                    {deletingId === image.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-8 rounded-xl border bg-white p-12 text-center">
                    <div className="text-6xl">📷</div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">No images yet</h3>
                    <p className="mt-2 text-gray-500">
                        Add images to showcase your business to customers.
                    </p>
                </div>
            )}
        </div>
    );
}
