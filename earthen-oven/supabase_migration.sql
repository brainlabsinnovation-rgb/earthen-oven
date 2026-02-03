-- Create Customer Table
CREATE TABLE IF NOT EXISTS "Customer" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "phone" TEXT UNIQUE NOT NULL,
  "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Reservation Table
CREATE TABLE IF NOT EXISTS "Reservation" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "reservationNumber" TEXT UNIQUE NOT NULL,
  "customerId" UUID NOT NULL REFERENCES "Customer"("id"),
  "date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "timeSlot" TEXT NOT NULL,
  "numberOfGuests" INTEGER NOT NULL,
  "specialOccasion" TEXT,
  "dietaryPreferences" TEXT,
  "specialRequests" TEXT,
  "tableNumber" INTEGER,
  "seatingArea" TEXT,
  "status" TEXT DEFAULT 'PENDING',
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "confirmedAt" TIMESTAMP WITH TIME ZONE,
  "cancelledAt" TIMESTAMP WITH TIME ZONE,
  "completedAt" TIMESTAMP WITH TIME ZONE
);

-- Create TableAvailability Table
CREATE TABLE IF NOT EXISTS "TableAvailability" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "timeSlot" TEXT NOT NULL,
  "totalTables" INTEGER DEFAULT 15,
  "bookedTables" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT "TableAvailability_date_timeSlot_key" UNIQUE ("date", "timeSlot")
);

-- Create GazalSchedule Table
CREATE TABLE IF NOT EXISTS "GazalSchedule" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "artist" TEXT NOT NULL,
  "date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create PrivateEventInquiry Table
CREATE TABLE IF NOT EXISTS "PrivateEventInquiry" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "eventDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "numberOfGuests" INTEGER NOT NULL,
  "eventType" TEXT,
  "message" TEXT,
  "status" TEXT DEFAULT 'PENDING',
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Data (Optional, but useful)
-- You can run this block to populate initial availability
DO $$
DECLARE
    curr_date DATE := CURRENT_DATE;
    slot TEXT;
    slots TEXT[] := ARRAY['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM'];
BEGIN
    FOR i IN 0..29 LOOP
        FOREACH slot IN ARRAY slots LOOP
            INSERT INTO "TableAvailability" ("date", "timeSlot", "totalTables", "bookedTables")
            VALUES ((curr_date + i) + TIME '12:00:00', slot, 15, 0)
            ON CONFLICT ("date", "timeSlot") DO NOTHING;
        END LOOP;
        
        -- Seed Gazal (Fri, Sat, Sun)
        IF EXTRACT(DOW FROM (curr_date + i)) IN (0, 5, 6) THEN
           INSERT INTO "GazalSchedule" ("artist", "date", "startTime", "endTime", "isActive")
           VALUES ('Ustad Raheem Khan & Troupe', (curr_date + i) + TIME '19:00:00', '8:00 PM', '10:30 PM', true);
        END IF;

    END LOOP;
END $$;
