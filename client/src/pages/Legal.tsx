import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, FileUp } from "lucide-react";

export default function Legal() {
  const { user } = useAuth();
  const [caseTitle, setCaseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [defensoryState, setDefensoryState] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [rightsQuestion, setRightsQuestion] = useState("");

  const { data: cases, isLoading: casesLoading } = trpc.legal.getCases.useQuery();
  const { data: rightsAnswer } = trpc.legal.getRightsGuide.useQuery(
    { question: rightsQuestion },
    { enabled: !!rightsQuestion }
  );

  const createCaseMutation = trpc.legal.createCase.useMutation({
    onSuccess: () => {
      setCaseTitle("");
      setDescription("");
      setDefensoryState("");
      setShowForm(false);
    },
  });

  const handleCreateCase = async () => {
    if (!caseTitle.trim() || !defensoryState.trim()) return;
    await createCaseMutation.mutateAsync({
      caseTitle,
      description,
      defensoryState,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Advocacia Legal</h1>
        <p className="text-gray-600 mt-2">
          Seus direitos e protocolo direto com a Defensoria Pública
        </p>
      </div>

      <Tabs defaultValue="cases" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cases">Meus Casos</TabsTrigger>
          <TabsTrigger value="rights">Guia de Direitos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="mt-6">
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} className="mb-6">
              <FileUp className="w-4 h-4 mr-2" />
              Criar Novo Caso
            </Button>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Novo Caso Legal</CardTitle>
                <CardDescription>
                  Descreva seu caso para envio à Defensoria Pública
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="caseTitle">Título do Caso</Label>
                    <Input
                      id="caseTitle"
                      placeholder="Ex: Atraso em Cirurgia Ortopédica"
                      value={caseTitle}
                      onChange={(e) => setCaseTitle(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva sua situação..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="defensoryState">Estado da Defensoria</Label>
                    <Input
                      id="defensoryState"
                      placeholder="Ex: RJ, SP, MG"
                      value={defensoryState}
                      onChange={(e) => setDefensoryState(e.target.value.toUpperCase())}
                      maxLength={2}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateCase}
                      disabled={
                        createCaseMutation.isPending ||
                        !caseTitle.trim() ||
                        !defensoryState.trim()
                      }
                    >
                      {createCaseMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        "Criar Caso"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Meus Casos</CardTitle>
              <CardDescription>
                Acompanhe o status de seus casos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {casesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : cases && cases.length > 0 ? (
                <div className="space-y-4">
                  {cases.map((legalCase) => (
                    <div key={legalCase.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {legalCase.caseTitle}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {legalCase.description}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded font-semibold ${
                            legalCase.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : legalCase.status === "analyzing"
                              ? "bg-blue-100 text-blue-800"
                              : legalCase.status === "received"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {legalCase.status}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                        <p>Defensoria: {legalCase.defensoryState}</p>
                        {legalCase.protocolNumber && (
                          <p>Protocolo: {legalCase.protocolNumber}</p>
                        )}
                        <p className="text-xs mt-2">
                          Criado em {new Date(legalCase.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Nenhum caso criado ainda.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Guia de Direitos</CardTitle>
              <CardDescription>
                Tire suas dúvidas sobre direitos e legislação brasileira
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question">Sua Pergunta</Label>
                  <Textarea
                    id="question"
                    placeholder="Ex: Tenho direito ao BPC/LOAS por não poder trabalhar?"
                    value={rightsQuestion}
                    onChange={(e) => setRightsQuestion(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                {rightsAnswer && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Resposta:</h4>
                    <p className="text-blue-900 text-sm whitespace-pre-wrap">
                      {rightsAnswer.answer}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos do Caso</CardTitle>
              <CardDescription>
                Organize e digitalize seus documentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Selecione um caso acima para adicionar documentos.
              </p>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Faça upload de seus documentos (laudos, exames, receitas)
                  </p>
                  <Button className="mt-4" disabled>
                    Fazer Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
