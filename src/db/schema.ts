// src/db/schema.ts
import { pgTable, text, timestamp, uuid, jsonb, integer, boolean } from "drizzle-orm/pg-core";

export const pipelines = pgTable("pipelines", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    source_path: text("source_path").notNull(),
    action_type: text("action_type").notNull(),
    action_config: jsonb("action_config"),
    created_at: timestamp("created_at").defaultNow(),
});

export const subscribers = pgTable("subscribers", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    pipeline_id: uuid("pipeline_id").references(() => pipelines.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    created_at: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
    id: uuid("id").primaryKey().defaultRandom(),
    pipeline_id: uuid("pipeline_id").references(() => pipelines.id, { onDelete: "cascade" }),
    payload: jsonb("payload").notNull(),
    status: text("status").default("queued"),
    result: jsonb("result"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

export const delivery_attempts = pgTable("delivery_attempts", {
    id: uuid("id").primaryKey().defaultRandom(),
    job_id: uuid("job_id").references(() => jobs.id, { onDelete: "cascade" }),
    subscriber_id: uuid("subscriber_id").references(() => subscribers.id, { onDelete: "cascade" }),
    success: boolean("success").default(false),
    response_status: integer("response_status"),
    attempt_number: integer("attempt_number").default(0),
    attempt_time: timestamp("attempt_time").defaultNow(),
});

export const admins = pgTable("admins", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    hashed_password: text("hashed_password").notNull(),
    created_at: timestamp("created_at").defaultNow(),
});