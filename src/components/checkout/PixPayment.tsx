import { Info } from "lucide-react";

export function PixPayment() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h4 className="font-medium text-blue-900">
            Como funciona o pagamento via PIX
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Após confirmar o pedido, você receberá um QR Code</li>
            <li>Abra o app do seu banco e escaneie o código</li>
            <li>O pagamento é processado instantaneamente</li>
            <li>O código expira em 30 minutos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

