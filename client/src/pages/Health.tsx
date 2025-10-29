import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, Send } from "lucide-react";

export default function Health() {
  const { user } = useAuth();
  const [painLevel, setPainLevel] = useState(5);
  const [moodLevel, setMoodLevel] = useState(5);
  const [medication, setMedication] = useState("");
  const [notes, setNotes] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  const { data: painHistory, isLoading: painLoading } = trpc.health.getPainHistory.useQuery();
  const { data: chatHistory, isLoading: chatLoading } = trpc.health.getChatHistory.useQuery();
  const { data: communityPosts } = trpc.community.getPosts.useQuery();

  const logPainMutation = trpc.health.logPain.useMutation({
    onSuccess: () => {
      setPainLevel(5);
      setMoodLevel(5);
      setMedication("");
      setNotes("");
    },
  });

  const chatMutation = trpc.health.chat.useMutation({
    onSuccess: () => {
      setChatMessage("");
    },
  });

  const handleLogPain = async () => {
    await logPainMutation.mutateAsync({
      painLevel,
      moodLevel,
      medication: medication || undefined,
      notes: notes || undefined,
    });
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    await chatMutation.mutateAsync({ message: chatMessage });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Suporte de Saúde Mental</h1>
        <p className="text-gray-600 mt-2">
          Chat com IA, diário de dor e comunidade de apoio
        </p>
      </div>

      <Tabs defaultValue="diary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diary">Diário de Dor</TabsTrigger>
          <TabsTrigger value="chat">Chat com IA</TabsTrigger>
          <TabsTrigger value="community">Comunidade</TabsTrigger>
        </TabsList>

        <TabsContent value="diary" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Dor e Humor</CardTitle>
                <CardDescription>
                  Acompanhe seus níveis de dor e humor diariamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="text-base">
                      Nível de Dor: <span className="font-bold text-red-600">{painLevel}</span>/10
                    </Label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={painLevel}
                      onChange={(e) => setPainLevel(Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-base">
                      Nível de Humor: <span className="font-bold text-blue-600">{moodLevel}</span>/10
                    </Label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={moodLevel}
                      onChange={(e) => setMoodLevel(Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medication">Medicamentos Tomados (opcional)</Label>
                    <Input
                      id="medication"
                      placeholder="Ex: Dipirona 500mg"
                      value={medication}
                      onChange={(e) => setMedication(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas (opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Como você se sente hoje?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={handleLogPain}
                    disabled={logPainMutation.isPending}
                    className="w-full"
                  >
                    {logPainMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Registrar"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico (Últimos 30 dias)</CardTitle>
              </CardHeader>
              <CardContent>
                {painLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : painHistory && painHistory.length > 0 ? (
                  <div className="space-y-3">
                    {painHistory.map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">
                              Dor: {entry.painLevel}/10 | Humor: {entry.moodLevel}/10
                            </p>
                            {entry.medication && (
                              <p className="text-gray-600">Medicação: {entry.medication}</p>
                            )}
                            {entry.notes && (
                              <p className="text-gray-600 mt-1">{entry.notes}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.loggedAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Nenhum registro ainda.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chat com Assistente de IA</CardTitle>
              <CardDescription>
                Converse com nosso assistente especializado em saúde mental
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-96">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded">
                  {chatLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : chatHistory && chatHistory.length > 0 ? (
                    chatHistory.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-900 border"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm">
                      Comece uma conversa...
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={chatMutation.isPending || !chatMessage.trim()}
                    size="sm"
                  >
                    {chatMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comunidade de Apoio</CardTitle>
              <CardDescription>
                Conecte-se com outros pacientes em situação similar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {communityPosts && communityPosts.length > 0 ? (
                <div className="space-y-4">
                  {communityPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.title}</h3>
                          <p className="text-xs text-gray-500">
                            {post.category} • {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        {post.approved === 1 && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Aprovado
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm">{post.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Nenhum post na comunidade ainda.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
