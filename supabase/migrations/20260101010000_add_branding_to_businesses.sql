DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'branding') THEN 
        ALTER TABLE "public"."businesses" ADD COLUMN "branding" jsonb; 
    END IF; 
END $$;
