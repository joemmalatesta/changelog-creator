ALTER TABLE "changelog_versions" RENAME COLUMN "version_number" TO "title";--> statement-breakpoint
ALTER TABLE "changelogs" RENAME COLUMN "user_id" TO "user_email";--> statement-breakpoint
ALTER TABLE "changelogs" DROP CONSTRAINT "changelogs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "changelog_entries" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "changelogs" ADD COLUMN "repo_name" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "changelogs" ADD CONSTRAINT "changelogs_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
