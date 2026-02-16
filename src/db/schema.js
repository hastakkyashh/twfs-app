import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Visitors: one row per unique browser cookie (visitor_id)
export const visitors = sqliteTable('visitors', {
  visitorId: text('visitor_id').primaryKey(),
  email: text('email'),
  firstSeenAt: text('first_seen_at').notNull().default(sql`(datetime('now'))`),
  lastSeenAt: text('last_seen_at').notNull().default(sql`(datetime('now'))`),
}, (table) => ({
  emailIdx: index('idx_visitors_email').on(table.email),
}));

// Sessions: one row per browser tab/visit
export const sessions = sqliteTable('sessions', {
  sessionId: text('session_id').primaryKey(),
  visitorId: text('visitor_id').notNull().references(() => visitors.visitorId),
  startedAt: text('started_at').notNull().default(sql`(datetime('now'))`),
  lastActiveAt: text('last_active_at').notNull().default(sql`(datetime('now'))`),
  userAgent: text('user_agent'),
  cfCountry: text('cf_country'),
  cfCity: text('cf_city'),
  cfRegion: text('cf_region'),
}, (table) => ({
  visitorIdx: index('idx_sessions_visitor').on(table.visitorId),
  startedIdx: index('idx_sessions_started').on(table.startedAt),
}));

// Events: every tracked interaction
export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  visitorId: text('visitor_id').notNull().references(() => visitors.visitorId),
  sessionId: text('session_id').notNull().references(() => sessions.sessionId),
  eventType: text('event_type').notNull(),
  page: text('page'),
  element: text('element'),
  metadata: text('metadata'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
}, (table) => ({
  visitorIdx: index('idx_events_visitor').on(table.visitorId),
  sessionIdx: index('idx_events_session').on(table.sessionId),
  typeIdx: index('idx_events_type').on(table.eventType),
  createdIdx: index('idx_events_created').on(table.createdAt),
}));

// Subscribers: email list with visitor linkage
export const subscribers = sqliteTable('subscribers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  visitorId: text('visitor_id'),
  subscribedAt: text('subscribed_at').notNull().default(sql`(datetime('now'))`),
});

// Form submissions telemetry table
export const enquiryFormSubmissions = sqliteTable('enquiry_form_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  dob: text('dob'),
  place: text('place'),
  phone: text('phone').notNull(),
  email: text('email'),
  service: text('service'),
  cfCountry: text('cf_country'),
  cfCity: text('cf_city'),
  cfRegion: text('cf_region'),
  cfLatitude: text('cf_latitude'),
  cfLongitude: text('cf_longitude'),
  cfTimezone: text('cf_timezone'),
  browserLatitude: real('browser_latitude'),
  browserLongitude: real('browser_longitude'),
  userAgent: text('user_agent'),
  ipCountry: text('ip_country'),
  submittedAt: text('submitted_at').notNull().default(sql`(datetime('now'))`),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
}, (table) => ({
  dateIdx: index('idx_submissions_date').on(table.submittedAt),
  phoneIdx: index('idx_submissions_phone').on(table.phone),
}));
