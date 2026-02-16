CREATE TABLE `enquiry_form_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`dob` text,
	`place` text,
	`phone` text NOT NULL,
	`email` text,
	`service` text,
	`cf_country` text,
	`cf_city` text,
	`cf_region` text,
	`cf_latitude` text,
	`cf_longitude` text,
	`cf_timezone` text,
	`browser_latitude` real,
	`browser_longitude` real,
	`user_agent` text,
	`ip_country` text,
	`submitted_at` text DEFAULT (datetime('now')) NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_submissions_date` ON `enquiry_form_submissions` (`submitted_at`);--> statement-breakpoint
CREATE INDEX `idx_submissions_phone` ON `enquiry_form_submissions` (`phone`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`visitor_id` text NOT NULL,
	`session_id` text NOT NULL,
	`event_type` text NOT NULL,
	`page` text,
	`element` text,
	`metadata` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`visitor_id`) REFERENCES `visitors`(`visitor_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`session_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_events_visitor` ON `events` (`visitor_id`);--> statement-breakpoint
CREATE INDEX `idx_events_session` ON `events` (`session_id`);--> statement-breakpoint
CREATE INDEX `idx_events_type` ON `events` (`event_type`);--> statement-breakpoint
CREATE INDEX `idx_events_created` ON `events` (`created_at`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`session_id` text PRIMARY KEY NOT NULL,
	`visitor_id` text NOT NULL,
	`started_at` text DEFAULT (datetime('now')) NOT NULL,
	`last_active_at` text DEFAULT (datetime('now')) NOT NULL,
	`user_agent` text,
	`cf_country` text,
	`cf_city` text,
	`cf_region` text,
	FOREIGN KEY (`visitor_id`) REFERENCES `visitors`(`visitor_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_visitor` ON `sessions` (`visitor_id`);--> statement-breakpoint
CREATE INDEX `idx_sessions_started` ON `sessions` (`started_at`);--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`visitor_id` text,
	`subscribed_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_email_unique` ON `subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `visitors` (
	`visitor_id` text PRIMARY KEY NOT NULL,
	`email` text,
	`first_seen_at` text DEFAULT (datetime('now')) NOT NULL,
	`last_seen_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_visitors_email` ON `visitors` (`email`);