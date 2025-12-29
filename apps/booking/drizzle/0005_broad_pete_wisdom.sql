CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text,
	"last_name" text,
	"avatar_url" text
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;