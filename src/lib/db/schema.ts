import { pgTable, uuid, text, integer, serial, timestamp, jsonb, unique, index, type PgTableWithColumns } from "drizzle-orm/pg-core";
import { relations, type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// Enums
export type UserRole = "free" | "pro" | "admin";
export type Provider = "openai" | "anthropic" | "google";
export type PromptCategory = "summary" | "analysis" | "compare" | "extract" | "critique" | "writing";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("free").$type<UserRole>(),
  tokensRemaining: integer("tokens_remaining").notNull().default(8000),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Prompts table
export const prompts = pgTable("prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),
  intent: text("intent"), // User's stated intent for the prompt
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
  return {
    userIdIdx: index("idx_prompts_user_id").on(table.userId),
  };
});

// Prompt versions table
export const promptVersions = pgTable("prompt_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  content: text("content").notNull(),
  model: text("model").notNull(),
  systemInstructions: text("system_instructions"),
  output: text("output"), // The actual LLM output
  evaluationScore: integer("evaluation_score").$type<number | null>(), // 0-100 score
  evaluationData: jsonb("evaluation_data").$type<Record<string, any> | null>(), // Full evaluation JSON
  tokensUsed: integer("tokens_used").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
  return {
    promptIdIdx: index("idx_prompt_versions_prompt_id").on(table.promptId),
    uniquePromptVersion: unique().on(table.promptId, table.versionNumber),
  };
});

// Templates table
export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  category: text("category").notNull().$type<PromptCategory>(),
  intent: text("intent").notNull(),
  content: text("content").notNull(),
  whyItWorks: text("why_it_works").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Migrations tracking table
export const migrations = pgTable("_migrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  executedAt: timestamp("executed_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
  return {
    nameIdx: index("idx_migrations_name").on(table.name),
  };
});

// Relations
export const usersRelations = relations(users, ({ many }) => {
  return {
    prompts: many(prompts),
  };
});

export const promptsRelations = relations(prompts, ({ one, many }) => {
  return {
    user: one(users, {
      fields: [prompts.userId],
      references: [users.id],
    }),
    versions: many(promptVersions),
  };
});

export const promptVersionsRelations = relations(promptVersions, ({ one }) => {
  return {
    prompt: one(prompts, {
      fields: [promptVersions.promptId],
      references: [prompts.id],
    }),
  };
});


// Type exports for TypeScript
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Prompt = InferSelectModel<typeof prompts>;
export type NewPrompt = InferInsertModel<typeof prompts>;
export type PromptVersion = InferSelectModel<typeof promptVersions>;
export type NewPromptVersion = InferInsertModel<typeof promptVersions>;
export type Template = InferSelectModel<typeof templates>;
export type NewTemplate = InferInsertModel<typeof templates>;
export type Migration = InferSelectModel<typeof migrations>;
export type NewMigration = InferInsertModel<typeof migrations>;
