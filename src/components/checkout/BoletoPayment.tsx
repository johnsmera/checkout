import { Info } from "lucide-react";

export function BoletoPayment() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h4 className="font-medium text-amber-900">
            Como funciona o pagamento via Boleto
          </h4>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>Após confirmar o pedido, você receberá o código de barras</li>
            <li>Pague em qualquer banco, lotérica ou app bancário</li>
            <li>A compensação ocorre em até 2 dias úteis</li>
            <li>Vencimento em 3 dias corridos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

