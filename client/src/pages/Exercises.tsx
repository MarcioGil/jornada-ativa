import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Exercises() {
  const { user } = useAuth();
  const [diagnosis, setDiagnosis] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data: plans, isLoading: plansLoading } = trpc.exercises.getPlans.useQuery();
  const { data: logs, isLoading: logsLoading } = trpc.exercises.getLogs.useQuery();
  
  const generatePlanMutation = trpc.exercises.generatePlan.useMutation({
    onSuccess: () => {
      setDiagnosis("");
      setShowForm(false);
    },
  });

  const logCompletionMutation = trpc.exercises.logCompletion.useMutation();

  const handleGeneratePlan = async () => {
    if (!diagnosis.trim()) return;
    await generatePlanMutation.mutateAsync({ diagnosis });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pré-habilitação Física</h1>
        <p className="text-gray-600 mt-2">
          Planos de exercícios personalizados com IA para fortalecer seu corpo
        </p>
      </div>

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="mb-6">
          Criar Novo Plano de Exercícios
        </Button>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Novo Plano de Exercícios</CardTitle>
            <CardDescription>
              Descreva sua condição ortopédica para receber um plano personalizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="diagnosis">Sua Condição Ortopédica</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Ex: Aguardando Artroplastia de Quadril, Lesão no Joelho, etc."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleGeneratePlan}
                  disabled={generatePlanMutation.isPending || !diagnosis.trim()}
                >
                  {generatePlanMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Gerar Plano"
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

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Seus Planos de Exercícios</CardTitle>
            <CardDescription>
              Planos criados especialmente para sua condição
            </CardDescription>
          </CardHeader>
          <CardContent>
            {plansLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : plans && plans.length > 0 ? (
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{plan.diagnosis}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Criado em {new Date(plan.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    {plan.exercisePlan && (
                      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(JSON.parse(plan.exercisePlan), null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                Nenhum plano criado ainda. Crie seu primeiro plano acima!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Exercícios</CardTitle>
            <CardDescription>
              Acompanhe seu progresso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Exercício #{log.exerciseId}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duração: {log.duration} minutos
                        </p>
                        {log.postureFeedback && (
                          <p className="text-sm text-blue-600 mt-2">
                            Feedback: {log.postureFeedback}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(log.loggedAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                Nenhum exercício registrado ainda. Comece sua jornada!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
