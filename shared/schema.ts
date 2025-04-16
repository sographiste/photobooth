import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'single' or 'strip'
  filter: text("filter").notNull().default("normal"), // 'normal', 'bw', 'sepia', 'comic'
  background: text("background").default("none"), // 'none', 'flowers', 'hearts'
  filePath: text("file_path").notNull(),
  photoUrls: jsonb("photo_urls").notNull(), // Array for strip mode, single element for single mode
  qrCode: text("qr_code").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;
