import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderProcessingProps {
  message: string;
}

export function OrderProcessing({ message }: OrderProcessingProps) {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Processando Pedido</h3>
            <output className="text-muted-foreground block" aria-live="polite">
              {message}
            </output>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

