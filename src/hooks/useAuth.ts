"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { User, AuthResponse } from "@/types/auth";
import { authService } from "@/lib/services";
import { getErrorMessage } from "@/lib/errors";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  });

  const [storagedUser, setStoragedUser] = useState<User | null>(null);
  const [isLoadingStoragedUser, setIsLoadingStoragedUser] = useState(true);

  // Carrega usuário atual na inicialização
  useEffect(() => {
    const loadCurrentUser = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      setIsLoadingStoragedUser(true);

      const user = await authService.getCurrentUser();
      setState((prev) => ({
        ...prev,
        user,
        isLoading: false,
      }));

      // Carrega usuário do localStorage de forma segura
      if (typeof window !== "undefined") {
        try {
          const userData = localStorage.getItem("user");
          if (userData) {
            const parsedUser = JSON.parse(userData) as User;
            setStoragedUser(parsedUser);
          } else {
            setStoragedUser(null);
          }
        } catch (error) {
          console.error("Erro ao carregar usuário do localStorage:", error);
          setStoragedUser(null);
        }
      }

      setIsLoadingStoragedUser(false);
    };

    loadCurrentUser();
  }, []);

  const signIn = useCallback(
    async ({ email, password }: User): Promise<AuthResponse> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await authService.signIn({ email, password });

        setState((prev) => ({
          ...prev,
          user: response.user || null,
          isLoading: false,
        }));

        // Atualiza o storagedUser após login bem-sucedido
        if (response.user) {
          setStoragedUser(response.user);
        }

        return response;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
        throw error;
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<AuthResponse> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.logout();

      setState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
      }));

      // Limpa o storagedUser após logout
      setStoragedUser(null);

      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return useMemo(
    () => ({
      ...state,
      storagedUser,
      isLoadingStoragedUser,
      signIn,
      logout,
      clearError,
    }),
    [state, storagedUser, isLoadingStoragedUser, signIn, logout, clearError],
  );
};
