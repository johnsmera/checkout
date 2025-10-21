import { useState, useEffect } from "react";
import { authSingleton, type User, type AuthResponse } from "@/services/auth.service";
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
    error: null
  });

  // Carrega usuário atual na inicialização
  useEffect(() => {
    const loadCurrentUser = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const user = await authSingleton.getCurrentUser();
      setState(prev => ({ 
        ...prev, 
        user, 
        isLoading: false 
      }));
    };

    loadCurrentUser();
  }, []);


  const signIn = async ({ email, password }: User): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authSingleton.signIn({ email, password });
      
      setState(prev => ({ 
        ...prev, 
        user: response.user || null, 
        isLoading: false 
      }));
      
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }));
      throw error;
    }
  };

  const logout = async (): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authSingleton.logout();
      
      setState(prev => ({ 
        ...prev, 
        user: null, 
        isLoading: false 
      }));
      
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }));
      throw error;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return { 
    user: state.user, 
    isLoading: state.isLoading, 
    error: state.error,
    signIn, 
    logout, 
    clearError 
  };
};
