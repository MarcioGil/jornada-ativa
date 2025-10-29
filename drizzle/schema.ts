import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Módulo 1: Pré-habilitação Física
 * Armazena planos de exercícios e progresso do paciente
 */
export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  diagnosis: text("diagnosis").notNull(), // Ex: "Aguardando Artroplastia de Quadril"
  exercisePlan: text("exercisePlan"), // JSON com plano gerado pela IA
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

export const exerciseLogs = mysqlTable("exerciseLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  exerciseId: int("exerciseId").notNull().references(() => exercises.id, { onDelete: "cascade" }),
  duration: int("duration"), // em minutos
  postureFeedback: text("postureFeedback"), // Feedback da IA sobre postura
  completed: int("completed").default(0), // 0 = não, 1 = sim
  loggedAt: timestamp("loggedAt").defaultNow().notNull(),
});

export type ExerciseLog = typeof exerciseLogs.$inferSelect;
export type InsertExerciseLog = typeof exerciseLogs.$inferInsert;

/**
 * Módulo 2: Suporte de Saúde Mental
 * Chatbot, diário de dor e comunidade
 */
export const painDiary = mysqlTable("painDiary", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  painLevel: int("painLevel").notNull(), // 1-10
  moodLevel: int("moodLevel").notNull(), // 1-10
  medication: text("medication"), // Medicamentos tomados
  notes: text("notes"), // Notas do paciente
  loggedAt: timestamp("loggedAt").defaultNow().notNull(),
});

export type PainDiary = typeof painDiary.$inferSelect;
export type InsertPainDiary = typeof painDiary.$inferInsert;

export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

export const communityPosts = mysqlTable("communityPosts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 64 }).notNull(), // Ex: "Artroplastia RJ", "Joelho SP"
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  approved: int("approved").default(0), // 0 = pendente, 1 = aprovado
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = typeof communityPosts.$inferInsert;

export const communityComments = mysqlTable("communityComments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull().references(() => communityPosts.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  approved: int("approved").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommunityComment = typeof communityComments.$inferSelect;
export type InsertCommunityComment = typeof communityComments.$inferInsert;

/**
 * Módulo 3: Acessibilidade
 * Scanner de acessibilidade e soluções
 */
export const accessibilityScans = mysqlTable("accessibilityScans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  location: varchar("location", { length: 255 }).notNull(), // Ex: "Banheiro", "Porta"
  imageUrl: text("imageUrl"), // URL da imagem no S3
  barriersIdentified: text("barriersIdentified"), // JSON com barreiras detectadas
  suggestedSolutions: text("suggestedSolutions"), // JSON com soluções sugeridas pela IA
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AccessibilityScan = typeof accessibilityScans.$inferSelect;
export type InsertAccessibilityScan = typeof accessibilityScans.$inferInsert;

/**
 * Módulo 4: Canal Direto de Advocacia
 * Organizador de caso e protocolo com Defensoria
 */
export const legalCases = mysqlTable("legalCases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  caseTitle: varchar("caseTitle", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "submitted", "received", "analyzing", "resolved"]).default("draft"),
  protocolNumber: varchar("protocolNumber", { length: 64 }), // Número do protocolo da Defensoria
  defensoryState: varchar("defensoryState", { length: 2 }), // Ex: "RJ", "SP"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LegalCase = typeof legalCases.$inferSelect;
export type InsertLegalCase = typeof legalCases.$inferInsert;

export const caseDocuments = mysqlTable("caseDocuments", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull().references(() => legalCases.id, { onDelete: "cascade" }),
  documentType: varchar("documentType", { length: 64 }).notNull(), // Ex: "Laudo", "Exame", "Receita"
  documentUrl: text("documentUrl").notNull(), // URL no S3
  extractedData: text("extractedData"), // JSON com dados extraídos pela IA (datas, CIDs, CRMs)
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type CaseDocument = typeof caseDocuments.$inferSelect;
export type InsertCaseDocument = typeof caseDocuments.$inferInsert;