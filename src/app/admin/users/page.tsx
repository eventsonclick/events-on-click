import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { deleteUser } from '@/app/actions/admin';

export default async function AdminUsersPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    // @ts-ignore
    const roleId = session?.user?.roleId;
    if (roleId !== 1) {
        redirect('/');
    }

    const users = await prisma.user.findMany({
        include: {
            role: true,
            vendorProfile: {
                select: { id: true, businessName: true },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
    });

    const currentUserId = parseInt(session.user.id);

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header Bar */}
            <header className="bg-stone-900 border-b border-stone-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <span className="text-stone-100 font-serif text-xl">
                        Admin<span className="text-stone-500 font-sans text-sm ml-2 tracking-widest uppercase">Users</span>
                    </span>
                    <Link href="/admin" className="text-xs text-gold-500 hover:text-gold-400 uppercase tracking-widest">
                        ← Dashboard
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-stone-900">User Management</h1>
                    <p className="mt-2 text-stone-500 font-light">{users.length} registered users</p>
                </div>

                <div className="bg-white border border-stone-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-stone-100">
                        <thead className="bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-stone-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-stone-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-stone-400 uppercase tracking-wider">Vendor Profile</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-stone-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold text-stone-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {users.map((user) => {
                                const isCurrentUser = user.id === currentUserId;
                                const isAdmin = user.role?.roleName === 'ADMIN';
                                const canDelete = !isCurrentUser && !isAdmin;

                                return (
                                    <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-serif text-stone-900">{user.fullName || 'No name'}</p>
                                                <p className="text-xs text-stone-400 mt-0.5">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-wider font-medium ${user.role?.roleName === 'ADMIN'
                                                    ? 'bg-red-50 text-red-700 border border-red-100'
                                                    : user.role?.roleName === 'VENDOR'
                                                        ? 'bg-gold-50 text-gold-700 border border-gold-100'
                                                        : 'bg-stone-100 text-stone-600'
                                                }`}>
                                                {user.role?.roleName || 'USER'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-stone-500 font-light">
                                            {user.vendorProfile?.businessName ? (
                                                <Link
                                                    href={`/vendors/${user.vendorProfile.id}`}
                                                    className="text-gold-600 hover:underline"
                                                >
                                                    {user.vendorProfile.businessName}
                                                </Link>
                                            ) : (
                                                <span className="text-stone-300">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-stone-500 font-light">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {canDelete ? (
                                                <form action={async () => {
                                                    'use server';
                                                    await deleteUser(user.id);
                                                }}>
                                                    <button
                                                        type="submit"
                                                        className="text-xs text-red-500 hover:text-red-700 uppercase tracking-wider font-medium transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </form>
                                            ) : (
                                                <span className="text-xs text-stone-300 uppercase tracking-wider">
                                                    {isCurrentUser ? 'You' : 'Protected'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="py-12 text-center text-stone-400">
                            No users found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
