import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2, Upload } from "lucide-react";

export default function Accessibility() {
  const { user } = useAuth();
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data: scans, isLoading: scansLoading } = trpc.accessibility.getScans.useQuery();

  const scanMutation = trpc.accessibility.scanHome.useMutation({
    onSuccess: () => {
      setLocation("");
      setImageUrl("");
      setShowForm(false);
    },
  });

  const handleScan = async () => {
    if (!location.trim() || !imageUrl.trim()) return;
    await scanMutation.mutateAsync({ location, imageUrl });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Acessibilidade</h1>
        <p className="text-gray-600 mt-2">
          Scanner de barreiras e soluções de baixo custo para sua casa
        </p>
      </div>

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="mb-6">
          <Upload className="w-4 h-4 mr-2" />
          Analisar Ambiente
        </Button>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Analisar Ambiente</CardTitle>
            <CardDescription>
              Tire uma foto do ambiente e receba sugestões de adaptações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Local da Casa</Label>
                <Input
                  id="location"
                  placeholder="Ex: Banheiro, Porta de entrada, Quarto"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  placeholder="Cole a URL da imagem"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Você pode fazer upload da imagem em um serviço de hospedagem e colar a URL aqui
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleScan}
                  disabled={scanMutation.isPending || !location.trim() || !imageUrl.trim()}
                >
                  {scanMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    "Analisar"
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
            <CardTitle>Análises de Acessibilidade</CardTitle>
            <CardDescription>
              Barreiras identificadas e soluções sugeridas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scansLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : scans && scans.length > 0 ? (
              <div className="space-y-6">
                {scans.map((scan) => (
                  <div key={scan.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">{scan.location}</h3>

                    {scan.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={scan.imageUrl}
                          alt={scan.location}
                          className="w-full max-h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {scan.barriersIdentified && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-red-600 mb-2">Barreiras Identificadas:</h4>
                        <div className="bg-red-50 p-3 rounded text-sm text-red-900">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(JSON.parse(scan.barriersIdentified), null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {scan.suggestedSolutions && (
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Soluções Sugeridas:</h4>
                        <div className="bg-green-50 p-3 rounded text-sm text-green-900">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(JSON.parse(scan.suggestedSolutions), null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-4">
                      Analisado em {new Date(scan.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                Nenhuma análise realizada ainda. Comece analisando um ambiente!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
