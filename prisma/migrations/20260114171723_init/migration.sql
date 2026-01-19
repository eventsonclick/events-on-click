-- CreateTable
CREATE TABLE "master_roles" (
    "id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "master_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile_number" TEXT,
    "password_hash" TEXT,
    "city_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_details" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "employee_code" TEXT NOT NULL,
    "department" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "master_countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_states" (
    "id" SERIAL NOT NULL,
    "country_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "master_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_cities" (
    "id" SERIAL NOT NULL,
    "state_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "master_cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_regions" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "master_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_areas" (
    "id" SERIAL NOT NULL,
    "region_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "pincode" VARCHAR(10),

    CONSTRAINT "master_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "master_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_sub_categories" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "master_sub_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_amenities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "master_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_occasions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "group_name" TEXT,
    "slug" TEXT NOT NULL,

    CONSTRAINT "master_occasions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "business_name" TEXT,
    "category_id" INTEGER,
    "sub_category_id" INTEGER,
    "city_id" INTEGER,
    "area_id" INTEGER,
    "current_plan_id" INTEGER,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" INTEGER,
    "avg_rating" DECIMAL(3,2) NOT NULL DEFAULT 0.0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_gallery" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "media_type" TEXT,
    "media_url" TEXT,
    "is_cover_image" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_social_links" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "platform_name" TEXT,
    "url" TEXT NOT NULL,

    CONSTRAINT "vendor_social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_opening_hours" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "open_time" TIME,
    "close_time" TIME,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "vendor_opening_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_amenities_mapping" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "amenity_id" INTEGER NOT NULL,

    CONSTRAINT "vendor_amenities_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_occasions_mapping" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "occasion_id" INTEGER NOT NULL,

    CONSTRAINT "vendor_occasions_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_subscription_plans" (
    "id" SERIAL NOT NULL,
    "plan_name" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "duration_months" INTEGER NOT NULL,
    "image_limit" INTEGER NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "master_subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "vendor_id" INTEGER NOT NULL,
    "occasion_id" INTEGER,
    "event_date" DATE,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_reviews" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "review_text" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "moderated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_payments" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(5) NOT NULL DEFAULT 'INR',
    "payment_status" TEXT,
    "payment_date" TIMESTAMP(3),
    "invoice_url" TEXT,

    CONSTRAINT "vendor_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" SERIAL NOT NULL,
    "action_performed" TEXT NOT NULL,
    "performed_by" INTEGER,
    "target_id" INTEGER,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "master_roles_role_name_key" ON "master_roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_number_key" ON "users"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "employee_details_user_id_key" ON "employee_details"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_details_employee_code_key" ON "employee_details"("employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "master_countries_slug_key" ON "master_countries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "master_states_slug_key" ON "master_states"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "master_cities_slug_key" ON "master_cities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "master_regions_slug_key" ON "master_regions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "master_areas_slug_key" ON "master_areas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "master_categories_slug_key" ON "master_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "master_sub_categories_slug_key" ON "master_sub_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "master_occasions_slug_key" ON "master_occasions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_user_id_key" ON "vendor_profiles"("user_id");

-- CreateIndex
CREATE INDEX "vendor_profiles_city_id_category_id_idx" ON "vendor_profiles"("city_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_opening_hours_vendor_id_day_of_week_key" ON "vendor_opening_hours"("vendor_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_amenities_mapping_vendor_id_amenity_id_key" ON "vendor_amenities_mapping"("vendor_id", "amenity_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_occasions_mapping_vendor_id_occasion_id_key" ON "vendor_occasions_mapping"("vendor_id", "occasion_id");

-- CreateIndex
CREATE INDEX "inquiries_vendor_id_idx" ON "inquiries"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_reviews_vendor_id_user_id_key" ON "vendor_reviews"("vendor_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_payments_transaction_id_key" ON "vendor_payments"("transaction_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "master_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "master_cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_details" ADD CONSTRAINT "employee_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_states" ADD CONSTRAINT "master_states_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "master_countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_cities" ADD CONSTRAINT "master_cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "master_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_regions" ADD CONSTRAINT "master_regions_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "master_cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_areas" ADD CONSTRAINT "master_areas_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "master_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_sub_categories" ADD CONSTRAINT "master_sub_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "master_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "master_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "master_sub_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "master_cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "master_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_current_plan_id_fkey" FOREIGN KEY ("current_plan_id") REFERENCES "master_subscription_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_gallery" ADD CONSTRAINT "vendor_gallery_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_social_links" ADD CONSTRAINT "vendor_social_links_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_opening_hours" ADD CONSTRAINT "vendor_opening_hours_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_amenities_mapping" ADD CONSTRAINT "vendor_amenities_mapping_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_amenities_mapping" ADD CONSTRAINT "vendor_amenities_mapping_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "master_amenities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_occasions_mapping" ADD CONSTRAINT "vendor_occasions_mapping_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_occasions_mapping" ADD CONSTRAINT "vendor_occasions_mapping_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "master_occasions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "master_occasions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_reviews" ADD CONSTRAINT "vendor_reviews_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_reviews" ADD CONSTRAINT "vendor_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_reviews" ADD CONSTRAINT "vendor_reviews_moderated_by_fkey" FOREIGN KEY ("moderated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_payments" ADD CONSTRAINT "vendor_payments_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_payments" ADD CONSTRAINT "vendor_payments_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "master_subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
