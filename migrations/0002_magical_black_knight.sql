ALTER TABLE "users" DROP CONSTRAINT "users_name_unique";--> statement-breakpoint
ALTER TABLE "changelogs" DROP COLUMN IF EXISTS "version_ids";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "name";