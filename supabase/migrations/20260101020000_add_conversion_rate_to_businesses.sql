DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'conversionRate') THEN 
        ALTER TABLE "public"."businesses" ADD COLUMN "conversionRate" numeric default 0; 
    END IF; 
END $$;
