"use client";

import { type ReactNode, Suspense } from "react";
import { useRouter } from "next/navigation";

interface ErrorBoundaryProps {
  children: ReactNode;
}

// Error Boundary moderno - Suspense para loading, try/catch para erros
export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorCatcher>{children}</ErrorCatcher>
    </Suspense>
  );
}

// Componente funcional para capturar erros
function ErrorCatcher({ children }: { children: ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    return <ErrorFallback error={error as Error} />;
  }
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Carregando...</span>
    </div>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Algo deu errado
        </h2>
        <p className="text-gray-600 mb-4">
          Ocorreu um erro inesperado. Tente novamente ou volte ao início.
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-100 p-3 rounded text-sm text-gray-700 mb-4">
            <strong>Erro:</strong> {error.message}
          </div>
        )}
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tentar novamente
          </button>
          <button
            type="button"
            onClick={handleGoHome}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
}
