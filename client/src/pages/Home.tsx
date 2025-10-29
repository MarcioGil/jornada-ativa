import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Heart, Home as HomeIcon, Scale, Users } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Jornada Ativa</h1>
              <p className="text-xl text-gray-600 mb-2">
                Plataforma de Apoio para Pacientes Ortopédicos
              </p>
              <p className="text-lg text-gray-500 mb-8">
                Transformando a espera em uma jornada ativa, informada e com poder de ação
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <Activity className="w-8 h-8 text-blue-600 mb-2" />
                  <CardTitle>Pré-habilitação Física</CardTitle>
                  <CardDescription>
                    Planos de exercícios personalizados com IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Mantenha força e mobilidade com exercícios seguros de baixo impacto, guiados por inteligência artificial.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heart className="w-8 h-8 text-red-600 mb-2" />
                  <CardTitle>Suporte de Saúde Mental</CardTitle>
                  <CardDescription>
                    Chatbot de apoio 24/7 com TCC
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Converse com um assistente especializado em dor crônica, registre seu humor e conecte-se com outros pacientes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <HomeIcon className="w-8 h-8 text-green-600 mb-2" />
                  <CardTitle>Acessibilidade</CardTitle>
                  <CardDescription>
                    Scanner de barreiras e soluções DIY
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Identifique barreiras em sua casa e receba sugestões de adaptações de baixo custo.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Scale className="w-8 h-8 text-purple-600 mb-2" />
                  <CardTitle>Advocacia Legal</CardTitle>
                  <CardDescription>
                    Canal direto com Defensoria Pública
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Acesse seus direitos, organize documentos e envie protocolos para a Defensoria sem sair de casa.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                onClick={() => {
                  window.location.href = getLoginUrl();
                }}
              >
                Começar Jornada Ativa
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {user?.name || "Paciente"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Sua jornada ativa começa aqui. Escolha um módulo para começar.
          </p>
        </div>

        <Tabs defaultValue="exercises" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="exercises">
              <Activity className="w-4 h-4 mr-2" />
              Exercícios
            </TabsTrigger>
            <TabsTrigger value="health">
              <Heart className="w-4 h-4 mr-2" />
              Saúde
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <HomeIcon className="w-4 h-4 mr-2" />
              Casa
            </TabsTrigger>
            <TabsTrigger value="legal">
              <Scale className="w-4 h-4 mr-2" />
              Direitos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pré-habilitação Física</CardTitle>
                <CardDescription>
                  Planos de exercícios personalizados para sua condição
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Crie um plano de exercícios seguro e personalizado baseado em sua condição ortopédica.
                </p>
                <Link href="/exercises">
                  <Button>Acessar Módulo de Exercícios</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Suporte de Saúde Mental</CardTitle>
                <CardDescription>
                  Chat com IA, diário de dor e comunidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Converse com nosso assistente de saúde mental, registre seu progresso e conecte-se com outros pacientes.
                </p>
                <Link href="/health">
                  <Button>Acessar Módulo de Saúde</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Acessibilidade</CardTitle>
                <CardDescription>
                  Scanner de barreiras e soluções de baixo custo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Tire fotos de sua casa e receba sugestões de adaptações práticas e acessíveis.
                </p>
                <Link href="/accessibility">
                  <Button>Acessar Módulo de Acessibilidade</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Advocacia Legal</CardTitle>
                <CardDescription>
                  Seus direitos e protocolo com Defensoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Acesse informações sobre seus direitos e envie documentos diretamente para a Defensoria Pública.
                </p>
                <Link href="/legal">
                  <Button>Acessar Módulo de Direitos</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
