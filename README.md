# Jornada Ativa - Plataforma de Apoio para Pacientes Ortopédicos

## Visão Geral

**Jornada Ativa** é uma plataforma Fullstack inovadora que utiliza Inteligência Artificial para oferecer suporte abrangente a pacientes ortopédicos na fila de espera do SUS. O projeto transforma a experiência de espera em uma **jornada ativa, informada e com poder de ação**, combinando tecnologia de ponta com empatia pelo paciente.

### O Problema

Pacientes em fila de espera para cirurgias ortopédicas enfrentam desafios significativos:

- **Deterioração Física**: Atrofia muscular, perda de mobilidade e piora da condição durante a espera
- **Deterioração Mental**: Ansiedade, depressão, solidão e sensação de impotência
- **Falta de Informação**: Desconhecimento sobre sua posição na fila e prognóstico
- **Barreiras Físicas e Legais**: Casa se torna uma prisão; sistema é um labirinto indecifrável

### A Solução

Jornada Ativa ataca esses pontos através de **quatro módulos integrados**, cada um endereçando uma necessidade específica:

## Arquitetura Técnica

### Stack Tecnológico

| Componente | Tecnologia |
|-----------|-----------|
| **Frontend** | React 19 + TypeScript + Tailwind CSS 4 |
| **Backend** | Node.js + Express + tRPC 11 |
| **Banco de Dados** | MySQL/TiDB com Drizzle ORM |
| **Autenticação** | Manus OAuth |
| **IA Generativa** | Google Gemini API |
| **Visão Computacional** | MediaPipe / TensorFlow.js |
| **Armazenamento** | S3 (Armazenamento em Nuvem) |

### Estrutura do Projeto

```
jornada-ativa/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas dos 4 módulos
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── lib/              # Utilidades e configurações
│   │   └── App.tsx           # Roteamento principal
│   └── public/               # Ativos estáticos
├── server/                   # Backend Node.js
│   ├── routers.ts           # Definição de procedimentos tRPC
│   ├── db.ts                # Query helpers do banco de dados
│   └── _core/               # Infraestrutura (OAuth, LLM, etc)
├── drizzle/                 # Schema do banco de dados
│   └── schema.ts            # Definição de tabelas
└── shared/                  # Código compartilhado
```

## Os Quatro Módulos

### Módulo 1: Pré-habilitação Física (O Fisioterapeuta Virtual)

**Objetivo**: Manter força e mobilidade durante a espera

**Funcionalidades**:

- **Plano de Exercícios Personalizado (IA)**: O paciente insere seu diagnóstico (ex: "Aguardando Artroplastia de Quadril"). Um modelo de IA, treinado com protocolos de fisioterapia seguros para pré-cirurgia, gera um plano de exercícios diário de baixo impacto
- **Assistente de Postura (Pose Estimation)**: Usando a câmera do celular, a IA analisa a postura durante o exercício e dá feedback em tempo real ("Mantenha as costas retas", "Não force o joelho")
- **Histórico de Progresso**: Acompanhe seus exercícios completados e evolução

**Endpoints tRPC**:
- `exercises.generatePlan` - Gera plano personalizado com IA
- `exercises.getPlans` - Lista planos do usuário
- `exercises.logCompletion` - Registra conclusão de exercício
- `exercises.getLogs` - Histórico de exercícios

---

### Módulo 2: Suporte de Saúde Mental (O Companheiro de Dor)

**Objetivo**: Oferecer suporte emocional 24/7 e reduzir isolamento

**Funcionalidades**:

- **Chatbot de Apoio (IA)**: Assistente especializado em Terapia Cognitivo-Comportamental (TCC) focada em dor crônica e ansiedade de espera. Oferece técnicas de mindfulness e reestruturação de pensamento
- **Diário de Dor e Humor**: Registre níveis de dor (1-10), humor (1-10), medicação e notas. A IA identifica padrões ("Sua dor piora em dias que você dorme mal")
- **Comunidade Segura**: Fórum moderado onde pacientes da mesma fila (ex: "Artroplastia RJ", "Joelho SP") se conectam e compartilham histórias

**Endpoints tRPC**:
- `health.logPain` - Registra entrada no diário
- `health.getPainHistory` - Histórico de dor (últimos 30 dias)
- `health.chat` - Chat com assistente de IA
- `health.getChatHistory` - Histórico de conversas
- `community.createPost` - Criar post na comunidade
- `community.getPosts` - Listar posts por categoria
- `community.addComment` - Comentar em posts

---

### Módulo 3: Acessibilidade (Quebrando Barreiras Físicas)

**Objetivo**: Identificar barreiras e sugerir adaptações de baixo custo

**Funcionalidades**:

- **Scanner de Acessibilidade (IA)**: Paciente tira fotos de sua casa (banheiro, porta, degrau). A IA identifica barreiras óbvias ("Degrau alto", "Porta estreita para cadeira de rodas", "Falta de barra de apoio")
- **Soluções de Baixo Custo (IA)**: LLM sugere adaptações simples e DIY (ex: "Veja como improvisar um elevador de assento sanitário") ou indica onde conseguir equipamentos

**Endpoints tRPC**:
- `accessibility.scanHome` - Analisa imagem para barreiras
- `accessibility.getScans` - Histórico de análises

---

### Módulo 4: Canal Direto de Advocacia (A Ponte Digital)

**Objetivo**: Garantir direitos sem precisar sair de casa

**Funcionalidades**:

- **Guia de Direitos (IA)**: Assistente treinado com legislação brasileira (Constituição, Leis do SUS, Estatuto da Pessoa com Deficiência) responde perguntas como: "Tenho direito ao BPC/LOAS?", "O que fazer se minha cirurgia foi desmarcada?"
- **Organizador de Caso Digital (IA + OCR)**: Paciente digitaliza laudos, exames, receitas. IA extrai datas, CIDs, CRMs, criando uma "pasta do caso" digital com linha do tempo clara
- **Protocolo Direto com Defensoria (API)**: App guia redação de petição. Ao finalizar, envia caso completo (petição + documentos) direto para sistema da Defensoria, abrindo protocolo oficial
- **Fallback com E-mail Estruturado**: Na ausência de API, gera e-mail formal, anexa documentos organizados, envia para Defensoria solicitando atendimento remoto
- **Rastreamento de Status**: Acompanhe status do pedido (Enviado, Recebido, Em Análise, Resolvido)

**Endpoints tRPC**:
- `legal.createCase` - Criar novo caso
- `legal.getCases` - Listar casos do usuário
- `legal.addDocument` - Adicionar documento ao caso
- `legal.getDocuments` - Listar documentos do caso
- `legal.updateStatus` - Atualizar status do caso
- `legal.getRightsGuide` - Consultar direitos com IA

---

## Banco de Dados

### Schema Completo

O projeto utiliza **10 tabelas** organizadas por módulo:

#### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários autenticados (Manus OAuth) |
| `exercises` | Planos de exercícios personalizados |
| `exerciseLogs` | Histórico de exercícios completados |
| `painDiary` | Registros diários de dor e humor |
| `chatMessages` | Histórico de conversas com IA |
| `communityPosts` | Posts do fórum da comunidade |
| `communityComments` | Comentários em posts |
| `accessibilityScans` | Análises de barreiras na casa |
| `legalCases` | Casos legais do paciente |
| `caseDocuments` | Documentos associados aos casos |

### Relacionamentos

```
users (1) ──→ (N) exercises
users (1) ──→ (N) exerciseLogs
users (1) ──→ (N) painDiary
users (1) ──→ (N) chatMessages
users (1) ──→ (N) communityPosts
users (1) ──→ (N) communityComments
users (1) ──→ (N) accessibilityScans
users (1) ──→ (N) legalCases
legalCases (1) ──→ (N) caseDocuments
communityPosts (1) ──→ (N) communityComments
```

## Integração com IA

### Google Gemini API

O projeto utiliza a **Google Gemini API** para todas as funcionalidades de IA generativa:

#### Casos de Uso

1. **Geração de Planos de Exercícios**: Prompt especializado em protocolos de pré-cirurgia
2. **Chatbot de Saúde Mental**: Treinado em TCC para dor crônica
3. **Análise de Acessibilidade**: Identifica barreiras em imagens
4. **Guia de Direitos**: Responde perguntas sobre legislação brasileira
5. **Extração de Dados**: OCR para documentos (laudos, exames)

#### Configuração

```typescript
// server/_core/llm.ts
import { invokeLLM } from "./server/_core/llm";

const response = await invokeLLM({
  messages: [
    { role: "system", content: "Você é um especialista em..." },
    { role: "user", content: "Sua pergunta..." }
  ]
});
```

**Nota**: A chave de API é injetada automaticamente via variáveis de ambiente.

## Como Usar

### Instalação e Setup

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/jornada-ativa.git
cd jornada-ativa

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
# Copie .env.example para .env e preencha os valores

# Executar migrações do banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Variáveis de Ambiente Necessárias

```env
DATABASE_URL=mysql://usuario:senha@host:porta/banco
JWT_SECRET=sua_chave_jwt_secreta
VITE_APP_ID=seu_app_id_manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
GEMINI_API_KEY=sua_chave_gemini_api
```

### Fluxo de Usuário

1. **Autenticação**: Usuário faz login via Manus OAuth
2. **Dashboard**: Acessa página inicial com os 4 módulos
3. **Módulo de Exercícios**: Cria plano personalizado, acompanha progresso
4. **Módulo de Saúde**: Registra dor/humor, conversa com IA, participa da comunidade
5. **Módulo de Acessibilidade**: Escaneia casa, recebe sugestões
6. **Módulo de Direitos**: Consulta direitos, organiza documentos, abre protocolo

## Desenvolvimento

### Estrutura de Código

O projeto segue padrões de desenvolvimento moderno:

- **tRPC**: Type-safe RPC para comunicação frontend-backend
- **Drizzle ORM**: Query builder type-safe para banco de dados
- **React Hooks**: Hooks customizados para lógica reutilizável
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Componentes acessíveis e customizáveis

### Adicionando Novas Funcionalidades

#### 1. Definir Schema no Banco

```typescript
// drizzle/schema.ts
export const minhaTabela = mysqlTable("minhaTabela", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  // ... mais colunas
});
```

#### 2. Criar Query Helpers

```typescript
// server/db.ts
export async function minhaFuncao(userId: number) {
  const db = await getDb();
  return db.select().from(minhaTabela).where(eq(minhaTabela.userId, userId));
}
```

#### 3. Adicionar Procedimento tRPC

```typescript
// server/routers.ts
export const appRouter = router({
  meuModulo: router({
    minhaFuncao: protectedProcedure.query(({ ctx }) =>
      minhaFuncao(ctx.user.id)
    ),
  }),
});
```

#### 4. Chamar do Frontend

```typescript
// client/src/pages/MeuComponente.tsx
const { data } = trpc.meuModulo.minhaFuncao.useQuery();
```

## Testes

O projeto inclui testes para APIs críticas:

```bash
# Executar testes
pnpm test

# Testes com cobertura
pnpm test:coverage
```

## Deploy

### Plataforma Recomendada

O projeto é otimizado para deploy em plataformas Fullstack modernas:

- **Vercel** (Frontend + Serverless Functions)
- **Railway** (Docker + PostgreSQL)
- **Render** (Full Stack)

### Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado
- [ ] Testes passando
- [ ] Build sem erros
- [ ] HTTPS habilitado
- [ ] CORS configurado
- [ ] Rate limiting ativado
- [ ] Logs centralizados

## Roadmap Futuro

### Fase 2 (Próximos Meses)

- [ ] Integração com APIs de Defensoria Pública
- [ ] Pose Estimation em tempo real com MediaPipe
- [ ] Notificações push
- [ ] Relatórios em PDF
- [ ] Integração com calendário (Google Calendar, Outlook)

### Fase 3 (Longo Prazo)

- [ ] App mobile nativo (React Native)
- [ ] Integração com wearables (smartwatch)
- [ ] Análise preditiva de tempo de espera
- [ ] Gamificação (badges, pontos)
- [ ] Integração com plataformas de telemedicina

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto é licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato e Suporte

- **Email**: suporte@jornadaativa.com.br
- **Website**: https://jornadaativa.com.br
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/jornada-ativa/issues)

## Agradecimentos

Jornada Ativa foi desenvolvido com o objetivo de transformar a vida de pacientes ortopédicos em fila de espera. Agradecemos:

- Aos pacientes que inspiraram este projeto
- À comunidade de código aberto
- Aos especialistas em saúde que validaram os protocolos
- À Google por disponibilizar a Gemini API

---

**Desenvolvido com ❤️ para quem espera, mas não desiste.**

*Última atualização: Outubro 2025*
