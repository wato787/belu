ALTER TABLE `photos` ADD `upload_id` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `photos` ADD `sort_order` integer NOT NULL DEFAULT 0;
