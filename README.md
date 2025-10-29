🚀 Jornada Ativa: Plataforma de Apoio Fullstack & IA para Pacientes Ortopédicos

Visão Geral do Projeto

Jornada Ativa é um projeto Fullstack inovador, movido por Inteligência Artificial, concebido para transformar a experiência de espera de pacientes ortopédicos na fila do Sistema Único de Saúde (SUS). O projeto aborda a crise humanitária da espera prolongada, oferecendo suporte contínuo em quatro pilares: Físico, Mental, Legal e Acessibilidade.

Em vez de ser uma espera passiva, a plataforma transforma o período pré-cirúrgico em uma jornada ativa, informada e com poder de ação.

💔 O Problema (Contexto Social e Técnico)

Milhares de pacientes perdem anos de vida e qualidade de vida enquanto aguardam cirurgias essenciais. Durante essa espera, eles enfrentam:

Deterioração Física: Atrofia muscular e piora do quadro devido à falta de fisioterapia guiada.

Deterioração Mental: Altos níveis de ansiedade, depressão e isolamento.

Barreiras de Acesso: Impossibilidade de locomoção, o que impede a busca por direitos e cuidados.

✨ A Solução (Impacto e Inovação)

A Jornada Ativa ataca essas falhas sistêmicas digitalizando o cuidado e a advocacia legal:

Cuidado Remoto: Fisioterapia segura e acompanhamento de saúde mental guiados por IA.

Eliminação de Barreiras Físicas: O paciente acessa o apoio legal (Defensoria Pública) diretamente de casa.

Advocacia Ativa: Ferramentas digitais para organização de documentos e protocolo de casos legais.

🛠️ Arquitetura Técnica (Fullstack Moderno)

O projeto foi construído sobre uma arquitetura moderna e escalável, utilizando o conceito de "End-to-End Type Safety" com tRPC e Drizzle ORM.

Componente

Tecnologia

Detalhes Técnicos

Frontend

React 19, TypeScript, Tailwind CSS 4

Interface responsiva e acessível, design mobile-first com foco em usabilidade para pacientes com mobilidade reduzida.

Backend

Node.js, Express, tRPC 11

Servidor leve e rápido, comunicação de ponta a ponta com segurança de tipos (Type-safe RPC).

Banco de Dados

MySQL/TiDB, Drizzle ORM

Banco de dados relacional distribuído (TiDB para escalabilidade), gerenciamento de schema e queries com o Drizzle ORM (TypeScript-first).

IA Generativa

Google Gemini API

Motor principal para Chatbots (TCC), Guia de Direitos e extração de dados (OCR).

Visão Computacional

MediaPipe / TensorFlow.js

Utilizada para Pose Estimation (estimativa de pose) no Módulo de Fisioterapia.

Autenticação

Manus OAuth

Sistema de login e gerenciamento de usuários.

Estrutura do Repositório

O projeto segue a abordagem de monorepo lógico para organização clara e separação de responsabilidades:

jornada-ativa/
├── client/                    # 📦 Frontend (React, Componentes, Pages)
├── server/                   # ⚙️ Backend (Node.js, Express, Lógica de Negócio)
├── drizzle/                 # 💾 Schema do Banco de Dados (Drizzle ORM)
└── shared/                  # 🤝 Tipos e Funções Compartilhadas (tRPC)


💻 Módulos em Detalhe (Deep Dive)

Módulo 1: Pré-habilitação Física (O Fisioterapeuta Virtual)

Inovação: Uso de IA de Visão para garantir a segurança dos exercícios.

Plano de Exercícios Personalizado (IA): O Gemini gera protocolos de exercícios diários de baixo impacto, minimizando o risco de lesão e focando na musculatura de suporte.

Assistente de Postura (Pose Estimation): Utiliza MediaPipe ou TensorFlow.js para analisar a postura do usuário via câmera do dispositivo, fornecendo feedback em tempo real ("Mantenha as costas retas").

Endpoints tRPC de Exemplo: exercises.generatePlan, exercises.logCompletion.

Módulo 2: Suporte de Saúde Mental (O Companheiro de Dor)

Inovação: Terapia Cognitivo-Comportamental (TCC) adaptada para dor crônica e espera.

Chatbot de Apoio (Gemini LLM): Um assistente 24/7 treinado em TCC para oferecer técnicas de mindfulness e reestruturação de pensamento, combatendo a solidão e a ansiedade.

Diário de Dor e Humor: Permite registrar dados que a IA analisa para identificar padrões e gatilhos.

Comunidade Segura: Fórum para conexão de pacientes com o mesmo diagnóstico ou na mesma fila de espera.

Endpoints tRPC de Exemplo: health.logPain, health.chat, community.createPost.

Módulo 4: Canal Direto de Advocacia (A Ponte Digital) 👑

Destaque Crítico: Remove a barreira física ao garantir o direito do paciente de casa.

Organizador de Caso Digital (IA + OCR): O paciente fotografa laudos e exames. A IA extrai e organiza CIDs, CRMs e datas, criando uma "pasta do caso" digital pronta para uso legal.

Protocolo Direto com Defensoria (Integração API): O sistema guia a redação de uma petição inicial e envia o caso completo através de uma API segura diretamente para a Defensoria Pública (ou usa o Fallback com E-mail Estruturado), eliminando a necessidade de locomoção.

Guia de Direitos (LLM): Respostas precisas sobre direitos, como BPC/LOAS e Leis do SUS, baseadas em legislação treinada.

Endpoints tRPC de Exemplo: legal.createCase, legal.addDocument, legal.getRightsGuide.

💾 Modelagem de Dados e Drizzle ORM

O projeto utiliza 10 tabelas principais, garantindo integridade referencial e organização modular. O Drizzle ORM é usado para tipagem segura das consultas (Type-safe Queries).

Schema Completo (Resumo)

Tabela

Módulo

Chaves de Interesse

Relacionamento (Exemplo)

users

Geral

id, email, nome

users (1) → (N) exercises

exercises

Módulo 1

userId, planoJson, dataCriacao

users (1) → (N) painDiary

painDiary

Módulo 2

userId, nivelDor, humor, notas



communityPosts

Módulo 2

userId, titulo, conteudo, categoria

posts (1) → (N) comments

legalCases

Módulo 4

userId, diagnostico, status, dataAbertura

cases (1) → (N) caseDocuments

caseDocuments

Módulo 4

caseId, tipo, urlS3, metadataOCR



⚙️ Setup e Instalação Local

Para rodar a Jornada Ativa em ambiente de desenvolvimento, siga os passos abaixo:

Pré-requisitos

Node.js (versão LTS)

pnpm (Recomendado)

MySQL/TiDB (Instância local ou remota)

Instruções

# 1. Clonar repositório
git clone [https://github.com/MarcioGil/jornada-ativa.git](https://github.com/MarcioGil/jornada-ativa.git)
cd jornada-ativa

# 2. Instalar dependências
pnpm install

# 3. Configurar Variáveis de Ambiente
# Crie um arquivo .env na raiz do projeto, baseado em .env.example, e preencha:


Variáveis Essenciais:
| Variável | Descrição |
| :--- | :--- |
| DATABASE_URL | String de conexão para o MySQL/TiDB. |
| GEMINI_API_KEY | Sua chave do Google Gemini API (Necessário para IA). |
| JWT_SECRET | Chave secreta para tokens de autenticação. |
| VITE_APP_ID, OAUTH_SERVER_URL, etc. | Variáveis para integração com Manus OAuth. |

# 4. Executar Migrações do Banco de Dados (Drizzle Kit)
pnpm db:push

# 5. Iniciar Servidor de Desenvolvimento
pnpm dev
# O frontend estará disponível em http://localhost:3000 (ou porta configurada)


🛣️ Roadmap e Próximos Passos

O projeto está em sua Fase 1 (MVP funcional). O roadmap futuro inclui:

Fase 2 (Curto Prazo)

Integração real com APIs de Defensorias Públicas (via convênio técnico).

Implementação completa do Pose Estimation com MediaPipe.

Desenvolvimento de relatórios de dor em PDF para apresentação médica.

Notificações push para lembretes de exercício e atualizações de caso.

Fase 3 (Longo Prazo)

Transição para um App mobile nativo (React Native).

Integração com wearables (smartwatch) para monitoramento de atividade.

Análise preditiva de tempo de espera com base em dados anonimizados do SUS.

Mecanismos de Gamificação (badges, pontos) para incentivar a adesão à fisioterapia.

🙋 Contato e Informações do Desenvolvedor

Este projeto é uma demonstração da capacidade de aplicar tecnologia fullstack e IA para solucionar problemas sociais urgentes.

Perfil

Link

Autor

Márcio Gil

GitHub

github.com/MarcioGil

LinkedIn

linkedin.com/in/márcio-gil-1b7669309

Portfólio

marciogil.github.io/curriculum-vitae/

Site

jornadaopa-dgydumhi.manus.space

Licença: Este projeto está licenciado sob a MIT License.

Desenvolvido com ❤️ para quem espera, mas não desiste.
Última atualização: Outubro 2025