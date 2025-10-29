import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import {
  createExercisePlan,
  getUserExercises,
  logExercise,
  getExerciseLogs,
  logPainDiary,
  getPainDiaryEntries,
  saveChatMessage,
  getChatHistory,
  createCommunityPost,
  getCommunityPosts,
  addCommunityComment,
  createAccessibilityScan,
  getUserAccessibilityScans,
  createLegalCase,
  getUserLegalCases,
  addCaseDocument,
  getCaseDocuments,
  updateLegalCaseStatus,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Módulo 1: Pré-habilitação Física
  exercises: router({
    generatePlan: protectedProcedure
      .input(z.object({ diagnosis: z.string() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `Você é um fisioterapeuta virtual especializado em pré-habilitação para cirurgias ortopédicas. 
                Crie um plano de exercícios diário, seguro e de baixo impacto para pacientes em fila de espera.
                Foque em manter amplitude de movimento e fortalecer musculatura de suporte (core, glúteos, quadríceps).
                Retorne um plano estruturado em JSON com exercícios, durações e precauções.`,
              },
              {
                role: "user",
                content: `Crie um plano de exercícios para paciente com: ${input.diagnosis}`,
              },
            ],
          });

          const planContent = typeof response.choices[0].message.content === 'string' 
            ? response.choices[0].message.content 
            : JSON.stringify(response.choices[0].message.content);
          const planData = JSON.parse(planContent);

          await createExercisePlan(
            ctx.user.id,
            input.diagnosis,
            JSON.stringify(planData)
          );

          return { success: true, plan: planData };
        } catch (error) {
          console.error("Error generating exercise plan:", error);
          throw new Error("Falha ao gerar plano de exercícios");
        }
      }),

    getPlans: protectedProcedure.query(async ({ ctx }) => {
      return getUserExercises(ctx.user.id);
    }),

    logCompletion: protectedProcedure
      .input(
        z.object({
          exerciseId: z.number(),
          duration: z.number(),
          postureFeedback: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return logExercise(
          ctx.user.id,
          input.exerciseId,
          input.duration,
          input.postureFeedback
        );
      }),

    getLogs: protectedProcedure.query(async ({ ctx }) => {
      return getExerciseLogs(ctx.user.id);
    }),
  }),

  // Módulo 2: Suporte de Saúde Mental
  health: router({
    logPain: protectedProcedure
      .input(
        z.object({
          painLevel: z.number().min(1).max(10),
          moodLevel: z.number().min(1).max(10),
          medication: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return logPainDiary(
          ctx.user.id,
          input.painLevel,
          input.moodLevel,
          input.medication,
          input.notes
        );
      }),

    getPainHistory: protectedProcedure.query(async ({ ctx }) => {
      return getPainDiaryEntries(ctx.user.id, 30);
    }),

    chat: protectedProcedure
      .input(z.object({ message: z.string() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const history = await getChatHistory(ctx.user.id, 10);

          const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
            {
              role: "system",
              content: `Você é um assistente de saúde mental especializado em Terapia Cognitivo-Comportamental (TCC) para dor crônica e ansiedade de espera.
              Não substitui um terapeuta, mas oferece suporte 24/7, técnicas de mindfulness e reestruturação de pensamento.
              Seja empático, validador e prático nas sugestões.`,
            },
            ...history.map((msg) => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            })),
            { role: "user" as const, content: input.message },
          ];

          const response = await invokeLLM({ messages });
          const assistantMessage = typeof response.choices[0].message.content === 'string' 
            ? response.choices[0].message.content 
            : JSON.stringify(response.choices[0].message.content);

          await saveChatMessage(ctx.user.id, "user", input.message);
          await saveChatMessage(ctx.user.id, "assistant", assistantMessage);

          return { message: assistantMessage };
        } catch (error) {
          console.error("Error in chat:", error);
          throw new Error("Falha ao processar mensagem");
        }
      }),

    getChatHistory: protectedProcedure.query(async ({ ctx }) => {
      return getChatHistory(ctx.user.id);
    }),
  }),

  community: router({
    createPost: protectedProcedure
      .input(
        z.object({
          category: z.string(),
          title: z.string(),
          content: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return createCommunityPost(
          ctx.user.id,
          input.category,
          input.title,
          input.content
        );
      }),

    getPosts: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return getCommunityPosts(input?.category);
      }),

    addComment: protectedProcedure
      .input(
        z.object({
          postId: z.number(),
          content: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return addCommunityComment(input.postId, ctx.user.id, input.content);
      }),
  }),

  // Módulo 3: Acessibilidade
  accessibility: router({
    scanHome: protectedProcedure
      .input(
        z.object({
          location: z.string(),
          imageUrl: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `Você é um especialista em acessibilidade para pessoas com mobilidade reduzida.
                Analise a imagem fornecida e identifique barreiras físicas e sugira soluções de baixo custo (DIY).
                Retorne um JSON estruturado com barreiras e soluções.`,
              },
              {
                role: "user",
                content: `Analise esta imagem de ${input.location} para barreiras de acessibilidade. A imagem está em: ${input.imageUrl}`,
              },
            ],
          });

          const analysisContent = typeof response.choices[0].message.content === 'string' 
            ? response.choices[0].message.content 
            : JSON.stringify(response.choices[0].message.content);
          const analysisData = JSON.parse(analysisContent);

          await createAccessibilityScan(
            ctx.user.id,
            input.location,
            input.imageUrl,
            JSON.stringify(analysisData.barriers || []),
            JSON.stringify(analysisData.solutions || [])
          );

          return { success: true, analysis: analysisData };
        } catch (error) {
          console.error("Error scanning accessibility:", error);
          throw new Error("Falha ao analisar acessibilidade");
        }
      }),

    getScans: protectedProcedure.query(async ({ ctx }) => {
      return getUserAccessibilityScans(ctx.user.id);
    }),
  }),

  // Módulo 4: Canal Direto de Advocacia
  legal: router({
    createCase: protectedProcedure
      .input(
        z.object({
          caseTitle: z.string(),
          description: z.string(),
          defensoryState: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return createLegalCase(
          ctx.user.id,
          input.caseTitle,
          input.description,
          input.defensoryState
        );
      }),

    getCases: protectedProcedure.query(async ({ ctx }) => {
      return getUserLegalCases(ctx.user.id);
    }),

    addDocument: protectedProcedure
      .input(
        z.object({
          caseId: z.number(),
          documentType: z.string(),
          documentUrl: z.string(),
          extractedData: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return addCaseDocument(
          input.caseId,
          input.documentType,
          input.documentUrl,
          input.extractedData
        );
      }),

    getDocuments: protectedProcedure
      .input(z.object({ caseId: z.number() }))
      .query(async ({ input }) => {
        return getCaseDocuments(input.caseId);
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          caseId: z.number(),
          status: z.enum(["draft", "submitted", "received", "analyzing", "resolved"]),
          protocolNumber: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return updateLegalCaseStatus(
          input.caseId,
          input.status,
          input.protocolNumber
        );
      }),

    getRightsGuide: publicProcedure
      .input(z.object({ question: z.string() }))
      .query(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `Você é um assistente legal especializado em legislação brasileira.
                Responda perguntas sobre direitos de pacientes, BPC/LOAS, Estatuto da Pessoa com Deficiência e direitos do SUS.
                Seja preciso, cite leis quando possível, e recomende buscar Defensoria Pública para casos específicos.`,
              },
              {
                role: "user",
                content: input.question,
              },
            ],
          });

          const answer = typeof response.choices[0].message.content === 'string' 
            ? response.choices[0].message.content 
            : JSON.stringify(response.choices[0].message.content);
          return { answer };
        } catch (error) {
          console.error("Error getting rights guide:", error);
          throw new Error("Falha ao obter informações de direitos");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
