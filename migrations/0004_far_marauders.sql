ALTER TABLE "changelog_versions" DROP CONSTRAINT "changelog_versions_changelog_id_changelogs_id_fk";
--> statement-breakpoint
ALTER TABLE "changelogs" DROP CONSTRAINT "changelogs_user_email_users_email_fk";
--> statement-breakpoint
ALTER TABLE "changelog_versions" DROP COLUMN IF EXISTS "changelog_id";--> statement-breakpoint
ALTER TABLE "changelogs" DROP COLUMN IF EXISTS "user_email";