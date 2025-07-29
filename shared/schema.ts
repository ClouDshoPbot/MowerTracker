import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trackingNumbers = pgTable("tracking_numbers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingNumber: text("tracking_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  packageWeight: text("package_weight"),
  serviceType: text("service_type").notNull().default("Standard Ground"),
  referenceNumber: text("reference_number"),
  estimatedDelivery: text("estimated_delivery"),
  currentStatus: text("current_status").notNull().default("Package Received"),
  currentLocation: text("current_location").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const trackingEvents = pgTable("tracking_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingNumberId: varchar("tracking_number_id").references(() => trackingNumbers.id).notNull(),
  status: text("status").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  timestamp: text("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTrackingNumberSchema = createInsertSchema(trackingNumbers).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrackingEventSchema = createInsertSchema(trackingEvents).omit({
  id: true,
  createdAt: true,
});

export const updateTrackingSchema = insertTrackingNumberSchema.partial();

export type InsertTrackingNumber = z.infer<typeof insertTrackingNumberSchema>;
export type TrackingNumber = typeof trackingNumbers.$inferSelect;
export type InsertTrackingEvent = z.infer<typeof insertTrackingEventSchema>;
export type TrackingEvent = typeof trackingEvents.$inferSelect;

export interface TrackingWithEvents extends TrackingNumber {
  events: TrackingEvent[];
}
