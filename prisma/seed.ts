import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting Seeding...')

    // 1. Roles
    const admin = await prisma.masterRole.upsert({
        where: { roleName: 'ADMIN' },
        update: {},
        create: { roleName: 'ADMIN', description: 'System Administrator' }
    })
    const vendor = await prisma.masterRole.upsert({
        where: { roleName: 'VENDOR' },
        update: {},
        create: { roleName: 'VENDOR', description: 'Business Owner' }
    })
    const userRole = await prisma.masterRole.upsert({
        where: { roleName: 'USER' },
        update: {},
        create: { roleName: 'USER', description: 'Customer' }
    })

    // 2. Geography (India -> Karnataka -> Bangalore)
    const india = await prisma.masterCountry.upsert({
        where: { slug: 'india' },
        update: {},
        create: { name: 'India', slug: 'india' }
    })

    const karnataka = await prisma.masterState.upsert({
        where: { slug: 'karnataka' },
        update: {},
        create: { name: 'Karnataka', slug: 'karnataka', countryId: india.id }
    })

    const bangalore = await prisma.masterCity.upsert({
        where: { slug: 'bangalore' },
        update: {},
        create: { name: 'Bangalore', slug: 'bangalore', stateId: karnataka.id }
    })

    // Regions for Bangalore
    const northBangalore = await prisma.masterRegion.upsert({
        where: { slug: 'north-bangalore' },
        update: {},
        create: { name: 'North Bangalore', slug: 'north-bangalore', cityId: bangalore.id }
    })
    const southBangalore = await prisma.masterRegion.upsert({
        where: { slug: 'south-bangalore' },
        update: {},
        create: { name: 'South Bangalore', slug: 'south-bangalore', cityId: bangalore.id }
    })
    const eastBangalore = await prisma.masterRegion.upsert({
        where: { slug: 'east-bangalore' },
        update: {},
        create: { name: 'East Bangalore', slug: 'east-bangalore', cityId: bangalore.id }
    })
    const centralBangalore = await prisma.masterRegion.upsert({
        where: { slug: 'central-bangalore' },
        update: {},
        create: { name: 'Central Bangalore', slug: 'central-bangalore', cityId: bangalore.id }
    })

    // Areas for North Bangalore
    await prisma.masterArea.upsert({
        where: { slug: 'hebbal' },
        update: {},
        create: { name: 'Hebbal', slug: 'hebbal', regionId: northBangalore.id }
    })
    await prisma.masterArea.upsert({
        where: { slug: 'yelahanka' },
        update: {},
        create: { name: 'Yelahanka', slug: 'yelahanka', regionId: northBangalore.id }
    })
    await prisma.masterArea.upsert({
        where: { slug: 'rt-nagar' },
        update: {},
        create: { name: 'RT Nagar', slug: 'rt-nagar', regionId: northBangalore.id }
    })

    // Areas for South Bangalore
    await prisma.masterArea.upsert({
        where: { slug: 'jayanagar' },
        update: {},
        create: { name: 'Jayanagar', slug: 'jayanagar', regionId: southBangalore.id }
    })
    await prisma.masterArea.upsert({
        where: { slug: 'jp-nagar' },
        update: {},
        create: { name: 'JP Nagar', slug: 'jp-nagar', regionId: southBangalore.id }
    })
    await prisma.masterArea.upsert({
        where: { slug: 'banashankari' },
        update: {},
        create: { name: 'Banashankari', slug: 'banashankari', regionId: southBangalore.id }
    })

    // Areas for East Bangalore
    await prisma.masterArea.upsert({
        where: { slug: 'whitefield' },
        update: {},
        create: { name: 'Whitefield', slug: 'whitefield', regionId: eastBangalore.id }
    })
    await prisma.masterArea.upsert({
        where: { slug: 'indiranagar' },
        update: {},
        create: { name: 'Indiranagar', slug: 'indiranagar', regionId: eastBangalore.id }
    })
    await prisma.masterArea.upsert({
        where: { slug: 'koramangala' },
        update: {},
        create: { name: 'Koramangala', slug: 'koramangala', regionId: eastBangalore.id }
    })

    // Areas for Central Bangalore
    await prisma.masterArea.upsert({
        where: { slug: 'mg-road' },
        update: {},
        create: { name: 'MG Road', slug: 'mg-road', regionId: centralBangalore.id }
    })
    await prisma.masterArea.upsert({
        where: { slug: 'brigade-road' },
        update: {},
        create: { name: 'Brigade Road', slug: 'brigade-road', regionId: centralBangalore.id }
    })

    // 3. Categories
    const venueCat = await prisma.masterCategory.upsert({
        where: { slug: 'venues' },
        update: {},
        create: { name: 'Venues', slug: 'venues' }
    })
    const caterersCat = await prisma.masterCategory.upsert({
        where: { slug: 'caterers' },
        update: {},
        create: { name: 'Caterers', slug: 'caterers' }
    })
    const photographersCat = await prisma.masterCategory.upsert({
        where: { slug: 'photographers' },
        update: {},
        create: { name: 'Photographers', slug: 'photographers' }
    })
    const decoratorsCat = await prisma.masterCategory.upsert({
        where: { slug: 'decorators' },
        update: {},
        create: { name: 'Decorators', slug: 'decorators' }
    })
    const djCat = await prisma.masterCategory.upsert({
        where: { slug: 'dj-music' },
        update: {},
        create: { name: 'DJ & Music', slug: 'dj-music' }
    })
    const makeupCat = await prisma.masterCategory.upsert({
        where: { slug: 'makeup-artists' },
        update: {},
        create: { name: 'Makeup Artists', slug: 'makeup-artists' }
    })

    // 4. Sub-Categories
    await prisma.masterSubCategory.upsert({
        where: { slug: 'banquet-halls' },
        update: {},
        create: { name: 'Banquet Halls', slug: 'banquet-halls', categoryId: venueCat.id }
    })
    await prisma.masterSubCategory.upsert({
        where: { slug: 'hotels' },
        update: {},
        create: { name: 'Hotels', slug: 'hotels', categoryId: venueCat.id }
    })
    await prisma.masterSubCategory.upsert({
        where: { slug: 'resorts' },
        update: {},
        create: { name: 'Resorts', slug: 'resorts', categoryId: venueCat.id }
    })
    await prisma.masterSubCategory.upsert({
        where: { slug: 'wedding-photography' },
        update: {},
        create: { name: 'Wedding Photography', slug: 'wedding-photography', categoryId: photographersCat.id }
    })
    await prisma.masterSubCategory.upsert({
        where: { slug: 'candid-photography' },
        update: {},
        create: { name: 'Candid Photography', slug: 'candid-photography', categoryId: photographersCat.id }
    })

    // 5. Amenities
    const amenitiesData = ['AC', 'Parking', 'WiFi', 'Valet', 'In-house Catering', 'Outside Catering Allowed', 'DJ Allowed', 'Alcohol Allowed', 'Changing Rooms', 'Terrace', 'Pool', 'Garden']
    for (const name of amenitiesData) {
        await prisma.masterAmenity.upsert({
            where: { id: amenitiesData.indexOf(name) + 1 },
            update: {},
            create: { name }
        })
    }

    // 6. Occasions
    const occasionsData = [
        { name: 'Wedding', groupName: 'Wedding' },
        { name: 'Engagement', groupName: 'Wedding' },
        { name: 'Mehndi', groupName: 'Wedding' },
        { name: 'Sangeet', groupName: 'Wedding' },
        { name: 'Reception', groupName: 'Wedding' },
        { name: 'Birthday Party', groupName: 'Personal' },
        { name: 'Anniversary', groupName: 'Personal' },
        { name: 'Baby Shower', groupName: 'Personal' },
        { name: 'Corporate Event', groupName: 'Corporate' },
        { name: 'Conference', groupName: 'Corporate' },
        { name: 'Product Launch', groupName: 'Corporate' },
    ]
    for (const occ of occasionsData) {
        const slug = occ.name.toLowerCase().replace(/\s+/g, '-')
        await prisma.masterOccasion.upsert({
            where: { slug },
            update: {},
            create: { name: occ.name, slug, groupName: occ.groupName }
        })
    }

    console.log('✅ Seeding complete! Categories, Amenities, Occasions, and Geography are live.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
