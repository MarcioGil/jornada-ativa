import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  exercises,
  exerciseLogs,
  painDiary,
  chatMessages,
  communityPosts,
  communityComments,
  accessibilityScans,
  legalCases,
  caseDocuments,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// Módulo 1: Pré-habilitação Física
// ============================================

export async function getUserExercises(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(exercises).where(eq(exercises.userId, userId));
}

export async function createExercisePlan(
  userId: number,
  diagnosis: string,
  exercisePlan: string
) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .insert(exercises)
    .values({ userId, diagnosis, exercisePlan });
  return result;
}

export async function logExercise(
  userId: number,
  exerciseId: number,
  duration: number,
  postureFeedback?: string
) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(exerciseLogs).values({
    userId,
    exerciseId,
    duration,
    postureFeedback,
    completed: 1,
  });
}

export async function getExerciseLogs(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(exerciseLogs).where(eq(exerciseLogs.userId, userId));
}

// ============================================
// Módulo 2: Suporte de Saúde Mental
// ============================================

export async function logPainDiary(
  userId: number,
  painLevel: number,
  moodLevel: number,
  medication?: string,
  notes?: string
) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(painDiary).values({
    userId,
    painLevel,
    moodLevel,
    medication,
    notes,
  });
}

export async function getPainDiaryEntries(userId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  return db
    .select()
    .from(painDiary)
    .where(eq(painDiary.userId, userId));
}

export async function saveChatMessage(
  userId: number,
  role: "user" | "assistant",
  content: string
) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(chatMessages).values({ userId, role, content });
}

export async function getChatHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(chatMessages.createdAt)
    .limit(limit);
}

export async function createCommunityPost(
  userId: number,
  category: string,
  title: string,
  content: string
) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(communityPosts).values({
    userId,
    category,
    title,
    content,
    approved: 0,
  });
}

export async function getCommunityPosts(category?: string) {
  const db = await getDb();
  if (!db) return [];
  if (category) {
    return db.select().from(communityPosts).where(eq(communityPosts.category, category));
  }
  return db.select().from(communityPosts);
}

export async function addCommunityComment(
  postId: number,
  userId: number,
  content: string
) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(communityComments).values({
    postId,
    userId,
    content,
    approved: 0,
  });
}

// ============================================
// Módulo 3: Acessibilidade
// ============================================

export async function createAccessibilityScan(
  userId: number,
  location: string,
  imageUrl: string,
  barriersIdentified: string,
  suggestedSolutions: string
) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(accessibilityScans).values({
    userId,
    location,
    imageUrl,
    barriersIdentified,
    suggestedSolutions,
  });
}

export async function getUserAccessibilityScans(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(accessibilityScans).where(eq(accessibilityScans.userId, userId));
}

// ============================================
// Módulo 4: Canal Direto de Advocacia
// ============================================

export async function createLegalCase(
  userId: number,
  caseTitle: string,
  description: string,
  defensoryState: string
) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(legalCases).values({
    userId,
    caseTitle,
    description,
    defensoryState,
    status: "draft",
  });
}

export async function getUserLegalCases(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(legalCases).where(eq(legalCases.userId, userId));
}

export async function addCaseDocument(
  caseId: number,
  documentType: string,
  documentUrl: string,
  extractedData?: string
) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(caseDocuments).values({
    caseId,
    documentType,
    documentUrl,
    extractedData,
  });
}

export async function getCaseDocuments(caseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseDocuments).where(eq(caseDocuments.caseId, caseId));
}

export async function updateLegalCaseStatus(
  caseId: number,
  status: "draft" | "submitted" | "received" | "analyzing" | "resolved",
  protocolNumber?: string
) {
  const db = await getDb();
  if (!db) return null;
  const updateData: Record<string, unknown> = { status };
  if (protocolNumber) {
    updateData.protocolNumber = protocolNumber;
  }
  return db.update(legalCases).set(updateData).where(eq(legalCases.id, caseId));
}
