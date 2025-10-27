import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { User } from "@/types/auth";

interface BuyerDataStepProps {
  user: User | null;
}

export function BuyerDataStep({ user }: BuyerDataStepProps) {
  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Carregando dados do usuário...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Comprador</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="buyer-name">Nome Completo</Label>
          <Input
            id="buyer-name"
            value={user.name}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buyer-email">E-mail</Label>
          <Input
            id="buyer-email"
            type="email"
            value={user.email}
            disabled
            className="bg-gray-50"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Os dados acima são provenientes da sua conta logada e não podem ser
          alterados neste momento.
        </p>
      </CardContent>
    </Card>
  );
}

