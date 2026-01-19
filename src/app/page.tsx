import Link from 'next/link';
import { getCategories, getCities } from '@/lib/data';

export default async function Home() {
  const [categories, cities] = await Promise.all([
    getCategories(),
    getCities(),
  ]);

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section - Editorial Style */}
      <section className="relative px-6 py-24 text-center lg:py-32 bg-stone-50 overflow-hidden">
        <div className="relative mx-auto max-w-5xl z-10">
          <span className="text-sm font-medium tracking-[0.2em] text-stone-500 uppercase animate-fade-in">
            Est. 2024
          </span>
          <h1 className="mt-8 text-5xl font-serif text-stone-900 sm:text-7xl lg:text-8xl animate-fade-in delay-100 leading-tight">
            Curating <br />
            <span className="italic text-stone-700">Unforgettable</span> Moments
          </h1>
          <p className="mt-8 mx-auto max-w-lg text-lg text-stone-600 font-light animate-fade-in delay-200">
            Discover the finest photographers, venues, and creatives for your most cherished events.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row animate-fade-in delay-300">
            <Link
              href="/vendors"
              className="btn-elegant"
            >
              Explore Vendors
            </Link>
            <Link
              href="/become-vendor"
              className="btn-elegant-outline"
            >
              List Your Business
            </Link>
          </div>
        </div>

        {/* Decorative Background Text (Subtle) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-serif text-stone-100 pointer-events-none opacity-50 z-0 select-none">
          Events
        </div>
      </section>

      {/* Curated Categories */}
      <section className="px-6 py-24 container-wide">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-stone-200 pb-6">
          <div>
            <h2 className="text-3xl font-serif text-stone-900">Curated Collections</h2>
            <p className="mt-2 text-stone-500">Hand-picked categories for your needs</p>
          </div>
          <Link href="/vendors" className="text-sm font-medium uppercase tracking-wider text-stone-900 hover:text-gold-600 transition-colors mt-4 md:mt-0">
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((category, idx) => (
            <Link
              key={category.id}
              href={`/vendors?category=${category.slug}`}
              className="group relative h-96 block overflow-hidden bg-stone-100"
            >
              {/* Placeholder for Category Image */}
              <div className="absolute inset-0 bg-stone-200 transition-transform duration-700 group-hover:scale-105" />

              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-linear-to-t from-black/20 to-transparent">
                <span className="text-xs text-white/80 uppercase tracking-widest mb-2">0{idx + 1}</span>
                <h3 className="text-2xl font-serif text-white italic group-hover:translate-x-2 transition-transform duration-300">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us - Minimal */}
      <section className="bg-stone-900 text-stone-100 px-6 py-24">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-24 border-t border-stone-800 pt-16">
            <div>
              <span className="text-2xl font-serif italic text-gold-400">01.</span>
              <h3 className="text-xl font-serif mt-4 mb-2">Verified Excellence</h3>
              <p className="text-stone-400 font-light leading-relaxed">
                Every vendor in our directory is vetted for quality, reliability, and style. We ensure only the best make the cut.
              </p>
            </div>
            <div>
              <span className="text-2xl font-serif italic text-gold-400">02.</span>
              <h3 className="text-xl font-serif mt-4 mb-2">Seamless Connection</h3>
              <p className="text-stone-400 font-light leading-relaxed">
                Connect directly with artists and venues. No middlemen, just pure creative collaboration for your event.
              </p>
            </div>
            <div>
              <span className="text-2xl font-serif italic text-gold-400">03.</span>
              <h3 className="text-xl font-serif mt-4 mb-2">Trusted Reviews</h3>
              <p className="text-stone-400 font-light leading-relaxed">
                Read authentic stories from real couples and planners. Transparency is the foundation of our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* City Links - Simple List */}
      <section className="px-6 py-24 container-wide border-b border-stone-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-stone-900">Popular Destinations</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/vendors?city=${city.slug}`}
              className="text-lg text-stone-600 hover:text-stone-900 hover:italic transition-all"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="px-6 py-32 text-center bg-white">
        <h2 className="text-4xl font-serif text-stone-900 mb-6">Ready to create magic?</h2>
        <div className="flex justify-center gap-6">
          <Link href="/vendors" className="text-sm font-medium uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-all">
            Find Vendors
          </Link>
          <Link href="/become-vendor" className="text-sm font-medium uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-all">
            Join as Vendor
          </Link>
        </div>
      </section>

      {/* Footer - Clean */}
      <footer className="bg-stone-50 px-6 py-12 border-t border-stone-200">
        <div className="container-wide flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-xl tracking-tight text-stone-900">
            Events<span className="italic text-stone-500">OnClick</span>
          </div>
          <div className="text-xs text-stone-400 uppercase tracking-widest">
            © 2024 EventsOnClick. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="font-serif text-stone-500 hover:text-stone-900 italic">Instagram</Link>
            <Link href="#" className="font-serif text-stone-500 hover:text-stone-900 italic">Pinterest</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
